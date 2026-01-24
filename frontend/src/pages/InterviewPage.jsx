import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, User, Bot, Play, XCircle, Sparkles, Mic, Monitor, Code2, Users, BrainCircuit } from 'lucide-react';
import api from '../api/axios';
import remarkGfm from 'remark-gfm';

const TOPICS = [
    { id: 'Python', icon: <Code2 />, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { id: 'Java', icon: <Monitor />, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'Data Structures', icon: <BrainCircuit />, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'System Design', icon: <Monitor />, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'Behavioral', icon: <Users />, color: 'text-green-500', bg: 'bg-green-50' },
];

const InterviewPage = () => {
    // Mode: 'setup' | 'session'
    const [mode, setMode] = useState('setup');

    // Setup State
    const [topic, setTopic] = useState('Python');
    const [difficulty, setDifficulty] = useState('Junior');
    const [loading, setLoading] = useState(false);

    // Session State
    const [sessionId, setSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false); // Fake typing indicator
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleStart = async () => {
        setLoading(true);
        try {
            const res = await api.post('/interview/start', { topic, difficulty });
            setSessionId(res.data.session_id);
            setMessages([
                { id: Date.now(), role: 'assistant', content: res.data.message }
            ]);
            setMode('session');
        } catch (err) {
            console.error("Failed to start interview", err);
            alert("Failed to start interview. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            const res = await api.post('/interview/chat', { session_id: sessionId, message: userMsg });
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: res.data.message }]);
        } catch (err) {
            console.error("Failed to send message", err);
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: "⚠️ Connection Error: Please try again." }]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleEndSession = () => {
        if (window.confirm("Are you sure you want to end the interview?")) {
            setMode('setup');
            setMessages([]);
            setSessionId(null);
        }
    };

    if (mode === 'setup') {
        return (
            <div className="min-h-full flex flex-col items-center justify-center p-4 lg:p-10 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-400/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                <header className="text-center space-y-3 mb-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm text-xs font-bold text-slate-600 mb-2 animate-fade-in-up">
                        <Sparkles size={14} className="text-blue-500" />
                        <span>Powered by Gemini AI</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        Master Your Next<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Technical Interview</span>
                    </h1>
                    <p className="text-base text-slate-600 max-w-xl mx-auto font-medium">
                        Practice real-time coding and behavioral questions with an AI interviewer that adapts to your level.
                    </p>
                </header>

                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                    {/* Left Col: Topic Selection */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-slate-200/50 flex flex-col">
                        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">1</span>
                            Choose Topic
                        </h3>
                        <div className="grid grid-cols-1 gap-2.5 flex-1">
                            {TOPICS.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTopic(t.id)}
                                    className={`relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 group text-left ${topic === t.id
                                        ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500/20'
                                        : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.bg} ${t.color}`}>
                                        {t.icon}
                                    </div>
                                    <span className={`font-bold text-sm ${topic === t.id ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{t.id}</span>
                                    {topic === t.id && (
                                        <div className="absolute right-4 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Col: Difficulty & Start */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-slate-200/50">
                            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">2</span>
                                Select Level
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {['Junior', 'Mid-Level', 'Senior'].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setDifficulty(level)}
                                        className={`py-3 px-2 rounded-xl border-2 font-bold text-xs transition-all duration-200 ${difficulty === level
                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                                            : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300 hover:scale-105'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-2xl text-white flex flex-col justify-between flex-1 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors"></div>

                            <div>
                                <h3 className="text-xl font-black mb-2">Ready to Start?</h3>
                                <p className="text-slate-400 font-medium text-xs leading-relaxed">
                                    You are about to start a <strong>{difficulty}</strong> level interview on <strong>{topic}</strong>.
                                    Ensure you have a stable connection and are ready to type code.
                                </p>
                            </div>

                            <button
                                onClick={handleStart}
                                disabled={loading}
                                className="mt-6 w-full bg-white text-slate-900 hover:bg-blue-50 p-3 rounded-xl font-black text-base shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin h-4 w-4 border-2 border-slate-900 border-t-transparent rounded-full"></span>
                                        Connecting...
                                    </span>
                                ) : (
                                    <>
                                        <Play fill="currentColor" size={18} /> Begin Interview
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] lg:h-full max-w-5xl mx-auto lg:p-4 p-2">
            <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[1.5rem] shadow-2xl overflow-hidden border border-white/50 flex flex-col relative ring-1 ring-black/5">

                {/* Header */}
                <div className="bg-white/90 backdrop-blur border-b border-gray-100 px-5 py-3 flex items-center justify-between shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                                <Bot size={20} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h2 className="text-slate-900 font-black text-base leading-tight">AI Interviewer</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">{topic}</span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">{difficulty}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleEndSession}
                        className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all font-bold text-xs"
                        title="End Session"
                    >
                        <span>End Session</span>
                        <XCircle size={16} className="group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 bg-gradient-to-b from-slate-50/50 to-white relative scroll-smooth">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 lg:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start animate-fade-in-up`}
                        >
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm text-xs font-bold ring-2 ring-white ${msg.role === 'user'
                                ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-blue-500/20'
                                : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/20'
                                }`}>
                                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>

                            {/* Bubble */}
                            <div className={`max-w-[85%] lg:max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-sm shadow-blue-500/10'
                                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-xl shadow-slate-200/40'
                                }`}>
                                <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert prose-p:text-blue-50' : 'prose-p:text-slate-600 prose-headings:text-slate-800'}`}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex gap-3 lg:gap-4 flex-row items-start animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 ring-2 ring-white">
                                <Bot size={14} className="text-slate-400" />
                            </div>
                            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100 shrink-0 z-10">
                    <div className="relative max-w-4xl mx-auto flex gap-3 items-end">
                        <div className="flex-1 bg-slate-50 border border-slate-200 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all rounded-[1.25rem] overflow-hidden shadow-inner">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type your answer here..."
                                className="w-full bg-transparent border-none px-5 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-0 resize-none h-[56px] custom-scrollbar focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="h-[56px] w-[56px] bg-slate-900 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center active:scale-90 group"
                        >
                            <Send size={20} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                    <div className="text-center mt-2.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Press Enter to send • Shift + Enter for new line
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewPage;
