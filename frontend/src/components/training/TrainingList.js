// src/components/training/TrainingList.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TrainingList = () => {
  // Toto bude později naplněno daty z API
  const trainings = [
    { id: 1, name: 'Trénink nohou', date: '2024-03-20', duration: '60 min' },
    { id: 2, name: 'Trénink zad', date: '2024-03-18', duration: '45 min' },
  ];

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {trainings.map((training) => (
          <li key={training.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/training/${training.id}`}
                    className="text-lg font-medium text-indigo-600 hover:text-indigo-900"
                  >
                    {training.name}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">
                    {training.date}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {training.duration}
                  </span>
                  <Link
                    to={`/training/${training.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainingList;