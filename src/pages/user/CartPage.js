import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/Navbar';
import { useCart } from '../../contexts/CartContext';
import CheckoutForm from '../../components/CheckoutForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useOrders } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { addOrder } = useOrders();
  const { user } = useAuth();

  const handleClearCart = () => {
      clearCart();
      toast.success('Cart cleared successfully');
  };

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const handleProceedToCheckout = () => {
    if (!cart || cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    setIsCheckingOut(true);
  };

  const handleCheckout = async (formData) => {
    try {
      // Validate cart and user
      if (!user) {
        toast.error('Please log in to place an order');
        return;
      }

      if (cart.length === 0) {
        toast.error('Your cart is empty');
        return;
      }

      // Prepare order data
      const orderData = {
        id: 'ord_' + Date.now(),
        userId: user.id,
        userName: user.name,
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: parseFloat(item.price),
          quantity: item.quantity,
          image: item.image
        })),
        total: calculateTotal(),
        customerInfo: formData,
        orderDate: new Date().toISOString(),
      };

      // Validate order total
      if (orderData.total <= 0) {
        toast.error('Invalid order total. Please check your cart.');
        return;
      }

      // Optional: Post order to JSON server if needed
      try {
        await axios.post('https://movies-json-hiql.onrender.com/orders', orderData);
      } catch (apiError) {
        console.warn('Failed to post order to JSON server:', apiError);
        // Continue with local storage processing even if API fails
      }

      // Update user's orders in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);

      if (userIndex !== -1) {
        if (!users[userIndex].orders) {
          users[userIndex].orders = [];
        }
        users[userIndex].orders.push(orderData);
        localStorage.setItem('users', JSON.stringify(users));
      } else {
        // Fallback: create new user entry if not found
        users.push({
          ...user,
          orders: [orderData]
        });
        localStorage.setItem('users', JSON.stringify(users));
      }

      // Add order to context
      await addOrder(orderData);

      // Clear the cart after successful order
      clearCart();

      // Show a success notification
      toast.success('Order placed successfully!');

      // Navigate to the user's orders page
      navigate('/user/orders');

    } catch (err) {
      console.error('Checkout error:', err);
      
      // More specific error handling
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(`Checkout failed: ${err.response.data.message || 'Server error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        toast.error('No response from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error('Failed to process checkout. Please try again later.');
      }
    }
  };

  const handleQuantityUpdate = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      toast.info('Item removed from cart');
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    toast.info('Item removed from cart');
  };

  return (
    <Container>
      <Navbar />
      <Content>
        {!isCheckingOut && (
          <>
            <CartHeader>
              <Title>Shopping Cart ({cart.length} items)</Title>
              {cart && cart.length > 0 && (
                <ClearCartButton onClick={handleClearCart}>
                  Clear Cart
                </ClearCartButton>
              )}
            </CartHeader>

            {!cart || cart.length === 0 ? (
              <EmptyCart>
                <h3>Your cart is empty</h3>
                <p>Add some movies to get started!</p>
                <ShopButton onClick={() => navigate('/user/movies')}>
                  Browse Movies
                </ShopButton>
              </EmptyCart>
            ) : (
              <>
                <CartItems>
                  {cart.map((item) => (
                    <CartItem key={item.id}>
                      <ItemImage 
                        src={item.image || `https://via.placeholder.com/150x200?text=${encodeURIComponent(item.title)}`} 
                        alt={item.title}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/150x200?text=${encodeURIComponent(item.title)}`;
                        }}
                      />
                      <ItemDetails>
                        <ItemTitle>{item.title}</ItemTitle>
                        <ItemPrice>${parseFloat(item.price).toFixed(2)}</ItemPrice>
                        <QuantityControl>
                          <QuantityButton
                            onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </QuantityButton>
                          <QuantityDisplay>{item.quantity}</QuantityDisplay>
                          <QuantityButton
                            onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                          >
                            +
                          </QuantityButton>
                        </QuantityControl>
                        <ItemSubtotal>
                          Subtotal: ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </ItemSubtotal>
                        <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                          Remove
                        </RemoveButton>
                      </ItemDetails>
                    </CartItem>
                  ))}
                </CartItems>
                <CartSummary>
                  <SummaryDetails>
                    <SummaryItem>
                      <span>Subtotal:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </SummaryItem>
                    <SummaryItem>
                      <span>Tax (10%):</span>
                      <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
                    </SummaryItem>
                    <Total>
                      <span>Total:</span>
                      <span>${(calculateTotal() * 1.1).toFixed(2)}</span>
                    </Total>
                  </SummaryDetails>
                  <CheckoutButton onClick={handleProceedToCheckout}>
                    Proceed to Checkout
                  </CheckoutButton>
                </CartSummary>
              </>
            )}
          </>
        )}

        {isCheckingOut && (
          <CheckoutForm
            onSubmit={handleCheckout}
            total={calculateTotal()}
            onCancel={() => setIsCheckingOut(false)}
          />
        )}
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;


const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ClearCartButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c82333;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  p {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
`;

const ShopButton = styled.button`
  background: #e50914;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f40612;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const CartItem = styled.div`
  display: flex;
  gap: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ItemImage = styled.img`
  width: 120px;
  height: 180px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ItemTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
`;

const ItemPrice = styled.div`
  color: #e50914;
  font-weight: bold;
  font-size: 1.1rem;
`;

const ItemSubtotal = styled.div`
  color: #666;
  font-size: 1rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuantityButton = styled.button`
  background: #e50914;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f40612;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  font-size: 1.1rem;
  color: #333;
  min-width: 40px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #e50914;
  cursor: pointer;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  text-align: left;

  &:hover {
    text-decoration: underline;
  }
`;

const CartSummary = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SummaryDetails = styled.div`
  margin-bottom: 1.5rem;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #666;
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const CheckoutButton = styled.button`
  background: #e50914;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background: #f40612;
  }
`;

export default CartPage;
