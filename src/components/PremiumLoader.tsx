import React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface PremiumLoaderProps {
  message?: string;
}

export const PremiumLoader: React.FC<PremiumLoaderProps> = ({ message = "Tuning your wellbeing threads..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg overflow-hidden relative">
      {/* Background soft pulse */}
      <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none animate-pulse" />
      
      {/* Growing Leaf / Sprouting Root Animated Icon */}
      <div className="relative w-16 h-16 flex items-center justify-center bg-indigo-500/10 rounded-2xl border border-indigo-400/20">
        
        {/* Swirling glowing particle trail around leaf */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-pink-400/30"
        />

        {/* Growing leaf SVG */}
        <svg viewBox="0 0 40 40" className="w-10 h-10">
          {/* Stem & root drawing */}
          <motion.path
            d="M20,32 Q20,20 12,14"
            stroke="#a7f3d0"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <motion.path
            d="M20,32 Q20,20 28,14"
            stroke="#a7f3d0"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.3 }}
          />
          
          {/* Sprout nodes */}
          <motion.circle
            cx="12"
            cy="14"
            r="3"
            fill="#34d399"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.circle
            cx="28"
            cy="14"
            r="3"
            fill="#fb7185"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
          />
        </svg>

        {/* Mini sparkles popping up */}
        <div className="absolute top-1 right-1">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
        </div>
      </div>

      {/* Floating particles rising up */}
      <div className="flex items-center justify-center space-x-1.5 h-3">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-indigo-400"
            animate={{
              y: [4, -12, 4],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Warm empathetic loader subtitle */}
      <div className="space-y-1">
        <p className="text-xs font-mono tracking-wide text-white/90 font-medium">
          {message}
        </p>
        <p className="text-[10px] text-white/50">
          Blending career roadmap with quiet reflection
        </p>
      </div>
    </div>
  );
};
