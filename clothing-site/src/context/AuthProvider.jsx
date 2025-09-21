import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContext.js';

export default function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('isAdmin');
    setIsAdmin(saved === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('isAdmin', String(isAdmin));
  }, [isAdmin]);

  const api = useMemo(() => ({
    isAdmin,
    login: (pin) => {
      // Simple demo PIN: 1234; replace with real auth in production
      if (String(pin) === '1234') {
        setIsAdmin(true);
        return { ok: true };
      }
      return { ok: false, error: 'Invalid PIN' };
    },
    logout: () => setIsAdmin(false),
  }), [isAdmin]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}
