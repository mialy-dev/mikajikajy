import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, User } from "lucide-react";
import { authApi } from "../api";
import AuthLayout from "../components/auth/AuthLayout";
import TextField from "../components/auth/TextField";
import PasswordInput from "../components/auth/PasswordInput";
import { isValidEmail, isValidPhone, isStrongPassword } from "../utils/validators";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", password: "", confirm: "", acceptTerms: true });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  function validate() {
    const e = {};
    if (form.nom.trim().length < 2) e.nom = "Le nom complet est obligatoire.";
    if (!isValidEmail(form.email)) e.email = "Adresse e-mail invalide.";
    if (!isValidPhone(form.telephone)) e.telephone = "Numéro de téléphone invalide.";
    if (!isStrongPassword(form.password)) e.password = "Le mot de passe ne respecte pas toutes les règles.";
    if (form.confirm !== form.password) e.confirm = "Les mots de passe ne correspondent pas.";
    if (!form.acceptTerms) e.acceptTerms = "Vous devez accepter les conditions.";
    return e;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    setServerError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const { message } = await authApi.register({
        nom: form.nom, email: form.email, telephone: form.telephone,
        password: form.password, acceptTerms: form.acceptTerms,
      });
      navigate("/login", { replace: true, state: { message } }); // seulement après enregistrement réel
    } catch (err) {
      if (err.errors) setErrors((prev) => ({ ...prev, ...err.errors }));
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Créer un compte E-KAJY" subtitle="Rejoignez E-KAJY pour gérer vos projets, réunions et procès-verbaux.">
      {serverError && <div role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{serverError}</div>}

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <TextField id="nom" label="Nom complet" icon={User} autoComplete="name" value={form.nom} onChange={set("nom")} error={errors.nom} />
        <TextField id="email" type="email" label="Adresse e-mail professionnelle" icon={Mail} autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
        <TextField id="telephone" type="tel" label="Numéro de téléphone" icon={Phone} autoComplete="tel" placeholder="+261 34 00 000 00" value={form.telephone} onChange={set("telephone")} error={errors.telephone} />
        <PasswordInput id="password" label="Mot de passe" autoComplete="new-password" showStrength value={form.password} onChange={set("password")} error={errors.password} />
        <PasswordInput id="confirm" label="Confirmer le mot de passe" autoComplete="new-password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} />

        <div>
          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.acceptTerms} onChange={set("acceptTerms")} className="mt-0.5 h-4 w-4 rounded border-slate-300" />
            <span>
              J'accepte les <Link to="/legal" className="text-[#18304F] underline">conditions d'utilisation</Link> et la{" "}
              <Link to="/legal" className="text-[#18304F] underline">politique de confidentialité</Link>.
            </span>
          </label>
          {errors.acceptTerms && <p className="mt-1.5 text-xs text-red-600">{errors.acceptTerms}</p>}
        </div>

        <button type="submit" disabled={loading}
          className="w-full rounded-xl bg-[#E52327] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c81e22] disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Création du compte..." : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Déjà un compte ? <Link to="/login" className="font-medium text-[#18304F] hover:underline">Se connecter</Link>
      </p>
    </AuthLayout>
  );
}