"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "I use Clipy daily for clipping conference talks. The AI summary saves me hours of rewatching.",
    author: "Alex Mercer",
    role: "Product Designer",
  },
  {
    quote:
      "The transcription accuracy is insane — even for technical talks in multiple languages. Total game changer.",
    author: "Priya Sharma",
    role: "Content Strategist",
  },
  {
    quote:
      "We use it for client video feedback. Clip the exact moment, transcribe it, share it. Done in seconds.",
    author: "Jordan Lee",
    role: "Agency Director",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-28">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[var(--accent)] font-semibold text-sm uppercase tracking-widest mb-3 block">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            Loved by creators & teams
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6 shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-[var(--accent)] text-[var(--accent)]"
                  />
                ))}
              </div>
              <p className="text-[var(--foreground)] text-sm leading-relaxed mb-6">
                "{t.quote}"
              </p>
              <div>
                <p className="font-semibold text-[var(--foreground)] text-sm">
                  {t.author}
                </p>
                <p className="text-xs text-[var(--muted)]">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
