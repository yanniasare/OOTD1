// Simple API helper for calling the backend
// Configure base URL via VITE_API_BASE; fallback to localhost:5001

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

export async function apiFetch(path, { method = 'GET', headers = {}, body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    const message = data?.message || res.statusText || 'Request failed';
    throw new Error(message);
  }
  return data;
}

export { API_BASE };
