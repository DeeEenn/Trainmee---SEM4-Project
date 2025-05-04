import React, { useState, useEffect } from 'react';
import TrainingForm from '../components/TrainingForm';
import TrainingList from '../components/TrainingList';
import ExerciseForm from '../components/ExerciseForm';
import ExerciseList from '../components/ExerciseList';

const TrainingPage = () => {
    const [trainings, setTrainings] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [isAddingExercise, setIsAddingExercise] = useState(false);
    const [exercises, setExercises] = useState([]);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    useEffect(() => {
        fetchTrainings();
    }, []);

    useEffect(() => {
        if (selectedTraining) {
            fetchExercises(selectedTraining.id);
        }
    }, [selectedTraining]);

    const fetchTrainings = async () => {
        try {
            const headers = getAuthHeader();
            if (!headers) {
                setError('Není přihlášen');
                return;
            }

            const response = await fetch('http://localhost:8080/api/trainings', {
                headers: headers
            });

            if (!response.ok) {
                throw new Error('Nepodařilo se načíst tréninky');
            }

            const data = await response.json();
            setTrainings(data);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchExercises = async (trainingId) => {
        try {
            const headers = getAuthHeader();
            const response = await fetch(`http://localhost:8080/api/trainings/${trainingId}/exercises`, {
                headers: headers
            });

            if (!response.ok) {
                throw new Error('Nepodařilo se načíst cvičení');
            }

            const data = await response.json();
            setExercises(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleAddExercise = async (exerciseData) => {
        try {
            const headers = getAuthHeader();
            const response = await fetch(`http://localhost:8080/api/trainings/${selectedTraining.id}/exercises`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(exerciseData)
            });

            if (!response.ok) {
                throw new Error('Nepodařilo se přidat cvičení');
            }

            const newExercise = await response.json();
            setExercises([...exercises, newExercise]);
            setIsAddingExercise(false);
            setSuccess('Cvičení přidáno');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleAddTraining = async (training) => {
        try {
            const headers = getAuthHeader();
            if (!headers) {
                setError('You are not logged in');
                return;
            }

            const response = await fetch('http://localhost:8080/api/trainings', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(training)
            });

            if (response.status === 401) {
                setError('Invalid token, please log in again');
                localStorage.removeItem('token');
                return;
            }

            if (response.status === 403) {
                setError('You are not authorized to perform this action');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to add training');
            }

            const newTraining = await response.json();
            setTrainings([...trainings, newTraining]);
            setIsAdding(false);
            setSuccess('Training added successfully');
            setTimeout(() => setSuccess(''), 3000);
            setError(null);
        } catch (err) {
            setError(`Error adding training: ${err.message}`);
            console.error('Error:', err);
        }
    };

    const handleUpdateTraining = async (id, trainingData) => {
        try {
            const headers = getAuthHeader();
            if (!headers) {
                setError('You are not logged in');
                return;
            }

            const response = await fetch(`http://localhost:8080/api/trainings/${id}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(trainingData)
            });

            if (response.status === 401) {
                setError('Invalid token, please log in again');
                localStorage.removeItem('token');
                return;
            }

            if (response.status === 403) {
                setError('You are not authorized to perform this action');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to update training');
            }

            const updatedTraining = await response.json();
            setTrainings(trainings.map(t => 
                t.id === id ? updatedTraining : t
            ));
            setSuccess('Training updated successfully');
            setTimeout(() => setSuccess(''), 3000);
            setError(null);
        } catch (err) {
            setError(`Error updating training: ${err.message}`);
            console.error('Error:', err);
        }
    };

    const handleDeleteTraining = async (id) => {
        try {
            const headers = getAuthHeader();
            const response = await fetch(`http://localhost:8080/api/trainings/${id}`, {
                method: 'DELETE',
                headers: headers
            });
            
            if (response.status === 401) {
                    setError('Invalid token, please log in again');
                localStorage.removeItem('token');
                return;
            }
            
            if (response.status === 403) {
                setError('You are not authorized to perform this action');
                return;
            }
            
            if (!response.ok) {
                throw new Error('Failed to delete training');
            }
            
            setTrainings(trainings.filter(training => training.id !== id));
            setError(null);
        } catch (error) {
            setError(error.message);
            console.error(error);
        }
    };

    if(loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if(error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-montserrat">Moje tréninky</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Přidat trénink
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            {isAdding ? (
                <TrainingForm 
                    onAddTraining={handleAddTraining}
                    onCancel={() => setIsAdding(false)}
                />
            ) : (
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <TrainingList 
                            trainings={trainings}
                            onDeleteTraining={handleDeleteTraining}
                            onUpdateTraining={handleUpdateTraining}
                            onSelectTraining={setSelectedTraining}
                            selectedTrainingId={selectedTraining?.id}
                        />
                    </div>
                    <div>
                        {selectedTraining ? (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold">Exercise</h3>
                                    <button
                                        onClick={() => setIsAddingExercise(true)}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        Add exercise
                                    </button>
                                </div>
                                {isAddingExercise ? (
                                    <ExerciseForm
                                        onAddExercise={handleAddExercise}
                                        onCancel={() => setIsAddingExercise(false)}
                                    />
                                ) : (
                                    <ExerciseList exercises={exercises} />
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <p>Select a training to view exercises</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainingPage;