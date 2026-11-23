import { X } from 'lucide-react';

export default function Modal({ titre, onClose, children }) {
  return (
    <div className="ek-overlay" onMouseDown={onClose}>
      <div className="ek-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <div className="ek-modal__head">
          <h3>{titre}</h3>
          <button className="ek-icon-btn" onClick={onClose} aria-label="Fermer"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}