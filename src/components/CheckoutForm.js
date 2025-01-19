import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const CheckoutForm = ({ onSubmit, total, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.address || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    onSubmit(formData);
  };

  return (
    <FormContainer>
      <FormTitle>Checkout</FormTitle>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Name *</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </FormGroup>

        <FormGroup>
          <Label>Email *</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </FormGroup>

        <FormGroup>
          <Label>Address *</Label>
          <Textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Enter your full address"
          />
        </FormGroup>

        <FormGroup>
          <Label>Phone *</Label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter 10-digit phone number"
          />
        </FormGroup>

        <OrderSummary>
          <SummaryTitle>Order Total:</SummaryTitle>
          <TotalAmount>${total.toFixed(2)}</TotalAmount>
        </OrderSummary>

        <ButtonGroup>
          <CancelButton type="button" onClick={onCancel}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit">
            Place Order
          </SubmitButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

// ... styled components remain the same


// Styled components
const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
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
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.8rem;

  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const Textarea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.8rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const OrderSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-top: 1rem;
`;

const SummaryTitle = styled.span`
  font-weight: bold;
  color: #333;
`;

const TotalAmount = styled.span`
  font-size: 1rem;
  font-weight: bold;
  color: #e50914;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
`;

const SubmitButton = styled(Button)`
  background: #e50914;
  color: white;

  &:hover {
    background: #f40612;
  }
`;

const CancelButton = styled(Button)`
  background: #666;
  color: white;

  &:hover {
    background: #777;
  }
`;

export default CheckoutForm;