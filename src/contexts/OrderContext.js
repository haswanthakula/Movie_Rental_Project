import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  // Load orders when user changes
  useEffect(() => {
    if (user) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = users.find(u => u.id === user.id);
      if (currentUser) {
        setOrders(currentUser.orders || []);
      }
    } else {
      setOrders([]);
    }
  }, [user]);

  const addOrder = (orderData) => {
    const newOrder = {
      id: Date.now().toString(),
      ...orderData,
      userId: user.id,
      orderDate: new Date().toISOString()
    };

    setOrders(prevOrders => {
      const updatedOrders = [...prevOrders, newOrder];
      
      // Update user's orders in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          return { ...u, orders: updatedOrders };
        }
        return u;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      return updatedOrders;
    });

    return newOrder;
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};