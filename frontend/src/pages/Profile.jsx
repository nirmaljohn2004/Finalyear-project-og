import { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, Briefcase, Code, Link as LinkIcon, Edit2, Upload, FileText, Brain, Zap, Target, MessageCircle, BarChart, Github, Linkedin, Globe, ChevronRight, X, Trophy } from 'lucide-react';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [takingTest, setTakingTest] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [answers, setAnswers] = useState({});

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        github_link: '',
        linkedin_link: '',
        website_link: '',
        skills: ''
    });

    const [resumeFile, setResumeFile] = useState(null);
    const [uploadingResume, setUploadingResume] = useState(false);

    // Mock questions for psychometric
    const questions = [
        {
            id: "learning_preference",
            text: "1️⃣ Learning Preference: When learning something new, you prefer:",
            options: ["A. Real-world examples and applications", "B. Clear theory and concepts first", "C. Visuals like diagrams or videos", "D. Learning by trying and experimenting"]
        },
        {
            id: "learning_speed",
            text: "2️⃣ Learning Speed: How do you want the content to be explained?",
            options: ["A. Very slowly, step by step", "B. At a comfortable normal pace", "C. Fast, only key points", "D. As fast as possible with challenges"]
        },
        {
            id: "difficulty_comfort",
            text: "3️⃣ Difficulty Comfort: Which type of problems do you enjoy most?",
            options: ["A. Very easy, confidence-building ones", "B. Medium difficulty", "C. Hard, thinking-intensive ones", "D. Interview or competition-level problems"]
        },
        {
            id: "feedback_style",
            text: "4️⃣ Help & Feedback Style: When you make a mistake, you prefer:",
            options: ["A. Immediate correction with explanation", "B. Small hints to figure it out myself", "C. Full solution after I finish", "D. Only tell me if it’s wrong"]
        },
        {
            id: "goal_orientation",
            text: "5️⃣ Goal Orientation: Your main reason for learning is:",
            options: ["A. To understand the basics clearly", "B. To build real-world projects", "C. To crack interviews or exams", "D. To compete and improve ranking"]
        }
    ];

    useEffect(() => {
        fetchProfile();
        fetchUser();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/profile/me');
            setProfile(res.data);
        } catch (err) {
            console.log("No behavior profile found");
        }
    };

    const fetchUser = async () => {
        try {
            const res = await api.get('/users/me');
            setUser(res.data);
            setFormData({
                name: res.data.name || '',
                bio: res.data.bio || '',
                github_link: res.data.github_link || '',
                linkedin_link: res.data.linkedin_link || '',
                website_link: res.data.website_link || '',
                skills: res.data.skills ? res.data.skills.join(', ') : ''
            });
        } catch (err) {
            console.error("Error fetching user details", err);
        }
    };

    const submitTest = async () => {
        try {
            const res = await api.post('/profile/submit', { answers });
            setProfile(res.data);
            setTakingTest(false);
        } catch (err) {
            console.error("Submission error:", err);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            const payload = {
                ...formData,
                skills: skillsArray
            };
            const res = await api.put('/users/me', payload);
            setUser(res.data);
            setIsEditing(false);
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert("Only PDF files are allowed.");
            return;
        }

        const data = new FormData();
        data.append('file', file);
        setUploadingResume(true);

        try {
            const res = await api.post('/users/me/resume', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Refresh user to get new resume URL
            fetchUser();
        } catch (err) {
            console.error("Resume upload failed", err);
            alert("Failed to upload resume");
        } finally {
            setUploadingResume(false);
        }
    };

    const ensureHttps = (url) => {
        if (!url) return '#';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    };

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 font-inter">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">My Profile</h1>
                    <p className="text-gray-500 font-medium text-sm">Manage your personal information and learning preferences</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl shadow-sm text-xs font-bold transition-all flex items-center gap-2"
                    >
                        <Edit2 size={14} />
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Editing Mode */}
            {isEditing ? (
                <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-xl animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Edit2 size={100} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-6 relative z-10">Edit Personal Details</h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-5 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Skills (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium transition-all text-sm"
                                    placeholder="Python, React, Machine Learning"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium transition-all resize-none text-sm"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2"><Github size={14} /> GitHub URL</label>
                                <input
                                    type="text"
                                    value={formData.github_link}
                                    onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2"><Linkedin size={14} /> LinkedIn URL</label>
                                <input
                                    type="text"
                                    value={formData.linkedin_link}
                                    onChange={(e) => setFormData({ ...formData, linkedin_link: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium transition-all text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 justify-end pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2.5 text-gray-600 hover:text-gray-900 font-bold transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-1 text-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Col: Personal Info & Resume */}
                    <div className="space-y-6">
                        {/* Personal Info Card */}
                        <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-10"></div>
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-blue-500/30 mb-4 ring-4 ring-white">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <h2 className="text-xl font-black text-gray-900 mb-0.5">{user?.name}</h2>
                                <p className="text-gray-500 font-medium mb-4 text-xs">{user?.email}</p>

                                {user?.bio && <p className="text-gray-600 mb-6 leading-relaxed text-xs bg-gray-50 p-3 rounded-xl border border-gray-100 italic">"{user.bio}"</p>}

                                <div className="w-full space-y-2.5">
                                    {user?.github_link && (
                                        <a href={ensureHttps(user.github_link)} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-white transition-all bg-gray-50 p-3 rounded-xl hover:bg-gray-900 group/link border border-gray-100 hover:border-gray-900">
                                            <Github size={18} className="group-hover/link:text-white transition-colors" />
                                            <span className="text-xs font-bold">GitHub Profile</span>
                                            <ChevronRight size={14} className="ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                        </a>
                                    )}
                                    {user?.linkedin_link && (
                                        <a href={ensureHttps(user.linkedin_link)} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-white transition-all bg-gray-50 p-3 rounded-xl hover:bg-[#0077B5] group/link border border-gray-100 hover:border-[#0077B5]">
                                            <Linkedin size={18} className="group-hover/link:text-white transition-colors" />
                                            <span className="text-xs font-bold">LinkedIn Profile</span>
                                            <ChevronRight size={14} className="ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Progression Card */}
                        <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-xl overflow-hidden relative">
                            <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <span className="bg-orange-100 text-orange-600 p-1.5 rounded-lg"><Trophy size={16} /></span> Stats
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-center">
                                    <div className="text-xl font-black text-orange-500 mb-0.5">🔥 {user?.streak_count || 0}</div>
                                    <div className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">Day Streak</div>
                                </div>
                                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
                                    <div className="text-xl font-black text-amber-500 mb-0.5">⚡ {user?.xp || 0}</div>
                                    <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Total XP</div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Current Rank</span>
                                    <span className="text-xs font-black text-blue-600">
                                        {(user?.xp || 0) < 100 ? "Novice" : (user?.xp || 0) < 500 ? "Apprentice" : "Master"}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                        style={{ width: `${Math.min(((user?.xp || 0) % 100), 100)}%` }} // Simplified progress
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Skills Card */}
                        <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-xl">
                            <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <span className="bg-orange-100 text-orange-600 p-1.5 rounded-lg"><Code size={16} /></span> Skills
                            </h2>
                            {user?.skills && user.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map(skill => (
                                        <span key={skill} className="px-3 py-1.5 bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-300 text-gray-700 rounded-lg text-[10px] font-bold transition-all cursor-default shadow-sm hover:shadow-md">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-xs italic">No skills added yet.</p>
                            )}
                        </div>

                        {/* Resume Card */}
                        <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-xl">
                            <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <span className="bg-pink-100 text-pink-600 p-1.5 rounded-lg"><FileText size={16} /></span> Resume
                            </h2>
                            {user?.resume_url ? (
                                <div className="space-y-3">
                                    <a
                                        href={`http://localhost:8000${user.resume_url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl border border-blue-200 transition-all group text-sm"
                                    >
                                        <FileText size={18} /> View Resume
                                    </a>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={handleResumeUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <button className="w-full py-2.5 bg-white text-gray-500 hover:text-gray-700 text-[10px] font-bold uppercase tracking-wider rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-400 transition-all flex items-center justify-center gap-2">
                                            <Upload size={14} /> {uploadingResume ? "Uploading..." : "Replace File"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all group relative cursor-pointer">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleResumeUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform text-gray-400 group-hover:text-blue-500">
                                        <Upload size={20} />
                                    </div>
                                    <p className="text-gray-900 font-bold mb-0.5 group-hover:text-blue-700 text-sm">Upload Resume</p>
                                    <p className="text-gray-400 text-[10px] font-medium">PDF format only</p>
                                    {uploadingResume && <p className="text-blue-600 text-[10px] font-bold mt-2">Uploading...</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Col: Psychometric & Behavioral */}
                    <div className="lg:col-span-2 h-full">
                        {profile ? (
                            <div className="bg-white p-6 md:p-8 rounded-[1.5rem] border border-gray-100 shadow-xl h-full relative overflow-hidden">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                            <span className="bg-violet-100 text-violet-600 p-1.5 rounded-lg text-base shadow-sm">🧠</span>
                                            Behavioral Profile
                                        </h2>
                                        <p className="text-gray-500 mt-0.5 font-medium ml-1 text-xs">AI-Analyzed Learning Persona</p>
                                    </div>
                                    <button
                                        onClick={() => setTakingTest(true)}
                                        className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                                    >
                                        <Edit2 size={12} />
                                        Retake Assessment
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                    {[
                                        { label: "Learning Preference", value: profile.learning_preference, icon: <Brain size={20} />, color: "text-purple-600 bg-purple-50" },
                                        { label: "Preferred Speed", value: profile.learning_speed, icon: <Zap size={20} />, color: "text-amber-600 bg-amber-50" },
                                        { label: "Difficulty Comfort", value: profile.difficulty_comfort, icon: <BarChart size={20} />, color: "text-blue-600 bg-blue-50" },
                                        { label: "Feedback Style", value: profile.feedback_style, icon: <MessageCircle size={20} />, color: "text-emerald-600 bg-emerald-50" },
                                        { label: "Primary Goal", value: profile.goal_orientation, icon: <Target size={20} />, color: "text-rose-600 bg-rose-50" }
                                    ].map((item) => (
                                        <div key={item.label} className="p-5 bg-white rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all group relative overflow-hidden">
                                            <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
                                                {item.icon}
                                            </div>
                                            <p className="text-gray-400 text-[10px] font-extrabold uppercase tracking-widest mb-1.5">
                                                {item.label}
                                            </p>
                                            <p className="text-base font-bold text-gray-900 leading-snug">{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Decor */}
                                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-br from-violet-50 to-blue-50 rounded-full blur-3xl opacity-60"></div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center py-16 bg-white rounded-[1.5rem] border border-gray-100 shadow-xl text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg ring-8 ring-white animate-bounce-slow">
                                        🧩
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2">Discover Your Learning Style</h3>
                                    <p className="text-gray-500 mb-8 max-w-md mx-auto font-medium leading-relaxed text-sm">
                                        Take our AI-powered psychometric assessment to unlock a personalized learning path tailored specifically to how you think.
                                    </p>
                                    <button
                                        onClick={() => setTakingTest(true)}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-xl shadow-blue-600/20 transition-all hover:scale-105 hover:-translate-y-1 text-sm"
                                    >
                                        Start Assessment →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Test Modal */}
            {takingTest && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
                    <div className="bg-white p-8 md:p-10 rounded-[2rem] max-w-3xl w-full shadow-2xl animate-scale-up my-8 max-h-[90vh] overflow-y-auto border border-gray-100">
                        <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Psychometric Assessment</h2>
                                <p className="text-gray-500 font-medium mt-1">Help us personalize your learning experience</p>
                            </div>
                            <button onClick={() => setTakingTest(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-10">
                            {questions.map((q, idx) => (
                                <div key={q.id} className="relative pl-12">
                                    <span className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-lg text-sm">{idx + 1}</span>
                                    <label className="block text-lg font-bold text-gray-900 mb-4 items-start gap-4">
                                        {q.text.split(': ')[1]}
                                    </label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {q.options.map((opt) => (
                                            <label key={opt} className={`
                                                flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all group
                                                ${answers[q.id] === opt
                                                    ? 'border-blue-500 bg-blue-50/50 shadow-md'
                                                    : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'}
                                            `}>
                                                <div className={`
                                                    w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                                                    ${answers[q.id] === opt ? 'border-blue-500 bg-blue-500' : 'border-gray-300 group-hover:border-blue-300'}
                                                `}>
                                                    {answers[q.id] === opt && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name={q.id}
                                                    value={opt}
                                                    checked={answers[q.id] === opt}
                                                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                                    className="hidden"
                                                />
                                                <span className={`text-sm font-medium ${answers[q.id] === opt ? 'text-gray-900' : 'text-gray-600'}`}>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-8 border-t border-gray-100 flex gap-4 justify-end sticky bottom-0 bg-white/95 backdrop-blur-sm p-4 -mx-4 -mb-4 rounded-b-[2rem]">
                            <button
                                onClick={() => setTakingTest(false)}
                                className="px-6 py-3 text-gray-500 hover:text-gray-900 font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitTest}
                                className="px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-xl shadow-blue-600/20 transition-all hover:scale-105"
                            >
                                Analyze Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
