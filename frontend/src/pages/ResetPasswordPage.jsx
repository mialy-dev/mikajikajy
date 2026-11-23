import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { AuthLayout, Alert, PasswordField, SubmitButton } from "../components/AuthForm";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Le mot de passe doit contenir au moins 8 caractères.");
    if (password !== confirm) return setError("Les mots de passe ne correspondent pas.");
    setBusy(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      navigate("/login", { replace: true, state: { message: "Mot de passe modifié. Connectez-vous avec le nouveau." } });
    } catch (err) {
      setError(err.response?.data?.error || "Réinitialisation impossible.");
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <AuthLayout title="Lien invalide" footer={<Link to="/forgot-password" className="underline">Demander un nouveau lien</Link>}>
        <Alert>Ce lien de réinitialisation est invalide.</Alert>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Nouveau mot de passe" subtitle="Choisissez un mot de passe d'au moins 8 caractères">
      {error && <Alert>{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField id="password" label="Nouveau mot de passe" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <PasswordField id="confirm" label="Confirmer" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <SubmitButton loading={busy}>{busy ? "Enregistrement…" : "Modifier le mot de passe"}</SubmitButton>
      </form>
    </AuthLayout>
  );
}