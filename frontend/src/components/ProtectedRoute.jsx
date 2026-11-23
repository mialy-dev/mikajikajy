import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-10 text-center text-[#64748B]">Chargement…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  if (roles?.length && !roles.includes(user.role)) {
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <h1 className="text-2xl font-bold text-[#18304F]">Accès refusé</h1>
        <p className="mt-2 text-[#64748B]">Votre rôle ne vous permet pas d'accéder à cette page.</p>
        <Link to="/dashboard" className="mt-6 inline-block rounded-lg bg-[#18304F] px-5 py-2.5 text-white">
          Retour au tableau de bord
        </Link>
      </div>
    );
  }
  return <Outlet />;
}