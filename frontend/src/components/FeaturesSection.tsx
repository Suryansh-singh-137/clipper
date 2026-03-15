"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const features = [
  {
    title: "Extract crystal-clear audio from any video",
    description:
      "Pull audio tracks from videos across any platform. Export as MP3 — perfect for repurposing content, creating podcasts, or saving music.",
    image: "/audio-extract.png",
    alt: "Audio extraction from video",
  },
  {
    title: "Transcribe in 50+ languages with AI precision",
    description:
      "Our AI transcription engine understands accents, technical jargon, and multiple speakers. Get word-perfect transcripts in any language within seconds.",
    image: "/transcribe-illustration.png",
    alt: "Multilingual transcription",
    reverse: true,
  },
  {
    title: "AI summaries that capture what matters",
    description:
      "Don't watch the whole video — let AI distill the key points, action items, and takeaways into a concise, shareable summary.",
    image: "/ai-summary.png",
    alt: "AI-powered video summary",
  },
];

const FeatureRow = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const textY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col ${
        feature.reverse ? "md:flex-row-reverse" : "md:flex-row"
      } items-center gap-12 md:gap-16`}
    >
      <motion.div style={{ y: textY }} className="flex-1">
        <span className="text-[var(--accent)] font-semibold text-xs uppercase tracking-widest mb-3 block">
          Feature 0{index + 1}
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-4 leading-tight">
          {feature.title}
        </h3>
        <p className="text-[var(--muted)] leading-relaxed">
          {feature.description}
        </p>
      </motion.div>
      <motion.div style={{ y: imgY }} className="flex-1 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--accent)]/10 rounded-3xl blur-xl scale-105" />
          <Image
            src={feature.image}
            alt={feature.alt}
            width={400}
            height={350}
            className="relative w-full max-w-sm rounded-2xl"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-28 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[var(--accent)] font-semibold text-sm uppercase tracking-widest mb-3 block">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            Your complete video toolkit
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-lg mx-auto">
            Everything you need to clip, extract, transcribe, and understand any
            video from the web.
          </p>
        </motion.div>

        <div className="space-y-28 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <FeatureRow key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
