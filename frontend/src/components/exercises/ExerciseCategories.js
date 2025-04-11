// src/components/exercises/ExerciseCategories.jsx
import React from 'react';

const ExerciseCategories = () => {
  const categories = [
    {
      name: 'Nohy',
      exercises: ['Dřepy', 'Výpady', 'Leg press', 'Mrtvý tah'],
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Záda',
      exercises: ['Přítahy', 'Veslování', 'Stahování kladky', 'Hyperextenze'],
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'Prsa',
      exercises: ['Bench press', 'Kliky', 'Rozpažky', 'Tlaky na ramena'],
      color: 'bg-red-100 text-red-800'
    },
    {
      name: 'Břicho',
      exercises: ['Sedy-lehy', 'Plank', 'Ruské twisty', 'Zvedání nohou'],
      color: 'bg-yellow-100 text-yellow-800'
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Kategorie cviků</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h4 className={`text-lg font-semibold mb-2 ${category.color} px-2 py-1 rounded`}>
              {category.name}
            </h4>
            <ul className="space-y-2">
              {category.exercises.map((exercise, exIndex) => (
                <li key={exIndex} className="text-sm text-gray-600">
                  {exercise}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseCategories;