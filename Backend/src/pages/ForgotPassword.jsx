import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { authApi } from "../api";
import AuthLayout from "../components/auth/AuthLayout";
import TextField from "../components/auth/TextField";
import { isValidEmail } from "../utils/validators";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!isValidEmail(email)) return setError("Adresse e-mail invalide.");
    setLoading(true);
    try {
      const { message } = await authApi.forgotPassword(email);
      setDone(message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Mot de passe oublié ?"
      subtitle="Vous avez oublié votre mot de passe ? Entrez votre adresse e-mail. Nous vous enverrons un lien sécurisé pour le réinitialiser."
    >
      {done ? (
        <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">{done}</div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <TextField id="email" type="email" label="Adresse e-mail" icon={Mail} autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-[#E52327] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c81e22] disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Envoi..." : "Envoyer le lien de réinitialisation"}
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-sm">
        <Link to="/login" className="font-medium text-[#18304F] hover:underline">← Retour à la connexion</Link>
      </p>
    </AuthLayout>
  );
}