import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, UserPlus, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            // Create user with Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Send verification email
            await sendEmailVerification(user);

            setMessage('Account created! A verification email has been sent to your inbox.');

            // Redirect after delay
            setTimeout(() => {
                navigate('/login');
            }, 5000);

        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('This email address is already in use.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.');
            } else {
                setError(err.message || 'Signup failed');
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#F8FAFC]">
            {/* Aesthetic Background - Soft Mesh Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-purple-200/40 rounded-full blur-[120px] mix-blend-multiply animate-float"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[40%] left-[40%] w-[30rem] h-[30rem] bg-pink-200/30 rounded-full blur-[100px] mix-blend-multiply animate-pulse-glow"></div>

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 p-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl text-slate-500 hover:text-indigo-600 hover:bg-white/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 z-20 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Signup Card */}
            <div className="relative w-full max-w-[420px] bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_40px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-10 animate-slide-up z-10 hover:shadow-[0_20px_60px_rgb(0,0,0,0.06)] transition-shadow duration-500">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-white shadow-sm mb-5 animate-bounce-slow">
                        <Sparkles size={24} className="text-purple-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight font-display mb-2">Create Account</h2>
                    <p className="text-slate-500 font-medium">Begin your journey today.</p>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm animate-shake shadow-sm">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {message && (
                    <div className="mb-6 p-4 bg-green-50/80 backdrop-blur-sm border border-green-100 rounded-2xl flex items-start gap-3 text-green-700 text-sm animate-pulse-glow shadow-sm">
                        <CheckCircle size={18} className="shrink-0 mt-0.5" />
                        <span className="font-medium">{message}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User size={18} className="text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/50 focus:bg-white transition-all duration-300 font-medium hover:border-slate-200 hover:bg-white/80"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={18} className="text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/50 focus:bg-white transition-all duration-300 font-medium hover:border-slate-200 hover:bg-white/80"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={18} className="text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/50 focus:bg-white transition-all duration-300 font-medium hover:border-slate-200 hover:bg-white/80"
                                placeholder="Create a password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Sign Up</span>
                                <UserPlus size={18} className="opacity-90" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-slate-100/60 text-center">
                    <p className="text-slate-500 text-sm font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-600 hover:text-purple-700 font-bold hover:underline decoration-2 decoration-purple-200 underline-offset-4 transition-all">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
