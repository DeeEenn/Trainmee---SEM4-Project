// src/components/training/AddNotes.jsx
import React, { useState } from 'react';

const AddNotes = ({ trainingId }) => {
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Zde bude později volání API
    console.log({ trainingId, notes });
    setNotes('');
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Add notes to training
        </h3>
        <form onSubmit={handleSubmit} className="mt-5">
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write down your notes..."
            />
          </div>
          <button
            type="submit"
            className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Save notes
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNotes;