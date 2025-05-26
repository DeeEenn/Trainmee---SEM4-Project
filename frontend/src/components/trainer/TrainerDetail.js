import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { trainerService } from '../../services/api';
import MessageList from '../common/MessageList';

const TrainerDetail = () => {
    const { id } = useParams();
    const [trainer, setTrainer] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('profile');
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [reviewError, setReviewError] = useState('');
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        loadTrainerData();
    }, [id]);

    // Adding useEffect for automatic loading of messages
    useEffect(() => {
        if (activeTab === 'messages' && trainer) {
            const interval = setInterval(async () => {
                try {
                    const messagesResponse = await trainerService.getMessages(id);
                    const messagesData = messagesResponse?.data || [];
                    setMessages(Array.isArray(messagesData) ? messagesData : []);
                    
                    // Counting unread messages
                    const unread = messagesData.filter(m => !m.read && m.sender.id === trainer.id).length;
                    setUnreadCount(unread);
                } catch (err) {
                    console.error('Error refreshing messages:', err);
                }
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [activeTab, trainer, id]);

    const loadTrainerData = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Loading trainer
            const trainerResponse = await trainerService.getById(id);
            if (!trainerResponse?.data) {
                throw new Error('Trainer data not found');
            }
            setTrainer(trainerResponse.data);
            
            // Loading reviews
            try {
                const reviewsResponse = await trainerService.getReviews(id);
                setReviews(reviewsResponse?.data || []);
            } catch (err) {
                console.error('Error loading reviews:', err);
                setReviews([]);
            }
            
            // Loading messages
            try {
                const messagesResponse = await trainerService.getMessages(id);
                const messagesData = messagesResponse?.data || [];
                setMessages(Array.isArray(messagesData) ? messagesData : []);
                
                // Counting unread messages
                const unread = messagesData.filter(m => !m.read && m.sender.id === trainerResponse.data.id).length;
                setUnreadCount(unread);
            } catch (err) { 
                console.error('Error loading messages:', err);
                setMessages([]);
                setUnreadCount(0);
            }
        } catch (err) {
            console.error('Error loading trainer data:', err);
            setError(err.response?.data?.message || 'Failed to load trainer data');
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewError('');
        
        if (!newReview.comment.trim()) {
            setReviewError('Please fill in the comment');
            return;
        }

        try {
            await trainerService.addReview(id, newReview);
            setNewReview({ rating: 5, comment: '' });
            await loadTrainerData();
        } catch (err) {
            console.error('Error adding review:', err);
            setReviewError(err.response?.data?.message || 'Failed to add review');
        }
    };

    const handleSendMessage = async (content) => {
        try {
            await trainerService.sendMessage(id, { content });
            const messagesResponse = await trainerService.getMessages(id);
            setMessages(messagesResponse?.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
    if (!trainer) return <div className="text-center py-8">Trainer not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex space-x-4 mb-8">
                <button
                    className={`px-4 py-2 ${activeTab === 'profile' ? 'border-b-2 border-gray-900' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'reviews' ? 'border-b-2 border-gray-900' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'messages' ? 'border-b-2 border-gray-900' : ''} relative`}
                    onClick={() => setActiveTab('messages')}
                >
                    Messages
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </div>

            {activeTab === 'profile' && (
                <div className="max-w-2xl">
                    <h2 className="text-2xl font-light mb-4">{trainer.name} {trainer.surname}</h2>
                    <p className="text-gray-600 mb-4">{trainer.email}</p>
                    {trainer.description && (
                        <p className="text-gray-600">{trainer.description}</p>
                    )}
                </div>
            )}

            {activeTab === 'reviews' && (
                <div className="max-w-2xl">
                    <h2 className="text-2xl font-light mb-4">Reviews</h2>
                    {!reviews.some(review => review.userId === currentUserId) && (
                        <form onSubmit={handleReviewSubmit} className="mb-8">
                            {reviewError && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded">
                                    {reviewError}
                                </div>
                            )}
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 mb-2">Rating</label>
                                <select
                                    value={newReview.rating}
                                    onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                >
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <option key={rating} value={rating}>{rating} stars</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 mb-2">Comment</label>
                                <textarea
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                    rows="4"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-800"
                            >
                                Add Review
                            </button>
                        </form>
                    )}

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

            {activeTab === 'messages' && (
                <div className="max-w-2xl">
                    <MessageList
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        currentUserId={currentUserId}
                        otherUserName={`${trainer.name} ${trainer.surname}`}
                        autoRefresh={true}
                        refreshInterval={5000}
                    />
                </div>
            )}
        </div>
    );
};

export default TrainerDetail; 