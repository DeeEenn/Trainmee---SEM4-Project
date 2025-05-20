import React, { useState, useEffect } from 'react';
import { trainingService } from '../services/api';

const TrainingPage = () => {
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    description: '',
    bodyPart: 'LEGS'
  });
  const [isAddingTraining, setIsAddingTraining] = useState(false);
  const [newTraining, setNewTraining] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [selectedBodyPart, setSelectedBodyPart] = useState('ALL');
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [trainingExercises, setTrainingExercises] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const bodyPartLabels = {
    'LEGS': 'Legs',
    'CHEST': 'Chest',
    'BACK': 'Back',
    'SHOULDERS': 'Shoulders',
    'ARMS': 'Arms',
    'ABS': 'Abs'
  };

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      const response = await trainingService.getAll();
      setTrainings(response.data);
      const exercisesPromises = response.data.map(training => 
        trainingService.getExercises(training.id)
          .then(res => ({ id: training.id, exercises: res.data }))
          .catch(() => ({ id: training.id, exercises: [] }))
      );
      const exercisesResults = await Promise.all(exercisesPromises);
      const exercisesMap = exercisesResults.reduce((acc, { id, exercises }) => {
        acc[id] = exercises;
        return acc;
      }, {});
      setTrainingExercises(exercisesMap);
    } catch (error) {
      setError('Failed to load workouts');
    }
  };

  const handleTrainingSelect = async (trainingId) => {
    try {
      const response = await trainingService.getExercises(trainingId);
      setExercises(response.data);
      setSelectedTraining(trainings.find(t => t.id === trainingId));
    } catch (error) {
      setError('Failed to load exercises');
    }
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    try {
      const exerciseData = {
        ...newExercise,
        description: newExercise.description || ''
      };
      
      const response = await trainingService.addExercise(selectedTraining.id, exerciseData);
      setExercises(prev => [...prev, response.data]);
      setTrainingExercises(prev => ({
        ...prev,
        [selectedTraining.id]: [...(prev[selectedTraining.id] || []), response.data]
      }));
      setNewExercise({ name: '', sets: '', reps: '', weight: '', description: '', bodyPart: 'LEGS' });
      setIsAddingExercise(false);
      setSuccessMessage('Exercise added successfully');
    } catch (error) {
      setError('Failed to add exercise');
    }
  };

  const handleDeleteTraining = async (id) => {
    try {
      await trainingService.delete(id);
      setTrainings(prev => prev.filter(t => t.id !== id));
      if (selectedTraining?.id === id) {
        setSelectedTraining(null);
        setExercises([]);
      }
      setTrainingExercises(prev => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });
      setSuccessMessage('Workout deleted successfully');
    } catch (error) {
      setError('Failed to delete workout');
    }
  };

  const handleDeleteAllTrainings = async () => {
    try {
      const deletePromises = trainings.map(training => trainingService.delete(training.id));
      await Promise.all(deletePromises);
      setTrainings([]);
      setSelectedTraining(null);
      setExercises([]);
      setTrainingExercises({});
      setSuccessMessage('All workouts deleted successfully');
      setIsDeletingAll(false);
    } catch (error) {
      setError('Failed to delete all workouts');
    }
  };

  const handleAddTraining = async (e) => {
    e.preventDefault();
    try {
      const trainingData = {
        ...newTraining,
        date: new Date(newTraining.date + 'T00:00:00').toISOString()
      };
      
      const response = await trainingService.create(trainingData);
      setTrainings(prev => [...prev, response.data]);
      setNewTraining({ name: '', date: new Date().toISOString().split('T')[0], description: '' });
      setIsAddingTraining(false);
      setSuccessMessage('Workout added successfully');
    } catch (error) {
      setError('Failed to add workout');
    }
  };

  const filteredTrainings = trainings.filter(training => {
    if (selectedBodyPart !== 'ALL') {
      const exercises = trainingExercises[training.id] || [];
      if (!exercises.some(exercise => exercise.bodyPart === selectedBodyPart)) {
        return false;
      }
    }

    if (searchTerm) {
      if (!training.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  const totalPages = Math.ceil(filteredTrainings.length / itemsPerPage);
  const paginatedTrainings = filteredTrainings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            My Workouts
          </h1>
          <p className="text-gray-600 font-light">
            Manage your workouts and track your progress
          </p>
        </div>

        {error && (
          <div className="mb-8 border-l-4 border-red-500 pl-4 py-2">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-8 border-l-4 border-green-500 pl-4 py-2">
            <p className="text-green-600">{successMessage}</p>
          </div>
        )}

        <div className="flex justify-between items-center mb-12">
          <div className="flex gap-4">
            <select
              value={selectedBodyPart}
              onChange={(e) => {
                setSelectedBodyPart(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
            >
              <option value="ALL">All Body Parts</option>
              {Object.entries(bodyPartLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder="Search workout..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
            />
          </div>
          {trainings.length > 0 && (
            <button
              onClick={() => setIsDeletingAll(true)}
              className="px-6 py-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            >
              Delete All
            </button>
          )}
        </div>

        {!isAddingTraining ? (
          <button
            onClick={() => setIsAddingTraining(true)}
            className="w-full mb-12 px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
          >
            Add Workout
          </button>
        ) : (
          <form onSubmit={handleAddTraining} className="mb-12 space-y-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Workout Name</label>
                <input
                  type="text"
                  value={newTraining.name}
                  onChange={(e) => setNewTraining(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Date</label>
                <input
                  type="date"
                  value={newTraining.date}
                  onChange={(e) => setNewTraining(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Description</label>
                <textarea
                  value={newTraining.description}
                  onChange={(e) => setNewTraining(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingTraining(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {paginatedTrainings.map(training => (
              <div
                key={training.id}
                className={`border-l-4 pl-6 cursor-pointer transition-colors ${
                  selectedTraining?.id === training.id 
                    ? 'border-gray-900' 
                    : 'border-gray-300 hover:border-gray-900'
                }`}
                onClick={() => handleTrainingSelect(training.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">{training.name}</h3>
                    <p className="text-gray-600">{new Date(training.date).toLocaleDateString()}</p>
                    {training.description && (
                      <p className="mt-2 text-gray-600">{training.description}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTraining(training.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border ${
                    currentPage === 1
                      ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                      : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                  } transition-colors`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 border ${
                      currentPage === index + 1
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900'
                    } transition-colors`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border ${
                    currentPage === totalPages
                      ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                      : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                  } transition-colors`}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {selectedTraining && (
            <div className="space-y-8">
              <div className="border-l-4 border-gray-900 pl-6">
                <h2 className="text-2xl font-light text-gray-900 mb-4">
                  Exercises for {selectedTraining.name}
                </h2>
                
                {!isAddingExercise ? (
                  <button
                    onClick={() => setIsAddingExercise(true)}
                    className="w-full mb-8 px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    Add Exercise
                  </button>
                ) : (
                  <form onSubmit={handleAddExercise} className="mb-8 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Exercise Name</label>
                        <input
                          type="text"
                          value={newExercise.name}
                          onChange={(e) => setNewExercise(prev => ({
                            ...prev,
                            name: e.target.value
                          }))}
                          className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Body Part</label>
                        <select
                          value={newExercise.bodyPart}
                          onChange={(e) => setNewExercise(prev => ({
                            ...prev,
                            bodyPart: e.target.value
                          }))}
                          className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                          required
                        >
                          {Object.entries(bodyPartLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Sets</label>
                        <input
                          type="number"
                          value={newExercise.sets}
                          onChange={(e) => setNewExercise(prev => ({
                            ...prev,
                            sets: e.target.value
                          }))}
                          className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Reps</label>
                        <input
                          type="number"
                          value={newExercise.reps}
                          onChange={(e) => setNewExercise(prev => ({
                            ...prev,
                            reps: e.target.value
                          }))}
                          className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Weight (kg)</label>
                        <input
                          type="number"
                          value={newExercise.weight}
                          onChange={(e) => setNewExercise(prev => ({
                            ...prev,
                            weight: e.target.value
                          }))}
                          className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Description</label>
                      <textarea
                        value={newExercise.description}
                        onChange={(e) => setNewExercise(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                        className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingExercise(false)}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-8">
                  {exercises.map(exercise => (
                    <div key={exercise.id} className="border-l-4 border-gray-300 pl-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-light text-gray-900 mb-2">{exercise.name}</h3>
                          <p className="text-gray-600 mb-4">Body Part: {bodyPartLabels[exercise.bodyPart]}</p>
                          <div className="grid grid-cols-3 gap-8">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Sets</p>
                              <p className="text-gray-900">{exercise.sets}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Reps</p>
                              <p className="text-gray-900">{exercise.reps}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Weight</p>
                              <p className="text-gray-900">{exercise.weight} kg</p>
                            </div>
                          </div>
                          {exercise.description && (
                            <p className="mt-4 text-gray-600">{exercise.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isDeletingAll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-md w-full">
            <h3 className="text-xl font-light text-gray-900 mb-4">
              Delete all workouts?
            </h3>
            <p className="text-gray-600 mb-8">
              This action cannot be undone. Are you sure you want to delete all your workouts?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteAllTrainings}
                className="flex-1 px-6 py-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                Delete All
              </button>
              <button
                onClick={() => setIsDeletingAll(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingPage;