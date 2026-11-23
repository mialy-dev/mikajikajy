export const STATUTS = {
  brouillon:       { label: 'Brouillon',       cls: 'bg-slate-100 text-slate-700' },
  soumis:          { label: 'Soumis',          cls: 'bg-blue-100 text-blue-700' },
  en_verification: { label: 'En vérification', cls: 'bg-amber-100 text-amber-700' },
  valide:          { label: 'Validé',          cls: 'bg-emerald-100 text-emerald-700' },
  rejete:          { label: 'Rejeté',          cls: 'bg-red-100 text-red-700' },
  signe:           { label: 'Signé',           cls: 'bg-indigo-100 text-indigo-700' },
  archive:         { label: 'Archivé',         cls: 'bg-zinc-200 text-zinc-700' },
};

// Types affichés sur la page d'accueil PV (si l'API est indisponible, on garde ces valeurs)
export const TYPES_PRINCIPAUX = [
  { code: 'mise-en-eau', libelle: 'PV Mise en eau', description: 'Essais et vérification des installations hydrauliques.', icon: 'Droplets' },
  { code: 'reception',   libelle: 'PV Réception',   description: 'Réception provisoire, définitive et avec réserves.', icon: 'ClipboardCheck' },
  { code: 'reunion',     libelle: 'PV de réunion',  description: 'Décisions, participants et comptes rendus.', icon: 'Users' },
  { code: 'constat',     libelle: 'PV de constat',  description: 'Observations, anomalies et non-conformités.', icon: 'SearchCheck' },
];

export const TYPES_AUTRES = [
  { code: 'visite-chantier',      libelle: 'PV de visite de chantier' },
  { code: 'avancement',           libelle: 'PV d\'avancement des travaux' },
  { code: 'arret-reprise',        libelle: 'PV d\'arrêt et de reprise des travaux' },
  { code: 'livraison',            libelle: 'PV de livraison' },
  { code: 'levee-reserves',       libelle: 'PV de levée des réserves' },
  { code: 'non-conformite',       libelle: 'PV de non-conformité' },
  { code: 'modification-travaux', libelle: 'PV de modification des travaux' },
];

export const NAVY = '#18304F';
export const RED = '#DC2626';

export const normRole = (r) =>
  String(r || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export const canWrite = (role) => ['superadmin', 'editeur', 'intervenant'].includes(normRole(role));
export const canReview = (role) => ['superadmin', 'editeur'].includes(normRole(role));
