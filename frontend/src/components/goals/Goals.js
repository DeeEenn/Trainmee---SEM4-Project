// src/components/goals/Goals.jsx
import React, { useState } from 'react';

const Goals = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Zvýšení bench pressu',
      target: 100,
      current: 80,
      deadline: '2024-06-01',
      category: 'Prsa'
    },
    {
      id: 2,
      name: 'Zvýšení dřepů',
      target: 120,
      current: 100,
      deadline: '2024-06-01',
      category: 'Nohy'
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    deadline: '',
    category: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Zde bude později volání API
    setGoals([...goals, { ...newGoal, id: goals.length + 1, current: 0 }]);
    setNewGoal({ name: '', target: '', deadline: '', category: '' });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Moje cíle</h2>
      
      {/* Formulář pro přidání nového cíle */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Goal name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kategorie</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={newGoal.category}
              onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
            >
              <option value="">Vyberte kategorii</option>
              <option value="Nohy">Nohy</option>
              <option value="Prsa">Prsa</option>
              <option value="Záda">Záda</option>
              <option value="Břicho">Břicho</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End goal (kg)</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add goal
        </button>
      </form>

      {/* Seznam cílů */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          return (
            <div key={goal.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">{goal.name}</h3>
                <span className="text-sm text-gray-500">{goal.category}</span>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{goal.current} kg</span>
                  <span>{goal.target} kg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Deadline: {goal.deadline}</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Goals;