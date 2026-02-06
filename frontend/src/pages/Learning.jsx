import python3d from '../assets/python-3d.png';
import java3d from '../assets/java-3d.png';
import { ArrowRight, Sparkles, Zap, Globe, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Learning = () => {
    const navigate = useNavigate();

    const handleLanguageSelect = (lang) => {
        const savedLevel = localStorage.getItem(`lastLevel_${lang}`);
        if (savedLevel) {
            navigate(`/learning/${lang}?level=${savedLevel}`);
        } else {
            navigate(`/learning/${lang}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden font-inter">
            {/* Ambient Background Lights */}
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow delay-1000"></div>

            <div className="relative z-10 max-w-6xl w-full">
                <div className="text-center mb-12 relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/40 text-xs font-bold text-slate-600 mb-4 shadow-sm animate-fade-in-up">
                        <Sparkles size={14} className="text-amber-500" />
                        <span>Interactive Learning Paths</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight animate-fade-in-up delay-100">
                        Master the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Future of Code</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                        Dive into immersive, AI-powered courses designed to transform you from beginner to architect. Select your weapon of choice.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 px-4">
                    {/* Python Card */}
                    <div
                        onClick={() => handleLanguageSelect('python')}
                        className="group relative h-[420px] bg-white rounded-[2rem] p-8 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)] transition-all duration-500 cursor-pointer overflow-hidden border border-slate-100 hover:border-blue-200 perspective-1000"
                    >
                        {/* 3D Floating Element */}
                        <div className="absolute -right-12 -top-12 w-64 h-64 z-0 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:translate-y-4">
                            <img src={python3d} alt="Python 3D" className="w-full h-full object-contain drop-shadow-2xl opacity-90" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col justify-end">
                            <div className="mb-auto">
                                <span className="inline-block px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-xl text-[10px] uppercase tracking-wider mb-4">
                                    AI & Data Science
                                </span>
                                <h2 className="text-3xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">Python</h2>
                                <p className="text-slate-400 font-medium text-sm">The Automation Powerhouse</p>
                            </div>

                            <div className="space-y-4">
                                <p className="text-slate-600 font-medium leading-relaxed text-sm">
                                    Unlock the power of AI, automation, and web development with the world's most versatile language.
                                </p>

                                <div className="flex gap-3">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                                        <Zap size={14} className="text-amber-500" /> Fast Track
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                                        <Globe size={14} className="text-blue-500" /> Web & AI
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/25">
                                    Start Python Path <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Java Card */}
                    <div
                        onClick={() => handleLanguageSelect('java')}
                        className="group relative h-[420px] bg-white rounded-[2rem] p-8 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(249,115,22,0.3)] transition-all duration-500 cursor-pointer overflow-hidden border border-slate-100 hover:border-orange-200 perspective-1000"
                    >
                        {/* 3D Floating Element */}
                        <div className="absolute -right-12 -top-12 w-64 h-64 z-0 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-6 group-hover:translate-y-4">
                            <img src={java3d} alt="Java 3D" className="w-full h-full object-contain drop-shadow-2xl opacity-90" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col justify-end">
                            <div className="mb-auto">
                                <span className="inline-block px-3 py-1.5 bg-orange-50 text-orange-700 font-bold rounded-xl text-[10px] uppercase tracking-wider mb-4">
                                    Enterprise Systems
                                </span>
                                <h2 className="text-3xl font-black text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">Java</h2>
                                <p className="text-slate-400 font-medium text-sm">The scalable backend king</p>
                            </div>

                            <div className="space-y-4">
                                <p className="text-slate-600 font-medium leading-relaxed text-sm">
                                    Build robust, scalable applications used by Fortune 500 companies. Master object-oriented design.
                                </p>

                                <div className="flex gap-3">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                                        <Layers size={14} className="text-orange-500" /> Robust
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                                        <Globe size={14} className="text-purple-500" /> Backend
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 group-hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/25">
                                    Start Java Path <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Learning;
