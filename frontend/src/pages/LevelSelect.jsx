import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLearningPath } from '../api/learning';
import { Check, Star, Lock } from 'lucide-react';

const LevelSelect = () => {
    const { language } = useParams();
    const navigate = useNavigate();
    const [existingPaths, setExistingPaths] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkPaths = async () => {
            const levels = ['beginner', 'intermediate', 'expert'];
            const found = {};

            for (const level of levels) {
                try {
                    const pathData = await getLearningPath(language, level);
                    if (pathData && pathData.orderedTopics) {
                        found[level] = true;
                    }
                } catch (e) {
                    // Ignore errors if path doesn't exist
                }
            }
            setExistingPaths(found);
            setIsLoading(false);
        };

        checkPaths();
    }, [language]);

    const handleLevelSelect = (level) => {
        // If path exists, RESUME instead of RETAKE QUIZ
        if (existingPaths[level]) {
            navigate(`/learning/${language}?level=${level}`);
        } else {
            navigate(`/learning/${language}/quiz?level=${level}`);
        }
    };

    const renderCard = (level, title, desc, icon, colorClass, borderClass, bgClass) => {
        const hasPath = existingPaths[level];

        return (
            <div
                onClick={() => handleLevelSelect(level)}
                className={`group bg-white p-6 rounded-2xl border ${borderClass} hover:border-current cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden`}
            >
                {hasPath && (
                    <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Check size={12} strokeWidth={3} /> Resumable
                    </div>
                )}

                <div className={`w-14 h-14 ${bgClass} rounded-xl mb-4 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <h2 className={`text-xl font-bold text-gray-900 mb-2 ${colorClass} transition-colors capitalize`}>{title}</h2>
                <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
            </div>
        );
    };

    if (isLoading) return <div className="p-12 text-center text-slate-400">Loading levels...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto h-full flex flex-col justify-center font-inter">
            <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-900 tracking-tight">
                Select Your Level
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
                {renderCard('beginner', 'Beginner', `For users new to programming or ${language} basics.`, '🌱', 'group-hover:text-green-600', 'border-green-100 hover:border-green-500', 'bg-green-100')}
                {renderCard('intermediate', 'Intermediate', 'For users familiar with basics and core concepts.', '⚡', 'group-hover:text-yellow-600', 'border-yellow-100 hover:border-yellow-500', 'bg-yellow-100')}
                {renderCard('expert', 'Expert', `For users confident in ${language} and real-world usage.`, '🔥', 'group-hover:text-red-600', 'border-red-100 hover:border-red-500', 'bg-red-100')}
            </div>
        </div>
    );
};

export default LevelSelect;
