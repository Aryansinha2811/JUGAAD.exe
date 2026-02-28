import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ResumeUploadCard from "./components/ResumeUploadCard";
import TodaysSession from "./components/TodaysSession";

function Interview() {
  const [resume, setResume] = useState<{ text: string; filename: string } | null>(null);

  return (
    <div className="min-h-screen pt-32 pb-20 px-8 flex flex-col items-center">
      {!resume ? (
        <>
          <div className="text-center mb-10">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">START INTERVIEW</h1>
            <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">Upload your resume to begin</p>
          </div>
          <ResumeUploadCard onResumeReady={(text, filename) => setResume({ text, filename })} />
        </>
      ) : (
        <>
          <div className="text-center mb-4">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">TODAY'S SESSION</h1>
            <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">Questions tailored to your resume</p>
          </div>
          <TodaysSession
            resumeText={resume.text}
            filename={resume.filename}
            onReset={() => setResume(null)}
          />
        </>
      )}
    </div>
  );
}

function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-black text-gray-900 mb-4">ABOUT</h1>
        <p className="text-gray-500 text-lg max-w-xl">
          JUGAAD.exe — an agentic AI-powered mock interview platform built at BuildX Hackathon 2026.
        </p>
      </div>
    </div>
  );
}

function Team() {
  const members = [
    { name: "Aryan Sinha", role: "Team Leader", collage: "ADGIPS" },
    { name: "Aman", role: "Member" , collage: "BPIT"},
    { name: "Anurag Kumar", role: "Member" , collage: "USICT" },
    { name: "Ansal Pandey", role: "Member", collage: "BPIT" },
  ];
  return (
    <div className="min-h-screen pt-32 px-8">
      <h1 className="text-5xl font-black text-gray-900 mb-12 text-center">THE TEAM</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {members.map((m) => (
          <div key={m.name} className="border border-gray-200 p-6 rounded-xl text-center hover:border-gray-400 transition-all bg-white shadow-sm">
            <div className="w-14 h-14 rounded-full bg-black mx-auto mb-3 flex items-center justify-center">
              <span className="text-white font-black text-xl">{m.name[0]}</span>
            </div>
            <h2 className="text-gray-900 font-bold text-lg">{m.name}</h2>
            <p className="text-gray-400 text-md">{m.role}</p>
            <p className="text-gray-600 text-sm mt-1">{m.collage}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </Router>
  );
}