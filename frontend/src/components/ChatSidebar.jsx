import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../api/axios';

const ChatSidebar = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Hello! I am your AI coding assistant. How can I help you evolve your code today?' }
    ]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get("/chat");
                if (response.data && Array.isArray(response.data)) {
                    // Map backend history to frontend format
                    const history = response.data.map(msg => ({
                        id: msg.id || Date.now(), // Fallback if id missing
                        sender: msg.sender,
                        text: msg.text
                    }));
                    // Prepend history or replace? 
                    // Usually replace, but keep the welcome message?
                    // If history exists, maybe replace the welcome message.
                    if (history.length > 0) {
                        setMessages(history);
                    }
                }
            } catch (error) {
                console.error("Failed to load chat history:", error);
            }
        };

        fetchHistory();
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        try {
            const response = await api.post("/chat", { message: userMsg.text });

            if (response.data) {
                const aiMsg = { id: Date.now() + 1, sender: 'ai', text: response.data.response };
                setMessages(prev => [...prev, aiMsg]);
            }
        } catch (error) {
            if (error.response && error.response.status === 429) {
                const aiMsg = {
                    id: Date.now() + 1,
                    sender: 'ai',
                    text: "🛑 **Quota Exceeded**\n\nYou have reached your daily AI usage limit. Please try again tomorrow or upgrade your plan."
                };
                setMessages(prev => [...prev, aiMsg]);
            } else {
                const errorMessage = error.response?.data?.detail || "Error: Could not reach AI.";
                const aiMsg = { id: Date.now() + 1, sender: 'ai', text: `⚠️ ${errorMessage}` };
                setMessages(prev => [...prev, aiMsg]);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <aside className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shadow-2xl z-30 transform transition-all duration-300 ease-in-out">
            <div className="p-3 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <span className="bg-blue-100 p-1 rounded-lg text-blue-600">⚡</span>
                    <span>AI Assistant</span>
                </h2>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-gray-50 scroll-smooth">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[90%] rounded-xl p-3 text-xs leading-relaxed shadow-sm ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none ring-1 ring-black/5'
                                }`}
                        >
                            {msg.sender === 'ai' ? (
                                <div className="prose prose-xs max-w-none prose-p:my-1 prose-pre:my-2 prose-pre:bg-gray-800 prose-pre:text-white prose-code:text-blue-600">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                msg.text
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 border-t border-gray-100 bg-white">
                <div className="flex gap-2 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask anything..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default ChatSidebar;
