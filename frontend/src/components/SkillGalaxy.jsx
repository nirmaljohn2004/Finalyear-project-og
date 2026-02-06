import { motion } from 'framer-motion';
import { Lock, Check, Star, Zap, Sparkles } from 'lucide-react';

const SkillNode = ({ x, y, title, status, onClick, delay }) => {
    const isMastered = status === 'MASTERED';
    const isUnlocked = status !== 'LOCKED';
    const isWeak = status === 'WEAK';

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay, duration: 0.5, type: 'spring' }}
            style={{ left: x, top: y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
        >
            <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClick}
                className={`
                    relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg transition-all
                    ${isMastered
                        ? 'bg-gradient-to-br from-green-400 to-emerald-600 ring-4 ring-emerald-500/20 shadow-emerald-500/40'
                        : isWeak
                            ? 'bg-gradient-to-br from-amber-400 to-orange-600 ring-4 ring-orange-500/20 shadow-orange-500/40 animate-pulse'
                            : isUnlocked
                                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 ring-4 ring-blue-500/20 shadow-blue-500/40 hover:shadow-blue-500/60'
                                : 'bg-slate-800 ring-4 ring-slate-700 shadow-xl cursor-not-allowed'}
                `}
            >
                {isMastered ? <Check className="text-white w-7 h-7 md:w-8 md:h-8" /> :
                    isWeak ? <Zap className="text-white w-7 h-7 md:w-8 md:h-8" /> :
                        !isUnlocked ? <Lock className="text-slate-500 w-6 h-6 md:w-7 md:h-7" /> :
                            <Star className="text-white w-7 h-7 md:w-8 md:h-8 fill-current" />}

                {isUnlocked && !isMastered && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-4px] rounded-full border border-blue-400/30 border-t-blue-400"
                    />
                )}
            </motion.button>

            {/* Enhanced Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
                <div className="bg-slate-900/95 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700 shadow-2xl min-w-[200px] max-w-[280px]">
                    <div className="text-sm font-bold text-white mb-2">{title}</div>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isMastered ? 'bg-emerald-500/20 text-emerald-300' :
                                isWeak ? 'bg-orange-500/20 text-orange-300' :
                                    isUnlocked ? 'bg-blue-500/20 text-blue-300' :
                                        'bg-slate-700/50 text-slate-400'
                            }`}>
                            {isMastered ? '✓ Mastered' : isWeak ? '⚡ Weak' : isUnlocked ? '🔓 Unlocked' : '🔒 Locked'}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ConnectionLine = ({ start, end, delay, status }) => {
    const isMastered = status === 'MASTERED';

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            <motion.line
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay, duration: 1, ease: "easeInOut" }}
                x1={start.rawX + '%'}
                y1={start.rawY + '%'}
                x2={end.rawX + '%'}
                y2={end.rawY + '%'}
                stroke={isMastered ? "#10b981" : "#3b82f6"}
                strokeWidth={isMastered ? 2.5 : 1.5}
                strokeDasharray={isMastered ? "none" : "5,5"}
                className={isMastered ? "opacity-40" : "opacity-25"}
            />
        </svg>
    );
};

const SkillGalaxy = ({ topics, onNodeClick }) => {
    // Generate Bounded Spiral Layout
    const generateLayout = (items) => {
        const layout = [];
        const count = items.length;
        const centerX = 50;
        const centerY = 50;

        // Dynamically adjust radius based on count to prevent overflow
        const baseRadius = count > 30 ? 32 : count > 20 ? 36 : 38;
        const scale = count > 1 ? baseRadius / Math.sqrt(count - 1) : 1;

        // Golden Angle (137.5 degrees in radians)
        const goldenAngle = 2.39996;

        items.forEach((item, index) => {
            if (index === 0) {
                layout.push({ ...item, x: '50%', y: '50%', rawX: 50, rawY: 50 });
                return;
            }

            // Fermat's Spiral
            const angle = index * goldenAngle;
            const radius = scale * Math.sqrt(index);

            // Calculate position
            const rawX = centerX + (Math.cos(angle) * radius);
            const rawY = centerY + (Math.sin(angle) * radius);

            // Clamp to safe bounds [10, 90] with margin
            const x = Math.max(10, Math.min(90, rawX));
            const y = Math.max(10, Math.min(90, rawY));

            layout.push({ ...item, x: `${x}%`, y: `${y}%`, rawX: x, rawY: y });
        });
        return layout;
    };

    const nodes = generateLayout(topics);

    return (
        <div className="relative w-full aspect-square md:aspect-[16/9] max-w-5xl mx-auto my-10 bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-700/50">
            {/* Space Background */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover opacity-40 mix-blend-screen pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/50 to-slate-900 pointer-events-none"></div>

            {/* Connecting Lines */}
            <div className="absolute inset-0 w-full h-full">
                {nodes.map((node, i) => {
                    if (i === 0) return null;
                    const prev = nodes[i - 1];
                    return (
                        <ConnectionLine
                            key={`line-${i}`}
                            start={prev}
                            end={node}
                            delay={i * 0.08}
                            status={prev.status === 'MASTERED' && node.status !== 'LOCKED' ? 'MASTERED' : 'LOCKED'}
                        />
                    );
                })}
            </div>

            {/* Nodes */}
            {nodes.map((node, i) => (
                <SkillNode
                    key={node.id}
                    {...node}
                    onClick={() => node.status !== 'LOCKED' && onNodeClick(node.id)}
                    delay={i * 0.12}
                />
            ))}

            {/* Title */}
            <div className="absolute bottom-6 left-6 z-30">
                <h3 className="text-white font-black text-2xl tracking-tight drop-shadow-lg flex items-center gap-2">
                    <Sparkles className="text-yellow-400 animate-pulse" /> Skill Galaxy
                </h3>
                <p className="text-slate-400 text-sm font-medium">Explore your learning constellation</p>
            </div>
        </div>
    );
};

export default SkillGalaxy;
