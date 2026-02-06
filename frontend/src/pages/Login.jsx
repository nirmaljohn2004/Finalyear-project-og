import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { firebaseLogin } from '../api/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            // Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if email is verified
            if (!user.emailVerified) {
                await signOut(auth);
                setError('Please verify your email address before logging in. Check your inbox.');
                setIsLoading(false);
                return;
            }

            // Get ID Token
            const token = await user.getIdToken();

            // Send to backend to get standard app token
            const data = await firebaseLogin(token);

            // Store app token
            localStorage.setItem('token', data.access_token);
            navigate('/dashboard');

        } catch (err) {
            console.error(err);
            if (err.code === 'auth/invalid-login-credentials' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Access to this account has been temporarily disabled. Try again later.');
            } else {
                setError(err.message || 'Login failed');
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

            {/* Login Card - Frosted Glass */}
            <div className="relative w-full max-w-[420px] bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_40px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-10 animate-slide-up z-10 hover:shadow-[0_20px_60px_rgb(0,0,0,0.06)] transition-shadow duration-500">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-white shadow-sm mb-5 animate-bounce-slow">
                        <Sparkles size={24} className="text-indigo-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight font-display mb-2">Welcome Back</h2>
                    <p className="text-slate-500 font-medium">Ready to continue your journey?</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm animate-shake shadow-sm">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white transition-all duration-300 font-medium hover:border-slate-200 hover:bg-white/80"
                                placeholder="hello@evocode.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                            <a href="#" className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors">Forgot?</a>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white transition-all duration-300 font-medium hover:border-slate-200 hover:bg-white/80"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <LogIn size={18} className="opacity-90" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-slate-100/60 text-center">
                    <p className="text-slate-500 text-sm font-medium">
                        New to EvoCode?{' '}
                        <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline decoration-2 decoration-indigo-200 underline-offset-4 transition-all">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
