import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { passwordRules, passwordStrength } from "../../utils/validators";

const RULE_LABELS = {
  length: "8 caractères minimum",
  upper: "Une majuscule",
  lower: "Une minuscule",
  digit: "Un chiffre",
  special: "Un caractère spécial",
};

export default function PasswordInput({ id, label, value, onChange, error, showStrength = false, autoComplete }) {
  const [visible, setVisible] = useState(false);
  const strength = passwordStrength(value);
  const rules = passwordRules(value);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#18304F]">
        {label}
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          className={`w-full rounded-xl border bg-white py-3 pl-10 pr-11 text-sm text-slate-800 outline-none transition
            focus:ring-2 focus:ring-[#18304F]/20 ${error ? "border-red-400" : "border-slate-200 focus:border-[#18304F]"}`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#18304F]"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}

      {showStrength && value && (
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <div className="flex h-1.5 flex-1 gap-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={`flex-1 rounded-full ${i <= strength.score ? strength.color : "bg-slate-200"}`} />
              ))}
            </div>
            <span className="text-xs font-medium text-slate-500">{strength.label}</span>
          </div>
          <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-xs sm:grid-cols-2">
            {Object.entries(RULE_LABELS).map(([key, text]) => (
              <li key={key} className={rules[key] ? "text-emerald-600" : "text-slate-400"}>
                {rules[key] ? "✓" : "○"} {text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}