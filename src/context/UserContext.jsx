import { createContext, useContext, useEffect, useState, useMemo } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const register = async (userData) => {
    try {
      // Simulate API call - replace with real API
      const newUser = {
        id: crypto.randomUUID(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
        addresses: [],
        orderHistory: [],
        wishlist: [],
        createdAt: new Date().toISOString(),
      };

      // Check if user already exists (simulate)
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = existingUsers.find(u => u.email === userData.email);
      
      if (userExists) {
        throw new Error('User with this email already exists');
      }

      // Save to users list
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      // Simulate API call - replace with real API
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = existingUsers.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('User not found');
      }

      // In a real app, you'd verify the password hash
      // For demo purposes, we'll accept any password
      setUser(foundUser);
      return { success: true, user: foundUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      const updatedUser = { ...user, ...updates };
      
      // Update in users list
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = existingUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        existingUsers[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(existingUsers));
      }

      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addAddress = (address) => {
    if (!user) return;
    
    const newAddress = {
      id: crypto.randomUUID(),
      ...address,
      isDefault: user.addresses.length === 0, // First address is default
    };

    const updatedUser = {
      ...user,
      addresses: [...user.addresses, newAddress]
    };

    updateProfile({ addresses: updatedUser.addresses });
  };

  const updateAddress = (addressId, updates) => {
    if (!user) return;

    const updatedAddresses = user.addresses.map(addr => 
      addr.id === addressId ? { ...addr, ...updates } : addr
    );

    updateProfile({ addresses: updatedAddresses });
  };

  const deleteAddress = (addressId) => {
    if (!user) return;

    const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
    updateProfile({ addresses: updatedAddresses });
  };

  const addToWishlist = (productId) => {
    if (!user) return;

    const wishlist = user.wishlist || [];
    if (!wishlist.includes(productId)) {
      updateProfile({ wishlist: [...wishlist, productId] });
    }
  };

  const removeFromWishlist = (productId) => {
    if (!user) return;

    const wishlist = user.wishlist || [];
    updateProfile({ wishlist: wishlist.filter(id => id !== productId) });
  };

  const addToOrderHistory = (order) => {
    if (!user) return;

    const orderHistory = user.orderHistory || [];
    updateProfile({ orderHistory: [...orderHistory, order] });
  };

  const value = useMemo(() => ({
    user,
    loading,
    isLoggedIn: !!user,
    register,
    login,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    addToWishlist,
    removeFromWishlist,
    addToOrderHistory,
  }), [user, loading]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
