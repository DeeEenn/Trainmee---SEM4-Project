import React from 'react';

const Statistics = () => {
    const stats = {
        totalTrainings: 10,
        totalHours: 24,
        averageDuration: 45,
        favoriteExercise: 'Squats',
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Total trainings</dt>
              <dd className="text-2xl font-semibold text-gray-900">{stats.totalTrainings}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total hours</dt>
              <dd className="text-2xl font-semibold text-gray-900">{stats.totalHours}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Average duration</dt>
              <dd className="text-2xl font-semibold text-gray-900">{stats.averageDuration} min</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Favorite exercise</dt>
              <dd className="text-2xl font-semibold text-gray-900">{stats.favoriteExercise}</dd>
            </div>
          </dl>
        </div>
      )
}

export default Statistics;