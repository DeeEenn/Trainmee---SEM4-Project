import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

// ProgressChart.js
const ProgressChart = ({ userId }) => {
    const [progressData, setProgressData] = useState([]);
    const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year', 'all'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/progress/user/${userId}`);
                setProgressData(response.data);
            } catch (error) {
                console.error('Chyba při načítání dat:', error);
            }
        };
        if (userId) {
            fetchData();
        }
    }, [userId]);

    const filterDataByTimeRange = (data, timeRange) => {
        const now = new Date();
        return data.filter(item => {
            const itemDate = new Date(item.date);
            switch(timeRange) {
                case 'week':
                    return itemDate >= new Date(now.setDate(now.getDate() - 7));
                case 'month':
                    return itemDate >= new Date(now.setMonth(now.getMonth() - 1));
                case 'year':
                    return itemDate >= new Date(now.setFullYear(now.getFullYear() - 1));
                default:
                    return true;
            }
        });
    };

    const filteredData = filterDataByTimeRange(progressData, timeRange);

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="mb-4">
                <select 
                    value={timeRange} 
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="p-2 border rounded bg-white"
                >
                    <option value="week">Týden</option>
                    <option value="month">Měsíc</option>
                    <option value="year">Rok</option>
                    <option value="all">Vše</option>
                </select>
            </div>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <LineChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="date" 
                            tickFormatter={(date) => new Date(date).toLocaleDateString('cs')}
                        />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip 
                            labelFormatter={(date) => new Date(date).toLocaleDateString('cs')}
                        />
                        <Legend />
                        <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="weight" 
                            stroke="#8884d8" 
                            name="Váha (kg)" 
                        />
                        <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="bodyFatPercentage" 
                            stroke="#82ca9d" 
                            name="Procento tuku (%)" 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProgressChart;