import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import welcomeImage from '../assets/welcome-3d.png';
import trophy3d from '../assets/stat-trophy-3d.png';
import fire3d from '../assets/stat-fire-3d.png';
import globe3d from '../assets/stat-globe-3d.png';
import lightning3d from '../assets/stat-lightning-3d.png';

const Home = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await api.get('/learning/dashboard/summary');
                setSummary(res.data);
            } catch (err) {
                console.error(err);
                // Fallback mock data if backend fails
                setSummary({
                    user_name: 'Learner',
                    progress_percent: 15,
                    current_topic: 'Python Basics',
                    selected_language: 'Python'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    // Dynamic Stats
    const stats = [
        { label: 'Topics Mastered', value: '12', image: trophy3d, barColor: 'bg-yellow-400' }, // Mock
        { label: 'Current Streak', value: `${summary?.streak || 0}`, image: fire3d, barColor: 'bg-orange-500' },
        { label: 'Current Rank', value: summary?.rank || 'Novice', image: globe3d, barColor: 'bg-blue-500' },
        { label: 'Total XP', value: `${summary?.xp || 0}`, image: lightning3d, barColor: 'bg-purple-500' },
    ];

    const activities = [
        { title: 'Completed "Python Basics"', time: '2 hours ago', icon: '✅', color: 'bg-green-500' },
        { title: 'Scored 100% in Quiz', time: 'Yesterday', icon: '🎯', color: 'bg-blue-500' },
        { title: 'Started "Java Stream API"', time: '2 days ago', icon: '🚀', color: 'bg-purple-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-inter">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Hero Section */}
                {/* Hero Section */}
                <header className="relative bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[280px]">
                    <div className="relative z-10 max-w-2xl text-white">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
                            <span>✨</span> Welcome Back
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight leading-tight">
                            Ready to level up, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200 filter drop-shadow-lg">
                                {summary.user_name}?
                            </span>
                        </h1>
                        <p className="text-sm md:text-base text-indigo-100 mb-6 font-medium max-w-lg leading-relaxed mix-blend-plus-lighter">
                            "The only way to learn a new programming language is by writing programs in it."
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate(`/learning/${summary.selected_language.toLowerCase()}`)}
                                className="bg-white text-indigo-600 hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-black text-sm transition-all shadow-xl shadow-indigo-900/30 hover:-translate-y-1 flex items-center gap-2 group"
                            >
                                Continue Learning {summary.selected_language}
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    </div>

                    {/* 3D Illustration */}
                    <div className="relative z-10 hidden md:block w-[350px] h-[350px] -mr-12 -my-16 perspective-1000">
                        <img
                            src={welcomeImage}
                            alt="3D Programmer"
                            className="w-full h-full object-contain drop-shadow-2xl animate-float transform hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white rounded-full blur-[100px] -mr-16 -mt-16 opacity-20 mix-blend-overlay"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500 rounded-full blur-[100px] -ml-16 -mb-16 opacity-40 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>
                </header>

                {/* Dynamic Stats Section */}
                <section>
                    <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2 animate-fade-in-up">
                        <span className="text-2xl">📊</span> Your Stats
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {stats.map((stat, idx) => (
                            <div
                                key={idx}
                                className="group relative bg-white h-[180px] rounded-[1.5rem] p-5 shadow-xl hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col justify-end items-start hover:-translate-y-2"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Animated 3D Icon Background */}
                                <div className={`absolute top-0 right-0 w-32 h-32 transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-[15deg] group-hover:translate-x-4 animate-float ${idx % 2 === 0 ? 'animation-delay-0' : 'animation-delay-2000'}`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent blur-xl rounded-full"></div>
                                    <img src={stat.image} alt={stat.label} className="w-full h-full object-contain drop-shadow-2xl" />
                                </div>

                                {/* Content */}
                                <div className="relative z-10 w-full">
                                    <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight group-hover:text-blue-600 transition-colors">
                                        {stat.value}
                                    </div>
                                    <div className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        {stat.label}
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div className={`h-full ${stat.barColor} group-hover:w-full w-1/3 transition-all duration-1000 ease-out rounded-full`}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
                    {/* Activity Feed - Glassmorphism */}
                    <section className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-[1.5rem] p-6 md:p-6 border border-white/50 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                        <div className="flex items-center justify-between mb-5 relative z-10">
                            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                <span className="text-xl">⚡</span> Recent Activity
                            </h2>
                            <button className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">View All</button>
                        </div>

                        <div className="space-y-5 relative z-10 pl-4">
                            {/* Timeline Line */}
                            <div className="absolute left-[35px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-blue-100 via-slate-100 to-transparent"></div>

                            {activities.map((item, idx) => (
                                <div key={idx} className="relative flex items-center gap-5 group">
                                    <div className={`
                                        relative z-10 w-10 h-10 rounded-xl flex items-center justify-center text-base shadow-lg shadow-blue-500/10 
                                        ${item.color} text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ring-4 ring-white
                                    `}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 bg-white p-3 rounded-xl border border-slate-50 group-hover:border-blue-100 group-hover:bg-blue-50/50 transition-all shadow-sm group-hover:shadow-md">
                                        <h3 className="font-bold text-slate-900 mb-0.5 text-sm">{item.title}</h3>
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Daily Challenge - Cyberpunk/Neon Style */}
                    <section className="relative h-full min-h-[300px] rounded-[1.5rem] p-6 md:p-6 shadow-2xl flex flex-col justify-between overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                        {/* Dynamic Background */}
                        <div className="absolute inset-0 bg-slate-900">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-slate-900 opacity-90"></div>
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full blur-[100px] animate-pulse-glow"></div>
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-500 rounded-full blur-[100px] animate-pulse-glow animation-delay-2000"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-lg">
                                    <span className="animate-pulse relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Daily Challenge</span>
                                </div>
                                <span className="text-xl shake-animation">🔥</span>
                            </div>

                            <h3 className="text-xl font-black text-white mb-2 leading-tight">
                                Reverse a <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-pink-200">Linked List</span>
                            </h3>

                            <p className="text-indigo-100/80 text-xs font-medium leading-relaxed mb-4">
                                Can you implement an algorithm to reverse a singly linked list in O(n) time?
                            </p>
                        </div>

                        <div className="relative z-10 glass-panel bg-white/10 border-white/10 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <div className="text-[10px] text-indigo-200 font-bold uppercase mb-0.5">Reward</div>
                                    <div className="text-base font-black text-white flex items-center gap-1">
                                        <span className="text-yellow-400">⚡</span> 50 XP
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-indigo-200 font-bold uppercase mb-0.5">Difficulty</div>
                                    <div className="text-[10px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-lg">Medium</div>
                                </div>
                            </div>

                            <button className="w-full py-2.5 bg-white text-slate-900 rounded-lg font-black text-sm hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10 flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-[0.98]">
                                Accept Challenge
                            </button>
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
};

export default Home;
