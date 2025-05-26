import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainingStats = ({ userId }) => {
    const [stats, setStats] = useState({});
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            if (!userId) return;
            
            setLoading(true);
            setError('');
            
            try {
                const response = await axios.get(`/api/progress/user/${userId}/training-stats`, {
                    params: { month: selectedMonth, year: selectedYear }
                });
                setStats(response.data);
            } catch (error) {
                setError('Error loading statistics: ' + (error.response?.data?.message || error.message));
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [userId, selectedMonth, selectedYear]);

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Training statistics</h2>
            
            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm sm:text-base">
                    {error}
                </div>
            )}

            <div className="mb-4 flex flex-col sm:flex-row gap-2">
                <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                >
                    {Array.from({length: 12}, (_, i) => (
                        <option key={i+1} value={i+1}>
                            {new Date(2000, i).toLocaleString('cs', { month: 'long' })}
                        </option>
                    ))}
                </select>
                
                <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                >
                    {Array.from({length: 5}, (_, i) => (
                        <option key={i} value={new Date().getFullYear() - i}>
                            {new Date().getFullYear() - i}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="text-center py-4 text-sm sm:text-base">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(stats).map(([date, count]) => (
                        <div key={date} className="p-3 border rounded bg-gray-50">
                            <div className="font-bold text-gray-800 text-sm sm:text-base">
                                {new Date(date).toLocaleDateString('cs')}
                            </div>
                            <div className="text-gray-600 text-sm sm:text-base">
                                Number of trainings: {count}
                            </div>
                        </div>
                    ))}
                    {Object.keys(stats).length === 0 && (
                        <div className="col-span-1 sm:col-span-2 text-center text-gray-500 py-4 text-sm sm:text-base">
                            No trainings in this period
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TrainingStats; 