"use client";
import { motion } from "framer-motion";
import { Globe, Youtube, Twitter, Film, Monitor, Tv } from "lucide-react";

const platforms = [
  { name: "YouTube", icon: Youtube },
  { name: "Vimeo", icon: Film },
  { name: "Twitter / X", icon: Twitter },
  { name: "Any Website", icon: Globe },
  { name: "Twitch", icon: Tv },
  { name: "Loom", icon: Monitor },
];

const PlatformsSection = () => {
  return (
    <section id="platforms" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-[var(--accent)] font-semibold text-sm uppercase tracking-widest mb-3 block">
            Universal
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            Works everywhere
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-md mx-auto">
            Extract videos from any platform on the web. If it plays, Clipy can
            clip it.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {platforms.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-6 shadow-sm border border-[var(--border)] hover:shadow-md transition-all text-center group cursor-default"
            >
              <p.icon className="w-8 h-8 mx-auto mb-3 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
              <p className="text-sm font-medium text-[var(--foreground)]">
                {p.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformsSection;
