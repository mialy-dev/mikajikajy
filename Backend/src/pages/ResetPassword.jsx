import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authApi } from "../api";
import AuthLayout from "../components/auth/AuthLayout";
import PasswordInput from "../components/auth/PasswordInput";
import { isStrongPassword } from "../utils/validators";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setServerError("");
    const errs = {};
    if (!isStrongPassword(password)) errs.password = "Le mot de passe ne respecte pas toutes les règles.";
    if (confirm !== password) errs.confirm = "Les mots de passe ne correspondent pas.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <AuthLayout title="Lien invalide" subtitle="Ce lien de réinitialisation est incomplet.">
        <Link to="/forgot-password" className="font-medium text-[#DC2626] hover:underline">Demander un nouveau lien</Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Nouveau mot de passe" subtitle="Choisissez un nouveau mot de passe sécurisé.">
      {success ? (
        <div className="space-y-4">
          <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">Votre mot de passe a été modifié avec succès.</div>
          <Link to="/login" className="block w-full rounded-xl bg-[#E52327] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#c81e22]">
            Retour à la connexion
          </Link>
        </div>
      ) : (
        <>
          {serverError && (
            <div role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {serverError} <Link to="/forgot-password" className="underline">Demander un nouveau lien</Link>
            </div>
          )}
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <PasswordInput id="password" label="Nouveau mot de passe" autoComplete="new-password" showStrength
              value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
            <PasswordInput id="confirm" label="Confirmer le nouveau mot de passe" autoComplete="new-password"
              value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-[#E52327] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c81e22] disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Enregistrement..." : "Enregistrer le mot de passe"}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}