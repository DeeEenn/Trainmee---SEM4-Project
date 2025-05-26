import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/api';

const TrainerConversations = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            loadMessages(selectedUser.id);
        }
    }, [selectedUser]);

    const loadConversations = async () => {
        try {
            setLoading(true);
            const data = await trainerService.getConversations();
            setConversations(data);
        } catch (err) {
            setError('Unable to load conversations');
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (userId) => {
        try {
            const data = await trainerService.getMessages(userId);
            setMessages(data);
        } catch (err) {
            setError('Unable to load messages');
        }
    };

    const handleMessageSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;
        
        try {
            await trainerService.sendMessage(selectedUser.id, { content: newMessage });
            setNewMessage('');
            loadMessages(selectedUser.id);
        } catch (err) {
            setError('Unable to send message');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-light mb-8">Conversations</h2>
            
            <div className="flex gap-8">
                <div className="w-1/3">
                    <div className="space-y-4">
                        {conversations.map(conversation => (
                            <div
                                key={conversation.user.id}
                                className={`p-4 border rounded cursor-pointer hover:bg-gray-50 ${
                                    selectedUser?.id === conversation.user.id ? 'bg-gray-50' : ''
                                }`}
                                onClick={() => setSelectedUser(conversation.user)}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">{conversation.user.name} {conversation.user.surname}</h3>
                                        <p className="text-sm text-gray-600">{conversation.lastMessage?.content || 'No messages'}</p>
                                    </div>
                                    {conversation.unreadCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {conversation.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-2/3">
                    {selectedUser ? (
                        <>
                            <div className="mb-4">
                                <h3 className="text-lg font-medium">
                                    Conversation with {selectedUser.name} {selectedUser.surname}
                                </h3>
                            </div>

                            <div className="space-y-4 mb-8 max-h-[500px] overflow-y-auto">
                                {messages.map(message => (
                                    <div
                                        key={message.id}
                                        className={`p-4 rounded-lg max-w-[80%] ${
                                            message.sender.id === selectedUser.id
                                                ? 'bg-gray-100 ml-auto'
                                                : 'bg-gray-900 text-white'
                                        }`}
                                    >
                                        <div className="text-sm mb-1">
                                            {message.sender.name} {message.sender.surname}
                                        </div>
                                        <div>{message.content}</div>
                                        <div className="text-xs mt-1 opacity-70">
                                            {message.createdAt}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleMessageSubmit}>
                                <div className="flex gap-4">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded"
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
                        </>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            Select a conversation to view messages
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainerConversations; 