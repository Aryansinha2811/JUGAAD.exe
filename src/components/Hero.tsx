import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const words = ["Interviews.", "Confidence.", "Your Career."];

export default function Hero() {
    const [wordIndex, setWordIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setWordIndex((i) => (i + 1) % words.length);
                setFade(true);
            }, 300);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 mb-5">
            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-600 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-8 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                    JUGAAD.exe · BuildX 2026
                </div>

                {/* Headline */}
                <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-none mb-4 mt-10 tracking-tight">
                    AI-POWERED
                </h1>
                <h1 className="text-6xl md:text-8xl font-black leading-none mb-6 tracking-tight">
                    <span
                        style={{
                            transition: "opacity 0.3s ease",
                            opacity: fade ? 1 : 0,
                            color: "#111",
                            display: "inline-block",
                        }}
                    >
                        {words[wordIndex]}
                    </span>
                </h1>

                <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                    An agentic AI platform that conducts personalized mock interviews —
                    adapting in real-time, analyzing your responses, and building your
                    confidence for the real thing.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/features"
                        className="bg-black text-white font-black text-sm px-8 py-4 rounded-full hover:bg-gray-800 transition-colors tracking-widest uppercase shadow-lg"
                    >
                        Start Mock Interview
                    </Link>
                    <Link
                        to="/about"
                        className="border border-gray-300 text-gray-700 font-bold text-sm px-8 py-4 rounded-full hover:border-gray-500 hover:bg-gray-50 transition-all tracking-widest uppercase"
                    >
                        Learn More
                    </Link>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto">
                    {[
                        { label: "Interview Modes", value: "3+" },
                        { label: "AI Agents", value: "Agentic" },
                        { label: "Cost", value: "$0 API" },
                    ].map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="text-3xl font-black text-gray-900">{s.value}</div>
                            <div className="text-gray-400 text-xs uppercase tracking-widest mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Corner label */}
            <div className="absolute bottom-8 right-8 text-gray-200 font-black text-6xl select-none pointer-events-none">
                BX
            </div>
        </main>
    );
}