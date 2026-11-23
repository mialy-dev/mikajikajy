import { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#18304F] focus:outline-none focus:ring-2 focus:ring-[#18304F]/20";

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#EFF6FF] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <h1 className="text-2xl font-bold text-[#18304F]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[#64748B]">{subtitle}</p>}
        <div className="mt-6 space-y-4">{children}</div>
        {footer && <div className="mt-6 space-y-2 text-center text-sm text-[#64748B]">{footer}</div>}
      </div>
    </div>
  );
}

export function Alert({ type = "error", children }) {
  const ok = type === "success";
  const Icon = ok ? CheckCircle2 : AlertCircle;
  return (
    <div role="alert" className={`flex items-start gap-2 rounded-lg p-3 text-sm ${ok ? "bg-green-50 text-green-800" : "bg-red-50 text-[#DC2626]"}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function Field({ label, id, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-[#18304F]">{label}</label>
      <input id={id} className={inputCls} {...props} />
    </div>
  );
}

export function PasswordField({ label, id, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-[#18304F]">{label}</label>
      <div className="relative">
        <input id={id} type={visible ? "text" : "password"} className={`${inputCls} pr-10`} {...props} />
        <button type="button" onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          className="absolute inset-y-0 right-0 px-3 text-[#64748B]">
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export function SubmitButton({ loading, children }) {
  return (
    <button type="submit" disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#DC2626] px-4 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}