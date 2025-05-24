import React from 'react';
import TrainerList from '../components/trainer/TrainerList';

const TrainerPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-light text-gray-900 mb-8">Trainers</h1>
            <TrainerList />
        </div>
    );
};

export default TrainerPage; 