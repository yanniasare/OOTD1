import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext.js';

export default function Header() {
  const { items } = useCart();
  const { theme, toggle } = useTheme();
  const { openMiniCart } = useUI();
  const { isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onAdmin = pathname.startsWith('/admin');
  const count = items.reduce((sum, it) => sum + it.quantity, 0);

  const navClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition active:scale-[0.98] border-b-2 ${
      isActive
        ? 'text-black dark:text-white border-black dark:border-white'
        : 'text-gray-700 dark:text-gray-200 border-transparent hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/70 dark:border-gray-800/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:dark:bg-gray-950/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Clothing-Site</Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={navClass} end>Home</NavLink>
          <NavLink to="/shop" className={navClass}>Shop</NavLink>
          {isAdmin && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
          {!onAdmin && (
            <button
              type="button"
              onClick={openMiniCart}
              className="relative inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/60 hover:bg-white dark:hover:bg-gray-800 transition"
              aria-label="Open cart drawer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-gray-900 dark:text-gray-100">
                <path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.44A2 2 0 008 18h10v-2H9.42a.25.25 0 01-.22-.37l.93-1.63H17a2 2 0 001.8-1.1l3.58-7.16A1 1 0 0021.5 4H7zm-1 16a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z"/>
              </svg>
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full bg-black text-white dark:bg-white dark:text-black">{count}</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-semibold rounded-full bg-red-600 text-white shadow" aria-hidden>
                  {Math.min(count, 9)}
                </span>
              )}
            </button>
          )}
          <button
            aria-label="Toggle dark mode"
            onClick={toggle}
            className="ml-2 px-3 py-2 rounded-md text-sm border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/60 hover:bg-white dark:hover:bg-gray-800 transition active:scale-[0.98]"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {isAdmin && (
            <div className="hidden sm:flex items-center gap-2 ml-2 px-2 py-1 rounded-full border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/60">
              <span className="text-xs text-gray-700 dark:text-gray-200">Admin</span>
              <button
                onClick={() => { logout(); navigate(import.meta.env.VITE_ADMIN_LOGIN_PATH || '/admin-login', { replace: true }); }}
                className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Logout"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
