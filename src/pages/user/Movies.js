import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/Navbar';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('https://movies-json-hiql.onrender.com/movies');
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      setMovies(data);
      setError(null);
    } catch (err) {
      setError('Error loading movies');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setDebouncedSearchTerm(searchValue);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  // Get unique categories from movies
  const categories = ['all', ...new Set(movies.map(movie => movie.category))];
  
  // Get unique years from movies
  const years = ['all', ...new Set(movies.map(movie => 
    new Date(movie.releaseDate).getFullYear()
  ))].sort((a, b) => b - a);

  // Rating options
  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '4.6', label: '4.6 & above' },
    { value: '4.7', label: '4.7 & above' },
    { value: '4.8', label: '4.8 & above' }
  ];

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || movie.category === selectedCategory;
    const matchesRating = selectedRating === 'all' || movie.rating.rate >= parseFloat(selectedRating);
    const matchesYear = selectedYear === 'all' || 
      new Date(movie.releaseDate).getFullYear() === parseInt(selectedYear);

    return matchesSearch && matchesCategory && matchesRating && matchesYear;
  });

  const handleAddToCart = (movie) => {
    addToCart(movie);
    toast.success(`${movie.title} added to cart!`);
  };

  return (
    <PageContainer>
      <Navbar />
      <MainContent>
        <FilterSection>
          <SearchBar
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <FilterGroup>
            <Select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.filter(cat => cat !== 'all').map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </Select>

            <Select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              {ratingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="all">All Years</option>
              {years.filter(year => year !== 'all').map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
          </FilterGroup>
        </FilterSection>

        {loading ? (
          <LoadingMessage>Loading movies...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : filteredMovies.length === 0 ? (
          <NoMoviesFound>
            <h3>No Movies Found</h3>
            <p>Try adjusting your search criteria</p>
          </NoMoviesFound>
        ) : (
          <MovieGrid>
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id}>
                <MovieImage src={movie.image} alt={movie.title} />
                <MovieInfo>
                  <MovieTitle>{movie.title}</MovieTitle>
                  <MovieDetails>
                    <ReleaseDate>
                      <Icon>📅</Icon> {new Date(movie.releaseDate).getFullYear()}
                    </ReleaseDate>
                    <Category>
                      <Icon>🎬</Icon> {movie.category}
                    </Category>
                    <Rating>
                      <Icon>⭐</Icon> {movie.rating.rate}
                    </Rating>
                  </MovieDetails>
                  <MoviePrice>${movie.price}</MoviePrice>
                  <AddToCartButton onClick={() => handleAddToCart(movie)}>
                    Add to Cart
                  </AddToCartButton>
                </MovieInfo>
              </MovieCard>
            ))}
          </MovieGrid>
        )}
      </MainContent>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const MainContent = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const MovieCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const MovieImage = styled.img`
  width: 100%;
  height: 350px;
  object-fit: cover;
`;

const MovieInfo = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MovieTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  height: 2.4em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const MovieDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
`;

const ReleaseDate = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const Category = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #666;
  font-size: 0.9rem;
`;

const Rating = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const Icon = styled.span`
  font-size: 1rem;
`;

const MoviePrice = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #e50914;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f40612;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #e50914;
  font-size: 1.2rem;
`;

const NoMoviesFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 100%;
  color: #666;
  text-align: center;
  
  h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  p {
    font-size: 1rem;
  }
`;

export default Movies;