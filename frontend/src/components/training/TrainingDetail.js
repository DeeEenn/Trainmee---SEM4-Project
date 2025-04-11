import React from 'react';
import { useParams, Link } from 'react-router-dom';

const TrainingDetail = () => {
  const { id } = useParams();
  
  // Toto bude později naplněno daty z API
  const training = {
    id: 1,
    date: '2024-03-20',
    name: 'Trénink nohou',
    duration: '60 min',
    exercises: [
      {
        name: 'Dřepy',
        sets: [
          { setNumber: 1, reps: 12, weight: 80, notes: 'Lehké' },
          { setNumber: 2, reps: 10, weight: 85, notes: 'Střední' },
          { setNumber: 3, reps: 8, weight: 90, notes: 'Těžké' }
        ]
      },
      {
        name: 'Výpady',
        sets: [
          { setNumber: 1, reps: 10, weight: 20, notes: '' },
          { setNumber: 2, reps: 10, weight: 20, notes: '' },
          { setNumber: 3, reps: 10, weight: 20, notes: '' }
        ]
      }
    ],
    notes: 'Dobrý trénink, příště přidat váhu'
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Tady přidáme tlačítko pro editaci */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{training.name}</h2>
          <p className="text-gray-500">{training.date}</p>
        </div>
        <div className="flex space-x-4">
          <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
            {training.duration}
          </span>
          <Link
            to={`/training/${id}/edit`}
            className="px-3 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {training.exercises.map((exercise, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">{exercise.name}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Series
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reps
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight (kg)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {exercise.sets.map((set, setIndex) => (
                    <tr key={setIndex}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {set.setNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {set.reps}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {set.weight}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {set.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {training.notes && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Training notes</h3>
          <p className="text-gray-600">{training.notes}</p>
        </div>
      )}
    </div>
  );
};

export default TrainingDetail;