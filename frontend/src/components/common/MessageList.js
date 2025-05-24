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
    const messagesEndRef = useRef(null);

    // Aktualizace lokálních zpráv při změně prop messages
    useEffect(() => {
        setLocalMessages(messages);
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            // Přidáme zprávu lokálně pro okamžité zobrazení
            const tempMessage = {
                id: Date.now(), // Dočasné ID
                content: newMessage,
                senderId: currentUserId,
                senderName: 'Vy', // Dočasné jméno
                createdAt: new Date().toISOString(),
                read: false
            };
            setLocalMessages(prev => [...prev, tempMessage]);
            setNewMessage('');
            scrollToBottom();

            // Odešleme zprávu na server
            await onSendMessage(newMessage);
        } catch (error) {
            console.error('Error sending message:', error);
            // V případě chyby odstraníme dočasnou zprávu
            setLocalMessages(prev => prev.filter(m => m.id !== Date.now()));
        }
    };

    // Automatické načítání zpráv
    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                // Zde by se mělo volat načtení nových zpráv
                // Toto je jen placeholder, protože načítání je řízeno z rodičovské komponenty
            }, refreshInterval);

            return () => clearInterval(interval);
        }
    }, [autoRefresh, refreshInterval]);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-light text-gray-900">
                    {otherUserName}
                </h3>
            </div>
            <div className="p-4">
                <div className="space-y-4 max-h-[500px] overflow-y-auto mb-4">
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
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="mt-4">
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
    );
};

export default MessageList; 