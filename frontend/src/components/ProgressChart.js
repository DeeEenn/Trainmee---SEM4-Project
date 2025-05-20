import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const ProgressChart = ({ measurements}) => {
    const data = {
        labels: measurements.map(m => new Date(m.date).toLocaleDateString('en-US')),
        datasets: [
            {
                label: 'Weight (kg)',
                data: measurements.map(m => m.weight),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'Body Fat Percentage (%)',
                data: measurements.map(m => m.bodyFatPercentage),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }
        ]
    }
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Weight and Body Fat Percentage Progress'
            }
        },
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
    return (
        <div className='progress-chart'>
            <Line data={data} options={options} />
        </div>
    )
}

  export default ProgressChart;