import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProfitDashboard = () => {
  const [profitData, setProfitData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isProfit, setIsProfit] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = !!sessionStorage.getItem('user'); // Adjust the key to match your authentication data
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      fetchProfitData();
    }
  }, [navigate]);

  const fetchProfitData = async () => {
    try {
      // Fetch profit data from the backend
      const response = await axios.get('http://localhost:5000/profits', {
        withCredentials: true, // Include credentials if needed
      });
      const data = response.data;

      // Check if the response indicates profit or loss
      const isProfit = data.hasOwnProperty('profit for this month');
      setIsProfit(isProfit);

      // Extract profit or loss value and ensure it's a number
      const profitOrLossValue = isProfit
        ? Number(data['profit for this month'])
        : Number(data['loss for this month']);

      // Validate if the value is indeed a number, if not fallback to 0
      if (isNaN(profitOrLossValue)) {
        console.warn('Profit/Loss value is not a number, defaulting to 0.');
        setProfitData(0);
      } else {
        setProfitData(profitOrLossValue);
      }

      // Set data for the Doughnut chart
      setChartData({
        labels: [isProfit ? 'Profit' : 'Loss'], // Only use a single label for the chart
        datasets: [
          {
            label: '€',
            data: [Math.abs(profitOrLossValue)], // Absolute value for display purposes
            // Use red for loss and green for profit
            backgroundColor: isProfit ? ['#28a745'] : ['#dc3545'], // Green for profit, red for loss
            hoverBackgroundColor: isProfit ? ['#218838'] : ['#c82333'], // Darker shades for hover
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching profit data:', error);
      setError('Failed to load profit data. Please try again later.');
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', width: '90%', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Profit Dashboard</h2>

      {/* Render error message if there's an error */}
      {error && (
        <div style={{ textAlign: 'center', color: 'red', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Render Doughnut Chart */}
      {chartData ? (
        <div style={{ width: '50%', margin: '0 auto' }}>
          <Doughnut data={chartData} />
        </div>
      ) : (
        <p>Loading chart data...</p>
      )}

      {/* Display Profit or Loss Message */}
      {profitData !== null ? (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          {isProfit ? (
            <p style={{ color: 'white', fontSize: '1.5em' }}>
              🎉 Profit for this month: €{!isNaN(profitData) ? profitData.toFixed(2) : '0.00'}
            </p>
          ) : (
            <p style={{ color: 'white', fontSize: '1.5em' }}>
              😔 Loss for this month: €{!isNaN(profitData) ? Math.abs(profitData).toFixed(2) : '0.00'}
            </p>
          )}
        </div>
      ) : (
        <p>Loading profit data...</p>
      )}
    </div>
  );
};

export default ProfitDashboard;
