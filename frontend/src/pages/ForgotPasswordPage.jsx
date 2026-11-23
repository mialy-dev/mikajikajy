import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { AuthLayout, Alert, Field, SubmitButton } from "../components/AuthForm";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setMessage(""); setBusy(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email: email.trim() });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.status === 429
        ? "Trop de demandes. Réessayez dans quelques minutes."
        : "Impossible d'envoyer la demande pour le moment.");
    } finally { setBusy(false); }
  }

  return (
    <AuthLayout title="Mot de passe oublié" subtitle="Nous vous enverrons un lien de réinitialisation"
      footer={<Link to="/login" className="font-semibold text-[#18304F] underline">Retour à la connexion</Link>}>
      {message && <Alert type="success">{message}</Alert>}
      {error && <Alert>{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field id="email" label="Adresse e-mail" type="email" autoComplete="email" required
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <SubmitButton loading={busy}>{busy ? "Envoi…" : "Envoyer le lien"}</SubmitButton>
      </form>
    </AuthLayout>
  );
}