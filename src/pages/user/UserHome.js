import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useMovies } from '../../contexts/MovieContext';


const UserHome = () => {
  const { movies } = useMovies();
  const featuredMovies = movies.slice(16, 20);

  return (
    <Container>
      <Navbar />
      <MainContent>
        <Header>
          <h1>Welcome to Movie Rental</h1>
        </Header>
        <FeaturedSection>
          <h2>Featured Movies</h2>
          <MovieGrid>
            {featuredMovies.map((movie) => (
              <MovieCard key={movie.id}>
                <MovieImage src={movie.image} alt={movie.title} />
                <MovieInfo>
                  <MovieTitle>{movie.title}</MovieTitle>
                  <MovieDetails>
                    <span>{movie.year}</span>
                    <span>{movie.genre}</span>
                  </MovieDetails>
                  
                </MovieInfo>
              </MovieCard>
            ))}
            <ViewMoreButton to="/user/movies">View More ->> </ViewMoreButton>
          </MovieGrid>
        </FeaturedSection>
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const MainContent = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const FeaturedSection = styled.div`
  margin-bottom: 40px;

  h2 {
    margin-bottom: 20px;
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const MovieCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MovieImage = styled.img`
  width: 100%;
  height: 350px;
  object-fit: cover;
`;

const MovieInfo = styled.div`
  padding: 15px;
`;

const MovieTitle = styled.h3`
  margin: 0 0 10px 0;
`;

const MovieDetails = styled.div`
  display: flex;
  gap: 10px;
  color: #666;
  margin-bottom: 10px;
`;

const ViewMoreButton = styled(Link)`
  display: block;
  text-align: center;
  background: #e50914;
  color: white;
  text-decoration: none;
  padding: 10px;
  border-radius: 4px;

  &:hover {
    background: #f40612;
  }
`;


export default UserHome;