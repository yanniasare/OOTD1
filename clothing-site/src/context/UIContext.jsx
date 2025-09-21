import { createContext, useContext, useMemo, useState } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  const api = useMemo(
    () => ({
      miniCartOpen,
      openMiniCart: () => setMiniCartOpen(true),
      closeMiniCart: () => setMiniCartOpen(false),
      toggleMiniCart: () => setMiniCartOpen((v) => !v),
    }),
    [miniCartOpen]
  );

  return <UIContext.Provider value={api}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
