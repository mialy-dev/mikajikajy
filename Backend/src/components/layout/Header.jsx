import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { MENU } from './menu';

export default function Header({ recherche, setRecherche, onMenu }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [menu, setMenu] = useState(false);
  const [notifs, setNotifs] = useState(null); // null = fermé
  const [notifErr, setNotifErr] = useState(false);
  const page = MENU.find((m) => pathname.startsWith(m.to))?.label ?? 'Accueil';
  const initiales = (user?.nom ?? '?').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
  const ouvertNotifs = notifs !== null;

  useEffect(() => {
    if (!ouvertNotifs) return;
    api.get('/notifications')
      .then((r) => { setNotifs(Array.isArray(r.data) ? r.data : []); setNotifErr(false); })
      .catch(() => setNotifErr(true));
  }, [ouvertNotifs]);

  return (
    <header className="ek-header">
      <button className="ek-icon-btn ek-burger" onClick={onMenu} aria-label="Ouvrir le menu"><Menu size={20} /></button>
      <div className="ek-crumb"><span>E-Kajy</span><span>/</span><strong>{page}</strong></div>
      <label className="ek-search"><Search size={16} />
        <input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher un chantier…" />
      </label>
      <div className="ek-pop">
        <button className="ek-icon-btn" onClick={() => setNotifs(ouvertNotifs ? null : [])} aria-label="Notifications"><Bell size={19} /></button>
        {ouvertNotifs && (
          <div className="ek-dropdown ek-notifs">
            <strong>Notifications</strong>
            {notifErr ? <p className="ek-muted">Service de notifications indisponible.</p>
              : notifs.length === 0 ? <p className="ek-muted">Aucune notification.</p>
              : notifs.map((n) => <p key={n.id} className={n.lu ? 'ek-muted' : ''}>{n.message}</p>)}
          </div>
        )}
      </div>
      <div className="ek-pop">
        <button className="ek-profile" onClick={() => setMenu(!menu)}>
          <span className="ek-avatar">{initiales}</span>
          <span className="ek-profile__txt"><b>{user?.nom ?? 'Utilisateur'}</b><small>{user?.role}</small></span>
          <ChevronDown size={16} />
        </button>
        {menu && (
          <div className="ek-dropdown">
            <div className="ek-muted">{user?.email}</div>
            <button className="ek-dd-item" onClick={logout}><LogOut size={16} /> Déconnexion</button>
          </div>
        )}
      </div>
    </header>
  );
}