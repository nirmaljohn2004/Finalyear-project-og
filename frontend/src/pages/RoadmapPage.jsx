import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { pythonRoadmap, javaRoadmap } from '../data/roadmapData';
import { getLearningPath, resetLearningPath } from '../api/learning';

const RoadmapPage = () => {
    const { language } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [personalizedRoadmap, setPersonalizedRoadmap] = useState(null);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
    const filterLevel = searchParams.get('level');

    useEffect(() => {
        let defaultRoadmap = null;
        if (language === 'python') defaultRoadmap = pythonRoadmap;
        else if (language === 'java') defaultRoadmap = javaRoadmap;

        if (!defaultRoadmap) return;

        const initialMap = JSON.parse(JSON.stringify(defaultRoadmap));
        const levels = ['beginner', 'intermediate', 'expert'];

        const fetchPaths = async () => {
            let foundLevel = null;
            for (const level of levels) {
                try {
                    const pathData = await getLearningPath(language, level);
                    if (pathData && pathData.orderedTopics) {
                        initialMap[level] = pathData.orderedTopics;
                        if (!foundLevel) foundLevel = level;
                    }
                } catch (e) {
                    // Path not generated yet, ignore
                }
            }
            setPersonalizedRoadmap(initialMap);
            if (!filterLevel && foundLevel) {
                navigate(`/learning/${language}?level=${foundLevel}`, { replace: true });
            }
        };

        fetchPaths();
    }, [language, filterLevel, navigate]);

    useEffect(() => {
        if (personalizedRoadmap) {
            console.log("DEBUG: Personalized Roadmap State:", personalizedRoadmap);
            console.log("DEBUG: Filter Level:", filterLevel);
        }
    }, [personalizedRoadmap, filterLevel]);

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

    const showSection = (sectionLevel) => {
        if (!filterLevel) return true;
        return filterLevel === sectionLevel;
    };

    // Check if eligible for certificate for the current filterLevel
    const currentLevelTopics = filterLevel ? roadmap[filterLevel] : [];
    const isEligibleForCertificate = currentLevelTopics && currentLevelTopics.length > 0 && currentLevelTopics.every(t => t.status === 'MASTERED');

    const ResetConfirmationModal = () => {
        if (!isResetModalOpen) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 transform scale-100 transition-all">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                            ⚠️
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Reset Syllabus?</h3>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Are you sure you want to reset your personalized <strong>{filterLevel}</strong> path? This action cannot be undone and you will lose your custom roadmap history.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsResetModalOpen(false)}
                                className="flex-1 py-3.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReset}
                                disabled={isResetting}
                                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isResetting ? 'Resetting...' : 'Yes, Reset It'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const TimelineItem = ({ topic, idx, side, color }) => {
        const isUnlocked = filterLevel; // If filtering by level, we assume unlocked for that level context for now

        // Status logic
        const status = topic.status || 'NOT_ATTEMPTED';
        const isMastered = status === 'MASTERED';
        const isWeak = status === 'WEAK';

        return (
            <div className={`relative w-full mb-6 z-10 md:grid md:grid-cols-2 md:gap-8`}>
                {/* Desktop Center Divider (Absolute) */}
                <div className="hidden md:block absolute left-1/2 -ml-0.5 w-1 h-full bg-transparent"></div>

                {/* Content Card */}
                {/* Mobile: default. Desktop: col-start based on side */}
                <div className={`
                    w-full 
                    ${side === 'left'
                        ? 'md:col-start-1 md:text-right md:pr-8'
                        : 'md:col-start-2 md:text-left md:pl-8'}
                `}>
                    <div
                        onClick={() => filterLevel && navigate(`/learning/${language}/topic/${topic.id}`)}
                        className={`
                            relative p-4 rounded-xl shadow-sm border transition-all duration-300
                            ${isMastered
                                ? 'bg-green-50 border-green-200 shadow-md cursor-pointer hover:-translate-y-1'
                                : isWeak
                                    ? 'bg-amber-50 border-amber-200 shadow-md cursor-pointer hover:-translate-y-1'
                                    : isUnlocked
                                        ? 'bg-white shadow-lg border-gray-100 cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 group'
                                        : 'bg-slate-50 border-slate-200 cursor-default'}
                        `}
                    >
                        {/* Connector Line (Desktop) */}
                        <div className={`hidden md:block absolute top-1/2 -my-0.5 h-1 w-8 
                            ${side === 'left' ? '-right-9' : '-left-9'}
                            ${isMastered ? 'bg-green-200' : isWeak ? 'bg-amber-200' : isUnlocked ? 'bg-gray-200' : 'bg-slate-100'}
                        `}></div>

                        {/* Mobile Connector */}
                        <div className={`md:hidden absolute top-8 -left-10 w-8 h-1 ${isMastered ? 'bg-green-200' : isWeak ? 'bg-amber-200' : isUnlocked ? 'bg-gray-200' : 'bg-slate-100'}`}></div>

                        <div className={`flex items-center gap-2 mb-1.5 ${side === 'left' ? 'md:flex-row-reverse' : ''}`}>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                                ${isMastered ? 'bg-green-100 text-green-700' : isWeak ? 'bg-amber-100 text-amber-700' : isUnlocked ? `${color.bg} ${color.text}` : 'bg-slate-200 text-slate-500'}
                            `}>
                                {isMastered ? 'MASTERED' : isWeak ? 'NEEDS REVIEW' : isUnlocked ? 'Unlocked' : 'Locked'}
                            </span>
                            <span className="text-gray-400 text-[10px] font-mono">#{idx + 1}</span>
                        </div>

                        <h3 className={`text-base font-bold mb-1 ${isMastered ? 'text-green-900' : isWeak ? 'text-amber-900' : isUnlocked ? 'text-gray-900 group-hover:text-blue-600' : 'text-slate-600'}`}>
                            {topic.title}
                        </h3>
                        {isWeak && (
                            <p className="text-[10px] font-bold text-amber-600 mb-0.5">⚠ AI Customized Content Ready</p>
                        )}
                        <p className={`text-[11px] leading-relaxed ${isUnlocked ? 'text-gray-500' : 'text-slate-500'}`}>
                            {isMastered ? 'Topic mastered! Great job.' : isWeak ? 'You struggled here. Retrying with tailored content.' : `Master the core concepts of ${topic.title} to advance your skills.`}
                        </p>
                    </div>
                </div>

                {/* Center Node */}
                <div className={`absolute left-[-19px] md:left-1/2 md:-ml-3 w-5 h-5 rounded-full border-4 border-white shadow-md z-20 top-8 md:top-1/2 md:-mt-2.5
                    ${isMastered ? 'bg-green-500' : isWeak ? 'bg-amber-500' : isUnlocked ? '' : 'bg-slate-300'}
                    `}
                    style={{ backgroundColor: isMastered ? '#22c55e' : isWeak ? '#f59e0b' : isUnlocked ? '#2563EB' : undefined }}
                ></div>
            </div>
        );
    };

    const LevelSection = ({ title, level, topics, color, number }) => {
        if (!showSection(level)) return null;

        return (
            <div className="relative pl-6 md:pl-0 pt-6">
                {/* Vertical Timeline Line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 md:left-1/2 md:-ml-0.5"></div>

                {/* Section Header */}
                <div className="relative z-10 flex md:justify-center items-center mb-8 pl-6 md:pl-0">
                    <div className="md:hidden absolute left-[-20px] top-1/2 -mt-0.5 w-6 h-1 bg-gray-200"></div>
                    <div className={`
                        px-5 py-2 rounded-full shadow-xl text-white font-bold text-sm flex items-center gap-3
                        bg-gradient-to-r ${color.gradient}
                     `}>
                        <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px]">{number}</span>
                        {title}
                    </div>
                </div>

                {/* Timeline Items */}
                <div className="space-y-3">
                    {topics.map((topic, idx) => (
                        <TimelineItem
                            key={topic.id}
                            topic={topic}
                            idx={idx}
                            side={idx % 2 === 0 ? 'left' : 'right'}
                            color={color}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-full bg-slate-50 py-6 px-4 relative overflow-x-hidden flex flex-col font-inter">
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-8 relative z-10 shrink-0">
                <div className="inline-block p-4 rounded-3xl bg-white shadow-2xl shadow-blue-900/10 mb-4 animate-bounce-slow">
                    <span className="text-4xl">{language === 'python' ? '🐍' : '☕'}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                    <span className="capitalize text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                        {language}
                    </span> Journey
                </h1>
                <p className="text-base text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                    {filterLevel
                        ? `Focusing on ${filterLevel} level. Complete these milestones to advance!`
                        : `Your expert-curated roadmap to mastering ${language}. Step by step.`
                    }
                </p>

                {filterLevel && (
                    <div className="flex flex-col items-center gap-4 mt-6">
                        {isEligibleForCertificate && (
                            <button
                                onClick={async () => {
                                    setIsGeneratingCertificate(true);
                                    try {
                                        const response = await api.post(
                                            `/certificate/generate/${language}/${filterLevel}`,
                                            {},
                                            { responseType: 'blob' }
                                        );
                                        const url = window.URL.createObjectURL(new Blob([response.data]));
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.setAttribute('download', `Certificate_${language}_${filterLevel}.pdf`);
                                        document.body.appendChild(link);
                                        link.click();
                                        link.remove();
                                    } catch (error) {
                                        console.error("Failed to download certificate:", error);
                                        alert("Could not download certificate. " + (error.response?.data?.detail || ""));
                                    } finally {
                                        setIsGeneratingCertificate(false);
                                    }
                                }}
                                disabled={isGeneratingCertificate}
                                className="group relative px-6 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all flex items-center gap-3 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                {isGeneratingCertificate ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                <span className="relative z-10">{isGeneratingCertificate ? 'Generating PDF...' : 'Get Certificate'}</span>
                            </button>
                        )}

                        <button
                            onClick={() => setIsResetModalOpen(true)}
                            className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-bold hover:bg-red-100 transition-colors border border-red-100 flex items-center gap-2"
                        >
                            <span>🔄</span> Reset Syllabus
                        </button>
                    </div>
                )}
            </div>

            <div className="max-w-6xl mx-auto pb-8 shrink-0 w-full">
                <LevelSection
                    title="Beginner Foundations"
                    level="beginner"
                    topics={roadmap.beginner}
                    color={{ gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-600' }}
                    number="01"
                />
                <LevelSection
                    title="Intermediate Concepts"
                    level="intermediate"
                    topics={roadmap.intermediate}
                    color={{ gradient: 'from-amber-400 to-orange-500', bg: 'bg-orange-50', text: 'text-orange-600' }}
                    number="02"
                />
                <LevelSection
                    title="Expert Mastery"
                    level="expert"
                    topics={roadmap.expert}
                    color={{ gradient: 'from-rose-500 to-pink-600', bg: 'bg-rose-50', text: 'text-rose-600' }}
                    number="03"
                />
            </div>

            {!filterLevel && (
                <div className="sticky bottom-6 left-0 right-0 z-50 flex justify-center mt-auto pointer-events-none">
                    <button
                        onClick={() => navigate(`/learning/${language}/level-select`)}
                        className="pointer-events-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:bg-black hover:scale-105 transition-all flex items-center gap-3 ring-4 ring-white"
                    >
                        <span className="text-xl">🚀</span>
                        <span className="text-base">Start Learning Journey</span>
                    </button>
                </div>
            )}
            <ResetConfirmationModal />
        </div>
    );
};

export default RoadmapPage;
