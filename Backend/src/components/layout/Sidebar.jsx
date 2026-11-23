import { NavLink } from 'react-router-dom';
import { MENU } from './menu';

export default function Sidebar({ ouvert, onClose }) {
  return (
    <>
      <div className={`ek-backdrop ${ouvert ? 'is-open' : ''}`} onClick={onClose} />
      <aside className={`ek-sidebar ${ouvert ? 'is-open' : ''}`} aria-label="Navigation principale">
        <div className="ek-brand"><span className="ek-logo">EK</span><span>E-Kajy</span></div>
        <nav>
          {MENU.map(({ id, label, icon: Icon, to, dispo }) =>
            dispo ? (
              <NavLink key={id} to={to} onClick={onClose} className={({ isActive }) => `ek-nav ${isActive ? 'is-active' : ''}`}>
                <Icon size={19} /><span>{label}</span>
              </NavLink>
            ) : (
              <button key={id} className="ek-nav is-disabled" disabled title="Module à développer">
                <Icon size={19} /><span>{label}</span><em>bientôt</em>
              </button>
            ))}
        </nav>
      </aside>
    </>
  );
}