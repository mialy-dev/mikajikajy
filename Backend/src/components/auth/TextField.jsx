export default function TextField({ id, label, icon: Icon, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#18304F]">{label}</label>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
        <input
          id={id}
          aria-invalid={!!error}
          className={`w-full rounded-xl border bg-white py-3 ${Icon ? "pl-10" : "pl-4"} pr-4 text-sm text-slate-800 outline-none transition
            focus:ring-2 focus:ring-[#18304F]/20 ${error ? "border-red-400" : "border-slate-200 focus:border-[#18304F]"}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}