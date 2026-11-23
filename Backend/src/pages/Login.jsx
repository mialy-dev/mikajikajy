import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { useAuth } from "../AuthContext";
import AuthLayout from "../components/auth/AuthLayout";
import TextField from "../components/auth/TextField";
import PasswordInput from "../components/auth/PasswordInput";
import { isValidEmail } from "../utils/validators";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const info = location.state?.message;
  const from = location.state?.from?.pathname || "/";

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setServerError("");
    const errs = {};
    if (!isValidEmail(form.email)) errs.email = "Adresse e-mail invalide.";
    if (!form.password) errs.password = "Le mot de passe est obligatoire.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Bienvenue sur E-KAJY" subtitle="Connectez-vous pour accéder à votre espace de travail.">
      {info && <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{info}</div>}
      {serverError && <div role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{serverError}</div>}

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <TextField id="email" type="email" label="Adresse e-mail" icon={Mail} autoComplete="email"
          value={form.email} onChange={set("email")} error={errors.email} />
        <PasswordInput id="password" label="Mot de passe" autoComplete="current-password"
          value={form.password} onChange={set("password")} error={errors.password} />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600">
            <input type="checkbox" checked={form.rememberMe} onChange={set("rememberMe")} className="h-4 w-4 rounded border-slate-300" />
            Se souvenir de moi
          </label>
          <Link to="/forgot-password" className="font-medium text-[#DC2626] hover:underline">Mot de passe oublié ?</Link>
        </div>

        <button type="submit" disabled={loading}
          className="w-full rounded-xl bg-[#E52327] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c81e22] disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Pas encore de compte ? <Link to="/register" className="font-medium text-[#18304F] hover:underline">Créer un compte</Link>
      </p>
    </AuthLayout>
  );
}