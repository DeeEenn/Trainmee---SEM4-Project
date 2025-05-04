import React, { useState } from 'react';

const ExerciseForm = ({ onAddExercise, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        bodyPart: '',
        sets: '',
        reps: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddExercise({
            ...formData,
            sets: parseInt(formData.sets),
            reps: parseInt(formData.reps)
        });
        setFormData({
            name: '',
            description: '',
            bodyPart: '',
            sets: '',
            reps: ''
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Exercise
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="2"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="bodyPart" className="block text-sm font-medium text-gray-700">
                    Body part
                </label>
                <input
                    type="text"
                    id="bodyPart"
                    name="bodyPart"
                    value={formData.bodyPart}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="sets" className="block text-sm font-medium text-gray-700">
                        Number of sets
                    </label>
                    <input
                        type="number"
                        id="sets"
                        name="sets"
                        value={formData.sets}
                        onChange={handleChange}
                        min="1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="reps" className="block text-sm font-medium text-gray-700">
                        Number of repetitions
                    </label>
                    <input
                        type="number"
                        id="reps"
                        name="reps"
                        value={formData.reps}
                        onChange={handleChange}
                        min="1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div className="flex space-x-4">
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Add exercise
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ExerciseForm; 