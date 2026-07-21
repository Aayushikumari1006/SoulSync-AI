import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TreePine, Sparkles, ChevronRight } from "lucide-react";

interface IntroSplashProps {
  onComplete: () => void;
  onExploreDemo?: () => void;
  accessibilityEnabled: boolean;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete, onExploreDemo, accessibilityEnabled }) => {
  const [stage, setStage] = useState<number>(0);
  const [skipped, setSkipped] = useState<boolean>(false);

  useEffect(() => {
    if (accessibilityEnabled) {
      // Instantly skip if animations are disabled / accessibility indicates reduced motion
      onComplete();
      return;
    }

    // Sequence timing
    const timers = [
      setTimeout(() => setStage(1), 1000),  // 1s: Seed appears
      setTimeout(() => setStage(2), 2000),  // 2s: Roots expand & Tree grows
      setTimeout(() => setStage(3), 3200),  // 3.2s: Tagline appears
      setTimeout(() => {
        // Complete intro and transition to dashboard
        if (!skipped) {
          onComplete();
        }
      }, 5000)
    ];

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [accessibilityEnabled, onComplete, skipped]);

  const handleSkip = () => {
    setSkipped(true);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(15px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 bg-[#0c0a1c] z-[9999] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background ambient deep pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,rgba(12,10,28,0)_70%)] pointer-events-none animate-pulse duration-[4000ms]" />

      {/* Floating Particle Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-300/40"
            style={{
              width: Math.random() * 5 + 2,
              height: Math.random() * 5 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: "blur(1px)",
            }}
            animate={{
              y: [0, -120],
              opacity: [0, 0.7, 0],
              scale: [1, 1.5, 0.8],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-lg px-6 text-center">
        {/* Stage 0: LOGO ANIMATION */}
        <AnimatePresence>
          {stage >= 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-6">
                {/* Glowing Outer Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 rounded-full border border-dashed border-indigo-400/30"
                />
                
                {/* Visualizing the Growing Seed, Roots, and Tree inside the logo */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-950 to-slate-900 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.25)] overflow-hidden relative">
                  
                  {/* Tree sprouting animation */}
                  {stage >= 2 && (
                    <motion.div
                      initial={{ y: 25, scale: 0.2, opacity: 0 }}
                      animate={{ y: 0, scale: 1, opacity: 1 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute z-10 text-emerald-400"
                    >
                      <TreePine className="w-12 h-12 stroke-[1.5]" />
                    </motion.div>
                  )}

                  {/* Expanding Roots inside logo */}
                  {stage >= 1 && stage < 2 && (
                    <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 100 100">
                      <motion.path
                        d="M50,50 L50,85 M50,65 L35,80 M50,70 L65,82"
                        stroke="rgba(129, 140, 248, 0.7)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </svg>
                  )}

                  {/* Seed pulse */}
                  {stage === 0 && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 rounded-full bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.8)]"
                    />
                  )}

                  {/* Seed sprouting transition */}
                  {stage === 1 && (
                    <motion.div
                      initial={{ scale: 0.5, y: 10 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="w-6 h-6 rounded-t-full bg-emerald-500 shadow-[0_0_20px_rgba(52,211,153,0.8)]"
                    />
                  )}
                </div>
              </div>

              {/* Title Spark */}
              <motion.h1
                initial={{ letterSpacing: "0.2em", opacity: 0 }}
                animate={{ letterSpacing: "0.05em", opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-3xl font-extrabold text-white font-display flex items-center gap-2"
              >
                🌱 SoulSync AI
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Descriptive Subtitle */}
        <div className="h-16 mt-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {stage === 1 && (
              <motion.p
                key="seed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-indigo-200/70 text-xs font-mono tracking-widest uppercase"
              >
                Planting the seed of awareness...
              </motion.p>
            )}
            {stage === 2 && (
              <motion.p
                key="tree"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-emerald-300/80 text-xs font-mono tracking-widest uppercase flex items-center gap-1.5 justify-center"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
                Expanding roots, growing vitality...
              </motion.p>
            )}
            {stage === 3 && (
              <motion.div
                key="tagline"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="space-y-1">
                  <p className="text-pink-200 text-sm md:text-base italic font-sans font-light tracking-wide">
                    "Understanding You Beyond Your Goals."
                  </p>
                  <p className="text-white/40 text-[9px] font-mono uppercase tracking-widest pt-1">
                    Connecting heart & roadmap
                  </p>
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(52,211,153,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onExploreDemo ? onExploreDemo() : onComplete()}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-2 border border-emerald-400/20 uppercase tracking-wider"
                >
                  <span>🌿 Explore Demo</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Persistent Left Explore Demo Shortcut */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onExploreDemo ? onExploreDemo() : onComplete()}
        className="absolute bottom-10 left-10 px-5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1 shadow-md transition cursor-pointer backdrop-blur-sm"
      >
        <span>🌿 Explore Demo</span>
        <ChevronRight className="w-4 h-4" />
      </motion.button>

      {/* Persistent Elegant Skip Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSkip}
        className="absolute bottom-10 right-10 px-5 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/90 text-xs font-semibold flex items-center gap-1 shadow-md transition cursor-pointer backdrop-blur-sm"
      >
        <span>Skip Intro</span>
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};
