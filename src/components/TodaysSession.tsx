import { useState, useEffect } from "react";

interface Props {
    resumeText: string;
    filename: string;
    onReset: () => void;
}

interface Question {
    id: number;
    category: "Technical" | "Behavioral" | "Experience";
    question: string;
}

const ALL_QUESTIONS: Question[] = [
    { id: 1, category: "Technical", question: "Explain the difference between REST and GraphQL APIs." },
    { id: 2, category: "Technical", question: "What is the difference between SQL and NoSQL databases? When would you use each?" },
    { id: 3, category: "Technical", question: "Explain how async/await works under the hood in JavaScript." },
    { id: 4, category: "Technical", question: "What is a closure in programming? Give a real-world example." },
    { id: 5, category: "Technical", question: "How does indexing improve database query performance?" },
    { id: 6, category: "Technical", question: "What is the difference between authentication and authorization?" },
    { id: 7, category: "Technical", question: "Explain the concept of microservices vs monolithic architecture." },
    { id: 8, category: "Technical", question: "What are React hooks and why were they introduced?" },
    { id: 9, category: "Technical", question: "How would you optimize a slow-loading web page?" },
    { id: 10, category: "Technical", question: "What is the CAP theorem and how does it affect distributed systems?" },
    { id: 11, category: "Behavioral", question: "Tell me about a time you had to meet a tight deadline. How did you handle it?" },
    { id: 12, category: "Behavioral", question: "Describe a situation where you disagreed with a teammate. What did you do?" },
    { id: 13, category: "Behavioral", question: "Tell me about a project you are most proud of and why." },
    { id: 14, category: "Behavioral", question: "How do you prioritize tasks when you have multiple deadlines at once?" },
    { id: 15, category: "Behavioral", question: "Describe a time you received critical feedback. How did you respond?" },
    { id: 16, category: "Behavioral", question: "Tell me about a time you had to learn something new very quickly." },
    { id: 17, category: "Experience", question: "Walk me through your most complex project end-to-end." },
    { id: 18, category: "Experience", question: "What technologies in your resume do you feel most confident in, and why?" },
    { id: 19, category: "Experience", question: "Describe a bug you spent the most time debugging. How did you solve it?" },
    { id: 20, category: "Experience", question: "How have you contributed to improving a team's development workflow or process?" },
    { id: 21, category: "Experience", question: "Tell me about a time you worked on a cross-functional team. What was your role?" },
    { id: 22, category: "Experience", question: "Which project in your portfolio best reflects your current skill level and why?" },
];

const categoryColors: Record<Question["category"], string> = {
    Technical: "bg-blue-50 text-blue-600 border-blue-100",
    Behavioral: "bg-purple-50 text-purple-600 border-purple-100",
    Experience: "bg-amber-50 text-amber-600 border-amber-100",
};

function pickRandom(arr: Question[], n: number): Question[] {
    return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function computeScore(answers: Record<number, string>, questions: Question[]): number {
    let score = 0;
    for (const q of questions) {
        const len = (answers[q.id] || "").trim().length;
        if (len >= 200) score += 1;
        else if (len >= 100) score += 0.75;
        else if (len >= 40) score += 0.5;
        else if (len >= 10) score += 0.25;
    }
    return Math.round(score * 10) / 10;
}

function getFeedback(score: number): { label: string; color: string; ring: string; bar: string; text: string } {
    if (score >= 9) return {
        label: "Outstanding",
        color: "text-emerald-600",
        ring: "border-emerald-400",
        bar: "bg-emerald-500",
        text: "Exceptional performance! Your answers were detailed, structured, and showed deep understanding. You're well-prepared for real interviews — keep this momentum going.",
    };
    if (score >= 7) return {
        label: "Strong",
        color: "text-blue-600",
        ring: "border-blue-400",
        bar: "bg-blue-500",
        text: "Great job! Most of your answers were well thought-out and thorough. Focus on adding more concrete examples and metrics to push your score even higher.",
    };
    if (score >= 5) return {
        label: "Average",
        color: "text-amber-500",
        ring: "border-amber-400",
        bar: "bg-amber-400",
        text: "Decent effort, but there's room to grow. Some answers lacked depth or were too brief. Try elaborating with real examples from your experience — interviewers love specifics.",
    };
    if (score >= 3) return {
        label: "Needs Work",
        color: "text-orange-500",
        ring: "border-orange-400",
        bar: "bg-orange-400",
        text: "You've made a start, but many answers were too short to be convincing. Practice expanding your responses using the STAR method (Situation, Task, Action, Result).",
    };
    return {
        label: "Incomplete",
        color: "text-red-500",
        ring: "border-red-400",
        bar: "bg-red-400",
        text: "Most questions were left unanswered or barely touched. That's okay — this is practice! Try answering every question with at least 2–3 sentences to build your confidence.",
    };
}

interface ScoreCardProps {
    score: number;
    total: number;
    onRetry: () => void;
    onNewSet: () => void;
}

function ScoreCard({ score, total, onRetry, onNewSet }: ScoreCardProps) {
    const feedback = getFeedback(score);
    const pct = (score / total) * 100;

    return (
        <div className={`mt-6 bg-white rounded-2xl border-2 ${feedback.ring} shadow-sm overflow-hidden`}>
            {/* Top band */}
            <div className="h-1.5 w-full bg-gray-100">
                <div
                    className={`h-full ${feedback.bar} transition-all duration-700 rounded-full`}
                    style={{ width: `${pct}%` }}
                />
            </div>

            <div className="px-8 py-7">
                {/* Score display */}
                <div className="flex items-end gap-3 mb-1">
                    <span className={`text-7xl font-black leading-none ${feedback.color}`}>{score}</span>
                    <span className="text-2xl font-black text-gray-300 mb-2">/ {total}</span>
                </div>
                <p className={`text-sm font-black uppercase tracking-widest ${feedback.color}`}>{feedback.label}</p>

                {/* Divider */}
                <div className="my-5 border-t border-gray-100" />

                {/* Feedback paragraph */}
                <p className="text-gray-600 text-sm leading-relaxed">{feedback.text}</p>

                {/* Breakdown hint */}
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                    {(["≥200 chars → 1pt", "≥100 chars → 0.75pt", "≥40 chars → 0.5pt"] as const).map((hint) => (
                        <div key={hint} className="bg-gray-50 rounded-lg px-2 py-2.5 border border-gray-100">
                            <p className="text-gray-400 text-[10px] font-semibold leading-snug">{hint}</p>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onRetry}
                        className="flex-1 border border-gray-200 text-gray-600 text-sm font-bold py-3 rounded-full hover:border-gray-400 transition-all tracking-wide"
                    >
                        ✏️ Improve Answers
                    </button>
                    <button
                        onClick={onNewSet}
                        className="flex-1 bg-black text-white text-sm font-black py-3 rounded-full hover:bg-gray-800 transition-colors tracking-wider uppercase"
                    >
                        ↻ New Set
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TodaysSession({ filename, onReset }: Props) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showScore, setShowScore] = useState(false);

    useEffect(() => { setQuestions(pickRandom(ALL_QUESTIONS, 10)); }, []);

    const regenerate = () => {
        setQuestions(pickRandom(ALL_QUESTIONS, 10));
        setExpanded(null);
        setAnswers({});
        setShowScore(false);
    };

    const answered = Object.values(answers).filter((a) => a.trim().length > 0).length;
    const score = computeScore(answers, questions);

    return (
        <div className="w-full max-w-2xl mx-auto mt-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Today's Session</span>
                        </div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight truncate max-w-xs">{filename}</h2>
                    </div>
                    <button
                        onClick={onReset}
                        className="text-xs text-gray-400 hover:text-gray-700 font-bold uppercase tracking-wider transition-colors border border-gray-200 px-3 py-1.5 rounded-full hover:border-gray-400"
                    >
                        ← New Resume
                    </button>
                </div>

                {/* Progress bar */}
                <div className="px-8 pt-5 pb-2 flex items-center gap-4">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-black rounded-full transition-all duration-500"
                            style={{ width: `${(answered / questions.length) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs font-bold text-gray-400 whitespace-nowrap">
                        {answered} / {questions.length} answered
                    </span>
                </div>

                {/* Questions */}
                <div className="px-8 py-4 space-y-3">
                    {questions.map((q, i) => (
                        <div key={q.id} className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 transition-all">
                            <button
                                onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                                className="w-full flex items-center gap-4 p-4 text-left"
                            >
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-colors
                  ${answers[q.id]?.trim() ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}>
                                    {answers[q.id]?.trim() ? "✓" : i + 1}
                                </span>
                                <p className="flex-1 text-sm font-semibold text-gray-800 leading-snug">{q.question}</p>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${categoryColors[q.category]}`}>
                                        {q.category}
                                    </span>
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${expanded === q.id ? "rotate-180" : ""}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                            {expanded === q.id && (
                                <div className="px-4 pb-4">
                                    <textarea
                                        rows={3}
                                        value={answers[q.id] || ""}
                                        onChange={(e) => {
                                            setAnswers((a) => ({ ...a, [q.id]: e.target.value }));
                                            setShowScore(false);
                                        }}
                                        placeholder="Type your answer here..."
                                        className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-gray-400 placeholder-gray-300 bg-gray-50"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-400">{questions.length} questions · pool of {ALL_QUESTIONS.length}</p>
                    <button onClick={regenerate} className="text-xs font-black uppercase tracking-wider text-gray-500 hover:text-black transition-colors">
                        ↻ New Set
                    </button>
                </div>
            </div>

            {/* Check My Score button */}
            {!showScore && (
                <button
                    onClick={() => setShowScore(true)}
                    className="mt-5 w-full bg-black text-white font-black text-sm py-4 rounded-full hover:bg-gray-800 transition-colors tracking-widest uppercase shadow-md"
                >
                    Check My Score →
                </button>
            )}

            {/* Score Card */}
            {showScore && (
                <ScoreCard
                    score={score}
                    total={questions.length}
                    onRetry={() => setShowScore(false)}
                    onNewSet={regenerate}
                />
            )}
        </div>
    );
}