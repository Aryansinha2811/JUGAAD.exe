import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
    { label: "Home", path: "/" },
    { label: "Interview", path: "/interview" },
    { label: "Team", path: "/team" },
    { label: "About", path: "/about" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                        <span className="text-white font-black text-xs">BX</span>
                    </div>
                    <span className="text-black font-black text-lg tracking-widest">
                        BUILD<span className="text-gray-500">X</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 font-bold">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-semibold tracking-wider uppercase transition-colors duration-200 ${location.pathname === link.path
                                    ? "text-black"
                                    : "text-gray-400 hover:text-black"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        to="/interview"
                        className="ml-4 bg-black text-white text-sm font-black px-5 py-2 rounded-full hover:bg-gray-800 transition-colors tracking-wider"
                    >
                        GET STARTED
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    onClick={() => setOpen(!open)}
                >
                    <span className={`block w-6 h-0.5 bg-black transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
                    <span className={`block w-6 h-0.5 bg-black transition-opacity ${open ? "opacity-0" : ""}`} />
                    <span className={`block w-6 h-0.5 bg-black transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 flex flex-col gap-4">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setOpen(false)}
                            className={`text-sm font-semibold tracking-wider uppercase ${location.pathname === link.path ? "text-black" : "text-gray-400"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}