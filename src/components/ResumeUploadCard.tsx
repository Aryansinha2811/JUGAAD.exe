import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";

type UploadState = "idle" | "dragging" | "uploaded" | "error";

interface Props {
    onResumeReady: (text: string, filename: string) => void;
}

export default function ResumeUploadCard({ onResumeReady }: Props) {
    const [state, setState] = useState<UploadState>("idle");
    const [file, setFile] = useState<File | null>(null);
    const [parsing, setParsing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const isValid = (f: File) =>
        f.type === "application/pdf" ||
        f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    const extractText = async (f: File): Promise<string> => {
        // For DOCX - read as arraybuffer and extract raw text
        if (f.type.includes("wordprocessingml")) {
            const text = await f.text();
            return text;
        }
        // For PDF - return filename + size as context since we can't parse binary in browser easily
        return `Resume file: ${f.name}, Size: ${(f.size / 1024).toFixed(1)}KB. This is a PDF resume uploaded by the candidate.`;
    };

    const handleFile = async (f: File) => {
        if (isValid(f)) {
            setFile(f);
            setState("uploaded");
        } else {
            setFile(null);
            setState("error");
        }
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setState("idle");
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    };

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setState("dragging");
    };

    const onDragLeave = () => setState("idle");

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
    };

    const reset = () => {
        setFile(null);
        setState("idle");
        if (inputRef.current) inputRef.current.value = "";
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleStartInterview = async () => {
        if (!file) return;
        setParsing(true);
        const text = await extractText(file);
        setParsing(false);
        onResumeReady(text, file.name);
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Upload Resume</h2>
                    <p className="text-gray-400 text-sm mt-1">PDF or DOCX · Max 10MB</p>
                </div>

                {state !== "uploaded" ? (
                    <div
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onClick={() => inputRef.current?.click()}
                        className={`cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center py-12 px-6 text-center
              ${state === "dragging"
                                ? "border-black bg-gray-50 scale-[1.01]"
                                : state === "error"
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                            }`}
                    >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors
              ${state === "error" ? "bg-red-100" : "bg-gray-100"}`}>
                            {state === "error" ? (
                                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            )}
                        </div>
                        {state === "error" ? (
                            <>
                                <p className="text-red-500 font-bold text-sm">Invalid file type</p>
                                <p className="text-red-400 text-xs mt-1">Please upload a PDF or DOCX file</p>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-700 font-bold text-sm">
                                    {state === "dragging" ? "Drop it here" : "Drag & drop your resume"}
                                </p>
                                <p className="text-gray-400 text-xs mt-1">or click to browse files</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-black uppercase">
                                {file?.name.split(".").pop()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-bold text-sm truncate">{file?.name}</p>
                            <p className="text-gray-400 text-xs mt-0.5">{file ? formatSize(file.size) : ""}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                )}

                <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={onChange} />

                <div className="mt-6 flex gap-3">
                    {state === "uploaded" ? (
                        <>
                            <button
                                onClick={reset}
                                className="flex-1 border border-gray-200 text-gray-500 text-sm font-bold py-3 rounded-full hover:border-gray-400 hover:text-gray-700 transition-all tracking-wide"
                            >
                                Replace
                            </button>
                            <button
                                onClick={handleStartInterview}
                                disabled={parsing}
                                className="flex-1 bg-black text-white text-sm font-black py-3 rounded-full hover:bg-gray-800 transition-colors tracking-wider uppercase disabled:opacity-50"
                            >
                                {parsing ? "Reading..." : "Generate Questions →"}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => inputRef.current?.click()}
                            className="flex-1 bg-black text-white text-sm font-black py-3 rounded-full hover:bg-gray-800 transition-colors tracking-wider uppercase"
                        >
                            Browse Files
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}