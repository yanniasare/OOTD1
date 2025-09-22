import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';

export default function AdminLogin() {
  const { login } = useContext(AuthContext);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const res = login(pin);
    if (res.ok) {
      navigate('/admin', { replace: true });
    } else {
      setError(res.error || 'Login failed');
    }
  };

  return (
    <section className="space-y-6 max-w-md">
      <Breadcrumbs />
      <h1 className="text-2xl sm:text-3xl font-semibold">Admin Login</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">Enter the admin PIN to access the dashboard.</p>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">PIN</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="••••"
            inputMode="numeric"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="px-4 py-2 bg-black text-white rounded-md">Login</button>
      </form>
    </section>
  );
}
