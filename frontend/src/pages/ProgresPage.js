import React, { useState, useEffect } from 'react';
import { progressService } from '../services/api';
import { userService } from '../services/api';
import ProgressChart from '../components/ProgressChart';

const ProgressPage = () => {
  const [userData, setUserData] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        if (!response.data || !response.data.id) {
          throw new Error('User ID not found in profile data');
        }
        setUserData(response.data);
      } catch (error) {
        setError('Failed to load user data: ' + (error.message || 'Unknown error'));
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadProgressData = async () => {
      if (!userData || !userData.id) return;
      
      try {
        setLoading(true);
        const [measurementsResponse, statsResponse] = await Promise.all([
          progressService.getUserMeasurements(
            userData.id,
            dateRange.startDate,
            dateRange.endDate
          ),
          progressService.getTrainingStats(
            userData.id,
            dateRange.startDate,
            dateRange.endDate
          )
        ]);
        
        setMeasurements(measurementsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        setError('Failed to load progress data: ' + (error.message || 'Unknown error'));
        console.error('Error loading progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, [userData, dateRange]);

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-24">
        <div className="max-w-2xl mx-auto px-6">
          <div className="mb-8 border-l-4 border-red-500 pl-4 py-2">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen py-24">
        <div className="max-w-2xl mx-auto px-6">
          <div className="mb-8 border-l-4 border-yellow-500 pl-4 py-2">
            <p className="text-yellow-600">No user data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Progress
          </h1>
          <p className="text-gray-600 font-light">
            Track your progress over time and analyze your results
          </p>
        </div>

        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm text-gray-600 mb-2">From</label>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
                className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
              />
            </div>
            <div>
                <label className="block text-sm text-gray-600 mb-2">To</label>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
                className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Average Weight</h3>
                <p className="text-lg text-gray-900">{stats.averageWeight.toFixed(1)} kg</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Average Body Fat</h3>
                <p className="text-lg text-gray-900">{stats.averageBodyFat.toFixed(1)} %</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Number of Measurements</h3>
                <p className="text-lg text-gray-900">{stats.measurementCount}</p>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-sm text-gray-600 mb-4">Progress Chart</h2>
            <ProgressChart measurements={measurements} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;