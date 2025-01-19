import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/AdminNavbar';
import { useMovies } from '../../contexts/MovieContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spin, Alert } from 'antd';

const MovieManagement = () => {
  const { movies, loading, error, addMovie, updateMovie, deleteMovie } = useMovies();
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
    releaseDate: '',
    rating: { rate: 0, count: 0 }
  });

  if (loading) {
    return (
      <Container>
        <Navbar />
        <LoadingContainer>
          <Spin size="large" />
          <p>Loading movies...</p>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Navbar />
        <ErrorContainer>
          <Alert 
            message="Error Loading Movies" 
            description={error} 
            type="error" 
            showIcon 
          />
          <RetryButton onClick={() => window.location.reload()}>
            Retry Loading
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateMovie = () => {
    // Check for empty required fields
    if (!formData.title || !formData.description || !formData.price || 
        !formData.category || !formData.releaseDate) {
      toast.error('Please fill in all required fields');
      return false;
    }

    // Check for duplicate title
    const isDuplicateTitle = movies.some(movie => 
      movie.title.toLowerCase() === formData.title.toLowerCase() &&
      (!selectedMovie || movie.id !== selectedMovie.id)
    );

    if (isDuplicateTitle) {
      toast.error('A movie with this title already exists');
      return false;
    }

    // Check for duplicate description
    const isDuplicateDescription = movies.some(movie => 
      movie.description.toLowerCase() === formData.description.toLowerCase() &&
      (!selectedMovie || movie.id !== selectedMovie.id)
    );

    if (isDuplicateDescription) {
      toast.error('A movie with this description already exists');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateMovie()) {
      return;
    }

    try {
      // If no image is provided, use title as placeholder
      const movieData = {
        ...formData,
        image: formData.image || `https://via.placeholder.com/400x600?text=${encodeURIComponent(formData.title)}`
      };

      if (dialogMode === 'add') {
        await addMovie(movieData);
        toast.success('Movie added successfully!');
      } else if (dialogMode === 'edit') {
        await updateMovie(selectedMovie.id, movieData);
        toast.success('Movie updated successfully!');
      }
      setShowDialog(false);
    } catch (error) {
      toast.error(dialogMode === 'add' ? 'Failed to add movie' : 'Failed to update movie');
      console.error('Error:', error);
    }
  };

  const handleAction = (mode, movie = null) => {
    setDialogMode(mode);
    setSelectedMovie(movie);
    if (mode === 'edit' && movie) {
      setFormData(movie);
    } else if (mode === 'add') {
      setFormData({
        title: '',
        price: '',
        description: '',
        category: '',
        image: '',
        releaseDate: '',
        rating: { rate: 0, count: 0 }
      });
    }
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMovie(id);
      toast.success('Movie deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete movie');
      console.error('Error:', error);
    }
  };

  return (
    <Container>
      <Navbar />
      <Content>
        <Header>
          <h1>Movie Management</h1>
          <AddButton onClick={() => handleAction('add')}>Add New Movie</AddButton>
        </Header>

        <MovieGrid>
          {movies.map((movie) => (
            <MovieCard key={movie.id}>
              <MovieImage src={movie.image} alt={movie.title} />
              <MovieInfo>
                <MovieTitle>{movie.title}</MovieTitle>
                <MoviePrice>${movie.price}</MoviePrice>
                <ButtonGroup>
                  <EditButton onClick={() => handleAction('edit', movie)}>
                    Edit
                  </EditButton>
                  <DeleteButton onClick={() => handleDelete(movie.id)}>
                    Delete
                  </DeleteButton>
                </ButtonGroup>
              </MovieInfo>
            </MovieCard>
          ))}
        </MovieGrid>

        {showDialog && (
          <DialogOverlay>
            <DialogContent>
              <DialogHeader>
                <h2>{dialogMode === 'add' ? 'Add New Movie' : 'Edit Movie'}</h2>
                <CloseButton onClick={() => setShowDialog(false)}>&times;</CloseButton>
              </DialogHeader>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Title *</Label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Description *</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Category *</Label>
                  <Input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Image URL</Label>
                  <Input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Leave empty to use title as placeholder"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Release Date *</Label>
                  <Input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Rating</Label>
                  <Input
                    type="number"
                    name="rating.rate"
                    value={formData.rating.rate}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="5"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Rating Count</Label>
                  <Input
                    type="number"
                    name="rating.count"
                    value={formData.rating.count}
                    onChange={handleInputChange}
                    min="0"
                  />
                </FormGroup>

                <SubmitButton type="submit">
                  {dialogMode === 'add' ? 'Add Movie' : 'Update Movie'}
                </SubmitButton>
              </Form>
            </DialogContent>
          </DialogOverlay>
        )}
      </Content>
    </Container>
  );
};

// Styled components remain the same

const Container = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const Content = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
`;

const AddButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #f40612;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MovieImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const MovieInfo = styled.div`
  padding: 1rem;
`;

const MovieTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
`;

const MoviePrice = styled.p`
  margin: 0 0 1rem 0;
  color: #333;
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #da190b;
  }
`;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const DialogTitle = styled.h2`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #333;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const Textarea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const DeleteConfirmation = styled.div`
  text-align: center;
  
  p {
    margin-bottom: 1.5rem;
    color: #666;
  }
`;

const ConfirmButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #da190b;
  }
`;

const CancelButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #666;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #777;
  }
`;

const SubmitButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #f40612;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const RetryButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #f40612;
  }
`;

export default MovieManagement;