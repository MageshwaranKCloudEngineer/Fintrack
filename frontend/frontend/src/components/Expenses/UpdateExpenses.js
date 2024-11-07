import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateExpense = () => {
  const { id } = useParams();
  const [expenseData, setExpenseData] = useState({ utilities: '', repairs: '', maintenance: '' });
  const navigate = useNavigate();

  const fetchExpense = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/expenses/${id}`, { withCredentials: true });
      setExpenseData(response.data);
    } catch (err) {
      console.error('Failed to fetch expense data:', err);
    }
  }, [id]);  // Only recreate fetchExpense when `id` changes

  useEffect(() => {
    const isAuthenticated = !!sessionStorage.getItem('user'); // Check if the user is authenticated
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      fetchExpense(); // Fetch expense data only if authenticated
    }
  }, [id, navigate, fetchExpense]);  // `fetchExpense` is stable due to useCallback


  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expenseData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/expenses/${id}`, expenseData, { withCredentials: true });
      alert("Expense record updated successfully.");
      navigate('/expenses');
    } catch (error) {
      alert("Error updating expense record.");
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', width: '90%', margin: '0 auto' }}>
      <h2>Update Expense Record</h2>
      <form onSubmit={handleSubmit}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Field</th>
              <th style={tableHeaderStyle}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tableDataStyle}>Utilities</td>
              <td style={tableDataStyle}>
                <input
                  type="number"
                  name="utilities"
                  placeholder="Utilities"
                  value={expenseData.utilities}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td style={tableDataStyle}>Repairs</td>
              <td style={tableDataStyle}>
                <input
                  type="number"
                  name="repairs"
                  placeholder="Repairs"
                  value={expenseData.repairs}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td style={tableDataStyle}>Maintenance</td>
              <td style={tableDataStyle}>
                <input
                  type="number"
                  name="maintenance"
                  placeholder="Maintenance"
                  value={expenseData.maintenance}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" style={buttonStyle}>Update Expense</button>
      </form>
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

export default UpdateExpense;
