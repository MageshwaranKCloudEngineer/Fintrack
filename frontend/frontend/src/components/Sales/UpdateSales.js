import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateSales = () => {
  const { product_name } = useParams();
  const [salesData, setSalesData] = useState({
    buying_price: '',
    selling_price: '',
    units_sold: '',
    returns: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = !!sessionStorage.getItem('user');
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      const fetchSalesData = async () => {
        try {
          const response = await axios.get(`http://3.12.230.158:5000/sales/${product_name}`, { withCredentials: true });
          setSalesData(response.data);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to fetch sales data');
        }
      };
      
      fetchSalesData();
    }
  }, [product_name, navigate]);

  const handleUpdateSales = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://3.12.230.158:5000/sales/${product_name}`, salesData, { withCredentials: true });
      alert("Expense record updated successfully.");
      navigate('/sales'); 
    } catch (error) {
      alert("Error updating expense record.");
    }
  };

  const handleLogout = async () => {
    await axios.post('http://3.12.230.158:5000/logout', {}, { withCredentials: true });
    sessionStorage.removeItem('user'); 
    navigate('/login');
  };

 

  return (
    <div style={{ padding: '20px', color: 'white', width: '90%', margin: '0 auto' }}>
      <h2>Update Sales Record for {product_name}</h2>
      <form onSubmit={handleUpdateSales}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Field</th>
              <th style={tableHeaderStyle}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tableDataStyle}>Buying Price</td>
              <td style={tableDataStyle}>
                <input
                  type="number"
                  placeholder="Buying Price"
                  value={salesData.buying_price}
                  onChange={(e) => setSalesData({ ...salesData, buying_price: e.target.value })}
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
                  value={salesData.selling_price}
                  onChange={(e) => setSalesData({ ...salesData, selling_price: e.target.value })}
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
                  value={salesData.units_sold}
                  onChange={(e) => setSalesData({ ...salesData, units_sold: e.target.value })}
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
                  value={salesData.returns}
                  onChange={(e) => setSalesData({ ...salesData, returns: e.target.value })}
                  required
                  style={inputStyle}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" style={buttonStyle}>Update Sales Record</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

// Table styles
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

export default UpdateSales;
