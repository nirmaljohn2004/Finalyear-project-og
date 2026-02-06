import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Brain, Rocket, Users, Database, Server, Smartphone, Layers, Hexagon, Zap, Github, Linkedin, Twitter, Sparkles, CheckCircle, ArrowRight, Play, ExternalLink, MessageSquare, Terminal, Cpu, Globe, Braces, Activity } from 'lucide-react';
import logo from '../assets/logo.png';

const LandingPage = () => {
    const navigate = useNavigate();

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 supports-[backdrop-filter]:bg-white/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <img src={logo} alt="EvoCode" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 hidden sm:block font-display tracking-tight">EvoCode</span>
                    </div>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 py-2.5 text-slate-600 font-bold hover:text-indigo-600 transition-colors text-sm"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-0.5 text-sm flex items-center gap-2"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-24 pb-20 lg:pt-40 lg:pb-32 px-4 overflow-hidden relative">

                {/* Enhanced Aesthetic Mesh Gradients */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-15%] right-[-10%] w-[45rem] h-[45rem] bg-indigo-200/40 rounded-full blur-[120px] mix-blend-multiply animate-float"></div>
                    <div className="absolute bottom-[0%] left-[-15%] w-[45rem] h-[45rem] bg-purple-200/40 rounded-full blur-[120px] mix-blend-multiply animate-float-delayed"></div>
                    <div className="absolute top-[30%] left-[40%] w-[35rem] h-[35rem] bg-pink-200/30 rounded-full blur-[100px] mix-blend-multiply animate-pulse-glow"></div>
                </motion.div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div initial="initial" animate="animate" variants={fadeIn} className="inline-block mb-6">
                        <div className="bg-white/60 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/60 shadow-sm flex items-center gap-2 mx-auto w-fit hover:border-indigo-200 transition-colors cursor-default">
                            <Sparkles size={14} className="fill-indigo-500 text-indigo-500 animate-pulse" />
                            <span className="text-xs font-bold tracking-wide uppercase text-indigo-900/80">The Future of Coding Education</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight font-display"
                    >
                        Master Coding with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                            Adaptive AI
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
                    >
                        Our AI acts as your <span className="text-slate-900 font-semibold under">personal pair programmer</span>, analyzing your code and tailoring the curriculum to your learning style in real-time.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <button
                            onClick={() => navigate('/signup')}
                            className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-base hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
                        >
                            <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Start Free Trial
                        </button>
                        <button
                            onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-white/40 backdrop-blur-md text-slate-700 border border-white/60 rounded-2xl font-bold text-base hover:bg-white hover:shadow-lg hover:border-white transition-all flex items-center justify-center gap-2 hover:-translate-y-1 group"
                        >
                            <Play className="w-4 h-4 fill-slate-700 group-hover:scale-110 transition-transform" />
                            See How It Works
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Bento Grid Features Section */}
            <section className="py-24 px-4 relative font-sans">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-bold tracking-wider uppercase text-xs mb-3 block">Powerful Tools</span>
                        <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6 font-display tracking-tight">Everything You Need to Scale</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">Experience a learning environment that feels like a professional workspace.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] lg:auto-rows-[350px]">

                        {/* Large Tile: Multi-Agent Architecture */}
                        <BentoItem className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-indigo-50 to-blue-50">
                            <div className="h-full flex flex-col relative overflow-hidden">
                                <div className="p-8 pb-0 z-10">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/30">
                                        <Users size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Multi-Agent Architecture</h3>
                                    <p className="text-slate-600 max-w-md">Our specialized agents work together to accelerate your learning. The Planner creates your roadmap, the Tutor teaches, and the Reviewer optimizes your code.</p>
                                </div>

                                {/* CSS Animation of connecting agents */}
                                <div className="absolute bottom-0 right-0 left-0 top-48 overflow-hidden flex items-center justify-center">
                                    <div className="relative w-full max-w-md h-full">
                                        {/* Connecting Lines */}
                                        <svg className="absolute inset-0 w-full h-full z-0 opacity-20 pointer-events-none">
                                            <line x1="50%" y1="20%" x2="20%" y2="70%" stroke="#4F46E5" strokeWidth="2" strokeDasharray="5,5" />
                                            <line x1="50%" y1="20%" x2="80%" y2="70%" stroke="#4F46E5" strokeWidth="2" strokeDasharray="5,5" />
                                            <line x1="20%" y1="70%" x2="80%" y2="70%" stroke="#4F46E5" strokeWidth="2" />
                                        </svg>

                                        {/* Planner Agent (Top) */}
                                        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 bg-white p-3 rounded-2xl shadow-lg border border-indigo-100 flex items-center gap-3 w-40 z-10 animate-float">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><Brain size={16} /></div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-900">Planner Agent</div>
                                                <div className="text-[10px] text-slate-500">Orchestrating...</div>
                                            </div>
                                        </div>

                                        {/* Tutor Agent (Bottom Left) */}
                                        <div className="absolute bottom-[20%] left-[10%] bg-white p-3 rounded-2xl shadow-lg border border-indigo-100 flex items-center gap-3 w-40 z-10 animate-float-delayed">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><MessageSquare size={16} /></div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-900">Tutor Agent</div>
                                                <div className="text-[10px] text-slate-500">Explaining...</div>
                                            </div>
                                        </div>

                                        {/* Reviewer Agent (Bottom Right) */}
                                        <div className="absolute bottom-[20%] right-[10%] bg-white p-3 rounded-2xl shadow-lg border border-indigo-100 flex items-center gap-3 w-40 z-10 animate-float" style={{ animationDelay: '1.5s' }}>
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle size={16} /></div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-900">QA Agent</div>
                                                <div className="text-[10px] text-slate-500">Verifying...</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BentoItem>

                        {/* Tall Tile: AI Chat */}
                        <BentoItem className="md:row-span-2 bg-gradient-to-br from-purple-50 to-pink-50">
                            <div className="h-full flex flex-col relative overflow-hidden p-6 z-10">
                                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-purple-500/30">
                                    <MessageSquare size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">24/7 AI Tutor</h3>
                                <p className="text-slate-600 text-sm mb-6">Stuck? Ask your personal AI assistant for explanations.</p>

                                <div className="flex-1 flex flex-col gap-3 font-medium text-xs">
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 self-start max-w-[90%]">
                                        <p className="text-slate-700">How do closures work in JS?</p>
                                    </div>
                                    <div className="bg-purple-600 p-3 rounded-2xl rounded-tr-none shadow-md shadow-purple-200 self-end max-w-[90%]">
                                        <p className="text-white">A closure is the combination of a function bundled together with references to its surrounding state!</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 self-start max-w-[90%]">
                                        <p className="text-slate-700">Can you give me an example?</p>
                                    </div>
                                </div>
                            </div>
                        </BentoItem>

                        {/* Wide Tile: Stats */}
                        <BentoItem className="md:col-span-2 bg-white">
                            <div className="h-full flex flex-col md:flex-row items-center p-8 gap-8">
                                <div className="flex-1">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/30">
                                        <Zap size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Gamified Progress</h3>
                                    <p className="text-slate-600 text-sm">Track your daily streaks, earn XP, and level up as you master new concepts. Visual analytics help you stay motivated.</p>
                                </div>
                                <div className="flex-1 w-full bg-slate-50 rounded-xl p-4 border border-slate-100 relative overflow-hidden">
                                    <div className="flex justify-between items-end h-24 gap-2">
                                        {[40, 60, 45, 70, 50, 80, 65].map((h, i) => (
                                            <div key={i} className="w-full bg-emerald-400 rounded-t-lg opacity-80" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </BentoItem>

                        {/* Small Tile: Interviews */}
                        <BentoItem className="bg-slate-900 text-white group cursor-pointer overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 z-0"></div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-md group-hover:scale-110 transition-transform">
                                    <Users size={24} className="text-blue-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-1">Mock Interviews</h3>
                                <p className="text-slate-400 text-xs">Simulate FAANG interviews.</p>
                            </div>
                        </BentoItem>

                    </div>
                </div >
            </section >

            {/* How It Works Section */}
            < section id="how-it-works" className="py-24 relative overflow-hidden" >
                <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-24">
                        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6 font-display tracking-tight">Your Path to Mastery</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">We've reimagined the learning process to be simpler, faster, and more effective.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[2.5rem] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 -z-10"></div>

                        <StepCard
                            number="01"
                            title="Psychometric Quiz"
                            description="We analyze your logic, memory, and coding aptitude to understand exactly how you learn best."
                            icon={<Brain />}
                            color="bg-indigo-50 text-indigo-600 border-indigo-100"
                        />
                        <StepCard
                            number="02"
                            title="AI Syllabus Generation"
                            description="Our engine builds a custom roadmap. Weak in loops? You get more practice. Fast learner? You skip ahead."
                            icon={<Layers />}
                            color="bg-purple-50 text-purple-600 border-purple-100"
                        />
                        <StepCard
                            number="03"
                            title="Interactive Mastery"
                            description="Learn with an AI pair programmer, solve real-world problems, and track your evolution."
                            icon={<Code2 />}
                            color="bg-pink-50 text-pink-600 border-pink-100"
                        />
                    </div>
                </div>
            </section >

            {/* Team Section (Restored & Enhanced) */}
            < section className="py-24 relative overflow-hidden" >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 -z-10"></div>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-purple-600 font-bold tracking-wider uppercase text-xs mb-3 block">The Minds Behind EvoCode</span>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 font-display tracking-tight">Meet the Team</h2>
                        <p className="text-slate-600 max-w-xl mx-auto text-lg">A passionate group of developers dedicated to revolutionizing education.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <DeveloperCard
                            name="Nirmal"
                            role="Full Stack Lead"
                            initials="N"
                            gradient="from-blue-500 to-indigo-600"
                            delay={0}
                        />
                        <DeveloperCard
                            name="Pranav"
                            role="AI Architect"
                            initials="P"
                            gradient="from-purple-500 to-pink-600"
                            delay={0.1}
                        />
                        <DeveloperCard
                            name="Sreelakshmi"
                            role="Frontend Specialist"
                            initials="S"
                            gradient="from-emerald-500 to-teal-600"
                            delay={0.2}
                        />
                        <DeveloperCard
                            name="Neha"
                            role="Backend Engineer"
                            initials="N"
                            gradient="from-orange-500 to-red-600"
                            delay={0.3}
                        />
                    </div>
                </div>
            </section >

            {/* Tech Stack Section */}
            <section className="py-20 border-t border-slate-100 bg-slate-50/50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 text-center mb-12">
                    <span className="text-slate-500 font-bold tracking-wider uppercase text-xs mb-2 block">Powering the Platform</span>
                    <h2 className="text-2xl font-black text-slate-900 font-display">Built with Modern Tech</h2>
                </div>

                {/* Infinite Slider */}
                <div className="relative flex overflow-x-hidden group">
                    <div className="flex animate-marquee gap-8 whitespace-nowrap py-4">
                        <TechBadge name="React" icon={<Braces size={16} />} color="text-cyan-500" bg="bg-cyan-500/10" />
                        <TechBadge name="Tailwind CSS" icon={<Sparkles size={16} />} color="text-teal-500" bg="bg-teal-500/10" />
                        <TechBadge name="Framer Motion" icon={<Zap size={16} />} color="text-purple-500" bg="bg-purple-500/10" />
                        <TechBadge name="Python" icon={<Terminal size={16} />} color="text-yellow-600" bg="bg-yellow-500/10" />
                        <TechBadge name="FastAPI" icon={<Zap size={16} />} color="text-emerald-600" bg="bg-emerald-500/10" />
                        <TechBadge name="LangChain" icon={<Activity size={16} />} color="text-orange-500" bg="bg-orange-500/10" />
                        <TechBadge name="Gemini AI" icon={<Brain size={16} />} color="text-blue-500" bg="bg-blue-500/10" />
                        <TechBadge name="PostgreSQL" icon={<Database size={16} />} color="text-indigo-500" bg="bg-indigo-500/10" />
                        <TechBadge name="Docker" icon={<Server size={16} />} color="text-blue-600" bg="bg-blue-600/10" />

                        {/* Duplicate for seamless loop */}
                        <TechBadge name="React" icon={<Braces size={16} />} color="text-cyan-500" bg="bg-cyan-500/10" />
                        <TechBadge name="Tailwind CSS" icon={<Sparkles size={16} />} color="text-teal-500" bg="bg-teal-500/10" />
                        <TechBadge name="Framer Motion" icon={<Zap size={16} />} color="text-purple-500" bg="bg-purple-500/10" />
                        <TechBadge name="Python" icon={<Terminal size={16} />} color="text-yellow-600" bg="bg-yellow-500/10" />
                        <TechBadge name="FastAPI" icon={<Zap size={16} />} color="text-emerald-600" bg="bg-emerald-500/10" />
                        <TechBadge name="LangChain" icon={<Activity size={16} />} color="text-orange-500" bg="bg-orange-500/10" />
                        <TechBadge name="Gemini AI" icon={<Brain size={16} />} color="text-blue-500" bg="bg-blue-500/10" />
                        <TechBadge name="PostgreSQL" icon={<Database size={16} />} color="text-indigo-500" bg="bg-indigo-500/10" />
                        <TechBadge name="Docker" icon={<Server size={16} />} color="text-blue-600" bg="bg-blue-600/10" />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            < section className="py-24 px-4 pb-32" >
                <div className="max-w-5xl mx-auto relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2.5rem] rotate-1 opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-1000"></div>
                    <div className="relative bg-[#0F172A] rounded-[2rem] p-12 md:p-20 text-center overflow-hidden border border-white/10">
                        {/* Background blobs for CTA */}
                        <div className="absolute top-[-50%] left-[-20%] w-[30rem] h-[30rem] bg-indigo-500/30 rounded-full blur-[80px] animate-pulse-glow"></div>
                        <div className="absolute bottom-[-50%] right-[-20%] w-[30rem] h-[30rem] bg-pink-500/30 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: '1s' }}></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tight font-display">Ready to Evolve?</h2>
                            <p className="text-slate-300 text-xl max-w-xl mx-auto mb-12 leading-relaxed">Join thousands of developers mastering code faster with EvoCode's adaptive AI engine.</p>

                            <button
                                onClick={() => navigate('/signup')}
                                className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center gap-2"
                            >
                                Get Started for Free <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section >

            {/* Footer */}
            < footer className="bg-white border-t border-slate-100 py-16" >
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">E</div>
                        <span className="font-bold text-slate-900 text-xl tracking-tight">EvoCode</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">© 2025 EvoCode Inc. Built with ❤️ for developers.</p>
                    <div className="flex gap-4">
                        <SocialLink href="https://github.com" icon={<Github size={18} />} />
                        <SocialLink href="https://twitter.com" icon={<Twitter size={18} />} />
                        <SocialLink href="https://linkedin.com" icon={<Linkedin size={18} />} />
                    </div>
                </div>
            </footer >
        </div >
    );
};

// Sub-components for cleaner code
const BentoItem = ({ children, className = "" }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-md ${className}`}
    >
        {children}
    </motion.div>
);

const StepCard = ({ number, title, description, icon, color }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="relative flex flex-col items-center text-center group"
    >
        <div className={`w-20 h-20 rounded-[2rem] ${color} border flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 z-10`}>
            {React.cloneElement(icon, { size: 32 })}
        </div>
        <span className="text-8xl font-black text-slate-100/50 absolute top-[-1rem] -z-10 select-none group-hover:text-slate-200/80 transition-colors font-display">{number}</span>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm max-w-[260px]">{description}</p>
    </motion.div>
);

const DeveloperCard = ({ name, role, initials, gradient, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: delay, duration: 0.5 }}
        whileHover={{ y: -5 }}
        className="relative group p-6 mx-auto w-full max-w-[280px]"
    >
        <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-lg group-hover:shadow-2xl transition-all duration-500"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${gradient} p-1 mb-5 group-hover:scale-105 transition-transform duration-300 shadow-lg`}>
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-600">
                    {initials}
                </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1 font-display">{name}</h3>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">{role}</p>
            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                <a href="#" className="p-2 text-slate-400 hover:text-slate-900 bg-white/50 hover:bg-white rounded-full transition-all hover:scale-110"><Github size={18} /></a>
                <a href="#" className="p-2 text-slate-400 hover:text-blue-600 bg-white/50 hover:bg-white rounded-full transition-all hover:scale-110"><Linkedin size={18} /></a>
                <a href="#" className="p-2 text-slate-400 hover:text-blue-400 bg-white/50 hover:bg-white rounded-full transition-all hover:scale-110"><Twitter size={18} /></a>
            </div>
        </div>
    </motion.div>
);

const SocialLink = ({ href, icon }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 p-3 rounded-full hover:bg-slate-100 hover:scale-110 border border-transparent hover:border-slate-200">
        {icon}
    </a>
);

const TechBadge = ({ name, icon, color, bg }) => (
    <div className={`flex items-center gap-2 px-6 py-3 rounded-full ${bg} border border-white/50 backdrop-blur-sm shadow-sm`}>
        <span className={color}>{icon}</span>
        <span className="font-bold text-slate-700 text-sm">{name}</span>
    </div>
);

export default LandingPage;
