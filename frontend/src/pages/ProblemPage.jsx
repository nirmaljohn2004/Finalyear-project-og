import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodePlayground from '../components/CodePlayground';
import api from '../api/axios';

const ProblemPage = () => {
    const { problemId } = useParams();
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [language, setLanguage] = useState('python');
    const [loading, setLoading] = useState(true);
    const [submissionResult, setSubmissionResult] = useState(null);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await api.get(`/competitive/problems/${problemId}`);
                setProblem(res.data);
            } catch (err) {
                console.error("Failed to fetch problem", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [problemId]);

    const handleSubmit = async (code) => {
        setSubmissionResult(null);
        try {
            const res = await api.post(`/competitive/problems/${problemId}/submit`, {
                code: code,
                language: language
            });
            setSubmissionResult(res.data);
        } catch (err) {
            console.error("Submission failed", err);
            alert("Submission failed. Please try again.");
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Loading Problem...</div>;
    if (!problem) return <div className="p-8 text-center text-red-500">Problem not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm/50 backdrop-blur-md bg-white/90">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/competitive')}
                        className="text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2 text-xs font-bold group"
                    >
                        <span className="p-1 rounded-lg group-hover:bg-gray-100 transition-colors">←</span> Back
                    </button>
                    <div className="h-5 w-px bg-gray-200"></div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-black text-gray-900 tracking-tight">{problem.title}</h1>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${problem.difficulty === 'Easy' ? 'bg-green-50 text-green-600 ring-1 ring-green-500/20' :
                            problem.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-600 ring-1 ring-yellow-500/20' :
                                'bg-red-50 text-red-600 ring-1 ring-red-500/20'
                            }`}>
                            {problem.difficulty}
                        </span>
                    </div>
                </div>

                {/* Language Selector */}
                <div className="relative">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="appearance-none bg-gray-100/50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-bold text-gray-700 cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">
                        ▼
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-61px)] overflow-hidden">
                {/* Problem Description Pane */}
                <div className="lg:w-[40%] bg-white border-r border-gray-200 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="prose prose-slate prose-sm max-w-none">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span>📄</span> Problem Description
                            </h3>
                            <div className="text-sm leading-relaxed text-gray-700 font-medium whitespace-pre-wrap">
                                {problem.description}
                            </div>

                            <div className="mt-6 space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <span>💡</span> Examples
                                </h3>
                                {problem.examples.map((ex, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <pre className="font-mono text-xs text-gray-600 whitespace-pre-wrap bg-transparent p-0 m-0 border-none font-medium">
                                            {ex}
                                        </pre>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submission Result Overlay */}
                    {submissionResult && (
                        <div className={`p-4 border-t shadow-[0_-4px_20px_rgba(0,0,0,0.05)] animate-slide-up bg-white z-20`}>
                            <div className={`rounded-xl p-3 border flex items-center justify-between ${submissionResult.status === 'Accepted'
                                ? 'bg-green-50/50 border-green-100'
                                : 'bg-red-50/50 border-red-100'
                                }`}>
                                <div>
                                    <h3 className={`text-base font-black flex items-center gap-2 ${submissionResult.status === 'Accepted' ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                        {submissionResult.status === 'Accepted' ? '🎉 Accepted' : '❌ Wrong Answer'}
                                    </h3>
                                    {submissionResult.status === 'Accepted' && (
                                        <div className="flex gap-3 text-xs text-green-700/80 font-bold mt-0.5">
                                            <span>✅ {submissionResult.passed_tests}/{submissionResult.total_tests} Tests Passed</span>
                                            <span>⏱️ {submissionResult.runtime}</span>
                                        </div>
                                    )}
                                    {submissionResult.status !== 'Accepted' && (
                                        <div className="text-xs text-red-600 mt-0.5 font-medium">
                                            {submissionResult.message || "Logic verification failed."}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSubmissionResult(null)}
                                    className="p-1.5 hover:bg-white/50 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Code Editor Pane */}
                <div className="flex-1 bg-gray-50 p-6 flex flex-col overflow-hidden">
                    <CodePlayground
                        initialCode={problem.starter_code[language] || "# Code here"}
                        language={language}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProblemPage;
