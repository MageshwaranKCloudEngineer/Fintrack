import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = !!sessionStorage.getItem('user');
    if (!isAuthenticated) {
      navigate('/login'); 
    } else {
      fetchExpenses(); 
    }
  }, [navigate]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://3.12.230.158:5000/expenses', { withCredentials: true });
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const deleteExpense = async (id) => {
    if (window.confirm(`Are you sure you want to delete this expense record?`)) {
      try {
        await axios.delete(`http://3.12.230.158:5000/expenses/${id}`, { withCredentials: true });
        setExpenses(expenses.filter(expense => expense.id !== id));
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', width: '90%', margin: '0 auto' }}>
      <h2>Expense Records</h2>
      
      {/* Button container for aligning buttons in a row */}
      <div style={buttonContainerStyle}>
        <Link
          to="/create-expense"
          style={buttonStyle}
        >
          Create New Expense Record
        </Link>

        <button
          onClick={() => navigate('/profits')} 
          style={buttonStyle} 
        >
          Net Income
        </button>

        <button
          onClick={() => navigate('/sales')} 
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
          Go To Sales
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Utilities</th>
            <th style={tableHeaderStyle}>Repairs</th>
            <th style={tableHeaderStyle}>Maintenance</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id} style={tableRowStyle}>
              <td style={tableDataStyle}>{expense.id}</td>
              <td style={tableDataStyle}>€{expense.utilities}</td>
              <td style={tableDataStyle}>€{expense.repairs}</td>
              <td style={tableDataStyle}>€{expense.maintenance}</td>
              <td style={tableDataStyle}>
                <Link to={`/update-expense/${expense.id}`} style={actionButtonStyle}>Edit</Link>
                <button onClick={() => deleteExpense(expense.id)} style={actionButtonStyle}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

const tableRowStyle = {
  backgroundColor: '#f9f9f9',
};

// Button container style to align buttons in a row
const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '20px',
  gap: '10px',
};

const buttonStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px',
  backgroundColor: '#007BFF', 
  color: 'white',
  textDecoration: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  border: 'none',
  flex: '2',
  marginRight: '10px'
};

const actionButtonStyle = {
  marginRight: '10px',
  padding: '5px 10px',
  backgroundColor: '#6a11cb', 
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  textDecoration: 'none',
};

export default ExpensesList;
