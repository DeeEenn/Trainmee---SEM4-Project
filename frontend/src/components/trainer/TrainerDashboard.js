import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/api';

const TrainerDashboard = () => {
    const [trainer, setTrainer] = useState(null);
    const [messages, setMessages] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);

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

            // Načtení konverzací
            try {
                const conversationsResponse = await trainerService.getConversations();
                setConversations(conversationsResponse.data || []);
            } catch (err) {
                console.error('Error loading conversations:', err);
                setConversations([]);
            }

            setLoading(false);
        } catch (err) {
            setError('Failed to load trainer data');
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (updatedData) => {
        try {
            const response = await trainerService.updateProfile(updatedData);
            setTrainer(response.data);
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    const handleConversationSelect = async (conversation) => {
        try {
            setSelectedConversation(conversation);
            // Načteme zprávy mezi trenérem a vybraným uživatelem
            const messagesResponse = await trainerService.getMessages(conversation.senderId);
            if (messagesResponse?.data) {
                setMessages(messagesResponse.data);
            }
        } catch (err) {
            console.error('Error loading messages:', err);
            setError('Nepodařilo se načíst zprávy');
        }
    };

    const handleSendMessage = async (content) => {
        if (!selectedConversation) return;

        try {
            await trainerService.sendMessage(selectedConversation.senderId, { content });
            // Znovu načteme zprávy po odeslání
            const messagesResponse = await trainerService.getMessages(selectedConversation.senderId);
            if (messagesResponse?.data) {
                setMessages(messagesResponse.data);
            }
            // Aktualizujeme seznam konverzací
            const conversationsResponse = await trainerService.getConversations();
            setConversations(conversationsResponse.data || []);
        } catch (err) {
            setError('Nepodařilo se odeslat zprávu');
        }
    };

    // Přidáme useEffect pro automatické načítání zpráv a konverzací
    useEffect(() => {
        if (selectedConversation && trainer) {
            const interval = setInterval(async () => {
                try {
                    // Načteme nové zprávy
                    const messagesResponse = await trainerService.getMessages(selectedConversation.senderId);
                    if (messagesResponse?.data) {
                        setMessages(messagesResponse.data);
                    }
                    // Načteme aktualizované konverzace
                    const conversationsResponse = await trainerService.getConversations();
                    setConversations(conversationsResponse.data || []);
                } catch (err) {
                    console.error('Error refreshing messages:', err);
                }
            }, 5000); // Aktualizace každých 5 sekund

            return () => clearInterval(interval);
        }
    }, [selectedConversation, trainer]);

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
                        Profile
                    </button>
                    <button
                        className={`px-4 py-2 ${
                            activeTab === 'conversations' ? 'border-b-2 border-gray-900' : 'text-gray-600'
                        }`}
                        onClick={() => setActiveTab('conversations')}
                    >
                        Conversations
                    </button>
                    <button
                        className={`px-4 py-2 ${
                            activeTab === 'reviews' ? 'border-b-2 border-gray-900' : 'text-gray-600'
                        }`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews
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
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-900"
                                        >
                                            Zrušit
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800"
                                        >
                                            Uložit
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <h2 className="text-xl font-light text-gray-900">Profil</h2>
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
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'conversations' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Seznam konverzací */}
                        <div className="md:col-span-1 space-y-4">
                            <h2 className="text-xl font-light text-gray-900 mb-4">Konverzace</h2>
                            {conversations.map(conversation => (
                                <div
                                    key={conversation.senderId}
                                    className={`border border-gray-200 rounded-lg overflow-hidden cursor-pointer transition-colors ${
                                        selectedConversation?.senderId === conversation.senderId 
                                            ? 'border-gray-900 bg-gray-50' 
                                            : 'hover:border-gray-300'
                                    }`}
                                    onClick={() => handleConversationSelect(conversation)}
                                >
                                    <div className="p-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-light text-gray-900">
                                                {conversation.senderName}
                                            </h3>
                                            {conversation.unreadCount > 0 && (
                                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                                    {conversation.unreadCount} nových
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm mt-1 truncate">
                                            {conversation.lastMessage}
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1">
                                            {new Date(conversation.lastMessageTime).toLocaleString('cs-CZ')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Detail chatu */}
                        <div className="md:col-span-2">
                            {selectedConversation ? (
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                                        <h3 className="text-lg font-light text-gray-900">
                                            {selectedConversation.senderName}
                                        </h3>
                                    </div>
                                    <div className="p-4">
                                        <div className="space-y-4 max-h-[500px] overflow-y-auto mb-4">
                                            {messages.map(message => (
                                                <div
                                                    key={message.id}
                                                    className={`p-4 rounded-lg max-w-[80%] ${
                                                        message.senderId === trainer.id
                                                            ? 'bg-gray-900 text-white ml-auto'
                                                            : 'bg-gray-100'
                                                    }`}
                                                >
                                                    <div className="text-sm mb-1">
                                                        {message.senderName}
                                                    </div>
                                                    <div>{message.content}</div>
                                                    <div className="text-xs mt-1 opacity-70">
                                                        {new Date(message.createdAt).toLocaleString('cs-CZ')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSendMessage(newMessage);
                                        }} className="mt-4">
                                            <div className="flex gap-4">
                                                <textarea
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded"
                                                    rows="3"
                                                    placeholder="Napište zprávu..."
                                                />
                                                <button
                                                    type="submit"
                                                    className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 self-end"
                                                    disabled={!newMessage.trim()}
                                                >
                                                    Odeslat
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                    Vyberte konverzaci pro zobrazení chatu
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="space-y-8">
                        <h2 className="text-xl font-light text-gray-900">Recenze</h2>
                        <div className="space-y-4">
                            {reviews.map(review => (
                                <div key={review.id} className="border-b border-gray-200 pb-4">
                                    <div className="flex items-center mb-2">
                                        <span className="text-gray-900">{review.userName}</span>
                                        <span className="mx-2">•</span>
                                        <span className="text-gray-600">{review.createdAt}</span>
                                    </div>
                                    <div className="mb-2">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <span key={i} className="text-yellow-400">★</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainerDashboard; 