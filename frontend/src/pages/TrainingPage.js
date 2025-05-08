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
    'LEGS': 'Nohy',
    'CHEST': 'Prsa',
    'BACK': 'Záda',
    'SHOULDERS': 'Ramena',
    'ARMS': 'Ruce',
    'ABS': 'Břicho'
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
      setError('Nepodařilo se načíst tréninky');
    }
  };

  const handleTrainingSelect = async (trainingId) => {
    try {
      const response = await trainingService.getExercises(trainingId);
      setExercises(response.data);
      setSelectedTraining(trainings.find(t => t.id === trainingId));
    } catch (error) {
      setError('Nepodařilo se načíst cvičení');
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
      setSuccessMessage('Cvičení bylo úspěšně přidáno');
    } catch (error) {
      console.error('Chyba při přidávání cvičení:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Nepodařilo se přidat cvičení');
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
      setSuccessMessage('Trénink byl úspěšně smazán');
    } catch (error) {
      setError('Nepodařilo se smazat trénink');
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
      setSuccessMessage('Všechny tréninky byly úspěšně smazány');
      setIsDeletingAll(false);
    } catch (error) {
      setError('Nepodařilo se smazat všechny tréninky');
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
      setSuccessMessage('Trénink byl úspěšně přidán');
    } catch (error) {
      console.error('Chyba při přidávání tréninku:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Nepodařilo se přidat trénink');
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
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Tréninky</h1>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Seznam tréninků</h2>
              {trainings.length > 0 && (
                <button
                  onClick={() => setIsDeletingAll(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Smazat vše
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedBodyPart}
                onChange={(e) => {
                  setSelectedBodyPart(e.target.value);
                  setCurrentPage(1);
                }}
                className="p-2 border rounded flex-1"
              >
                <option value="ALL">Všechny části těla</option>
                <option value="LEGS">Nohy</option>
                <option value="CHEST">Prsa</option>
                <option value="BACK">Záda</option>
                <option value="SHOULDERS">Ramena</option>
                <option value="ARMS">Ruce</option>
                <option value="ABS">Břicho</option>
              </select>
              
              <input
                type="text"
                placeholder="Hledat trénink..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="p-2 border rounded flex-1"
              />
            </div>
          </div>
          
          {!isAddingTraining ? (
            <button
              onClick={() => setIsAddingTraining(true)}
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Přidat trénink
            </button>
          ) : (
            <form onSubmit={handleAddTraining} className="mb-4 p-4 border rounded">
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Název tréninku"
                  value={newTraining.name}
                  onChange={(e) => setNewTraining(prev => ({ ...prev, name: e.target.value }))}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="date"
                  value={newTraining.date}
                  onChange={(e) => setNewTraining(prev => ({ ...prev, date: e.target.value }))}
                  className="p-2 border rounded"
                  required
                />
                <textarea
                  placeholder="Popis"
                  value={newTraining.description}
                  onChange={(e) => setNewTraining(prev => ({ ...prev, description: e.target.value }))}
                  className="p-2 border rounded"
                />
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Přidat
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingTraining(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Zrušit
                </button>
              </div>
            </form>
          )}
          
          <div className="space-y-4">
            {paginatedTrainings.map(training => (
              <div
                key={training.id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedTraining?.id === training.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleTrainingSelect(training.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{training.name}</h3>
                    <p className="text-sm text-gray-600">{new Date(training.date).toLocaleDateString()}</p>
                    {training.description && (
                      <p className="mt-2 text-gray-700">{training.description}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTraining(training.id);
                    }}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    Smazat
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Předchozí
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Další
              </button>
            </div>
          )}
        </div>

        {selectedTraining && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Cvičení pro {selectedTraining.name}
            </h2>
            
            {!isAddingExercise ? (
              <button
                onClick={() => setIsAddingExercise(true)}
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Přidat cvičení
              </button>
            ) : (
              <form onSubmit={handleAddExercise} className="mb-4 p-4 border rounded">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Název cvičení"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    className="p-2 border rounded"
                    required
                  />
                  <select
                    value={newExercise.bodyPart}
                    onChange={(e) => setNewExercise(prev => ({
                      ...prev,
                      bodyPart: e.target.value
                    }))}
                    className="p-2 border rounded"
                    required
                  >
                    <option value="LEGS">Nohy</option>
                    <option value="CHEST">Prsa</option>
                    <option value="BACK">Záda</option>
                    <option value="SHOULDERS">Ramena</option>
                    <option value="ARMS">Ruce</option>
                    <option value="ABS">Břicho</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Počet sérií"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise(prev => ({
                      ...prev,
                      sets: e.target.value
                    }))}
                    className="p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Počet opakování"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise(prev => ({
                      ...prev,
                      reps: e.target.value
                    }))}
                    className="p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Váha (kg)"
                    value={newExercise.weight}
                    onChange={(e) => setNewExercise(prev => ({
                      ...prev,
                      weight: e.target.value
                    }))}
                    className="p-2 border rounded"
                    required
                  />
                  <textarea
                    placeholder="Popis"
                    value={newExercise.description}
                    onChange={(e) => setNewExercise(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    className="p-2 border rounded"
                  />
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Přidat
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingExercise(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Zrušit
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {exercises.map(exercise => (
                <div key={exercise.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{exercise.name}</h3>
                      <p className="text-sm text-gray-600">Část těla: {bodyPartLabels[exercise.bodyPart] || exercise.bodyPart}</p>
                      <p>Série: {exercise.sets}</p>
                      <p>Opakování: {exercise.reps}</p>
                      <p>Váha: {exercise.weight} kg</p>
                      {exercise.description && (
                        <p className="mt-2 text-gray-700">{exercise.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isDeletingAll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Smazat všechny tréninky?</h3>
            <p className="mb-4">Tato akce je nevratná.</p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAllTrainings}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Ano, smazat vše
              </button>
              <button
                onClick={() => setIsDeletingAll(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Zrušit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingPage;