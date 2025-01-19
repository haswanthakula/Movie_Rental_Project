import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://movies-json-hiql.onrender.com/movies', {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMovies(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
      setError('Failed to fetch movies. Please ensure the JSON server is running.');
      toast.error('Unable to load movies. Check your server connection.');
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (movieId) => {
    try {
      const response = await fetch(`https://movies-json-hiql.onrender.com/movies/${movieId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove movie from movies state
        setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));

        // Remove from all users' carts in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map(user => ({
          ...user,
          cart: user.cart ? user.cart.filter(item => item.id !== movieId) : []
        }));
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        // Remove from current cart in localStorage
        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = currentCart.filter(item => item.id !== movieId);
        if (updatedCart.length > 0) {
          localStorage.setItem('cart', JSON.stringify(updatedCart));
        } else {
          localStorage.removeItem('cart');
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting movie:', error);
      return false;
    }
  };

  const addMovie = async (movieData) => {
    try {
      const response = await fetch('https://movies-json-hiql.onrender.com/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
      });

      if (!response.ok) throw new Error('Failed to add movie');

      const newMovie = await response.json();
      setMovies(prevMovies => [...prevMovies, newMovie]);
      return true;
    } catch (error) {
      console.error('Error adding movie:', error);
      return false;
    }
  };

  const updateMovie = async (movieId, updatedData) => {
    try {
      const response = await fetch(`https://movies-json-hiql.onrender.com/movies/${movieId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update movie');

      const updatedMovie = await response.json();
      setMovies(prevMovies =>
        prevMovies.map(movie =>
          movie.id === movieId ? updatedMovie : movie
        )
      );
      return true;
    } catch (error) {
      console.error('Error updating movie:', error);
      return false;
    }
  };

  return (
    <MovieContext.Provider value={{
      movies,
      loading,
      error,
      addMovie,
      updateMovie,
      deleteMovie,
      fetchMovies
    }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};

export default MovieContext;