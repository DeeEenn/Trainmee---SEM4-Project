import React from 'react';

const ProgressChart = () => {
    const progressData = [
        { date: '2024-03-01', weight: 80, reps: 8 },
        { date: '2024-03-08', weight: 82, reps: 10 },
        { date: '2024-03-15', weight: 85, reps: 12 },
      ]
    return (
        <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Progress chart</h3>
        <div className="h-64 flex items-end space-x-2">
          {progressData.map((data, index) => (
            <div key={index} className="flex-1">
              <div
                className="bg-indigo-600 rounded-t"
                style={{ height: `${(data.weight / 100) * 100}%` }}
              ></div>
              <p className="text-xs text-center mt-2">{data.date}</p>
            </div>
          ))}
        </div>
      </div>
    )
}

export default ProgressChart;