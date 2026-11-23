import { HardHat, Users, ClipboardCheck, Droplets, Building2, ListChecks, AlertTriangle, BarChart3, Timer, Globe, LifeBuoy } from 'lucide-react';

// dispo:true = module réellement implémenté. Les autres sont désactivés (pas de page vide factice).
export const MENU = [
  { id: 'chantiers',    label: 'Chantiers',            icon: HardHat,        to: '/chantiers', dispo: true },
  { id: 'intervenants', label: 'Intervenants',         icon: Users,          to: '/intervenants' },
  { id: 'reception',    label: 'Réception de support', icon: ClipboardCheck, to: '/reception-support' },
  { id: 'mise-en-eau',  label: 'Mise en eau',          icon: Droplets,       to: '/mise-en-eau' },
  { id: 'clients',      label: 'Clients',              icon: Building2,      to: '/clients' },
  { id: 'constats',     label: 'Liste des constats',   icon: ListChecks,     to: '/constats' },
  { id: 'reserves',     label: 'Réserves',             icon: AlertTriangle,  to: '/reserves' },
  { id: 'etats',        label: 'États des projets',    icon: BarChart3,      to: '/etats' },
  { id: 'temps',        label: 'Temps de tâche',       icon: Timer,          to: '/temps' },
  { id: 'site',         label: 'Site internet',        icon: Globe,          to: '/site' },
  { id: 'aide',         label: "Besoin d'aide",        icon: LifeBuoy,       to: '/aide' },
];