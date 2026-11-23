import { Router } from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
// ⚠️ Adapte cet import à ton middleware d'authentification existant (celui qui remplit req.user depuis le cookie "token")
import { protect } from '../middleware/auth.middleware.js';
import * as c from '../controllers/pv.controller.js';

const router = Router();

// Upload : photos (jpg/png/webp), PDF — 10 Mo max, 10 fichiers max
fs.mkdirSync(c.UPLOAD_DIR, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: c.UPLOAD_DIR,
    filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) =>
    ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Format non autorisé (JPG, PNG, WEBP ou PDF)')),
});

const norm = (r) => String(r || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const allow = (...roles) => (req, res, next) =>
  roles.includes(norm(req.user?.role || req.user?.role_name))
    ? next()
    : res.status(403).json({ message: 'Accès refusé pour votre rôle' });

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(protect);

// Lecture : tous les rôles
router.get('/types', wrap(c.listTypes));
router.get('/stats', wrap(c.stats));
router.get('/', wrap(c.listPv));
router.get('/:id', wrap(c.getPv));

// Écriture : superadmin, éditeur, intervenant (le lecteur est en lecture seule)
router.post('/', allow('superadmin', 'editeur', 'intervenant'), wrap(c.createPv));
router.put('/:id', allow('superadmin', 'editeur', 'intervenant'), wrap(c.updatePv));
router.post('/:id/statut', allow('superadmin', 'editeur', 'intervenant'), wrap(c.changeStatut)); // la matrice fine est dans le contrôleur
router.post('/:id/signatures', allow('superadmin', 'editeur', 'intervenant'), wrap(c.addSignature));
router.post('/:id/documents', allow('superadmin', 'editeur', 'intervenant'), wrap(c.addDocument));
router.post('/:id/fichiers', allow('superadmin', 'editeur', 'intervenant'), upload.array('fichiers', 10), wrap(c.uploadDocuments));
router.get('/documents/:docId/download', wrap(c.downloadDocument));
router.delete('/documents/:docId', allow('superadmin', 'editeur', 'intervenant'), wrap(c.deleteDocument));
router.delete('/:id', allow('superadmin', 'editeur'), wrap(c.deletePv));

// Gestion des erreurs multer / validation
router.use((err, _req, res, _next) => res.status(400).json({ message: err.message || 'Erreur' }));

export default router;

// Dans server.js / app.js :
//   import pvRoutes from './routes/pv.routes.js';
//   app.use('/api/pv', pvRoutes);
