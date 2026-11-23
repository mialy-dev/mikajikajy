import { Link } from 'react-router-dom';
import { Facebook, Mail, Phone } from 'lucide-react';
import Logo from '../assets/logo.png';

const NAVY = '#18304F';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: NAVY }} className="text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
        <Link to="/" className="inline-flex items-center gap-2">
            <img src={Logo} alt="Logo E-KAJY" className="h-10 w-auto" />
            <span className="text-xl font-extrabold tracking-wide text-white">
              <span className="text-[#DC2626]">E</span>-KAJY
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-300">
            Application web de gestion et de suivi des chantiers : procès-verbaux, réserves, signatures et archivage.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-white">Liens utiles</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Accueil</Link></li>
            <li><Link to="/pv" className="hover:text-white">Gestion des PV</Link></li>
            <li><Link to="/tarifs" className="hover:text-white">Tarifs</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/activation-licence" className="hover:text-white">Activer ma licence</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-white">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone size={15} /> 000 00 000 00</li>
            <li className="flex items-center gap-2"><Mail size={15} /> ekajy@gmail.com</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-white">Suivez-nous</h4>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm hover:text-white">
            <Facebook size={16} /> Facebook
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-slate-400">© {new Date().getFullYear()} E-KAJY. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
