import { useEffect, useMemo, useReducer } from 'react';
import { CartContext } from './cartContext.js';

const initialState = {
  items: [], // {id, name, price, image, size, quantity}
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload;
    case 'ADD': {
      const { id, size } = action.payload;
      const idx = state.items.findIndex((it) => it.id === id && it.size === size);
      if (idx >= 0) {
        const items = [...state.items];
        items[idx] = { ...items[idx], quantity: items[idx].quantity + (action.payload.quantity || 1) };
        return { ...state, items };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }] };
    }
    case 'UPDATE_QTY': {
      const { id, size, quantity } = action.payload;
      const items = state.items.map((it) => (it.id === id && it.size === size ? { ...it, quantity } : it));
      return { ...state, items };
    }
    case 'REMOVE': {
      const { id, size } = action.payload;
      const items = state.items.filter((it) => !(it.id === id && it.size === size));
      return { ...state, items };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        dispatch({ type: 'INIT', payload: JSON.parse(saved) });
      } catch { /* ignore parse errors */ }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const api = useMemo(() => ({
    items: state.items,
    addToCart: (item) => dispatch({ type: 'ADD', payload: item }),
    updateQuantity: (id, size, quantity) => dispatch({ type: 'UPDATE_QTY', payload: { id, size, quantity } }),
    removeFromCart: (id, size) => dispatch({ type: 'REMOVE', payload: { id, size } }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
  }), [state.items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}
