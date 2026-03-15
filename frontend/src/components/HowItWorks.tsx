"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Scissors, Headphones, Languages, BrainCircuit } from "lucide-react";

const steps = [
  {
    icon: Scissors,
    title: "Paste & Clip",
    description:
      "Paste any video URL from YouTube, Vimeo, Twitter, or any platform. Pick the exact moment you want.",
  },
  {
    icon: Headphones,
    title: "Extract Audio",
    description:
      "Pull the audio track from any video instantly. Perfect for podcasts, music, or voice memos.",
  },
  {
    icon: Languages,
    title: "Transcribe",
    description:
      "Transcribe your clip in any language with AI-powered accuracy. Subtitles, captions, or full text.",
  },
  {
    icon: BrainCircuit,
    title: "AI Summary",
    description:
      "Get an intelligent summary of your video content — key points, action items, and highlights.",
  },
];

const HowItWorks = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-28 bg-[var(--background)] relative overflow-hidden"
    >
      <motion.div
        style={{ y }}
        className="absolute -top-20 right-0 w-80 h-80 bg-[var(--accent)]/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[var(--accent)] font-semibold text-sm uppercase tracking-widest mb-3 block">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            Four steps. Zero friction.
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-lg mx-auto">
            From any video on the web to clipped, transcribed, and summarized —
            in seconds.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)] hover:shadow-md transition-all group"
            >
              <div className="absolute top-4 right-4 text-xs font-bold text-[var(--muted)]/30">
                0{i + 1}
              </div>
              <div className="w-12 h-12 rounded-xl bg-[var(--accent)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <step.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                {step.title}
              </h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
