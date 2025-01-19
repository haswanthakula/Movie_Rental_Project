import React from 'react';
import styled from 'styled-components';
import { useOrders } from '../contexts/OrderContext';
import Navbar from './Navbar';

const OrderHistory = () => {
  const { orders } = useOrders();

  return (
    <Container>
      <Navbar />
      <Content>
        <Title>Order History</Title>
        {orders.length === 0 ? (
          <NoOrders>
            <h3>No Orders Found</h3>
            <p>You haven't placed any orders yet.</p>
          </NoOrders>
        ) : (
          <OrdersList>
            {orders.map((order) => (
              <OrderCard key={order.id}>
                <OrderHeader>
                  <OrderId>Order #{order.id}</OrderId>
                  <OrderDate>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </OrderDate>
                </OrderHeader>
                <ItemsList>
                  {order.items.map((item) => (
                    <OrderItem key={item.id}>
                      <ItemImage 
                        src={item.image || `https://via.placeholder.com/150x200?text=${encodeURIComponent(item.title)}`} 
                        alt={item.title} 
                      />
                      <ItemDetails>
                        <ItemTitle>{item.title}</ItemTitle>
                        <ItemQuantity>Quantity: {item.quantity}</ItemQuantity>
                        <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                      </ItemDetails>
                    </OrderItem>
                  ))}
                </ItemsList>
                <OrderTotal>
                  Total: ${order.total.toFixed(2)}
                </OrderTotal>
              </OrderCard>
            ))}
          </OrdersList>
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
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;

const NoOrders = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
  }
`;

const OrdersList = styled.div`
  display: flex;
  flex-wrap: wrap;
    gap: 2rem;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const OrderId = styled.span`
  font-weight: bold;
  color: #333;
`;

const OrderDate = styled.span`
  color: #666;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderItem = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const ItemQuantity = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ItemPrice = styled.div`
  color: #e50914;
  font-weight: bold;
  margin-top: 0.5rem;
`;

const OrderTotal = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  text-align: right;
  font-weight: bold;
  color: #e50914;
  font-size: 1.2rem;
`;

export default OrderHistory;