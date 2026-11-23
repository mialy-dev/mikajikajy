
import { Router } from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';

import { protect } from '../middleware/auth.middleware.js';
import * as c from '../controllers/pv.controller.js';

const router = Router();

// Création du dossier de stockage
fs.mkdirSync(c.UPLOAD_DIR, { recursive: true });

// Configuration des fichiers
const upload = multer({
  storage: multer.diskStorage({
    destination: c.UPLOAD_DIR,
    filename: (_req, file, cb) => {
      cb(
        null,
        `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`
      );
    },
  }),

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },

  fileFilter: (_req, file, cb) => {
    const formats = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ];

    if (formats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format non autorisé (JPG, PNG, WEBP ou PDF)'));
    }
  },
});

// Gestion des rôles
const norm = (role) =>
  String(role || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const allow = (...roles) => (req, res, next) => {
  const role = norm(req.user?.role || req.user?.role_name);

  if (roles.includes(role)) {
    return next();
  }

  return res.status(403).json({
    message: 'Accès refusé pour votre rôle',
  });
};

// Gestion des erreurs asynchrones
const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Toutes les routes PV nécessitent une authentification
router.use(protect);

// Lecture
router.get('/types', wrap(c.listTypes));
router.get('/stats', wrap(c.stats));
router.get('/documents/:docId/download', wrap(c.downloadDocument));
router.get('/', wrap(c.listPv));
router.get('/:id', wrap(c.getPv));

// Création
router.post(
  '/',
  allow('superadmin', 'editeur', 'intervenant'),
  wrap(c.createPv)
);

// Modification
router.put(
  '/:id',
  allow('superadmin', 'editeur', 'intervenant'),
  wrap(c.updatePv)
);

// Changement de statut
router.post(
  '/:id/statut',
  allow('superadmin', 'editeur', 'intervenant'),
  wrap(c.changeStatut)
);

// Signatures
router.post(
  '/:id/signatures',
  allow('superadmin', 'editeur', 'intervenant'),
  wrap(c.addSignature)
);

// Documents
router.post(
  '/:id/documents',
  allow('superadmin', 'editeur', 'intervenant'),
  wrap(c.addDocument)
);

// Téléchargement de fichiers
router.post(
  '/:id/fichiers',
  allow('superadmin', 'editeur', 'intervenant'),
  upload.array('fichiers', 10),
  wrap(c.uploadDocuments)
);

// Suppression d'un document
router.delete(
  '/documents/:docId',
  allow('superadmin', 'editeur', 'intervenant'),
  wrap(c.deleteDocument)
);

// Suppression d'un PV
router.delete(
  '/:id',
  allow('superadmin', 'editeur'),
  wrap(c.deletePv)
);

// Gestion des erreurs
router.use((err, _req, res, _next) => {
  res.status(400).json({
    message: err.message || 'Erreur',
  });
});

export default router;
