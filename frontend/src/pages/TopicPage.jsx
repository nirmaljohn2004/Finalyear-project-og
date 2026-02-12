import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTopicContent, submitTopicQuiz } from '../api/learning';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodePlayground from '../components/CodePlayground';

const TopicPage = () => {
    const { language, topicId } = useParams();
    const navigate = useNavigate();
    const [topicContent, setTopicContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                const data = await getTopicContent(language, topicId);
                setTopicContent(data);
                // Reset states on new content fetch
                setQuizAnswers({});
                setEvaluationResult(null);
            } catch (err) {
                console.error(err);
                setError("Failed to load topic content. It might not be generated yet.");
            } finally {
                setLoading(false);
            }
        };

        if (language && topicId) {
            fetchContent();
        }
    }, [language, topicId]);

    const handleOptionSelect = (questionId, option) => {
        setQuizAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleSubmitQuiz = async () => {
        if (!topicContent || !topicContent.quiz) return;

        const submissionPayload = topicContent.quiz.map(q => ({
            questionId: q.id,
            selectedOption: quizAnswers[q.id],
            // For MVP: Simple client-side check to pass isCorrect to backend evaluator, 
            // OR ideally backend checks. 
            // Requirement said "Evaluator Agent... Inputs... Correct answers". 
            // Our backend evaluator currently checks `isCorrect` provided in payload (simplification).
            // Let's check correctness here securely? No, backend sent correct answers in mock_quiz (for MVP).
            // We will compare selected vs q.correctAnswer
            isCorrect: quizAnswers[q.id] === q.correctAnswer
        }));

        try {
            setSubmitting(true);
            const result = await submitTopicQuiz(language, topicId, submissionPayload, topicContent.quiz.length);
            setEvaluationResult(result);
        } catch (err) {
            console.error(err);
            alert("Failed to submit quiz.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error) return (
        <div className="p-8 text-center bg-white h-screen flex flex-col justify-center items-center">
            <p className="text-red-500 mb-4 font-bold text-xl">{error}</p>
            <button onClick={() => navigate(`/learning/${language}`)} className="text-blue-600 hover:underline">
                Back to Roadmap
            </button>
        </div>
    );

    if (!topicContent) return <div>Topic not found</div>;

    const quizComplete = topicContent.quiz && Object.keys(quizAnswers).length === topicContent.quiz.length;

    return (

        <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
            <div className="flex-1 p-3 md:p-6 max-w-4xl mx-auto w-full">
                <button
                    onClick={() => navigate(`/learning/${language}`)}
                    className="mb-6 text-gray-400 hover:text-gray-900 flex items-center gap-2 text-xs font-bold transition-colors group"
                >
                    <span className="p-1 rounded-lg group-hover:bg-gray-200 transition-colors">←</span> Back to Roadmap
                </button>

                <div className="bg-white rounded-[1.5rem] shadow-xl overflow-hidden border border-gray-100 ring-1 ring-gray-100/50">
                    {/* Header */}
                    <div className="p-6 md:p-10 border-b border-gray-100 relative overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-8xl select-none filter blur-sm">
                            {language === 'python' ? '🐍' : '☕'}
                        </div>
                        <div className="relative z-10">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase">Topic Module</span>
                                {topicContent.status === 'MASTERED' && (
                                    <span className="bg-green-50 text-green-600 ring-1 ring-green-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                        ✅ MASTERED
                                    </span>
                                )}
                                {topicContent.status === 'WEAK' && (
                                    <span className="bg-amber-50 text-amber-600 ring-1 ring-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                        ⚠️ NEEDS IMPROVEMENT
                                    </span>
                                )}
                                {topicContent.is_ai_generated && (
                                    <span className="bg-purple-50 text-purple-600 ring-1 ring-purple-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                        ✨ AI PERSONALIZED
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 capitalize mb-4 tracking-tight leading-tight">
                                {topicContent.topic_id}
                            </h1>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 md:p-10">
                        <div className="prose prose-base max-w-none text-gray-600 prose-headings:font-black prose-headings:text-gray-900 prose-headings:tracking-tight prose-code:text-blue-600 prose-pre:bg-gray-900 prose-pre:text-gray-50 prose-pre:rounded-xl prose-pre:shadow-lg prose-img:rounded-xl prose-p:leading-relaxed prose-strong:text-gray-900">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    table: ({ node, ...props }) => <div className="overflow-x-auto my-4 rounded-lg border border-gray-200 shadow-sm"><table className="min-w-full divide-y divide-gray-200" {...props} /></div>,
                                    thead: ({ node, ...props }) => <thead className="bg-gray-50" {...props} />,
                                    th: ({ node, ...props }) => <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200" {...props} />,
                                    td: ({ node, ...props }) => <td className="px-5 py-3 whitespace-normal text-sm text-gray-600 border-b border-gray-100 align-top" {...props} />,
                                    pre: ({ node, ...props }) => <pre className="m-0 p-0 bg-transparent" {...props} />,
                                    // Custom styling for code blocks to match visual style
                                    code: ({ node, inline, className, children, ...props }) => {
                                        return !inline ? (
                                            <div className="rounded-xl overflow-hidden my-2 w-full shadow-md ring-1 ring-black/5">
                                                <code className={`block bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto ${className}`} {...props}>
                                                    {children}
                                                </code>
                                            </div>
                                        ) : (
                                            <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded-md font-mono text-sm font-bold ring-1 ring-gray-200" {...props}>
                                                {children}
                                            </code>
                                        )
                                    },
                                    // Fix validateDOMNesting warning: Render paragraphs as divs if necessary
                                    p: ({ node, ...props }) => <div className="mb-4 leading-relaxed" {...props} />
                                }}
                            >
                                {topicContent.content}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* Code Examples Section */}
                    {topicContent.examples && topicContent.examples.length > 0 && (
                        <div className="bg-gray-50/50 p-6 md:p-10 border-t border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="text-blue-600">💻</span> Practical Usage
                            </h2>
                            <div className="space-y-10">
                                {topicContent.examples.map((example, idx) => (
                                    <div key={idx} className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-xs">{idx + 1}</span>
                                            <h3 className="text-lg font-bold text-gray-900">Example Scenario</h3>
                                        </div>
                                        <div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-200">
                                            <CodePlayground
                                                initialCode={typeof example === 'string' ? example.replace(/```python\n|```java\n|```/g, '') : example}
                                                language={language}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Coding Challenge Section */}
                    {topicContent.practice_problem && (
                        <div className="bg-indigo-50/50 p-6 md:p-10 border-t border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="text-indigo-600">⚡</span> Coding Challenge
                            </h2>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 mb-6">
                                <h3 className="font-bold text-gray-900 mb-2">Problem Statement</h3>
                                <p className="text-gray-700 leading-relaxed font-medium">
                                    {topicContent.practice_problem}
                                </p>
                            </div>
                            <div className="rounded-xl overflow-hidden shadow-xl ring-1 ring-gray-200">
                                <CodePlayground
                                    initialCode={`# Write your solution here\n`}
                                    language={language}
                                    testCases={topicContent.test_cases}
                                />
                            </div>
                        </div>
                    )}

                    {/* Quiz Section */}
                    {topicContent.quiz && topicContent.quiz.length > 0 && !evaluationResult && (
                        <div className="bg-white border-t border-gray-100 p-6 md:p-10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-50"></div>
                            <div className="relative z-10">
                                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="text-indigo-600">📝</span> Knowledge Check
                                </h2>
                                <div className="space-y-6">
                                    {topicContent.quiz.map((q, idx) => (
                                        <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                                            <p className="font-bold text-lg text-gray-800 mb-6 flex gap-3 leading-relaxed">
                                                <span className="text-gray-300 select-none">#{idx + 1}</span>
                                                {q.question}
                                            </p>
                                            <div className="grid grid-cols-1 gap-3">
                                                {q.options.map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => handleOptionSelect(q.id, opt)}
                                                        className={`
                                                            p-4 rounded-lg font-bold text-left transition-all border-2 relative group flex items-start text-sm
                                                            ${quizAnswers[q.id] === opt
                                                                ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-lg shadow-blue-500/10'
                                                                : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-600'}
                                                        `}
                                                    >
                                                        <div className={`w-4 h-4 rounded-full border-2 mr-3 mt-0.5 flex-shrink-0 transition-colors ${quizAnswers[q.id] === opt ? 'border-blue-500 bg-blue-500' : 'border-gray-300 group-hover:border-blue-400'
                                                            }`}></div>
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={handleSubmitQuiz}
                                        disabled={!quizComplete || submitting}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl font-black text-base shadow-xl shadow-blue-600/20 disabled:shadow-none hover:-translate-y-1 transition-all disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Evaluating...' : 'Submit Answers'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Evaluation Result */}
                    {evaluationResult && (
                        <div className={`p-10 text-center border-t relative overflow-hidden ${evaluationResult.status === 'MASTERED' ? 'bg-green-50/30' : 'bg-amber-50/30'}`}>
                            <div className={`w-24 h-24 rounded-3xl rotate-3 flex items-center justify-center text-5xl mx-auto mb-6 shadow-2xl transition-transform hover:rotate-6 ${evaluationResult.status === 'MASTERED' ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : 'bg-gradient-to-br from-amber-400 to-amber-600 text-white'}`}>
                                {evaluationResult.status === 'MASTERED' ? '🏆' : '📚'}
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                                {evaluationResult.status === 'MASTERED' ? 'Topic Mastered!' : 'Keep Practicing!'}
                            </h2>
                            <p className="text-xl text-gray-500 mb-8 font-bold">
                                You scored <strong className={evaluationResult.status === 'MASTERED' ? 'text-green-600' : 'text-amber-600'}>{Math.round(evaluationResult.score)}%</strong>
                            </p>

                            {evaluationResult.status === 'MASTERED' ? (
                                <button onClick={() => navigate(`/learning/${language}`)} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-xl hover:bg-black transition-all hover:-translate-y-1 text-sm">
                                    Continue Journey →
                                </button>
                            ) : (
                                <button onClick={() => window.location.reload()} className="bg-white text-gray-900 border-2 border-gray-200 px-8 py-3 rounded-xl font-bold shadow-lg hover:border-gray-900 transition-all hover:-translate-y-1 text-sm">
                                    Retry with Personalized Content
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopicPage;
