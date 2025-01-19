import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container>
      <Content>
        <Title>404</Title>
        <Message>Page Not Found</Message>
        <HomeButton to="/">Go Home</HomeButton>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #141e30, #243b55);
  color: white;
`;

const Content = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 6rem;
  margin: 0;
`;

const Message = styled.p`
  font-size: 1.5rem;
  margin: 20px 0;
`;

const HomeButton = styled(Link)`
  background: #e50914;
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: bold;

  &:hover {
    background: #f40612;
  }
`;

export default NotFound;