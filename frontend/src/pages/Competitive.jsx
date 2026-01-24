import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Zap, Code, Swords, Users, Clock, Target, ArrowRight, Plus, Star } from 'lucide-react';

const Competitive = () => {
    const navigate = useNavigate();

    // Mock Data
    const userInfo = {
        rank: 1240,
        elo: 1450,
        league: "Silver II",
        wins: 45,
        streak: 3
    };

    const contests = [
        { id: 1, title: "Weekly Code Clash #45", startsIn: "2h 30m", participants: 342, prize: "500 XP" },
        { id: 2, title: "Algorithm Sprint", startsIn: "1d 12h", participants: 128, prize: "Badge" },
        { id: 3, title: "Debugging Championship", startsIn: "3d 05h", participants: 890, prize: "Premium" },
    ];

    const activeBattles = [
        { id: 101, title: "Array Manipulation", difficulty: "Medium", language: "Python", players: "1/2" },
        { id: 102, title: "Dynamic Programming Basics", difficulty: "Hard", language: "Java", players: "0/2" },
    ];

    const leaderboard = [
        { rank: 1, user: "CodeMaster99", elo: 2450, change: "+12" },
        { rank: 2, user: "AlgoQueen", elo: 2410, change: "+5" },
        { rank: 3, user: "BugHunter", elo: 2380, change: "-2" },
        { rank: 4, user: "DevNinja", elo: 2350, change: "+20" },
        { rank: 5, user: "SystemShock", elo: 2310, change: "+0" },
    ];

    const problems = [
        { id: 201, title: "Two Sum", difficulty: "Easy", acceptance: "95%", tags: ["Array", "Hash Table"], url: "https://leetcode.com/problems/two-sum/" },
        { id: 202, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", acceptance: "76%", tags: ["String", "Sliding Window"], url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
        { id: 203, title: "Median of Two Sorted Arrays", difficulty: "Hard", acceptance: "42%", tags: ["Binary Search"], url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
    ];

    const getDifficultyColor = (diff) => {
        if (diff === "Easy") return "text-emerald-600 bg-emerald-50 border-emerald-200";
        if (diff === "Medium") return "text-amber-600 bg-amber-50 border-amber-200";
        return "text-rose-600 bg-rose-50 border-rose-200";
    };

    return (
        <div className="p-3 md:p-6 max-w-6xl mx-auto font-inter space-y-8">
            {/* Header & Stats */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Competitive Arena</h1>
                    <p className="text-slate-500 font-medium text-base">Test your skills against the world's best.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-5 py-3 rounded-xl shadow-lg shadow-blue-900/5 border border-slate-100 flex items-center gap-3 hover:-translate-y-1 transition-transform cursor-default">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                            <Trophy size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Rank</div>
                            <div className="text-xl font-black text-slate-900">#{userInfo.rank}</div>
                        </div>
                    </div>
                    <div className="bg-white px-5 py-3 rounded-xl shadow-lg shadow-blue-900/5 border border-slate-100 flex items-center gap-3 hover:-translate-y-1 transition-transform cursor-default">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                            <Zap size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">ELO Rating</div>
                            <div className="text-xl font-black text-slate-900">{userInfo.elo}</div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Contests & active battles */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Featured Contest */}
                    <section className="relative overflow-hidden bg-slate-900 rounded-[1.5rem] p-6 md:p-8 text-white shadow-2xl group cursor-pointer hover:shadow-indigo-500/20 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700 opacity-90 transition-opacity group-hover:opacity-100"></div>
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl opacity-50"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/30 rounded-full -ml-16 -mb-16 blur-3xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 h-full">
                            <div className="space-y-3 max-w-lg">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold border border-white/20 text-indigo-100">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-200 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-400"></span>
                                    </span>
                                    NEXT MAJOR EVENT
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight">{contests[0].title}</h2>
                                <p className="text-indigo-100/80 font-medium text-sm md:text-base">Compete for <span className="text-white font-bold">{contests[0].prize}</span> and eternal glory on the leaderboard.</p>

                                <div className="flex flex-wrap items-center gap-4 pt-1">
                                    <div className="flex items-center gap-2 text-indigo-100 bg-white/5 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs">
                                        <Clock size={14} className="text-indigo-300" />
                                        <span className="font-bold">{contests[0].startsIn} left</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-indigo-100 bg-white/5 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs">
                                        <Users size={14} className="text-indigo-300" />
                                        <span className="font-bold">{contests[0].participants} Registered</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full md:w-auto bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-2 whitespace-nowrap text-sm">
                                Register Now <ArrowRight size={16} />
                            </button>
                        </div>
                    </section>

                    {/* Recent Problems List */}
                    <section className="bg-white rounded-[1.5rem] border border-slate-100 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                <Code size={20} className="text-blue-500" /> Practice Problems
                            </h3>
                            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">View All Problems</button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {problems.map((prob) => (
                                <div
                                    key={prob.id}
                                    onClick={() => navigate(`/competitive/problem/${prob.id}`)}
                                    className="p-4 md:p-6 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between group cursor-pointer"
                                >
                                    <div className="mb-3 md:mb-0">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{prob.title}</h4>
                                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getDifficultyColor(prob.difficulty)}`}>
                                                {prob.difficulty}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {prob.tags.map(tag => (
                                                <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200">{tag}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 md:justify-end min-w-[160px]">
                                        <div className="text-right">
                                            <div className="text-[10px] text-slate-400 font-bold uppercase mb-0">Acceptance</div>
                                            <div className="text-xs font-bold text-slate-700">{prob.acceptance}</div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors ml-auto md:ml-0">
                                            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Leaderboard & Quick Play */}
                <div className="space-y-6">
                    {/* Quick Play / Battles */}
                    <section className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Swords size={80} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2 relative z-10">
                            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><Swords size={16} /></span> Live Battles
                        </h3>

                        <div className="space-y-3 relative z-10">
                            {activeBattles.map(battle => (
                                <div key={battle.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900 text-xs">{battle.title}</h4>
                                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${getDifficultyColor(battle.difficulty)}`}>
                                            {battle.difficulty.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> {battle.language}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                                            <Users size={10} /> {battle.players}
                                        </div>
                                    </div>
                                    <button className="w-full mt-2 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Join Battle</button>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-4 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 relative z-10 text-xs">
                            <Plus size={16} /> Create Room
                        </button>
                    </section>

                    {/* Top Leaderboard */}
                    <section className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                <span className="p-1.5 bg-amber-50 text-amber-500 rounded-lg"><Trophy size={16} /></span> Top Players
                            </h3>
                            <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Weekly</span>
                        </div>
                        <div className="space-y-1">
                            {leaderboard.map((player, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-7 h-7 rounded-md flex items-center justify-center font-black text-xs relative
                                            ${idx === 0 ? 'bg-amber-100 text-amber-700' :
                                                idx === 1 ? 'bg-slate-200 text-slate-600' :
                                                    idx === 2 ? 'bg-orange-100 text-orange-800' : 'bg-transparent text-slate-400'}
                                        `}>
                                            {idx < 3 && <Star size={8} className="absolute -top-1 -right-1 fill-current" />}
                                            {player.rank}
                                        </div>
                                        <span className="font-bold text-slate-700 text-xs group-hover:text-blue-700 transition-colors">{player.user}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-slate-900 text-xs">{player.elo}</div>
                                        <div className={`text-[10px] font-bold ${player.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {player.change}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center gap-2">
                            View Full Leaderboard <ArrowRight size={12} />
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Competitive;
