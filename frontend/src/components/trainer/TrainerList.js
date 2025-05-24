import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trainerService } from '../../services/api';

const TrainerList = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadTrainers();
    }, []);

    const loadTrainers = async () => {
        try {
            const response = await trainerService.getAll();
            setTrainers(response.data);
            setLoading(false);
        } catch (err) {
            setError('Nepodařilo se načíst trenéry');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 py-8">
                <p>{error}</p>
            </div>
        );
    }

    if (trainers.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>Žádní trenéři nejsou k dispozici.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map(trainer => (
                <div key={trainer.id} className="border-l-4 border-gray-300 pl-6 hover:border-gray-900 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-light text-gray-900 mb-2">
                                {trainer.name} {trainer.surname}
                            </h3>
                            <p className="text-gray-600 mb-4">{trainer.email}</p>
                            {trainer.description && (
                                <p className="text-gray-600 mb-4">{trainer.description}</p>
                            )}
                            <Link
                                to={`/trainers/${trainer.id}`}
                                className="inline-block px-6 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                            >
                                Zobrazit profil
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TrainerList; 