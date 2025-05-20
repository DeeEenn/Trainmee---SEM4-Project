import React, { useState } from 'react';
import TrainingForm from './TrainingForm';

const TrainingList = ({ trainings, onDeleteTraining, onUpdateTraining, onSelectTraining, selectedTrainingId }) => {
    const [editingTraining, setEditingTraining] = useState(null);

    const handleEdit = (training) => {
        setEditingTraining(training);
    };

    const handleCancelEdit = () => {
        setEditingTraining(null);
    };

    if (trainings.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p className="text-lg font-montserrat">You don't have any trainings yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {trainings.map(training => (
                <div 
                    key={training.id} 
                    className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
                        selectedTrainingId === training.id ? 'ring-2 ring-indigo-500' : ''
                    }`}
                    onClick={() => onSelectTraining(training)}
                >
                    {editingTraining?.id === training.id ? (
                        <TrainingForm 
                            training={editingTraining}
                            onAddTraining={(updatedTraining) => {
                                onUpdateTraining(editingTraining.id, updatedTraining);
                                setEditingTraining(null);
                            }}
                            onCancel={handleCancelEdit}
                        />
                    ) : (
                        <>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {training.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(training.date).toLocaleString('cs-CZ')}
                                    </p>
                                </div>
                                <div className="flex space-x-4 sm:space-x-2">
                                    <button 
                                        className="text-indigo-600 hover:text-indigo-800 text-sm sm:text-base"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(training);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="text-red-600 hover:text-red-800 text-sm sm:text-base"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteTraining(training.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            {training.description && (
                                <p className="mt-2 text-gray-600 text-sm sm:text-base">
                                    {training.description}
                                </p>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TrainingList;