import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import SalesList from './components/Sales/SalesList';
import CreateSales from './components/Sales/CreateSales';
import UpdateSales from './components/Sales/UpdateSales';
import ExpensesList from './components/Expenses/ExpensesList';  
import CreateExpense from './components/Expenses/CreateExpenses';  
import UpdateExpense from './components/Expenses/UpdateExpenses';  
import ProfitDashboard from './components/Calculator/ProfitDashboard'; 

const App = () => {
  return (
    <Router>
      <div 
        style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', 
          color: 'white', 
          paddingBottom: '50px' 
        }}
      >
        <h1 style={{ textAlign: 'center' }}>Fintech - Sales and Expenses Management System</h1>

        <Routes> 
          {/* Auth Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Sales Routes */}
          <Route path="/sales" element={<SalesList />} />
          <Route path="/create-sales" element={<CreateSales />} />
          <Route path="/update-sales/:product_name" element={<UpdateSales />} />

          {/* Expenses Routes */}
          <Route path="/expenses" element={<ExpensesList />} />  
          <Route path="/create-expense" element={<CreateExpense />} />  
          <Route path="/update-expense/:id" element={<UpdateExpense />} />  

          {/* Profit Route */}
          <Route path="/profits" element={<ProfitDashboard />} />  
          
          {/* Default route */}
          <Route path="/" element={<Register />} />
        </Routes>
        
        {/* Copyright Footer */}
        <footer style={{ 
          marginTop: 'auto', 
          padding: '20px', 
          textAlign: 'center', 
          backgroundColor: '#f1f1f1', 
          color: 'black' 
        }}>
          <p>&copy; {new Date().getFullYear()} MK Fintech and Solution. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
