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
    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

            // Loading conversations
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
            // Loading conversations between trainer and selected user 
            const messagesResponse = await trainerService.getMessages(conversation.senderId);
            if (messagesResponse?.data) {
                setMessages(messagesResponse.data);
            }
        } catch (err) {
            console.error('Error loading messages:', err);
            setError('Unable to load messages');
        }
    };

    const handleSendMessage = async (content) => {
        if (!selectedConversation) return;

        try {
            await trainerService.sendMessage(selectedConversation.senderId, { content });
            // Reload messages after sending
            const messagesResponse = await trainerService.getMessages(selectedConversation.senderId);
            if (messagesResponse?.data) {
                setMessages(messagesResponse.data);
            }
            // Update conversations list
            const conversationsResponse = await trainerService.getConversations();
            setConversations(conversationsResponse.data || []);
        } catch (err) {
            setError('Unable to send message');
        }
    };

    // Adding use Effect for automatic loading of messages and conversations
    useEffect(() => {
        if (selectedConversation && trainer) {
            const interval = setInterval(async () => {
                try {
                    // Loading new messages
                    const messagesResponse = await trainerService.getMessages(selectedConversation.senderId);
                    if (messagesResponse?.data) {
                        setMessages(messagesResponse.data);
                    }
                    // Loading updated conversations
                    const conversationsResponse = await trainerService.getConversations();
                    setConversations(conversationsResponse.data || []);
                } catch (err) {
                    console.error('Error refreshing messages:', err);
                }
            }, 5000); // Update every 5 seconds

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
                                    description: trainer.description
                                });
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">Description</label>
                                        <textarea
                                            value={trainer.description || ''}
                                            onChange={(e) => setTrainer({ ...trainer, description: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:border-gray-900 focus:outline-none bg-transparent"
                                            rows="4"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-900"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <h2 className="text-xl font-light text-gray-900">Profile</h2>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                                        >
                                            Edit profile
                                        </button>
                                    </div>
                                    <div className="border-l-4 border-gray-300 pl-6">
                                        <h3 className="text-xl font-light text-gray-900 mb-4">About the trainer</h3>
                                        <p className="text-gray-600">{trainer.description || 'No description available.'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'conversations' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 space-y-4">
                            <h2 className="text-xl font-light text-gray-900 mb-4">Conversations</h2>
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
                                                    {conversation.unreadCount} new
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

                        <div className="md:col-span-2">
                            {selectedConversation ? (
                                <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col h-[600px]">
                                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                                        <h3 className="text-lg font-light text-gray-900">
                                            {selectedConversation.senderName}
                                        </h3>
                                    </div>
                                    <div className="flex-1 overflow-hidden flex flex-col">
                                        <div className="flex-1 overflow-y-auto p-4" id="messages-container">
                                            <div className="space-y-4">
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
                                                <div ref={messagesEndRef} />
                                            </div>
                                        </div>

                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSendMessage(newMessage);
                                            setNewMessage('');
                                        }} className="p-4 border-t border-gray-200 bg-white">
                                            <div className="flex gap-4">
                                                <textarea
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded resize-none"
                                                    rows="3"
                                                    placeholder="Type your message..."
                                                />
                                                <button
                                                    type="submit"
                                                    className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 self-end"
                                                    disabled={!newMessage.trim()}
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[600px] flex items-center justify-center text-gray-500 border border-gray-200 rounded-lg">
                                    Select a conversation to view the chat
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="space-y-8">
                        <h2 className="text-xl font-light text-gray-900">Reviews</h2>
                        <div className="space-y-4">
                            {reviews.map(review => (
                                <div key={review.id} className="border-b border-gray-200 pb-4">
                                    <div className="flex items-center mb-2">
                                        <span className="text-gray-900">{review.userName}</span>
                                        <span className="mx-2">•</span>
                                        <span className="text-gray-600">
                                            {new Date(review.createdAt).toLocaleDateString('cs-CZ')}
                                        </span>
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