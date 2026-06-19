"use client";

import { motion } from "framer-motion";

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="aurora absolute inset-0" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute inset-0 bg-radial-glow-bottom" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.22]" />
      <div className="noise absolute inset-0" />
      <div className="vignette absolute inset-0" />

      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-40 top-[15%] h-[550px] w-[550px] rounded-full bg-emerald-500/[0.07] blur-[130px]"
      />
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute -right-40 top-[25%] h-[650px] w-[650px] rounded-full bg-teal-400/[0.06] blur-[150px]"
      />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-600/[0.06] blur-[120px]"
      />
    </div>
  );
}
