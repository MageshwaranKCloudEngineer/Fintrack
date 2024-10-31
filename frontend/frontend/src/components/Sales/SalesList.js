import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const SalesList = () => {
  const [salesRecords, setSalesRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('http://localhost:5000/sales', { withCredentials: true });
        setSalesRecords(response.data);
      } catch (err) {
        setError('Failed to fetch sales records. Please try again later.');
        console.error(err); 
      } finally {
        setLoading(false);
      }
    };

    const isAuthenticated = !!sessionStorage.getItem('user');
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchSales();
    }
  }, [navigate]);

  const deleteSalesRecord = async (productName) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      try {
        await axios.delete(`http://localhost:5000/sales/${productName}`, { withCredentials: true });
        setSalesRecords(salesRecords.filter(record => record.product_name !== productName));
      } catch (err) {
        setError('Failed to delete sales record. Please try again later.');
        console.error(err); 
      }
    }
  };

  const handleLogout = async () => {
    await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
    sessionStorage.removeItem('user'); 
    navigate('/login');
  };

  if (loading) {
    return <div style={{ color: 'white' }}>Loading sales records...</div>; 
  }

  return (
    <div style={{ padding: '20px', color: 'white', width: '90%', margin: '0 auto' }}>
      <h2>Sales Records</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} 

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px',
            backgroundColor: '#007BFF', 
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
            flex: '2', 
            marginRight: '10px' 
          }}
        >
          Logout
        </button>

        <Link
          to="/create-sales"
          style={{
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#007BFF', 
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            flex: '2',
            marginRight: '10px' 
          }}
        >
          Create New Sales Record
        </Link>

        <Link
          to="/expenses"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#28a745', 
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            flex: '2'
          }}
        >
          Go to Expenses
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Product Name</th>
            <th style={tableHeaderStyle}>Buying Price</th>
            <th style={tableHeaderStyle}>Selling Price</th>
            <th style={tableHeaderStyle}>Units Sold</th>
            <th style={tableHeaderStyle}>Returns</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salesRecords.map(record => (
            <tr key={record.product_name} style={tableRowStyle}>
              <td style={tableDataStyle}>{record.product_name}</td>
              <td style={tableDataStyle}>€{record.buying_price}</td> 
              <td style={tableDataStyle}>€{record.selling_price}</td> 
              <td style={tableDataStyle}>{record.units_sold}</td>
              <td style={tableDataStyle}>{record.returns}</td>
              <td style={tableDataStyle}>
                <Link
                  to={`/update-sales/${record.product_name}`}
                  style={buttonStyle}
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteSalesRecord(record.product_name)}
                  style={buttonStyle}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableHeaderStyle = {
  backgroundColor: '#6a11cb',
  color: 'white',
  padding: '10px',
  textAlign: 'left',
  borderBottom: '2px solid white',
};

const tableDataStyle = {
  padding: '10px',
  backgroundColor: '#fff',
  color: '#333',
  textAlign: 'left',
};

const tableRowStyle = {
  backgroundColor: '#f9f9f9',
};

const buttonStyle = {
  marginRight: '10px',
  padding: '5px 10px',
  backgroundColor: '#6a11cb', 
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  textDecoration: 'none',
};

export default SalesList;
