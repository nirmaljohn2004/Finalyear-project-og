import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { pythonRoadmap, javaRoadmap } from '../data/roadmapData';
import { getLearningPath, resetLearningPath } from '../api/learning';
import SkillGalaxy from '../components/SkillGalaxy';
import { LayoutGrid, List, Check, Lock, Play, Star, GitBranch } from 'lucide-react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';



// --- Simple List View Component (Overview) ---
// --- Simple List View Component (Overview) ---
const SimpleListView = ({ roadmapData, language }) => {
    // Helper to render a section
    const renderSection = (title, topics, color) => (
        <div className="mb-12 relative">
            {/* Section Header */}
            <div className={`inline-block px-4 py-2 rounded-lg font-bold text-white mb-6 ${color} shadow-lg relative z-10`}>
                {title}
            </div>

            {/* Vertical Line */}
            <div className="absolute left-6 top-10 bottom-0 w-1 bg-slate-200 -z-0" />

            <div className="space-y-6">
                {topics && topics.map((topic, idx) => (
                    <div key={topic.id || idx} className="flex items-center gap-6 relative z-10 group">
                        {/* Node */}
                        <div className={`w-12 h-12 rounded-full border-4 border-slate-100 bg-white flex items-center justify-center font-bold text-slate-400 group-hover:border-slate-300 group-hover:scale-110 transition-all shadow-sm`}>
                            {idx + 1}
                        </div>

                        {/* Card */}
                        <div className="flex-1 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                            <h3 className="font-bold text-slate-900 text-lg mb-1">{topic.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2">{topic.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="w-full bg-slate-50 py-16 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Full Curriculum</h2>
                    <p className="text-slate-500 text-lg">
                        Master {language} through these three progressive levels.
                    </p>
                </div>

                {renderSection("Beginner Level", roadmapData.beginner, "bg-emerald-500")}
                {renderSection("Intermediate Level", roadmapData.intermediate, "bg-blue-500")}
                {renderSection("Expert Level", roadmapData.expert, "bg-purple-500")}
            </div>
        </div>
    );
};


const RoadmapPage = () => {
    const { language } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activeLevel, setActiveLevel] = useState(null);
    const [personalizedRoadmap, setPersonalizedRoadmap] = useState(null);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // Default to list for the new animation view
    const filterLevel = searchParams.get('level');
    const containerRef = useRef(null);

    // Save preference when filterLevel changes
    useEffect(() => {
        if (filterLevel && language) {
            localStorage.setItem(`lastLevel_${language}`, filterLevel);
        }
    }, [filterLevel, language]);

    useEffect(() => {
        let defaultRoadmap = null;
        if (language === 'python') defaultRoadmap = pythonRoadmap;
        else if (language === 'java') defaultRoadmap = javaRoadmap;

        if (!defaultRoadmap) return;

        const initialMap = JSON.parse(JSON.stringify(defaultRoadmap));
        const levels = ['beginner', 'intermediate', 'expert'];

        const fetchPaths = async () => {
            let foundLevel = null;
            let availableLevels = [];

            for (const level of levels) {
                try {
                    const pathData = await getLearningPath(language, level);
                    if (pathData && pathData.orderedTopics) {
                        initialMap[level] = pathData.orderedTopics;
                        availableLevels.push(level);
                        if (!foundLevel) foundLevel = level;
                    }
                } catch (e) {
                    // Path not generated yet, ignore
                }
            }

            // Prioritize last visited level if available
            const savedLevel = localStorage.getItem(`lastLevel_${language}`);
            if (savedLevel && availableLevels.includes(savedLevel)) {
                setActiveLevel(savedLevel);
            } else {
                setActiveLevel(foundLevel);
            }

            setPersonalizedRoadmap(initialMap);
        };

        fetchPaths();
    }, [language, filterLevel, navigate]);

    useEffect(() => {
        if (personalizedRoadmap) {
            console.log("DEBUG: Personalized Roadmap State:", personalizedRoadmap);
            console.log("DEBUG: Filter Level:", filterLevel);
        }

        // Auto-redirect if active level exists and we are on overview
        if (activeLevel && !filterLevel && !isResetting) {
            navigate(`/learning/${language}?level=${activeLevel}`, { replace: true });
        }
    }, [personalizedRoadmap, filterLevel, activeLevel, isResetting, language, navigate]);

    const handleReset = async () => {
        if (!filterLevel) return;
        setIsResetting(true);
        try {
            await resetLearningPath(language, filterLevel);
            setIsResetModalOpen(false);
            navigate(`/learning/${language}`, { replace: true });
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Failed to reset path. Please try again.");
        } finally {
            setIsResetting(false);
        }
    };

    if (!personalizedRoadmap) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const roadmap = personalizedRoadmap;

    // --- Animated Components ---

    const SectionHeader = ({ title, color, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="relative z-20 flex justify-center py-16"
        >
            <div className={`
                px-8 py-3 rounded-full text-white font-bold text-lg shadow-xl tracking-wide uppercase flex items-center gap-3
                bg-gradient-to-r ${color} backdrop-blur-md border border-white/20
            `}>
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">{index}</span>
                {title}
            </div>
        </motion.div>
    );

    const AnimatedCard = ({ topic, idx, side, isMastered, isWeak, isUnlocked }) => {
        return (
            <motion.div
                initial={{ opacity: 0, x: side === 'left' ? -50 : 50, rotate: side === 'left' ? -2 : 2 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                className={`flex w-full mb-12 relative ${side === 'left' ? 'justify-end pr-12' : 'justify-start pl-12'}`}
            >
                <div
                    onClick={() => (isUnlocked || isMastered) && navigate(`/learning/${language}/topic/${topic.id}`)}
                    className={`
                        w-full md:w-[450px] relative p-6 rounded-3xl backdrop-blur-xl border
                        transition-all duration-300 group
                        ${isMastered
                            ? 'bg-green-50/90 border-green-200 shadow-[0_8px_30px_rgb(34,197,94,0.15)] hover:shadow-[0_20px_40px_rgb(34,197,94,0.25)]'
                            : isWeak
                                ? 'bg-amber-50/90 border-amber-200 shadow-[0_8px_30px_rgb(245,158,11,0.15)] hover:shadow-[0_20px_40px_rgb(245,158,11,0.25)]'
                                : isUnlocked
                                    ? 'bg-white/90 border-blue-100 shadow-[0_8px_30px_rgb(59,130,246,0.1)] hover:shadow-[0_20px_40px_rgb(59,130,246,0.2)] hover:-translate-y-1 cursor-pointer'
                                    : 'bg-white/40 border-slate-200/60 shadow-none hover:bg-white/60 hover:border-slate-300 transition-colors cursor-not-allowed'
                        }
                    `}
                >
                    {/* Glowing border effect for unlocked */}
                    {isUnlocked && !isMastered && (
                        <div className="absolute inset-0 rounded-3xl border-2 border-blue-400/20 group-hover:border-blue-500/40 transition-colors pointer-events-none" />
                    )}

                    <div className="flex items-start justify-between mb-3">
                        <div className={`
                            w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm transition-colors
                            ${isMastered
                                ? 'bg-green-500 text-white'
                                : isWeak
                                    ? 'bg-amber-500 text-white'
                                    : isUnlocked
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-200 text-slate-400 group-hover:bg-slate-300 group-hover:text-slate-600'
                            }
                        `}>
                            {isMastered ? <Check size={20} strokeWidth={3} /> : isUnlocked ? <Play size={20} fill="currentColor" /> : <Lock size={18} />}
                        </div>
                        <span className={`text-xs font-bold tracking-wider uppercase ${isUnlocked ? 'text-slate-400' : 'text-slate-400/70'}`}>Topic {idx + 1}</span>
                    </div>

                    <h3 className={`text-xl font-extrabold mb-2 ${isMastered ? 'text-green-900' : isUnlocked ? 'text-slate-800' : 'text-slate-500/80'}`}>
                        {topic.title}
                    </h3>

                    <p className={`text-sm font-medium leading-relaxed ${isMastered ? 'text-green-700' : isUnlocked ? 'text-slate-500' : 'text-slate-400'}`}>
                        {isMastered ? 'Mastery achieved! Knowledge secured.' : isWeak ? 'Review recommended to strengthen gaps.' : isUnlocked ? 'Unlock the concepts required to proceed.' : 'Complete previous modules to unlock.'}
                    </p>

                    {/* Status Pill */}
                    {isMastered && (
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-400 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <Star size={10} fill="currentColor" /> MASTERED
                        </div>
                    )}
                </div>

                {/* Connector Line to Center */}
                <div className={`absolute top-1/2 w-12 h-[2px] ${side === 'left' ? 'right-0' : 'left-0'} 
                    ${isMastered ? 'bg-green-400' : isUnlocked ? 'bg-blue-300' : 'bg-slate-200'}
                `} />

                {/* Central Node Dot */}
                <div className={`
                    absolute top-1/2 -mt-3 w-6 h-6 rounded-full border-4 z-20 shadow-md transform transition-transform duration-500
                    ${side === 'left' ? '-right-3' : '-left-3'}
                    ${isMastered
                        ? 'bg-white border-green-500 scale-110'
                        : isUnlocked
                            ? 'bg-blue-600 border-blue-200 animate-pulse'
                            : 'bg-white border-slate-200'
                    }
                `} />
            </motion.div>
        );
    };

    const AnimatedRoadmap = ({ roadmapData }) => {
        const { scrollYProgress } = useScroll();
        const scaleY = useSpring(scrollYProgress, {
            stiffness: 100,
            damping: 30,
            restDelta: 0.001
        });

        // Helper to determine global index for side placement
        let globalIndex = 0;

        // Strict Control Flow:
        // A topic is unlocked ONLY if:
        // 1. It is already Mastered/Weak (attempted).
        // 2. OR it is the IMMEDIATE NEXT topic after the last Mastered one.
        // We track this with a flag that breaks after the first non-mastered topic.
        let isSequenceActive = true;

        const levels = [
            { id: 'beginner', title: 'Beginner Foundations', color: 'from-emerald-500 to-teal-500', number: '01' },
            { id: 'intermediate', title: 'Intermediate Concepts', color: 'from-amber-400 to-orange-500', number: '02' },
            { id: 'expert', title: 'Expert Mastery', color: 'from-rose-500 to-pink-600', number: '03' }
        ];

        return (
            <div className="relative max-w-5xl mx-auto py-10 px-4">
                {/* Central Line Background (Static) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 -ml-0.5 rounded-full" />

                {/* Central Line Progress (Animated) */}
                <motion.div
                    className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-emerald-500 via-amber-500 to-rose-500 -ml-0.5 rounded-full origin-top z-10"
                    style={{ scaleY, height: '100%' }}
                />

                <div className="relative z-20 pb-20">
                    {levels.map((level) => {
                        const topics = roadmapData[level.id] || [];
                        if (topics.length === 0) return null;

                        return (
                            <div key={level.id}>
                                <SectionHeader title={level.title} color={level.color} index={level.number} />
                                {topics.map((topic) => {
                                    const currentIndex = globalIndex++;
                                    const status = topic.status || 'NOT_ATTEMPTED';
                                    const isMastered = status === 'MASTERED';
                                    const isWeak = status === 'WEAK';

                                    // Determine topic availability based on View Mode
                                    // 1. Overview Mode (!filterLevel): ALL topics are "Locked" (Preview Only). User must start journey to interact.
                                    // 2. Personalized Mode (filterLevel): Strict sequential unlocking.

                                    let isUnlocked = false;

                                    if (!filterLevel) {
                                        // View Only Mode
                                        isUnlocked = false;
                                    } else {
                                        // Learning Mode - Strict Sequence
                                        isUnlocked = isSequenceActive;
                                        if (!isMastered && isSequenceActive) {
                                            isSequenceActive = false; // Next topics locked
                                        }
                                    }

                                    return (
                                        <AnimatedCard
                                            key={topic.id}
                                            topic={topic}
                                            idx={currentIndex}
                                            side={currentIndex % 2 === 0 ? 'left' : 'right'}
                                            isMastered={isMastered}
                                            isWeak={isWeak}
                                            isUnlocked={isUnlocked}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    };

    // --- Reset Modal ---
    const ResetConfirmationModal = () => {
        if (!isResetModalOpen) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 transform scale-100 transition-all">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">⚠️</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Reset Syllabus?</h3>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Are you sure you want to reset your personalized <strong>{filterLevel}</strong> path? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setIsResetModalOpen(false)} className="flex-1 py-3.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                            <button onClick={handleReset} disabled={isResetting} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">{isResetting ? 'Resetting...' : 'Yes, Reset It'}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    const getFlattenedTopics = () => {
        if (filterLevel) return roadmap[filterLevel] || [];
        return [...(roadmap.beginner || []), ...(roadmap.intermediate || []), ...(roadmap.expert || [])];
    };


    // --- Main Render ---
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-x-hidden font-inter selection:bg-blue-100 selection:text-blue-900">
            {/* Header Area */}
            <div className="relative pt-12 pb-6 text-center z-10 bg-gradient-to-b from-white to-slate-50 border-b border-slate-100/50">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="inline-block p-4 rounded-3xl bg-white shadow-xl shadow-blue-900/5 mb-4"
                >
                    <span className="text-4xl filter drop-shadow-md">{language === 'python' ? '🐍' : '☕'}</span>
                </motion.div>
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 capitalize">
                        {language} Mastery
                    </span>
                </motion.h1>
                <p className="text-slate-500 font-medium max-w-xl mx-auto mb-6">
                    {filterLevel ? `Level: ${filterLevel}` : 'Your comprehensive journey from basics to expert.'}
                </p>

                {/* Function Bar - Only show relevant controls */}
                <div className="flex items-center justify-center gap-4">
                    {filterLevel ? (
                        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex gap-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                            >
                                <List size={16} /> Path
                            </button>
                            <button
                                onClick={() => setViewMode('galaxy')}
                                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'galaxy' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                            >
                                <LayoutGrid size={16} /> Galaxy
                            </button>
                        </div>
                    ) : (
                        <div className="px-4 py-2 bg-slate-100 rounded-xl text-slate-500 text-sm font-bold flex items-center gap-2">
                            <GitBranch size={16} /> Timeline Overview
                        </div>
                    )}

                    {filterLevel && (
                        <>
                            {/* Back to Overview */}
                            <button
                                onClick={() => navigate(`/learning/${language}/level-select`)}
                                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all text-sm"
                            >
                                Switch Level
                            </button>

                            {/* Certificate and Reset Buttons */}
                            <button
                                onClick={async () => {
                                    setIsGeneratingCertificate(true);
                                    try {
                                        const response = await api.post(`/certificate/generate/${language}/${filterLevel}`, {}, { responseType: 'blob' });
                                        const url = window.URL.createObjectURL(new Blob([response.data]));
                                        const link = document.createElement('a'); link.href = url; link.setAttribute('download', `Certificate.pdf`); document.body.appendChild(link); link.click(); link.remove();
                                    } catch (e) { alert("Certificate error"); }
                                    finally { setIsGeneratingCertificate(false); }
                                }}
                                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-400/20 transition-all text-sm flex items-center gap-2"
                            >
                                <Star size={16} fill="currentColor" /> {isGeneratingCertificate ? '...' : 'Certificate'}
                            </button>
                            <button
                                onClick={() => setIsResetModalOpen(true)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                            >
                                ↺
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="relative min-h-[600px]">
                {!filterLevel ? (
                    // 1. DEFAULT VIEW: Simple List Overview
                    <SimpleListView roadmapData={roadmap} language={language} />
                ) : (
                    // 2. PERSONALIZED LEVEL VIEW: Animated Vertical List or Galaxy
                    <>
                        {viewMode === 'list' && (
                            <AnimatedRoadmap
                                roadmapData={
                                    filterLevel
                                        ? { [filterLevel]: roadmap[filterLevel] }
                                        : roadmap
                                }
                            />
                        )}

                        {viewMode === 'galaxy' && (
                            <div className="max-w-6xl mx-auto py-8">
                                <SkillGalaxy topics={getFlattenedTopics()} onNodeClick={(id) => navigate(`/learning/${language}/topic/${id}`)} />
                            </div>
                        )}
                    </>
                )}
            </div>


            {/* Start Button (only if no level selected) */}
            {!filterLevel && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none"
                >
                    <button
                        onClick={() => {
                            if (activeLevel) {
                                navigate(`/learning/${language}?level=${activeLevel}`);
                            } else {
                                navigate(`/learning/${language}/level-select`);
                            }
                        }}
                        className="pointer-events-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:bg-black hover:scale-105 transition-all flex items-center gap-3 ring-4 ring-white"
                    >
                        <span>🚀</span> {activeLevel ? `Continue ${activeLevel} Journey` : 'Start Learning Journey'}
                    </button>
                </motion.div>
            )}

            <ResetConfirmationModal />
        </div>
    );
};

export default RoadmapPage;
