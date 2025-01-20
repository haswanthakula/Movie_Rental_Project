import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MovieProvider } from './contexts/MovieContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import GlobalStyles from './styles/GlobalStyles';
import { AuthProvider } from './contexts/AuthContext';
import styled from 'styled-components';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy loaded components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// User Pages
const UserHome = lazy(() => import('./pages/user/UserHome'));
const Movies = lazy(() => import('./pages/user/Movies'));
const CartPage = lazy(() => import('./pages/user/CartPage'));
const OrderHistory = lazy(() => import('./components/OrderHistory'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const MovieManagement = lazy(() => import('./pages/admin/MovieManagement'));
const SalesReport = lazy(() => import('./pages/admin/SalesReport'));

// Loading component
const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: #141414;
  color: #e50914;
  font-size: 1.5rem;

  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid #e50914;
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-left: 10px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const App = () => {
  return (
    <AuthProvider>
      <MovieProvider>
        <OrderProvider>
          <CartProvider>
            <Router>
              <GlobalStyles />
              <Suspense fallback={<LoadingSpinner>Loading...</LoadingSpinner>}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* User Routes */}
                  <Route path="/user/home" element={<UserHome />} />
                  <Route path="/user/movies" element={<Movies />} />
                  <Route path="/user/cart" element={<CartPage />} />
                  <Route path="/user/orders" element={<OrderHistory />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/movies" element={<MovieManagement />} /> 
                  <Route path="/admin/sales-report" element={<SalesReport />} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<Navigate to="/404" />} />
                  <Route path="/404" element={<NotFound />} />
                </Routes>
              </Suspense>
              <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </Router>
          </CartProvider>
        </OrderProvider>
      </MovieProvider>
    </AuthProvider>
  );
};

export default App;