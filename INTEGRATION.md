# Module PV E-KAJY — intégration

## 1. Base de données
Copie `backend/migration-pv.sql` dans ton dossier backend, puis :

```powershell
node apply-migration.js migration-pv.sql
```

Si `projets.id` est un UUID, remplace `INTEGER REFERENCES projets` par `UUID REFERENCES projets` dans le fichier avant de l'exécuter.

## 2. Backend
Copie :
- `backend/controllers/pv.controller.js` → `controllers/`
- `backend/routes/pv.routes.js` → `routes/`

Dans `routes/pv.routes.js`, vérifie la ligne d'import de `protect` (nom de ton middleware d'auth).

Dans `server.js` (ou `app.js`) :

```js
import pvRoutes from './routes/pv.routes.js';
app.use('/api/pv', pvRoutes);
```

## 3. Frontend
Copie le dossier `frontend/src/pages/pv/` dans `src/pages/`. Dépendances : `lucide-react` (déjà là) et `html2pdf.js`.

```powershell
npm i html2pdf.js
```

### Routes (`App.jsx`)
L'ordre compte : `/pv/liste` et `/pv/voir/:id` avant `/pv/:code`.

```jsx
import { Navigate } from 'react-router-dom';
import PVHome from './pages/pv/PVHome';
import PVList from './pages/pv/PVList';
import PVDetail from './pages/pv/PVDetail';

{/* Public : présentation */}
<Route path="/pv" element={<PVHome />} />

{/* Anciennes routes du menu → nouvelles pages */}
<Route path="/pv-mise-en-eau" element={<Navigate to="/pv/mise-en-eau" replace />} />
<Route path="/pv-reception" element={<Navigate to="/pv/reception" replace />} />
<Route path="/pv-autre" element={<Navigate to="/pv/liste" replace />} />

{/* Protégé : utilise ton composant ProtectedRoute existant */}
<Route element={<ProtectedRoute />}>
  <Route path="/pv/liste" element={<PVList />} />
  <Route path="/pv/voir/:id" element={<PVDetail />} />
  <Route path="/pv/:code" element={<PVList />} />
</Route>
```

### Menu (`PublicHeader`) — PV après Chantiers
Ordre des liens : **Accueil · Chantiers · PV · Contact**

```jsx
const NAV = [
  { to: '/', label: 'Accueil' },
  { to: '/chantiers', label: 'Chantiers' },
  { to: '/pv', label: 'PV' },
  { to: '/contact', label: 'Contact' },
];
```

## 4. Permissions
| Rôle | Droits |
|---|---|
| superadmin | tout, y compris archivage |
| éditeur | création, modification, vérification, validation, rejet, signature, suppression (brouillon) |
| intervenant | crée et modifie ses propres PV, soumet, signe ; ne voit que ses PV + PV validés/signés/archivés |
| lecteur | lecture seule |

## 5. Circuit des statuts
Brouillon → Soumis → En vérification → Validé / Rejeté → Signé → Archivé
(Rejeté → Brouillon pour correction). Un PV n'est modifiable qu'en Brouillon ou Rejeté.

## 6. Points à ajuster selon ton projet
- `req.user.role` : le contrôleur lit `role` ou `role_name`.
- Colonne du nom de chantier : `projets.nom` (sinon l'affichage retombe sur `#id`).
- Pièces jointes (`pv_documents`) : le backend enregistre nom + URL ; l'upload de fichiers/photos (multer) n'est pas inclus.
- Multi-entreprise : aucun filtre par entreprise n'est appliqué ; à ajouter si tes projets portent un `entreprise_id`.
