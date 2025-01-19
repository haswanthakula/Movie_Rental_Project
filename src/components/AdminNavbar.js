import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';


const AdminNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    toast.info('Logged out successfully');
    navigate('/');
  };

  return (
    <Nav>
      <NavBrand to="/admin/dashboard">Movie Rental Admin</NavBrand>
      <NavLinks>
        <NavLink to="/admin/dashboard">Dashboard</NavLink>
        <NavLink to="/admin/movies">Movie Management</NavLink>
        <NavLink to="/admin/sales-report">Sales Report</NavLink>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </NavLinks>
    </Nav>
  );
};

const Nav = styled.nav`
  background: #141e30;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavBrand = styled(Link)`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const LogoutButton = styled.button`
  background: #e50914;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #f40612;
  }
`;

export default AdminNavbar;