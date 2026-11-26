import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthLayout, Alert, Field, PasswordField, SubmitButton } from "../components/AuthForm";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?\d{9,15}$/;
const cleanPhone = (v) => v.replace(/[\s.\-()]/g, "");

function passwordError(p) {
  const ok = p.length >= 8 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p);
  return ok ? "" : "8 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial.";
}

function FieldError({ children }) {
  return children ? <p className="mt-1 text-sm text-red-600">{children}</p> : null;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", password: "", confirm: "", acceptTerms: false });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const clear = (k) => setErrors((x) => ({ ...x, [k]: undefined }));
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); clear(k); };

  function validate() {
    const e = {};
    if (form.nom.trim().length < 2) e.nom = "Le nom complet est obligatoire.";
    if (!EMAIL_RE.test(form.email.trim())) e.email = "Adresse e-mail invalide.";
    if (!PHONE_RE.test(cleanPhone(form.telephone))) e.telephone = "Numéro de téléphone invalide (ex. 034 12 345 67).";
    const pe = passwordError(form.password);
    if (pe) e.password = pe;
    if (form.password !== form.confirm) e.confirm = "Les mots de passe ne correspondent pas.";
    if (!form.acceptTerms) e.acceptTerms = "Vous devez accepter les conditions.";
    return e;
  }

async function handleSubmit(ev) {
  ev.preventDefault();
  setError("");

  const e = validate();
  setErrors(e);

  if (Object.keys(e).length) {
    setError("Veuillez corriger les champs en erreur.");
    return;
  }

  setBusy(true);

  try {
    await register({
      nom: form.nom.trim(),
      email: form.email.trim(),
      telephone: cleanPhone(form.telephone),
      password: form.password,
      acceptTerms: true,
    });

    navigate("/login", {
      replace: true,
      state: {
        message: "Compte créé. Vous pouvez vous connecter.",
      },
    });
  } catch (err) {
    const data = err.response?.data;

    if (data?.errors) {
      setErrors(data.errors);
    }

    setError(
      !err.response
        ? "Impossible de joindre le serveur. Vérifiez la connexion."
        : err.response.status === 409
        ? "Cette adresse e-mail est déjà utilisée."
        : data?.message || "Inscription impossible."
    );
  } finally {
    setBusy(false);
  }
}

  return (
    <AuthLayout title="Créer un compte" subtitle="Rejoignez E-KAJY"
      footer={<p>Déjà inscrit ? <Link to="/login" className="font-semibold text-[#18304F] underline">Se connecter</Link></p>}>
      {error && <Alert>{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <Field id="nom" label="Nom complet" required autoComplete="name" value={form.nom} onChange={set("nom")} />
          <FieldError>{errors.nom}</FieldError>
        </div>
        <div>
          <Field id="email" label="Adresse e-mail" type="email" autoComplete="email" required value={form.email} onChange={set("email")} />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div>
          <Field id="telephone" label="Téléphone" type="tel" autoComplete="tel" placeholder="034 12 345 67" required value={form.telephone} onChange={set("telephone")} />
          <FieldError>{errors.telephone}</FieldError>
        </div>
        <div>
          <PasswordField id="password" label="Mot de passe" autoComplete="new-password" required value={form.password} onChange={set("password")} />
          {errors.password
            ? <FieldError>{errors.password}</FieldError>
            : <p className="mt-1 text-xs text-slate-500">8 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial.</p>}
        </div>
        <div>
          <PasswordField id="confirm" label="Confirmer le mot de passe" autoComplete="new-password" required value={form.confirm} onChange={set("confirm")} />
          <FieldError>{errors.confirm}</FieldError>
        </div>
        <div>
          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.acceptTerms} className="mt-1 h-4 w-4 accent-[#18304F]"
              onChange={(e) => { setForm({ ...form, acceptTerms: e.target.checked }); clear("acceptTerms"); }} />
            <span>J'accepte les conditions d'utilisation d'E-KAJY.</span>
          </label>
          <FieldError>{errors.acceptTerms}</FieldError>
        </div>
        <SubmitButton loading={busy}>{busy ? "Création…" : "Créer mon compte"}</SubmitButton>
      </form>
    </AuthLayout>
  );
}