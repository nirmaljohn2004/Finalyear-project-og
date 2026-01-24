import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, GraduationCap, Trophy, User, LogOut, MessageSquare, Menu, X, ChevronRight, Code2, Sparkles, Mic } from 'lucide-react';
import { getMe } from '../api/auth';
import ChatSidebar from './ChatSidebar';
import logo from '../assets/logo.png';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mobile toggle

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getMe();
                setUser(userData);
            } catch (err) {
                console.error("Failed to fetch user in layout", err);
            }
        };
        fetchUser();
    }, [location.pathname]); // Re-fetch when path changes to keep sidebar updated

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Home', icon: <Home size={20} /> },
        { path: '/learning', label: 'My Learning', icon: <GraduationCap size={20} /> },
        { path: '/competitive', label: 'Competitive', icon: <Trophy size={20} /> },
        { path: '/interview', label: 'Mock Interview', icon: <Mic size={20} /> },
        { path: '/profile', label: 'Profile', icon: <User size={20} /> },
    ];

    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 text-slate-900 overflow-hidden font-sans">
            {/* Mobile Sidebar Overlay */}
            {!isSidebarOpen && (
                <div className="fixed inset-0 bg-black/20 z-20 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(true)}></div>
            )}

            {/* Sidebar Left */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-30
                    w-64 bg-white/90 backdrop-blur-xl border-r border-gray-100 flex flex-col shrink-0 shadow-2xl lg:shadow-none
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo Area */}
                <div className="p-6 flex items-center justify-center">
                    <img src={logo} alt="EvoCode Logo" className="h-20 w-auto object-contain" />
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto py-3 custom-scrollbar">
                    <p className="px-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 ml-1">Menu</p>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold group relative overflow-hidden
                                    ${isActive
                                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }
                                `}
                            >
                                <span className={`transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                    {item.icon}
                                </span>
                                <span className="relative z-10 text-sm">{item.label}</span>
                                {isActive && (
                                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom User Section */}
                <div className="p-3 border-t border-gray-100 bg-gray-50/50 backdrop-blur-sm">
                    {user && (
                        <div className="flex items-center gap-3 mb-3 px-2 p-2 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-gray-100 hover:shadow-sm cursor-pointer group">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white group-hover:scale-105 transition-transform text-sm">
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">{user.name}</p>
                                <div className="flex items-center gap-3 text-[10px] font-bold mt-0.5">
                                    <span className="text-orange-500 flex items-center gap-1" title="Daily Streak">🔥 {user.streak_count || 0}</span>
                                    <span className="text-amber-600 flex items-center gap-1" title="Total XP">⚡ {user.xp || 0} XP</span>
                                </div>
                            </div>
                            <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-200 hover:border-red-100 bg-white hover:shadow-sm"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                    <p className="text-center text-[10px] text-slate-300 mt-3 font-mono">v1.0.2 • Beta</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-[#F8FAFC] relative flex flex-col h-screen">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-20">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <span className="font-bold text-lg text-slate-900">evoCode</span>
                    <div className="w-10"></div> {/* Spacer */}
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth custom-scrollbar">
                    <Outlet />
                </div>

                {/* Floating AI Chat Toggle */}
                {!isChatOpen && (
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="absolute right-6 bottom-6 md:right-8 md:bottom-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all z-20 group ring-4 ring-white/50"
                        title="Open AI Chat"
                    >
                        <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="absolute right-0 top-0 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                    </button>
                )}
            </main>

            {/* Sidebar Right (Chat) */}
            {isChatOpen && (
                <ChatSidebar onClose={() => setIsChatOpen(false)} />
            )}
        </div>
    );
};

export default DashboardLayout;
