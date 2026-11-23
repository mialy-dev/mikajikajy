export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

// Accepte +261 34 12 345 67, 034 12 345 67, etc.
export const isValidPhone = (v) => {
  const digits = v.replace(/[\s.\-()]/g, "");
  return /^\+?\d{9,15}$/.test(digits);
};

export const passwordRules = (pw) => ({
  length: pw.length >= 8,
  lower: /[a-z]/.test(pw),
  upper: /[A-Z]/.test(pw),
  digit: /\d/.test(pw),
  special: /[^A-Za-z0-9]/.test(pw),
});

export const isStrongPassword = (pw) => Object.values(passwordRules(pw)).every(Boolean);

export function passwordStrength(pw) {
  const score = Object.values(passwordRules(pw)).filter(Boolean).length + (pw.length >= 12 ? 1 : 0);
  if (!pw) return { score: 0, label: "", color: "bg-slate-200" };
  if (score <= 2) return { score, label: "Faible", color: "bg-red-500" };
  if (score <= 4) return { score, label: "Moyen", color: "bg-amber-500" };
  return { score, label: "Fort", color: "bg-emerald-500" };
}