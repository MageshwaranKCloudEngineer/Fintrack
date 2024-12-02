import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

const ProfitDashboard = () => {
  const [profitData, setProfitData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isProfit, setIsProfit] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure ArcElement and other chart elements are registered
    ChartJS.register(ArcElement, Tooltip, Legend);

    // Check if user is authenticated
    const isAuthenticated = !!sessionStorage.getItem('user');
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchProfitData();
    }
  }, [navigate]);

  const fetchProfitData = async () => {
    try {
      const response = await axios.get('http://3.12.230.158:5000/profits', { withCredentials: true });
      const data = response.data;
      const isProfit = data.hasOwnProperty('profit for this month');
      setIsProfit(isProfit);

      const profitOrLossValue = isProfit ? Number(data['profit for this month']) : Number(data['loss for this month']);
      setProfitData(isNaN(profitOrLossValue) ? 0 : profitOrLossValue);

      setChartData({
        labels: [isProfit ? 'Profit' : 'Loss'],
        datasets: [
          {
            label: '€',
            data: [Math.abs(profitOrLossValue)],
            backgroundColor: isProfit ? ['#28a745'] : ['#dc3545'],
            hoverBackgroundColor: isProfit ? ['#218838'] : ['#c82333'],
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
      {error && <div style={{ textAlign: 'center', color: 'red', marginBottom: '20px' }}>{error}</div>}
      {chartData ? (
        <div style={{ width: '50%', margin: '0 auto' }}>
          <Doughnut data={chartData} />
        </div>
      ) : (
        <p>Loading chart data...</p>
      )}
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
