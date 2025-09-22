import { useEffect, useMemo, useState } from 'react';
import { OrdersContext } from './ordersContext.js';

export default function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('orders');
      if (saved) setOrders(JSON.parse(saved));
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('orders', JSON.stringify(orders));
    } catch {
      // ignore write errors
    }
  }, [orders]);

  const api = useMemo(() => ({
    orders,
    addOrder: (order) => {
      const id = order.id || crypto.randomUUID();
      const now = Date.now();
      const rec = { id, createdAt: now, status: 'pending', ...order };
      setOrders((prev) => [rec, ...prev]);
      return rec;
    },
    getOrder: (id) => orders.find((o) => o.id === id) || null,
    updateOrderStatus: (id, status) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))),
  }), [orders]);

  return <OrdersContext.Provider value={api}>{children}</OrdersContext.Provider>;
}
