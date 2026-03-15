"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative pt-12 pb-24 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-32 left-[10%] w-72 h-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
      <div className="absolute bottom-10 right-[15%] w-96 h-96 rounded-full bg-[var(--accent)]/5 blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          style={{ y: textY, opacity }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-[var(--border)] text-sm font-medium text-[var(--foreground)]">
              <Play className="w-3 h-3 fill-[var(--accent)] text-[var(--accent)]" />
              Works with YouTube, Vimeo, Twitter & more
              <ArrowRight size={14} className="text-[var(--muted)]" />
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-[var(--foreground)] leading-[1.1] mb-6"
          >
            Clip, extract &{" "}
            <span className="text-[var(--accent)]">transcribe</span> any video
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--muted)] max-w-xl mb-10 leading-relaxed"
          >
            Clipy is a smart video toolkit — clip any video from the web,
            extract audio, transcribe in any language, and get AI-powered
            summaries. All in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md"
          >
            <input
              type="text"
              placeholder="Paste a video URL..."
              className="flex-1 w-full px-5 py-3.5 rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 transition-all text-sm shadow-sm font-mono"
            />
            <Link
              href="/tool"
              className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 text-sm"
            >
              Clip it <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-xs text-[var(--muted)]"
          >
            No sign-up required • Free to start • Works on any platform
          </motion.p>
        </motion.div>

        <motion.div
          style={{ y: imageY }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[var(--accent)]/10 rounded-3xl blur-3xl scale-110" />
            <Image
              src="/hero-clipy.png"
              alt="Person clipping and editing video with Clipy"
              width={500}
              height={400}
              className="relative w-full max-w-xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
