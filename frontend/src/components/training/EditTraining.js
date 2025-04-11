// src/components/training/EditTraining.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditTraining = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Toto bude později naplněno daty z API
  const [training, setTraining] = useState({
    name: 'Trénink nohou',
    date: '2024-03-20',
    duration: '60',
    exercises: [
      {
        name: 'Dřepy',
        sets: [
          { reps: 12, weight: 80 },
          { reps: 10, weight: 85 },
          { reps: 8, weight: 90 }
        ]
      }
    ],
    notes: 'Dobrý trénink, příště přidat váhu'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Zde bude později volání API
    console.log(training);
    navigate(`/training/${id}`);
  };

  const addExercise = () => {
    setTraining({
      ...training,
      exercises: [...training.exercises, { name: '', sets: [{ reps: 0, weight: 0 }] }]
    });
  };

  const addSet = (exerciseIndex) => {
    const newExercises = [...training.exercises];
    newExercises[exerciseIndex].sets.push({ reps: 0, weight: 0 });
    setTraining({ ...training, exercises: newExercises });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Edit training</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Exercise name</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={training.name}
            onChange={(e) => setTraining({ ...training, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={training.date}
            onChange={(e) => setTraining({ ...training, date: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Exercise length (minutes)</label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={training.duration}
            onChange={(e) => setTraining({ ...training, duration: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Exercises</h3>
          {training.exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="border rounded-lg p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Exercise name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={exercise.name}
                  onChange={(e) => {
                    const newExercises = [...training.exercises];
                    newExercises[exerciseIndex].name = e.target.value;
                    setTraining({ ...training, exercises: newExercises });
                  }}
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Série</h4>
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex space-x-4">
                    <div>
                      <label className="block text-xs text-gray-500">Reps</label>
                      <input
                        type="number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={set.reps}
                        onChange={(e) => {
                          const newExercises = [...training.exercises];
                          newExercises[exerciseIndex].sets[setIndex].reps = e.target.value;
                          setTraining({ ...training, exercises: newExercises });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Weight (kg)</label>
                      <input
                        type="number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={set.weight}
                        onChange={(e) => {
                          const newExercises = [...training.exercises];
                          newExercises[exerciseIndex].sets[setIndex].weight = e.target.value;
                          setTraining({ ...training, exercises: newExercises });
                        }}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSet(exerciseIndex)}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                >
                  + Přidat sérii
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addExercise}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            + Add exercise
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            value={training.notes}
            onChange={(e) => setTraining({ ...training, notes: e.target.value })}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/training/${id}`)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTraining;