import React from "react";

const TrainingHistory = () => {
    const history = [
        {
          id: 1,
          date: '2024-03-20',
          name: 'Trénink nohou',
          exercises: [
            { name: 'Dřepy', sets: 3, reps: 12, weight: 80 },
            { name: 'Výpady', sets: 3, reps: 10, weight: 20 },
          ],
          notes: 'Dobrý trénink, příště přidat váhu'
        },
        {
          id: 2,
          date: '2024-03-18',
          name: 'Trénink zad',
          exercises: [
            { name: 'Přítahy', sets: 4, reps: 8, weight: 60 },
            { name: 'Veslování', sets: 3, reps: 10, weight: 40 },
          ],
          notes: 'Těžší série, ale zvládnuté'
        }
      ]

      return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Training history
            </h3>
          </div>
          <div className="border-t border-gray-200">
            {history.map((training) => (
              <div key={training.id} className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-indigo-600">
                    {training.name}
                  </h4>
                  <p className="text-sm text-gray-500">{training.date}</p>
                </div>
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-500">Cviky:</h5>
                  <ul className="mt-2 space-y-2">
                    {training.exercises.map((exercise, index) => (
                      <li key={index} className="text-sm">
                        {exercise.name} - {exercise.sets} series, {exercise.reps} reps, {exercise.weight} kg
                      </li>
                    ))}
                  </ul>
                </div>
                {training.notes && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-500">Notes:</h5>
                    <p className="mt-1 text-sm text-gray-900">{training.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
}

export default TrainingHistory;