import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [messages, setMessages] = useState([]);

  // toast("Texte") pour un succès, toast("Texte", "err") pour une erreur
  const toast = useCallback((texte, type = "ok") => {
    const id = Date.now() + Math.random();
    setMessages((liste) => [...liste, { id, texte, type }]);
    setTimeout(() => setMessages((liste) => liste.filter((m) => m.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex max-w-sm flex-col gap-2" aria-live="polite">
        {messages.map((m) => (
          <div
            key={m.id}
            role="status"
            className={`rounded-lg px-4 py-3 text-sm text-white shadow-lg ${
              m.type === "err" ? "bg-[#DC2626]" : "bg-[#18304F]"
            }`}
          >
            {m.texte}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast doit être utilisé dans un ToastProvider");
  return ctx;
}