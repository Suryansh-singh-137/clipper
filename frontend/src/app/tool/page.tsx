"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Scissors,
  Download,
  FileText,
  BrainCircuit,
  Loader2,
  Check,
} from "lucide-react";
import Link from "next/link";

interface Result {
  mp4Url: string;
  mp3Url: string;
  transcript: string;
  summary: string;
}

const OUTPUT_OPTIONS = [
  { id: "mp4", label: "MP4 Video", icon: Download },
  { id: "mp3", label: "MP3 Audio", icon: Download },
  { id: "transcript", label: "Transcript", icon: FileText },
  { id: "summary", label: "AI Summary", icon: BrainCircuit },
];

const STEPS = [
  "⏳ Downloading video...",
  "✂️  Clipping...",
  "🎵 Extracting audio...",
  "🎙️ Transcribing...",
  "🤖 Summarizing...",
  "✅ Done!",
];

export default function ToolPage() {
  const [url, seturl] = useState("");
  const [start, setstart] = useState("");
  const [end, setend] = useState("");
  const [output, setoutput] = useState(["mp4"]);
  const [loading, setloading] = useState(false);
  const [result, setresult] = useState<Result>({
    mp4Url: "",
    mp3Url: "",
    transcript: "",
    summary: "",
  });
  const [step, setstep] = useState("");
  const [error, seterror] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);

  // toggle output selection
  function toggleOutput(id: string) {
    setoutput((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id],
    );
  }

  async function handleClip() {
    if (!url) return;
    setloading(true);
    seterror("");
    setresult({ mp4Url: "", mp3Url: "", transcript: "", summary: "" });

    let i = 0;
    setstep(STEPS[0]);
    const interval = setInterval(() => {
      i++;
      if (i < STEPS.length - 1) setstep(STEPS[i]);
    }, 8000);
    try {
      const response = await fetch("https://clipper-production-0d3d.up.railway.app/clip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tweetUrl: url, start, end, outputs: output }),
      });
      const res = await response.json();
      clearInterval(interval);

      if (res.error) {
        seterror(res.error);
        setstep("");
        setloading(false);
        return;
      }

      setstep(STEPS[STEPS.length - 1]);
      setresult(res);
    } catch (err) {
      clearInterval(interval);
      seterror(
        "Could not connect to backend. Make sure it is running on port 8000.",
      );
      setstep("");
    } finally {
      setloading(false);
    }
  }

  const hasResult =
    result.mp4Url || result.mp3Url || result.transcript || result.summary;

  return (
    <div className="min-h-screen w-full relative">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #f7f7ff 10%, #27187e 100%)",
        }}
      />

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[var(--accent)] flex items-center justify-center">
              <Scissors className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-[var(--foreground)]">
              Clipy
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            ← Back to home
          </Link>
        </nav>

        {/* Main content */}
        <main className="max-w-2xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-5xl font-bold text-[var(--foreground)] mb-3">
              Clip anything.
            </h1>
            <p className="text-[var(--muted)]">
              Paste a video URL, pick your options, and let Clipy do the rest.
            </p>
          </motion.div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl border border-[var(--border)] shadow-sm p-6 space-y-5"
          >
            {/* URL input */}
            <div>
              <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-2 block">
                Video URL
              </label>
              <input
                type="text"
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={(e) => seturl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 text-sm font-mono"
              />
            </div>

            {/* Time inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-2 block">
                  Start time
                </label>
                <input
                  type="text"
                  placeholder="00:00:05"
                  value={start}
                  onChange={(e) => setstart(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 text-sm font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-2 block">
                  End time
                </label>
                <input
                  type="text"
                  placeholder="00:00:30"
                  value={end}
                  onChange={(e) => setend(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 text-sm font-mono"
                />
              </div>
            </div>

            {/* Output selector */}
            <div>
              <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-2 block">
                Outputs
              </label>
              <div className="grid grid-cols-2 gap-2">
                {OUTPUT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => toggleOutput(opt.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      output.includes(opt.id)
                        ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                        : "bg-white border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]"
                    }`}
                  >
                    {output.includes(opt.id) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <opt.icon className="w-4 h-4" />
                    )}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleClip}
              disabled={loading || !url}
              className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Scissors className="w-4 h-4" />
              )}
              {loading ? "Processing..." : "Clip it"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </motion.div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center"
              >
                ❌ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step progress */}
          <AnimatePresence>
            {step && !error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-center text-sm text-[var(--muted)] font-medium"
              >
                {step}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading skeleton */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 bg-white/80 backdrop-blur-md rounded-2xl border border-[var(--border)] p-6 space-y-3"
              >
                <div className="h-4 w-24 bg-[var(--border)] rounded-full animate-pulse" />
                <div className="h-12 w-full bg-[var(--border)] rounded-xl animate-pulse" />
                <div className="h-12 w-full bg-[var(--border)] rounded-xl animate-pulse" />
                <div className="h-20 w-full bg-[var(--border)] rounded-xl animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {hasResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-white/80 backdrop-blur-md rounded-2xl border border-[var(--border)] shadow-sm p-6 space-y-4"
              >
                <h2 className="font-bold text-[var(--foreground)] text-lg">
                  Results
                </h2>

                {/* MP4 download */}
                {result.mp4Url && (
                  <a
                    href={result.mp4Url}
                    download
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all group"
                  >
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      📥 Download MP4
                    </span>
                    <Download className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)]" />
                  </a>
                )}

                {/* MP3 download */}
                {result.mp3Url && (
                  <a
                    href={result.mp3Url}
                    download
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all group"
                  >
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      🎵 Download MP3
                    </span>
                    <Download className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)]" />
                  </a>
                )}

                {/* Transcript */}
                {result.transcript && (
                  <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                    <button
                      onClick={() => setShowTranscript(!showTranscript)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--accent)]/5 transition-all"
                    >
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        📝 Transcript
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        {showTranscript ? "Hide" : "Show"}
                      </span>
                    </button>
                    {showTranscript && (
                      <div className="px-4 pb-4 text-sm text-[var(--muted)] leading-relaxed border-t border-[var(--border)] pt-3">
                        {result.transcript}
                      </div>
                    )}
                  </div>
                )}

                {/* Summary */}
                {result.summary && (
                  <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-4">
                    <p className="text-xs font-semibold text-[var(--accent)] uppercase tracking-widest mb-2">
                      🤖 AI Summary
                    </p>
                    <p className="text-sm text-[var(--foreground)] leading-relaxed">
                      {result.summary}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
