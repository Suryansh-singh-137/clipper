"use client";
import { ArrowRight, Scissors } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-[var(--foreground)] text-white">
      <div className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-6 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ready to clip smarter?
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Join thousands of creators, researchers, and teams using Clipy every
            day.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-[var(--background)] text-[var(--accent)] hover:bg-white px-8 py-3 rounded-xl font-semibold text-base transition-colors"
          >
            Try Clipy Free <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[var(--background)] flex items-center justify-center">
              <Scissors className="w-3.5 h-3.5 text-[var(--accent)]" />
            </div>
            <span className="font-semibold text-sm">Clipy</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-white/50">
            <a href="#" className="hover:text-white/80 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white/80 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white/80 transition-colors">
              Contact
            </a>
          </div>
          <p className="text-xs text-white/40">
            © 2026 Clipy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
