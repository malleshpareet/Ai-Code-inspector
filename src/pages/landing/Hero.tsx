import { FaPlay } from "react-icons/fa";
import LightRays from "../../components/ui/LightRays";

interface HeroProps {
    onSignUpClick: () => void;
}

export default function Hero({ onSignUpClick }: HeroProps) {
    return (
        <section className="pt-32 pb-20 px-6 relative overflow-hidden">
            {/* Light Rays Background Effect */}
            <div className="absolute inset-0 w-full h-full z-0">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#60a5fa"
                    raysSpeed={1.2}
                    lightSpread={0.6}
                    rayLength={1.5}
                    followMouse={true}
                    mouseInfluence={0.2}
                    noiseAmount={0.15}
                    distortion={0.08}
                    pulsating={true}
                    fadeDistance={1.2}
                    saturation={2}
                    className="opacity-80"
                />
            </div>

            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] z-0"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="max-w-2xl">
                    <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                        Revolutionize <br />
                        Your Code <br />
                        Reviews with <span className="text-blue-500">AI</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
                        Save time, crush bugs, and ship code faster. Let AI handle the heavy lifting of code inspection.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={onSignUpClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-lg font-semibold transition shadow-lg shadow-blue-600/25 text-center"
                        >
                            Start Free Trial
                        </button>
                        <button className="flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-600 hover:bg-gray-800/50 text-white px-8 py-3.5 rounded-lg font-semibold transition text-center">
                            <FaPlay className="text-xs" />
                            See a Demo
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <div className="relative rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl bg-[#1e293b]/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700/50 bg-[#0f172a]">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <div className="ml-4 text-xs text-gray-500 font-mono">app.tsx</div>
                        </div>
                        <div className="p-1">
                            <img
                                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Code Editor Dashboard"
                                className="w-full h-auto rounded opacity-90"
                            />
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-[#1e293b] border border-gray-700 p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-white font-semibold text-sm">No Bugs Found</div>
                                <div className="text-gray-400 text-xs">Analysis Complete</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
