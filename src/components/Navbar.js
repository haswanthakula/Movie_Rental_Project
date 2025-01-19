import React from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <Nav>
      <Logo>Movie Rental</Logo>
      <NavLinks>
        <NavLink to="/user/home">Home</NavLink>
        <NavLink to="/user/movies">Movies</NavLink>
        <NavLink to="/user/cart">
          Cart ({cartCount})
        </NavLink>
        <NavLink to="/user/orders">Orders</NavLink>
        <UserName>Welcome, {user?.name || 'User'}</UserName>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </NavLinks>
    </Nav>
  );
};

const Nav = styled.nav`
  background: #141414;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Logo = styled.div`
  color: #e50914;
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #e50914;
  }
`;

const UserName = styled.span`
  color: white;
  margin-right: 1rem;
`;

const LogoutButton = styled.button`
  background: #e50914;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #f40612;
  }
`;

export default Navbar;