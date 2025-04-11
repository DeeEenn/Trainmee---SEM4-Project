import React from 'react';
import ProgressChart from '../components/progress/ProgressChart';
import Statistics from '../components/progress/Statistics';

const Progress = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your progress</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProgressChart />
        <Statistics />
      </div>
    </div>
  );
};

export default Progress;