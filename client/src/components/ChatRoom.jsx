import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { FiSend } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { Card, Input, Button } from './ui';

const ChatRoom = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Polling every 3s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const { data } = await api.get('/chat');
            // Check if new messages to avoid unnecessary re-renders/scrolls if possible, 
            // but for simple polling we just set state.
            // Optimization: Only update if length changes or last ID changes
            setMessages(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await api.post('/chat', { message: newMessage });
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card className="h-[600px] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-indigo-50 dark:bg-gray-800 rounded-t-lg">
                <h2 className="font-bold text-lg text-indigo-900 dark:text-white">Team Chat Room</h2>
                <span className="text-xs text-indigo-600 dark:text-indigo-400">Live</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                {messages.map((msg) => (
                    <div key={msg._id} className={`flex ${msg.user._id === user._id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-lg p-3 ${msg.user._id === user._id
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                            }`}>
                            <div className="flex justify-between items-baseline gap-2 mb-1">
                                <span className={`text-xs font-bold ${msg.user._id === user._id ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                    {msg.user.name}
                                </span>
                                <span className={`text-[10px] ${msg.user._id === user._id ? 'text-indigo-300' : 'text-gray-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm">{msg.message}</p>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t bg-white dark:bg-gray-800 rounded-b-lg flex gap-2">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                    <FiSend />
                </Button>
            </form>
        </Card>
    );
};

export default ChatRoom;
