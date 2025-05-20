import React from 'react';

const ExerciseList = ({ exercises }) => {
    if (exercises.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                <p>No exercises yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {exercises.map(exercise => (
                <div key={exercise.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                {exercise.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500">
                                Body part: {exercise.bodyPart}
                            </p>
                        </div>
                    </div>
                    {exercise.description && (
                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                            {exercise.description}
                        </p>
                    )}
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        <div>
                            <span className="text-xs sm:text-sm font-medium text-gray-500">Sets:</span>
                            <span className="ml-2 text-sm sm:text-base text-gray-900">{exercise.sets}</span>
                        </div>
                        <div>
                            <span className="text-xs sm:text-sm font-medium text-gray-500">Repetitions:</span>
                            <span className="ml-2 text-sm sm:text-base text-gray-900">{exercise.reps}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExerciseList; 