import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const { user, chargement } = useAuth();
  const [ouvert, setOuvert] = useState(false);
  const [recherche, setRecherche] = useState('');
  if (chargement) return <div className="ek-center">Chargement…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="ek-app">
      <Sidebar ouvert={ouvert} onClose={() => setOuvert(false)} />
      <div className="ek-main">
        <Header recherche={recherche} setRecherche={setRecherche} onMenu={() => setOuvert(true)} />
        <main className="ek-content"><Outlet context={{ recherche }} /></main>
      </div>
    </div>
  );
}