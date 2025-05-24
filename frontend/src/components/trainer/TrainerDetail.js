import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { trainerService } from '../../services/api';

const TrainerDetail = () => {
    const { id } = useParams();
    const [trainer, setTrainer] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('profile');
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [trainingPlans, setTrainingPlans] = useState([]);
    const [newTrainingPlan, setNewTrainingPlan] = useState({ title: '', description: '' });

    useEffect(() => {
        loadTrainerData();
    }, [id]);

    const loadTrainerData = async () => {
        try {
            console.log('Načítám data trenéra s ID:', id);
            
            // Nejdřív načteme základní informace o trenérovi
            const trainerResponse = await trainerService.getById(id);
            console.log('Odpověď od API:', trainerResponse.data);
            setTrainer(trainerResponse.data);

            try {
                // Pak zkusíme načíst recenze
                const reviewsResponse = await trainerService.getReviews(id);
                setReviews(reviewsResponse.data);
            } catch (err) {
                console.warn('Nepodařilo se načíst recenze:', err);
                setReviews([]);
            }

            try {
                // Pak zkusíme načíst zprávy
                const messagesResponse = await trainerService.getMessages(id);
                setMessages(messagesResponse.data);
            } catch (err) {
                console.warn('Nepodařilo se načíst zprávy:', err);
                setMessages([]);
            }

            try {
                // Nakonec zkusíme načíst tréninkové plány
                const plansResponse = await trainerService.getTrainingPlans(id);
                setTrainingPlans(plansResponse.data);
            } catch (err) {
                console.warn('Nepodařilo se načíst tréninkové plány:', err);
                setTrainingPlans([]);
            }

            setLoading(false);
        } catch (err) {
            console.error('Chyba při načítání dat trenéra:', err);
            setError('Nepodařilo se načíst data trenéra');
            setLoading(false);
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            const response = await trainerService.addReview(id, newReview);
            setReviews([...reviews, response.data]);
            setNewReview({ rating: 5, comment: '' });
        } catch (err) {
            setError('Nepodařilo se přidat hodnocení');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            const response = await trainerService.sendMessage(id, { content: newMessage });
            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (err) {
            setError('Nepodařilo se odeslat zprávu');
        }
    };

    const handleCreateTrainingPlan = async (e) => {
        e.preventDefault();
        try {
            const response = await trainerService.createTrainingPlan(id, newTrainingPlan);
            setTrainingPlans([...trainingPlans, response.data]);
            setNewTrainingPlan({ title: '', description: '' });
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

    if (!trainer) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>Trenér nebyl nalezen</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-light text-gray-900 mb-2">
                        {trainer.name} {trainer.surname}
                    </h1>
                    <p className="text-gray-600">{trainer.email}</p>
                </div>

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
                            activeTab === 'reviews' ? 'border-b-2 border-gray-900' : 'text-gray-600'
                        }`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Hodnocení
                    </button>
                    <button
                        className={`px-4 py-2 ${
                            activeTab === 'messages' ? 'border-b-2 border-gray-900' : 'text-gray-600'
                        }`}
                        onClick={() => setActiveTab('messages')}
                    >
                        Zprávy
                    </button>
                    <button
                        className={`px-4 py-2 ${
                            activeTab === 'plans' ? 'border-b-2 border-gray-900' : 'text-gray-600'
                        }`}
                        onClick={() => setActiveTab('plans')}
                    >
                        Tréninkové plány
                    </button>
                </div>

                {activeTab === 'profile' && (
                    <div className="space-y-8">
                        <div className="border-l-4 border-gray-300 pl-6">
                            <h2 className="text-xl font-light text-gray-900 mb-4">O trenérovi</h2>
                            <p className="text-gray-600">{trainer.description || 'Žádný popis není k dispozici.'}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="space-y-8">
                        <form onSubmit={handleAddReview} className="border-l-4 border-gray-300 pl-6 mb-8">
                            <h2 className="text-xl font-light text-gray-900 mb-4">Přidat hodnocení</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Hodnocení</label>
                                    <select
                                        value={newReview.rating}
                                        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                                    >
                                        {[5, 4, 3, 2, 1].map(rating => (
                                            <option key={rating} value={rating}>
                                                {rating} {rating === 1 ? 'hvězda' : rating < 5 ? 'hvězdy' : 'hvězd'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Komentář</label>
                                    <textarea
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                                        rows="3"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                                >
                                    Přidat hodnocení
                                </button>
                            </div>
                        </form>

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
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="space-y-8">
                        <form onSubmit={handleSendMessage} className="border-l-4 border-gray-300 pl-6 mb-8">
                            <h2 className="text-xl font-light text-gray-900 mb-4">Poslat zprávu</h2>
                            <div className="space-y-4">
                                <div>
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                                        rows="3"
                                        placeholder="Napište zprávu..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                                >
                                    Odeslat
                                </button>
                            </div>
                        </form>

                        <div className="space-y-8">
                            {messages.map(message => (
                                <div key={message.id} className="border-l-4 border-gray-300 pl-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-gray-900 mb-2">{message.senderName}</p>
                                            <p className="text-gray-600">{message.content}</p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                {new Date(message.createdAt).toLocaleDateString('cs-CZ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'plans' && (
                    <div className="space-y-8">
                        <form onSubmit={handleCreateTrainingPlan} className="border-l-4 border-gray-300 pl-6 mb-8">
                            <h2 className="text-xl font-light text-gray-900 mb-4">Vytvořit tréninkový plán</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Název</label>
                                    <input
                                        type="text"
                                        value={newTrainingPlan.title}
                                        onChange={(e) => setNewTrainingPlan({ ...newTrainingPlan, title: e.target.value })}
                                        className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Popis</label>
                                    <textarea
                                        value={newTrainingPlan.description}
                                        onChange={(e) => setNewTrainingPlan({ ...newTrainingPlan, description: e.target.value })}
                                        className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                                        rows="3"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                                >
                                    Vytvořit plán
                                </button>
                            </div>
                        </form>

                        <div className="space-y-8">
                            {trainingPlans.map(plan => (
                                <div key={plan.id} className="border-l-4 border-gray-300 pl-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-light text-gray-900 mb-2">{plan.title}</h3>
                                            <p className="text-gray-600 mb-4">{plan.description}</p>
                                            <p className="text-sm text-gray-500">
                                                Vytvořeno: {new Date(plan.createdAt).toLocaleDateString('cs-CZ')}
                                            </p>
                                            {plan.accepted && (
                                                <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                                    Schváleno
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainerDetail; 