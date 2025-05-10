import React, { useState } from 'react';
import axios from 'axios';

const AddProgressForm = ({ userId, onProgressAdded }) => {
    const [formData, setFormData] = useState({
        weight: '',
        bodyFatPercentage: '',
        notes: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await axios.post('/api/progress', {
                ...formData,
                userId
            });
            setFormData({ weight: '', bodyFatPercentage: '', notes: '' });
            setSuccess('Záznam byl úspěšně přidán');
            onProgressAdded();
        } catch (error) {
            setError('Chyba při ukládání záznamu: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Přidat nový záznam</h2>
            
            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                    {success}
                </div>
            )}

            <div className="mb-4">
                <label className="block mb-2 font-medium">Váha (kg)</label>
                <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">Procento tuku (%)</label>
                <input
                    type="number"
                    step="0.1"
                    value={formData.bodyFatPercentage}
                    onChange={(e) => setFormData({...formData, bodyFatPercentage: e.target.value})}
                    className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">Poznámky</label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                />
            </div>

            <button 
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
                Přidat záznam
            </button>
        </form>
    );
};

export default AddProgressForm;