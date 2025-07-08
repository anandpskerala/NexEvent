import { useState, useEffect } from 'react';
import { Home, ArrowLeft, Zap, Terminal, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [glitchText, setGlitchText] = useState('404');
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoaded(true);

        const glitchInterval = setInterval(() => {
            const glitchChars = ['4', '0', '4', '█', '▓', '▒', '░'];
            const randomGlitch = Array.from({ length: 3 }, () =>
                glitchChars[Math.floor(Math.random() * glitchChars.length)]
            ).join('');

            setGlitchText(randomGlitch);

            setTimeout(() => setGlitchText('404'), 100);
        }, 3000);

        return () => clearInterval(glitchInterval);
    }, []);

    const handleGoHome = () => {
        navigate("/");
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                    animation: 'grid-move 20s linear infinite'
                }}></div>
            </div>

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-300/30 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
                <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-green-300/30 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
            </div>

            <div className="absolute inset-0 pointer-events-none">
                <Cpu className="absolute top-1/6 left-1/6 text-blue-500 w-8 h-8 animate-pulse opacity-70" />
                <Terminal className="absolute top-2/3 right-1/5 text-green-500 w-6 h-6 animate-pulse opacity-70 animation-delay-1000" />
                <Zap className="absolute bottom-1/4 left-1/3 text-pink-500 w-7 h-7 animate-pulse opacity-70 animation-delay-1500" />
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className={`text-center max-w-2xl w-full transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>

                    <div className="mb-8 relative">
                        <h1 className="text-8xl md:text-9xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4 relative">
                            {glitchText}
                        </h1>
                        <div className="absolute inset-0 text-8xl md:text-9xl font-mono font-black text-blue-400 opacity-20 blur-sm animate-pulse">
                            404
                        </div>
                        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto rounded-full shadow-lg shadow-blue-400/30"></div>
                    </div>

                    <div className="mb-12 space-y-6">
                        <div className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 rounded-xl p-6 font-mono text-left max-w-md mx-auto shadow-xl shadow-blue-500/10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse animation-delay-300"></div>
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse animation-delay-600"></div>
                            </div>
                            <div className="text-blue-600">
                                <span className="text-pink-600 font-bold">ERROR:</span> Page not found
                            </div>
                            <div className="text-green-600 mt-2">
                                <span className="text-blue-600 font-bold">STATUS:</span> 404 - Resource unavailable
                            </div>
                            <div className="text-pink-600 mt-2">
                                <span className="text-green-600 font-bold">SOLUTION:</span> Navigate to safety zone
                            </div>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                            <span className="text-blue-600">SYSTEM</span> <span className="text-pink-600">MALFUNCTION</span>
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            The requested data packet has been lost in the digital matrix.
                            <span className="text-blue-600 font-semibold"> Initiating recovery protocols...</span>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <button
                            onClick={handleGoHome}
                            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 border-2 border-blue-400/30 cursor-pointer"
                        >
                            <Home size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                            RETURN HOME
                        </button>

                        <button
                            onClick={handleGoBack}
                            className="group flex items-center justify-center gap-3 bg-white border-2 border-pink-400 text-pink-600 hover:bg-pink-500 hover:text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-pink-400/30 cursor-pointer"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
                            GO BACK
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60 animate-pulse"></div>

            <style>{`
                @keyframes grid-move {
                0% { transform: translate(0, 0); }
                100% { transform: translate(50px, 50px); }
                }
                .animation-delay-300 { animation-delay: 300ms; }
                .animation-delay-600 { animation-delay: 600ms; }
                .animation-delay-1000 { animation-delay: 1000ms; }
                .animation-delay-1500 { animation-delay: 1500ms; }
                .animation-delay-2000 { animation-delay: 2000ms; }
            `}</style>
        </div>
    );
}

export default Error404