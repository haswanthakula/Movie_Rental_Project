import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaWhatsapp, FaTwitter, FaInstagram } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import emailjs from '@emailjs/browser';
 // Update this import


const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });



  const handleLoginClick = (adminMode) => {
    setIsAdmin(adminMode);
    setShowLogin(true);
    setShowRegister(false);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isAdmin) {
        if (email === 'admin@gmail.com' && password === 'admin123') {
          await login(email, password);
          localStorage.setItem('userRole', 'admin');
          toast.success('Welcome Admin!');
          navigate('/admin/dashboard');
        } else {
          toast.error('Invalid admin credentials');
        }
      } else {
        await login(email, password);
        toast.success('Login successful!');
        navigate('/user/home');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const { login, register } = useAuth(); // Use the hook correctly
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }

      await register(email, password, name);
      toast.success('Registration successful! Please login.');
      setShowRegister(false);
      setShowLogin(true);
      setIsAdmin(false);
      // Clear form
      setEmail('');
      setPassword('');
      setName('');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const form = useRef(); // Add this ref

  const handleContactSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_w0brudi',
        'template_u3iatzi',
        e.target,
        'RwjP2wZEUkFove_K9'
      )
      .then(
        () => {
          toast.success('Message sent successfully!');
          setShowContact(false);
          setContactForm({ name: '', email: '', message: '' });
        },
        (error) => {
          console.error('Failed to send message:', error.text);
          toast.error('Failed to send message. Please try again.');
        }
      );
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container>
      <Header>
        <Logo>Movie Rental</Logo>
        <ButtonGroup>
          <StyledButton onClick={() => handleLoginClick(false)}>Login</StyledButton>
          <StyledButton onClick={() => setShowRegister(true)}>Register</StyledButton>
          <StyledButton onClick={() => handleLoginClick(true)}>Admin</StyledButton>
          <StyledButton onClick={() => setShowContact(true)}>Contact</StyledButton>
        </ButtonGroup>
      </Header>

      <MainContent>
        <Title>Welcome to Movie Rental</Title>
        <Subtitle>Stream your favorite movies anytime, anywhere.</Subtitle>
      </MainContent>

      <Footer>
  <SocialLinks>
    <SocialIcon 
      href="https://www.facebook.com" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <FaFacebook />
    </SocialIcon>
    <SocialIcon 
      href="https://wa.me/917207009566" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <FaWhatsapp />
    </SocialIcon>
    <SocialIcon 
      href="https://twitter.com" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <FaTwitter />
    </SocialIcon>
    <SocialIcon 
      href="https://www.instagram.com" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <FaInstagram />
    </SocialIcon>
  </SocialLinks>
  <CopyrightText>&copy; 2024 Movie Rental. All rights reserved.</CopyrightText>
</Footer>

      {/* Contact Dialog */}
      {showContact && (
      <Overlay>
        <Dialog>
          <CloseButton onClick={() => setShowContact(false)}>&times;</CloseButton>
          <DialogTitle>Contact Us</DialogTitle>
          <LoginForm ref={form} onSubmit={handleContactSubmit}>
            <InputGroup>
              <Label>Name</Label>
              <Input
                type="text"
                name="user_name" // Update name to match EmailJS template
                onChange={handleContactChange}
                placeholder="Enter your name"
                required
              />
            </InputGroup>
            <InputGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="user_email" // Update name to match EmailJS template
                onChange={handleContactChange}
                placeholder="Enter your email"
                required
              />
            </InputGroup>
            <InputGroup>
              <Label>Message</Label>
              <TextArea
                name="message"
                onChange={handleContactChange}
                required
                placeholder="Enter your message"
                rows="4"
              />
            </InputGroup>
            <SubmitButton type="submit">Send Message</SubmitButton>
          </LoginForm>
        </Dialog>
      </Overlay>
    )}

            {/* Login Dialog */}
            {showLogin && (
        <Overlay>
          <Dialog>
            <CloseButton onClick={() => setShowLogin(false)}>&times;</CloseButton>
            <DialogTitle>{isAdmin ? 'Admin Login' : 'User Login'}</DialogTitle>
            <LoginForm onSubmit={handleSubmit}>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <InputGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </InputGroup>
              <SubmitButton type="submit">Login</SubmitButton>
            </LoginForm>
          </Dialog>
        </Overlay>
      )}

      {/* Register Dialog */}
      {showRegister && (
        <Overlay>
          <Dialog>
            <CloseButton onClick={() => setShowRegister(false)}>&times;</CloseButton>
            <DialogTitle>Register</DialogTitle>
            <LoginForm onSubmit={handleRegister}>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <InputGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </InputGroup>
              <SubmitButton type="submit">Register</SubmitButton>
            </LoginForm>
          </Dialog>
        </Overlay>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url('https://assets.nflxext.com/ffe/siteui/vlv3/fc164b4b-f085-44ee-bb7f-ec7df8539eff/d23a1608-7d90-4da1-93d6-bae2fe60a69b/IN-en-20230814-popsignuptwoweeks-perspective_alpha_website_large.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  color: white;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1;
  }
`;

const Header = styled.header`
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
`;

const Logo = styled.h1`
  color: #e50914;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 2;
`;

const StyledButton = styled.button`
  background: #e50914;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f40612;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  position: relative;
  z-index: 2;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const Footer = styled.footer`
  padding: 2rem;
  text-align: center;
  position: relative;
  z-index: 2;
`;

const SocialIcon = styled.a`
  color: white;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);

  &:hover {
    color: #e50914;
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
`;

const CopyrightText = styled.p`
  color: #aaa;
  font-size: 0.9rem;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  background: #141414;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  position: relative;
  z-index: 1001;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #aaa;
  cursor: pointer;

  &:hover {
    color: white;
  }
`;

const DialogTitle = styled.h2`
  text-align: center;
  color: white;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: white;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  font-size: 1rem;
  color: white;

  &:focus {
    outline: none;
    border-color: #e50914;
    background: #454545;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  font-size: 1rem;
  color: white;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #e50914;
    background: #454545;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const SubmitButton = styled.button`
  background: #e50914;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background: #f40612;
  }
`;

const ErrorMessage = styled.div`
  color: #e50914;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  background: rgba(229, 9, 20, 0.1);
  padding: 0.5rem;
  border-radius: 4px;
`;

export default LandingPage;