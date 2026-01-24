import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Copy, Check } from 'lucide-react';
import api from '../api/axios';

const CodePlayground = ({ initialCode = '', language = 'python', onSubmit = null }) => {
    const [code, setCode] = useState(initialCode);

    // Update local state if prop changes (e.g. topic navigation)
    useEffect(() => {
        setCode(initialCode);
    }, [initialCode]);

    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleRun = async () => {
        setIsRunning(true);
        setOutput("Running...");
        try {
            const res = await api.post('/execution/execute', {
                language: language.toLowerCase(),
                code: code
            });

            // Format output based on exit code
            if (res.data.exit_code === 0) {
                setOutput(res.data.output || "Program finished with no output.");
            } else {
                setOutput(`Error:\n${res.data.stderr}`);
            }
        } catch (err) {
            console.error(err);
            setOutput("Failed to execute code. Infrastructure might be busy.");
        } finally {
            setIsRunning(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xl flex flex-col md:flex-row h-[600px] ring-1 ring-gray-100">
            {/* Editor Pane (Left/Top) */}
            <div className="flex-1 flex flex-col border-r border-gray-100 min-w-0">
                <div className="bg-gray-50/50 backdrop-blur-sm p-3 flex justify-between items-center border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                        {language} Editor
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopy}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Copy Code"
                        >
                            {isCopied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <Editor
                        height="100%"
                        defaultLanguage={language}
                        value={code}
                        onChange={(value) => setCode(value)}
                        theme="light"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: "'Fira Code', 'Consolas', monospace",
                            padding: { top: 20 },
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            lineNumbers: 'on',
                            renderLineHighlight: 'all',
                            scrollbar: {
                                vertical: 'hidden',
                                horizontal: 'hidden'
                            }
                        }}
                    />
                </div>
            </div>

            {/* Output Pane (Right/Bottom) */}
            <div className="w-full md:w-1/3 bg-gray-50/30 flex flex-col min-w-[300px] backdrop-blur-sm">
                <div className="bg-gray-50 p-3 flex justify-between items-center border-b border-gray-200">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <span className="text-base">⚡</span> Console Output
                    </span>
                    <button
                        onClick={() => setOutput('')}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Clear Console"
                    >
                        <RotateCcw size={14} />
                    </button>
                </div>
                <div className="flex-1 p-4 font-mono text-sm overflow-auto text-gray-700 whitespace-pre-wrap bg-white">
                    {output || <span className="text-gray-400 italic flex items-center gap-2 opacity-50">
                        <Play size={14} /> Run code to see output...
                    </span>}
                </div>
                <div className="p-4 border-t border-gray-100 bg-white flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isRunning
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border-2 border-gray-100 hover:border-green-200 text-gray-700 hover:text-green-600 hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-0.5'
                            }`}
                    >
                        {isRunning ? (
                            <>
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                Running...
                            </>
                        ) : (
                            <>
                                <Play size={18} className={isRunning ? "" : "text-green-500"} fill="currentColor" />
                                Run Code
                            </>
                        )}
                    </button>
                    {onSubmit && (
                        <button
                            onClick={() => onSubmit(code)}
                            disabled={isRunning}
                            className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
                        >
                            Submit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CodePlayground;
