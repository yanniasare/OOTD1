import { useContext } from 'react';
import { ProductsContext } from './productsContext.js';

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
