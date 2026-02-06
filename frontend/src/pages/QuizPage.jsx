import { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import { beginnerQuestions } from '../data/quiz/beginnerQuestions';
import { intermediateQuestions } from '../data/quiz/intermediateQuestions';
import { expertQuestions } from '../data/quiz/expertQuestions';
import { javaBeginnerQuestions } from '../data/quiz/javaBeginnerQuestions';
import { javaIntermediateQuestions } from '../data/quiz/javaIntermediateQuestions';
import { javaExpertQuestions } from '../data/quiz/javaExpertQuestions';

const QuizPage = () => {
    const { language } = useParams();
    const [searchParams] = useSearchParams();
    const level = searchParams.get('level'); // beginner, intermediate, expert
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [userAnswers, setUserAnswers] = useState({}); // Track answers by index
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        // Load questions based on level and language
        let loadedQuestions = [];
        if (language === 'python') {
            switch (level) {
                case 'beginner': loadedQuestions = beginnerQuestions; break;
                case 'intermediate': loadedQuestions = intermediateQuestions; break;
                case 'expert': loadedQuestions = expertQuestions; break;
            }
        } else if (language === 'java') {
            switch (level) {
                case 'beginner': loadedQuestions = javaBeginnerQuestions; break;
                case 'intermediate': loadedQuestions = javaIntermediateQuestions; break;
                case 'expert': loadedQuestions = javaExpertQuestions; break;
            }
        }

        setQuestions(loadedQuestions);
        setCurrentIndex(0);
        setScore(0);
        setIsCompleted(false);
    }, [level, language]);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleNext = () => {
        // Evaluate answer
        const currentQuestion = questions[currentIndex];

        // Store answer
        setUserAnswers(prev => ({ ...prev, [currentIndex]: selectedOption }));

        if (selectedOption === currentQuestion.answer) {
            setScore(prev => prev + 1);
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
        } else {
            // Finish quiz - wait for state update to reflect final score calc
            // But state update is async. For safety, calculate final score contribution now.
            const finalScore = (selectedOption === currentQuestion.answer) ? score + 1 : score;
            setScore(finalScore);
            setIsCompleted(true);
            saveResult(finalScore);
        }
    };

    const saveResult = async (finalScore) => {
        try {
            // New Flow: Generate Learning Path via Backend Agent
            // 1. Construct quiz results in expected format
            const resultItems = questions.map((q, idx) => {
                // If this is the current question (last one), we might not have updated selectedOption state 
                // fully if we relied on `handleNext`. But wait, handleNext calls saveResult AFTER checking current.
                // Actually `questions` doesn't track user answers currently. 
                // We need to track user answers to send to backend.
                // Refactor required: We need to store user answers as they go.
                return {
                    questionId: q.id,
                    question: q.question,
                    selectedOption: userAnswers[idx] || (idx === currentIndex ? selectedOption : ""),
                    correctOption: q.answer,
                    isCorrect: (userAnswers[idx] || (idx === currentIndex ? selectedOption : "")) === q.answer
                };
            });

            // Need available topics to reorder. 
            // We can import them here or assume backend knows them. 
            // The API expects `availableTopics`. Let's import roadmapData.
            let roadmapData = null;
            if (language === 'python') {
                // dynamic import or just import at top? Import at top is cleaner.
                const { pythonRoadmap } = await import('../data/roadmapData');
                roadmapData = pythonRoadmap[level];
            } else {
                const { javaRoadmap } = await import('../data/roadmapData');
                roadmapData = javaRoadmap[level];
            }

            // Call API
            // Note: We might want to show "Analyzing..." state before navigating.
            // But for now, let's just do it.
            // Wait, we need to show the results screen first? 
            // The prompt says "1. User completes quiz... 2. Agent analyzes... 4. Learning Path Page".
            // So immediately after quiz, we could go to roadmap OR show result then go to roadmap.
            // Existing code shows result screen.

            // Let's optimize: Save locally first for the result screen to show score immediately.
            const result = {
                level,
                score: finalScore,
                date: new Date().toISOString()
            };
            const storageKey = `quiz_result_${language}`;
            const existing = JSON.parse(localStorage.getItem(storageKey) || '{}');
            existing[level] = result;
            localStorage.setItem(storageKey, JSON.stringify(existing));

            // Fire and forget path generation? Or wait? 
            // Better to wait if we want the next screen to be correct.
            // But we are on the result screen. The user stays there.
            // So we can trigger it in background.

            if (roadmapData) {
                import('../api/learning').then(({ generateLearningPath }) => {
                    generateLearningPath(language, level, resultItems, roadmapData).catch(err => console.error(err));
                });
            }

        } catch (e) {
            console.error("Failed to save result", e);
        }
    };

    if (questions.length === 0) return <div className="p-8">Loading questions or invalid level...</div>;

    if (isCompleted) {
        return (
            <div className="flex flex-col items-center justify-center p-6 h-full font-inter">
                <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-gray-100">
                    <div className="w-20 h-20 bg-green-100 text-5xl flex items-center justify-center rounded-full mx-auto mb-5">
                        🏆
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1.5">Quiz Completed!</h2>
                    <p className="text-gray-500 mb-6 text-sm">You completed the <span className="capitalize">{level}</span> {language} quiz.</p>

                    <div className="bg-gray-50 p-5 rounded-xl mb-6">
                        <div className="text-xs text-gray-500 mb-0.5">Your Score</div>
                        <div className="text-4xl font-black text-blue-600">{score} <span className="text-xl text-gray-400 font-bold">/ {questions.length}</span></div>
                    </div>

                    <div className="grid gap-2.5">
                        <button
                            onClick={() => navigate(`/learning/${language}?level=${level}`)}
                            className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all shadow-lg shadow-gray-900/10 mb-2 text-sm"
                        >
                            View Personalized Path 🚀
                        </button>
                        <button
                            onClick={() => navigate(`/learning/${language}/level-select`)}
                            className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all text-sm"
                        >
                            Try Another Level
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="p-6 md:p-8 max-w-2xl mx-auto h-full flex flex-col font-inter">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 capitalize">{level} Quiz</h1>
                    <p className="text-gray-500 text-xs">Question {currentIndex + 1} of {questions.length}</p>
                </div>
                <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {language}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full mb-6 overflow-hidden">
                <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Question */}
            <div className="flex-1">
                <QuestionCard
                    question={currentQuestion}
                    selectedOption={selectedOption}
                    onOptionSelect={handleOptionSelect}
                />
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleNext}
                    disabled={!selectedOption}
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg text-sm
            ${selectedOption
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30 hover:-translate-y-1'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                    {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
            </div>
        </div>
    );
};

export default QuizPage;
