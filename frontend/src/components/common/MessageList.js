import React, { useState, useEffect, useRef } from 'react';

const MessageList = ({ 
    messages, 
    onSendMessage, 
    currentUserId,
    otherUserName,
    autoRefresh = true,
    refreshInterval = 10000 
}) => {
    const [newMessage, setNewMessage] = useState('');
    const [localMessages, setLocalMessages] = useState([]);
    const messagesContainerRef = useRef(null);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

    // Updating local messages when messages prop changes   
    useEffect(() => {
        const wasAtBottom = isAtBottom();
        setLocalMessages(messages);
        
        // If user was at the bottom or sent a new message, scroll down
        if (wasAtBottom || shouldAutoScroll) {
            setTimeout(scrollToBottom, 100);
        }
    }, [messages, shouldAutoScroll]);

    const isAtBottom = () => {
        if (!messagesContainerRef.current) return true;
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        return Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
    };

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    const handleScroll = () => {
        setShouldAutoScroll(isAtBottom());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            setShouldAutoScroll(true); // When sending a message, always scroll down
            // Add message locally for immediate display    
            const tempMessage = {
                id: Date.now(), // Temporary ID
                content: newMessage,
                senderId: currentUserId,
                senderName: 'You', // Temporary name
                createdAt: new Date().toISOString(),
                read: false
            };
            setLocalMessages(prev => [...prev, tempMessage]);
            setNewMessage('');
            scrollToBottom();

            // Send message to server
            await onSendMessage(newMessage);
        } catch (error) {
            console.error('Error sending message:', error);
            // If error, remove temporary message
            setLocalMessages(prev => prev.filter(m => m.id !== Date.now()));
        }
    };      

    // Automatic loading of messages
    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                // Here should be called loading of new messages
                // This is just a placeholder, because loading is controlled by the parent component
            }, refreshInterval);

            return () => clearInterval(interval);
        }
    }, [autoRefresh, refreshInterval]);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-light text-gray-900">
                    {otherUserName}
                </h3>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
                <div 
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-4" 
                    id="messages-container"
                    onScroll={handleScroll}
                >
                    <div className="space-y-4">
                        {localMessages.map(message => (
                            <div
                                key={message.id}
                                className={`p-4 rounded-lg max-w-[80%] ${
                                    message.senderId === currentUserId
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
                </div>

                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
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
    );
};

export default MessageList; 