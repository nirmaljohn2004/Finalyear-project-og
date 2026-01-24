import { useNavigate, useParams } from 'react-router-dom';

const LevelSelect = () => {
    const { language } = useParams();
    const navigate = useNavigate();

    const handleLevelSelect = (level) => {
        navigate(`/learning/${language}/quiz?level=${level}`);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto h-full flex flex-col justify-center font-inter">
            <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-900 tracking-tight">
                Select Your Level
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Beginner Card */}
                <div
                    onClick={() => handleLevelSelect('beginner')}
                    className="group bg-white p-6 rounded-2xl border border-green-100 hover:border-green-500 cursor-pointer transition-all hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1"
                >
                    <div className="w-14 h-14 bg-green-100 rounded-xl mb-4 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        🌱
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Beginner</h2>
                    <p className="text-gray-500 leading-relaxed text-sm">For users new to programming or {language} basics.</p>
                </div>

                {/* Intermediate Card */}
                <div
                    onClick={() => handleLevelSelect('intermediate')}
                    className="group bg-white p-6 rounded-2xl border border-yellow-100 hover:border-yellow-500 cursor-pointer transition-all hover:shadow-xl hover:shadow-yellow-500/10 hover:-translate-y-1"
                >
                    <div className="w-14 h-14 bg-yellow-100 rounded-xl mb-4 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        ⚡
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">Intermediate</h2>
                    <p className="text-gray-500 leading-relaxed text-sm">For users familiar with basics and core concepts.</p>
                </div>

                {/* Expert Card */}
                <div
                    onClick={() => handleLevelSelect('expert')}
                    className="group bg-white p-6 rounded-2xl border border-red-100 hover:border-red-500 cursor-pointer transition-all hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1"
                >
                    <div className="w-14 h-14 bg-red-100 rounded-xl mb-4 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        🔥
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">Expert</h2>
                    <p className="text-gray-500 leading-relaxed text-sm">For users confident in {language} and real-world usage.</p>
                </div>
            </div>
        </div>
    );
};

export default LevelSelect;
