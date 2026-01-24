import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Brain, Rocket, Users, Database, Server, Smartphone, Layers, Hexagon, Zap, Github, Linkedin, Twitter } from 'lucide-react';
import logo from '../assets/logo.png';

const LandingPage = () => {
    const navigate = useNavigate();

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="EvoCode Logo" className="h-16 w-auto object-contain" />
                        {/* Text removed as it is likely in the logo, or we can keep it if logo is just symbol. 
                             The generated logo had text. If I shrink it to h-12, text might be small. 
                             Let's assume the user prefers the full logo image. 
                             If the image has text "EvoCode", displaying it twice is bad. 
                             I'll assume the image is the full lockup. */}
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2.5 text-slate-600 font-bold hover:text-blue-600 transition"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-24 pb-16 lg:pt-36 lg:pb-32 px-4 overflow-hidden relative font-inter">

                {/* 3D Abstract Elements */}
                <div className="absolute top-40 right-[10%] w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl rotate-12 shadow-2xl shadow-blue-500/30 hidden lg:block animate-float"></div>
                <div className="absolute top-60 left-[10%] w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl -rotate-12 shadow-xl shadow-purple-500/30 hidden lg:block animate-float-delayed"></div>
                <div className="absolute bottom-40 right-[20%] w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl rotate-45 shadow-lg shadow-emerald-500/30 hidden lg:block animate-float"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div initial="initial" animate="animate" variants={fadeIn} className="inline-block mb-4">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border border-blue-100 flex items-center gap-2 mx-auto w-fit shadow-sm">
                            <Zap size={14} fill="currentColor" /> The Future of Coding Education
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-4xl lg:text-7xl font-black text-slate-900 leading-tight mb-6 tracking-tight"
                    >
                        Master Code with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                            Adaptive AI
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
                    >
                        EvoCode evolves with you. Our AI-driven platform analyzes your learning style in real-time, tailoring a personalized curriculum to ensure you master every concept efficiently.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-base hover:bg-slate-800 transition shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
                        >
                            <Rocket className="w-4 h-4 group-hover:animate-bounce" />
                            Start Your Journey
                        </button>
                        <button
                            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                            className="px-6 py-3.5 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold text-base hover:border-slate-300 transition flex items-center justify-center gap-2 hover:-translate-y-1"
                        >
                            Learn More
                        </button>
                    </motion.div>
                </div>

                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-40 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[128px]" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-400 rounded-full blur-[128px]" />
                </div>
            </section>

            {/* Features Glass Grid */}
            <section id="features" className="py-20 bg-slate-50 relative overflow-hidden font-inter">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">Why EvoCode?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-base font-medium">We combine cutting-edge AI with proven pedagogical methods to create a personalized learning experience like no other.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Brain className="w-8 h-8 text-white" />}
                            color="from-purple-500 to-indigo-600"
                            title="Psychometric Profiling"
                            description="We analyze your learning style (Visual, Practical, Theoretical) to tailor content specifically for you."
                        />
                        <FeatureCard
                            icon={<Layers className="w-8 h-8 text-white" />}
                            color="from-blue-500 to-cyan-500"
                            title="Adaptive Curriculum"
                            description="Weak in loops? We give you more practice. Mastered functions? We move you forward. No wasted time."
                        />
                        <FeatureCard
                            icon={<Users className="w-8 h-8 text-white" />}
                            color="from-emerald-500 to-teal-600"
                            title="AI Pair Programmer"
                            description="Get real-time help, code reviews, and explanations from your personalized AI assistant, available 24/7."
                        />
                    </div>
                </div>
            </section>

            {/* Developers Section */}
            <section className="py-20 bg-white relative font-inter">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-xs mb-2 block">The Minds Behind EvoCode</span>
                        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">Meet the Team</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-base font-medium">Passionate developers building the future of education.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DeveloperCard name="Nirmal" role="Full Stack Developer" color="bg-gradient-to-br from-blue-500 to-indigo-600" github="https://github.com/nirmaljohn2004" linkedin="https://www.linkedin.com/in/nirmal-john-732690254" />
                        <DeveloperCard name="Pranav" role="AI Engineer" color="bg-gradient-to-br from-purple-500 to-pink-600" github="https://github.com" linkedin="https://linkedin.com" />
                        <DeveloperCard name="Sreelakshmi" role="Frontend Specialist" color="bg-gradient-to-br from-emerald-500 to-teal-600" github="https://github.com" linkedin="https://linkedin.com" />
                        <DeveloperCard name="Neha" role="Backend Architect" color="bg-gradient-to-br from-orange-500 to-red-600" github="https://github.com" linkedin="https://linkedin.com" />
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-20 bg-slate-50 border-t border-slate-100 font-inter">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-black text-slate-900 mb-3">Powered By Modern Tech</h2>
                        <p className="text-slate-600 font-medium text-sm">Built with the robust technologies to ensure speed, security, and scalability.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <TechCard icon={<Smartphone className="w-6 h-6" />} name="React + Vite" />
                        <TechCard icon={<Server className="w-6 h-6" />} name="FastAPI (Python)" />
                        <TechCard icon={<Brain className="w-6 h-6" />} name="Google Gemini AI" />
                        <TechCard icon={<Database className="w-6 h-6" />} name="Firestore" />
                    </div>
                </div>
            </section>

            {/* Developers / Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 font-inter">
                <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg mb-4">
                        <Code2 size={20} />
                    </div>
                    <p className="mb-6 font-medium text-slate-300 text-base max-w-md">Empowering the next generation of developers through adaptive, AI-driven education.</p>
                    <div className="flex gap-4 mb-6">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-800 rounded-full hover:bg-slate-700 transition"><Github size={18} /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-800 rounded-full hover:bg-slate-700 transition"><Linkedin size={18} /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-800 rounded-full hover:bg-slate-700 transition"><Twitter size={18} /></a>
                    </div>
                    <p className="text-xs opacity-60">© 2025 EvoCode Learning Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, color }) => (
    <div className="relative group p-6 rounded-[1.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-bl-[80px] transition-transform group-hover:scale-110`}></div>
        <div className={`mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 leading-relaxed font-medium text-sm">{description}</p>
    </div>
);

const DeveloperCard = ({ name, role, color, github = "#", linkedin = "#" }) => (
    <div className="group relative bg-white p-5 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center">
        <div className={`w-20 h-20 mx-auto mb-3 rounded-full ${color} flex items-center justify-center text-white text-2xl font-black shadow-lg transform group-hover:scale-110 transition-transform`}>
            {name[0]}
        </div>
        <h3 className="text-lg font-bold text-slate-900">{name}</h3>
        <p className="text-slate-500 font-medium text-xs">{role}</p>
        <div className="flex justify-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <a href={github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
                <Github size={18} />
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                <Linkedin size={18} />
            </a>
        </div>
    </div>
);

const TechCard = ({ icon, name }) => (
    <div className="flex flex-col items-center p-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-slate-700 mb-2 transform hover:scale-110 transition-transform">{icon}</div>
        <span className="font-bold text-slate-900 text-sm">{name}</span>
    </div>
);

export default LandingPage;
