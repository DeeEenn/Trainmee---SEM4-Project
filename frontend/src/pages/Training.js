import React from 'react';
import TrainingList from '../components/training/TrainingList';
import AddTrainingForm from '../components/training/AddTrainingForm';
import TrainingHistory from '../components/training/TrainingHistory';
import AddNotes from '../components/training/AddNotes';

const Training = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-6">Trainings</h1>
          <AddTrainingForm />
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">My trainings</h2>
          <TrainingList />
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Training history</h2>
          <TrainingHistory />
        </div>
        <div className="mt-8">
          <AddNotes trainingId={1} />
        </div>
      </div>
    </div>
  );
};

export default Training;