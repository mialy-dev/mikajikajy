import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const T = createContext(() => {});
export const useToast = () => useContext(T);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((message, type = 'ok') => {
    const id = Date.now() + Math.random();
    setItems((l) => [...l, { id, message, type }]);
    setTimeout(() => setItems((l) => l.filter((x) => x.id !== id)), 3500);
  }, []);
  return (
    <T.Provider value={push}>
      {children}
      <div className="ek-toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`ek-toast ek-toast--${t.type}`}>
            {t.type === 'ok' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}{t.message}
          </div>
        ))}
      </div>
    </T.Provider>
  );
}