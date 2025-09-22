import { createContext } from 'react';

// Separate context object to satisfy fast-refresh rule: this file has no components
export const ProductsContext = createContext(null);
