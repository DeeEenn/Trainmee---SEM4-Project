import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/api';
import TrainingPlanForm from './TrainingPlanForm';

const TrainerDashboard = () => {
    const [trainer, setTrainer] = useState(null);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showTrainingPlanForm, setShowTrainingPlanForm] = useState(false);

    useEffect(() => {
        loadTrainerData();
    }, []);

    const loadTrainerData = async () => {
        try {
            const trainerId = localStorage.getItem('userId');
            const trainerResponse = await trainerService.getById(trainerId);
            setTrainer(trainerResponse.data);

            const reviewsResponse = await trainerService.getReviews(trainerId);
            setReviews(reviewsResponse.data);

            setLoading(false);
        } catch (err) {
            setError('Nepodařilo se načíst data trenéra');
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (updatedData) => {
        try {
            const response = await trainerService.updateProfile(updatedData);
            setTrainer(response.data);
            setIsEditing(false);
        } catch (err) {
            setError('Nepodařilo se aktualizovat profil');
        }
    };

    const handleClientSelect = async (clientId) => {
        try {
            setSelectedClient(clientId);
            const messagesResponse = await trainerService.getMessages(clientId);
            setMessages(messagesResponse.data);
        } catch (err) {
            setError('Nepodařilo se načíst zprávy');
        }
    };

    const handleSendMessage = async (content) => {
        try {
            const response = await trainerService.sendMessage(selectedClient, { content });
            setMessages([...messages, response.data]);
        } catch (err) {
            setError('Nepodařilo se odeslat zprávu');
        }
    };

    const handleCreateTrainingPlan = async (planData) => {
        try {
            await trainerService.createTrainingPlan(selectedClient, planData);
            setShowTrainingPlanForm(false);
        } catch (err) {
            setError('Nepodařilo se vytvořit tréninkový plán');
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex border-b border-gray-200 mb-8">
                    <button
                        className={`px-4 py-2 ${
                            activeTab === 'profile' ? 'border-b-2 border-gray-900' : 'text-gray-600'
                        }`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profil
                    </button>
                    <button
                        className={`px-4 py-2 ${
                            activeTab === 'clients' ? 'border-b-2 border-gray-900' : 'text-gray-600'
                        }`}
                        onClick={() => setActiveTab('clients')}
                    >
                        Klienti
                    </button>
                    <button
                        className={`px-4 py-2 ${
                            activeTab === 'reviews' ? 'border-b-2 border-gray-900' : 'text-gray-600'
                        }`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Hodnocení
                    </button>
                </div>

                {activeTab === 'profile' && (
                    <div className="space-y-8">
                        {isEditing ? (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleProfileUpdate({
                                    name: trainer.name,
                                    surname: trainer.surname,
                                    email: trainer.email,
                                    description: trainer.description
                                });
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">Jméno</label>
                                        <input
                                            type="text"
                                            value={trainer.name}
                                            onChange={(e) => setTrainer({ ...trainer, name: e.target.value })}
                                            className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">Příjmení</label>
                                        <input
                                            type="text"
                                            value={trainer.surname}
                                            onChange={(e) => setTrainer({ ...trainer, surname: e.target.value })}
                                            className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={trainer.email}
                                            onChange={(e) => setTrainer({ ...trainer, email: e.target.value })}
                                            className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">Popis</label>
                                        <textarea
                                            value={trainer.description}
                                            onChange={(e) => setTrainer({ ...trainer, description: e.target.value })}
                                            className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                                            rows="4"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            className="px-6 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                                        >
                                            Uložit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                                        >
                                            Zrušit
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-light text-gray-900 mb-2">
                                            {trainer.name} {trainer.surname}
                                        </h2>
                                        <p className="text-gray-600">{trainer.email}</p>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                                    >
                                        Upravit profil
                                    </button>
                                </div>
                                <div className="border-l-4 border-gray-300 pl-6">
                                    <h3 className="text-xl font-light text-gray-900 mb-4">O trenérovi</h3>
                                    <p className="text-gray-600">{trainer.description || 'Žádný popis není k dispozici.'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'clients' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h2 className="text-xl font-light text-gray-900">Klienti</h2>
                                {clients.map(client => (
                                    <div
                                        key={client.id}
                                        className={`p-4 border-l-4 ${
                                            selectedClient === client.id ? 'border-gray-900' : 'border-gray-300'
                                        } cursor-pointer hover:border-gray-900 transition-colors`}
                                        onClick={() => handleClientSelect(client.id)}
                                    >
                                        <h3 className="text-lg font-light text-gray-900">
                                            {client.name} {client.surname}
                                        </h3>
                                        <p className="text-gray-600">{client.email}</p>
                                    </div>
                                ))}
                            </div>

                            {selectedClient && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-light text-gray-900">Zprávy</h2>
                                        <button
                                            onClick={() => setShowTrainingPlanForm(true)}
                                            className="px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                                        >
                                            Vytvořit tréninkový plán
                                        </button>
                                    </div>

                                    {showTrainingPlanForm ? (
                                        <TrainingPlanForm
                                            onSubmit={handleCreateTrainingPlan}
                                            clientId={selectedClient}
                                        />
                                    ) : (
                                        <div className="space-y-4">
                                            {messages.map(message => (
                                                <div
                                                    key={message.id}
                                                    className={`p-4 border-l-4 ${
                                                        message.senderId === selectedClient
                                                            ? 'border-gray-300'
                                                            : 'border-gray-900'
                                                    }`}
                                                >
                                                    <p className="text-gray-600">{message.content}</p>
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        {new Date(message.createdAt).toLocaleDateString('cs-CZ')}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="space-y-8">
                        {reviews.map(review => (
                            <div key={review.id} className="border-l-4 border-gray-300 pl-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <span className="text-gray-900 mr-2">{review.userName}</span>
                                            <span className="text-yellow-500">
                                                {'★'.repeat(review.rating)}
                                                {'☆'.repeat(5 - review.rating)}
                                            </span>
                                        </div>
                                        <p className="text-gray-600">{review.comment}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {new Date(review.createdAt).toLocaleDateString('cs-CZ')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainerDashboard; 