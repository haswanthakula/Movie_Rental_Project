import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DatePicker, Space, Card, Table, Spin, Alert, Typography, Empty } from 'antd';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import Navbar from '../../components/AdminNavbar';
import { useMovies } from '../../contexts/MovieContext';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const SalesReport = () => {
  const { movies } = useMovies();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(7, 'day'),
    dayjs()
  ]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const allOrders = users.flatMap(user => user.orders || []);
      
      if (allOrders.length === 0) {
        setError('No orders found. Start selling movies to generate a sales report.');
      } else {
        setOrders(allOrders);
        setError(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please check your local storage.');
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  // Filter orders by date range
  const filteredOrders = orders.filter(order => {
    const orderDate = dayjs(order.orderDate);
    return orderDate.isAfter(dateRange[0]) && 
           orderDate.isBefore(dateRange[1].add(1, 'day'));
  });

  // Calculate statistics
  const statistics = {
    totalOrders: filteredOrders.length,
    totalRevenue: filteredOrders.reduce((sum, order) => sum + order.total, 0),
    averageOrderValue: filteredOrders.length > 0 
      ? filteredOrders.reduce((sum, order) => sum + order.total, 0) / filteredOrders.length 
      : 0,
    totalMovies: filteredOrders.reduce((sum, order) => sum + order.items.length, 0)
  };

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer',
      dataIndex: 'customerInfo',
      key: 'customer',
      render: (customerInfo) => customerInfo?.name || 'Unknown'
    },
    {
      title: 'Date',
      dataIndex: 'orderDate',
      key: 'date',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `$${total.toFixed(2)}`
    }
  ];

  if (loading) {
    return (
      <Container>
        <Navbar />
        <LoadingContainer>
          <Spin size="large" />
          <p>Loading sales report...</p>
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
            message="Sales Report" 
            description={error} 
            type="warning" 
            showIcon 
          />
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Navbar />
      <Content>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <RangePicker 
            value={dateRange}
            onChange={handleDateRangeChange}
            style={{ marginBottom: '20px' }}
          />

          <StatisticsRow>
            <Card title="Total Orders" style={{ width: 200 }}>
              {statistics.totalOrders}
            </Card>
            <Card title="Total Revenue" style={{ width: 200 }}>
              ${statistics.totalRevenue.toFixed(2)}
            </Card>
            <Card title="Avg Order Value" style={{ width: 200 }}>
              ${statistics.averageOrderValue.toFixed(2)}
            </Card>
            <Card title="Total Movies Sold" style={{ width: 200 }}>
              {statistics.totalMovies}
            </Card>
          </StatisticsRow>

          <Title level={3}>Order History</Title>
          {filteredOrders.length > 0 ? (
            <Table 
              columns={orderColumns} 
              dataSource={filteredOrders}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          ) : (
            <Empty 
              description="No orders found in the selected date range" 
              style={{ margin: '20px 0' }} 
            />
          )}
        </Space>
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

const StatisticsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
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

export default SalesReport;