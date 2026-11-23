import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthLayout, Alert, Field, PasswordField, SubmitButton } from "../components/AuthForm";

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const demande = location.state?.from?.pathname;
  const from = demande && demande !== "/login" ? demande : "/dashboard";
  const info = location.state?.message;

  if (loading) return <div className="p-10 text-center text-[#64748B]">Chargement…</div>;
  if (user) return <Navigate to={from} replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form.email.trim(), form.password, form.remember);
      // La redirection se fait via <Navigate> dès que user est défini
    } catch (err) {
      const s = err.response?.status;
      setError(
        s === 401 ? "E-mail ou mot de passe incorrect."
        : s === 429 ? "Trop de tentatives. Réessayez dans quelques minutes."
        : err.response?.data?.error || "Connexion impossible. Vérifiez votre connexion internet."
      );
      setBusy(false);
    }
  }

  return (
    <AuthLayout title="Connexion" subtitle="Accédez à votre espace E-KAJY"
      footer={<p>Pas encore de compte ? <Link to="/register" className="font-semibold text-[#18304F] underline">Créer un compte</Link></p>}>
      {info && <Alert type="success">{info}</Alert>}
      {error && <Alert>{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field id="email" label="Adresse e-mail" type="email" autoComplete="email" required
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <PasswordField id="password" label="Mot de passe" autoComplete="current-password" required
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-[#64748B]">
            <input type="checkbox" checked={form.remember}
              onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
            Se souvenir de moi
          </label>
          <Link to="/forgot-password" className="text-[#18304F] underline">Mot de passe oublié ?</Link>
        </div>
        <SubmitButton loading={busy}>{busy ? "Connexion…" : "Se connecter"}</SubmitButton>
      </form>
    </AuthLayout>
  );
}