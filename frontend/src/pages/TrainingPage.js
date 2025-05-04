import React, { useState, useEffect } from 'react';
import TrainingForm from '../components/TrainingForm';
import TrainingList from '../components/TrainingList';

const TrainingPage = () => {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('You are not logged in');
        }
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };
    
    useEffect(() => {
        loadTrainings();
    }, []);

    const loadTrainings = async () => {
        try {
            const headers = getAuthHeader();
            const response = await fetch('http://localhost:8080/api/trainings', {
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setTrainings(data);
            setError(null);
        } catch (err) {
            setError(`Error fetching trainings: ${err.message}`);
            console.error('Error:', err);
        } finally {
            setLoading(false);
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
                <h2 className="text-2xl font-montserrat">My Trainings</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Add New Training
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
                <TrainingList 
                    trainings={trainings}
                    onDeleteTraining={handleDeleteTraining}
                    onUpdateTraining={handleUpdateTraining}
                />
            )}
        </div>
    );
};

export default TrainingPage;