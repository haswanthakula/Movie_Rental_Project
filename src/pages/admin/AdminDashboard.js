import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/AdminNavbar';
import { useMovies } from '../../contexts/MovieContext';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { movies } = useMovies();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([fetchOrders(), loadUsers()]);
  }, []);

  const fetchOrders = async () => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const allOrders = users.flatMap(user => user.orders || []);
      setOrders(allOrders);
    } catch (error) {
      toast.error('Error loading orders');
      setError('Error loading orders');
    }
  };

  const loadUsers = () => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(storedUsers);
    } catch (error) {
      toast.error('Error loading users');
      setError('Error loading users');
    }
  };

  const handleDeleteUser = (userId) => {
    try {
      const updatedUsers = users.filter(user => user.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  // Calculate top ordered movies
  const getTopOrderedMovies = () => {
    const movieCounts = {};
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const movieId = item.id.toString();
          movieCounts[movieId] = (movieCounts[movieId] || 0) + (item.quantity || 1);
        });
      }
    });

    return Object.entries(movieCounts)
      .map(([movieId, count]) => ({
        movie: movies.find(m => m.id.toString() === movieId),
        orderCount: count
      }))
      .filter(({ movie }) => movie) // Remove entries without a matching movie
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 5);
  };

  return (
    <Container>
      <Navbar />
      <Content>
        <Title>Admin Dashboard</Title>

        <Section>
          <SectionTitle>Top Ordered Movies</SectionTitle>
          <TopMoviesGrid>
            {getTopOrderedMovies().map(({ movie, orderCount }) => (
              <MovieCard key={movie?.id}>
                <MovieImage src={movie?.image} alt={movie?.title} />
                <MovieInfo>
                  <MovieTitle>{movie?.title}</MovieTitle>
                  <OrderCount>Orders: {orderCount}</OrderCount>
                  <MoviePrice>${movie?.price}</MoviePrice>
                </MovieInfo>
              </MovieCard>
            ))}
          </TopMoviesGrid>
        </Section>

        {/* Users Section */}
        <Section>
          <SectionTitle>Registered Users</SectionTitle>
          {users.length === 0 ? (
            <NoData>No registered users found</NoData>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Registration Date</Th>
                  <Th>Orders</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <Td>{user.id}</Td>
                    <Td>{user.name}</Td>
                    <Td>{user.email}</Td>
                    <Td>{new Date(parseInt(user.id)).toLocaleDateString()}</Td>
                    <Td>{user.orders?.length || 0}</Td>
                    <Td>
                      <ActionButton 
                        onClick={() => handleDeleteUser(user.id)}
                        color="#e50914"
                      >
                        Delete
                      </ActionButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Section>

        {/* Top Ordered Movies */}
        
      </Content>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const Content = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const Section = styled.section`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #333;
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
`;

const TopMoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MovieCard = styled.div`
  background: white;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  border: 1px solid #e0e0e0;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const MovieImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;

const MovieInfo = styled.div`
  padding: 0.5rem;
  text-align: center;
`;

const MovieTitle = styled.h3`
  margin: 0 0 0.3rem 0;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OrderCount = styled.div`
  color: #e50914;
  font-size: 0.7rem;
  margin-bottom: 0.2rem;
`;

const MoviePrice = styled.div`
  font-size: 0.7rem;
  color: #666;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  color: #333;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #666;
`;

const ActionButton = styled.button`
  background: ${props => props.color || '#e50914'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    opacity: 0.9;
  }
`;

const NoData = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

export default AdminDashboard;