import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 600); // smooth exit
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div id="splash-screen" className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden select-none">
      {/* Background radial gradients for premium depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]" />
      <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(circle_500px_at_50%_400px,rgba(76,29,149,0.15),transparent)]" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Icon and Glow */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
          animate={{ scale: [1, 1.05, 1], opacity: 1, rotate: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-violet-600 via-fuchsia-500 to-pink-500 shadow-[0_0_50px_rgba(139,92,246,0.3)] border border-violet-400/30"
        >
          <Sparkles className="w-12 h-12 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" />
        </motion.div>

        {/* Brand Name with display typography */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 text-4xl font-extrabold tracking-wider font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400"
        >
          A U R A
        </motion.h1>

        {/* Brand Slogan */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-2 text-sm tracking-widest text-zinc-400 font-medium uppercase"
        >
          A Era da Conexão Inteligente
        </motion.p>
      </div>

      {/* Progress Bar & Loader */}
      <div className="absolute bottom-20 w-64 h-[3px] bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="absolute bottom-12 text-xs tracking-wider text-zinc-500 font-mono">
        CARREGANDO MOTOR SOCIAL v2.6.0
      </div>
    </div>
  );
}
