import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateExpense = () => {
  const [expenseData, setExpenseData] = useState({ id: '', utilities: '', repairs: '', maintenance: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expenseData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('http://3.12.230.158:5000/expenses', expenseData);
      setSuccess('Expense record created successfully.');
      navigate('/expenses');
    } catch (error) {
      setError('Error creating expense record.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ color: 'white' }}>Creating expense record...</div>; // Loading indicator
  }

  return (
    <div style={{ padding: '20px', color: 'white', width: '90%', margin: '0 auto' }}>
      <h2>Create New Expense Record</h2>
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
              <td style={tableDataStyle}>Date</td>
              <td style={tableDataStyle}>
                <input
                  type="text"
                  name="id" 
                  placeholder="Date"
                  value={expenseData.id}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </td>
            </tr>
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
              <td style={tableDataStyle}>Res</td>
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
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Creating...' : 'Create Expense'}
        </button>
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

export default CreateExpense;
