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
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 12,
                    padding: 15,
                    font: {
                        size: window.innerWidth < 640 ? 10 : 12
                    }
                }
            },
            title: {
                display: true,
                text: 'Weight and Body Fat Percentage Progress',
                font: {
                    size: window.innerWidth < 640 ? 14 : 16
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    font: {
                        size: window.innerWidth < 640 ? 10 : 12
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: window.innerWidth < 640 ? 10 : 12
                    },
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    }
    return (
        <div className='progress-chart h-[300px] sm:h-[400px] p-4'>
            <Line data={data} options={options} />
        </div>
    )
}

  export default ProgressChart;