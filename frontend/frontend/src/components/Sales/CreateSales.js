import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const CreateSales = () => {
  const [productName, setProductName] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [unitsSold, setUnitsSold] = useState('');
  const [returns, setReturns] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = !!sessionStorage.getItem('user');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleCreateSales = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/sales', {
        product_name: productName,
        buying_price: buyingPrice,
        selling_price: sellingPrice,
        units_sold: unitsSold,
        returns: returns
      }, { withCredentials: true });
      
      setSuccess("Sales record created successfully");
      setError('');
      navigate('/sales');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create sales record');
      setSuccess('');
    } finally {
      setLoading(false); 
    }
  };

  if (loading) {
    return <div style={{ color: 'white' }}>Creating sales record...</div>; 
  }

  return (
    <div style={{ padding: '20px', color: 'white', width: '90%', margin: '0 auto' }}>
      <h2>Create Sales Record</h2>
      <form onSubmit={handleCreateSales}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Field</th>
              <th style={tableHeaderStyle}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tableDataStyle}>Product Name</td>
              <td style={tableDataStyle}>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td style={tableDataStyle}>Buying Price</td>
              <td style={tableDataStyle}>
                <input
                  type="number"
                  placeholder="Buying Price"
                  value={buyingPrice}
                  onChange={(e) => setBuyingPrice(e.target.value)}
                  required
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td style={tableDataStyle}>Selling Price</td>
              <td style={tableDataStyle}>
                <input
                  type="number"
                  placeholder="Selling Price"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  required
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td style={tableDataStyle}>Units Sold</td>
              <td style={tableDataStyle}>
                <input
                  type="number"
                  placeholder="Units Sold"
                  value={unitsSold}
                  onChange={(e) => setUnitsSold(e.target.value)}
                  required
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td style={tableDataStyle}>Returns</td>
              <td style={tableDataStyle}>
                <input
                  type="number"
                  placeholder="Returns"
                  value={returns}
                  onChange={(e) => setReturns(e.target.value)}
                  required
                  style={inputStyle}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Creating...' : 'Create Sales Record'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
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

const inputStyle = {
  width: '100%',
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const buttonStyle = {
  marginTop: '20px',
  padding: '10px 15px',
  backgroundColor: '#007BFF', 
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default CreateSales;
