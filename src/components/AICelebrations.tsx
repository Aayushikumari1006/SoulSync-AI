import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Trophy, Award, Star, Flame, Compass, Heart, GraduationCap, X } from "lucide-react";

export type CelebrationType =
  | "Assignment"
  | "Hackathon"
  | "Internship"
  | "Scholarship"
  | "Semester"
  | "Graduation";

interface AICelebrationsProps {
  type: CelebrationType;
  onClose: () => void;
  accessibilityEnabled?: boolean;
}

export const AICelebrations: React.FC<AICelebrationsProps> = ({
  type,
  onClose,
  accessibilityEnabled = false,
}) => {
  // Auto close celebration after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5500);
    return () => clearTimeout(timer);
  }, [type, onClose]);

  if (accessibilityEnabled) {
    return (
      <div className="fixed inset-0 bg-slate-950/90 z-[1000] flex items-center justify-center p-6 text-white text-center">
        <div className="max-w-md p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
          <Trophy className="w-12 h-12 text-yellow-400 mx-auto" />
          <h2 className="text-xl font-bold">Milestone Completed!</h2>
          <p className="text-sm text-slate-300">Congratulations on completing your {type} objective!</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-semibold"
          >
            Wonderful
          </button>
        </div>
      </div>
    );
  }

  // Define details for each celebration type
  const getContent = () => {
    switch (type) {
      case "Assignment":
        return {
          title: "Assignment Complete! 🌸",
          subtitle: "Your patience has cultivated understanding.",
          colorClass: "from-emerald-400 to-teal-500",
          icon: <Award className="w-6 h-6 text-emerald-400" />,
        };
      case "Hackathon":
        return {
          title: "Hackathon Proposal Submitted! 🔥",
          subtitle: "Fueling the fire of local systems innovation.",
          colorClass: "from-orange-500 to-rose-600",
          icon: <Flame className="w-6 h-6 text-orange-400" />,
        };
      case "Internship":
        return {
          title: "Internship Offer Earned! 🌉",
          subtitle: "Building the bridge between theory and impact.",
          colorClass: "from-blue-500 to-indigo-600",
          icon: <Compass className="w-6 h-6 text-sky-400" />,
        };
      case "Scholarship":
        return {
          title: "Scholarship Achieved! 🌸",
          subtitle: "Consistency plants the blossoms of tomorrow.",
          colorClass: "from-pink-500 to-rose-400",
          icon: <Heart className="w-6 h-6 text-pink-400" />,
        };
      case "Semester":
        return {
          title: "Semester Completed! 🌊",
          subtitle: "Expanding the horizon of your knowledge lake.",
          colorClass: "from-cyan-400 to-indigo-500",
          icon: <Star className="w-6 h-6 text-cyan-300 animate-pulse" />,
        };
      case "Graduation":
        return {
          title: "Graduation Mastered! 🌅",
          subtitle: "The sun rises over new frontiers of build.",
          colorClass: "from-amber-400 to-pink-600",
          icon: <GraduationCap className="w-6 h-6 text-amber-300" />,
        };
    }
  };

  const details = getContent();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl"
    >
      {/* Background glowing rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-pink-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: -30 }}
        transition={{ type: "spring", damping: 15 }}
        className="relative w-full max-w-lg p-6 md:p-8 rounded-3xl bg-[#1d1a39]/90 border border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.25)] text-center text-white overflow-hidden"
      >
        {/* Floating Sparks */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-yellow-300/60"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -60, 0],
                opacity: [0, 0.9, 0],
                scale: [0.8, 1.4, 0.8],
              }}
              transition={{
                duration: 2.5 + Math.random() * 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dynamic Header */}
        <div className="flex flex-col items-center mb-6 space-y-2">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
            {details.icon}
          </div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-indigo-300/80 font-bold">
            Companion Reward Unlocked
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-pink-200 bg-clip-text text-transparent">
            {details.title}
          </h2>
          <p className="text-xs md:text-sm text-white/70 italic max-w-sm">
            "{details.subtitle}"
          </p>
        </div>

        {/* 🎨 CELEBRATION VECTOR CANVAS STAGE */}
        <div className="w-full h-44 rounded-2xl bg-slate-900/45 border border-white/5 flex items-center justify-center relative overflow-hidden shadow-inner">
          
          {/* 1. ASSIGNMENT: FLOWER BLOOMS */}
          {type === "Assignment" && (
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              {/* Stem and Leaves */}
              <motion.path
                d="M50,90 Q50,60 50,45"
                stroke="#34d399"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <motion.path
                d="M50,70 Q35,62 30,68"
                stroke="#059669"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              />
              <motion.path
                d="M50,60 Q65,52 70,58"
                stroke="#059669"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
              />

              {/* Flower Center and Blooming Petals */}
              <g transform="translate(50, 45)">
                {/* Petals */}
                {[...Array(6)].map((_, index) => {
                  const rotation = index * 60;
                  return (
                    <motion.ellipse
                      key={index}
                      cx="0"
                      cy="-14"
                      rx="8"
                      ry="12"
                      fill="#ec4899"
                      fillOpacity="0.85"
                      transform={`rotate(${rotation})`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 10,
                        delay: 1.2 + index * 0.1,
                      }}
                    />
                  );
                })}
                {/* Yellow center node */}
                <motion.circle
                  cx="0"
                  cy="0"
                  r="6"
                  fill="#fbbf24"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 120, delay: 1.8 }}
                />
              </g>
            </svg>
          )}

          {/* 2. HACKATHON: CAMPFIRE LIGHTS UP */}
          {type === "Hackathon" && (
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              {/* Wood Logs */}
              <motion.path
                d="M32,75 L68,68 M32,68 L68,75"
                stroke="#78350f"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              />

              {/* Glowing charcoal base */}
              <motion.circle
                cx="50"
                cy="70"
                r="12"
                fill="url(#fireGlow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Fire Flames (animated scaling and shifting paths) */}
              <motion.path
                d="M50,70 C40,70 35,55 50,25 C65,55 60,70 50,70 Z"
                fill="#f97316"
                fillOpacity="0.85"
                animate={{
                  scaleY: [1, 1.15, 0.95, 1],
                  scaleX: [1, 0.9, 1.1, 1],
                  y: [0, -3, 1, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.path
                d="M50,70 C45,70 40,60 50,38 C60,60 55,70 50,70 Z"
                fill="#f59e0b"
                animate={{
                  scaleY: [0.9, 1.1, 0.85, 0.9],
                  scaleX: [1.1, 0.95, 1.05, 1.1],
                  y: [0, -2, 2, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.1,
                }}
              />
              <motion.path
                d="M50,70 C48,70 45,64 50,48 C55,64 52,70 50,70 Z"
                fill="#ef4444"
                animate={{
                  scaleY: [1.1, 0.9, 1.15, 1.1],
                  y: [1, -4, 0, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.25,
                }}
              />

              {/* Fire sparks */}
              {[...Array(5)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx={42 + i * 4}
                  cy="50"
                  r="1.8"
                  fill="#fef08a"
                  animate={{
                    y: [15, -45],
                    x: [0, (i % 2 === 0 ? 8 : -8)],
                    opacity: [0, 0.9, 0],
                  }}
                  transition={{
                    duration: 1.5 + i * 0.2,
                    repeat: Infinity,
                    delay: i * 0.25,
                  }}
                />
              ))}

              <defs>
                <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          )}

          {/* 3. INTERNSHIP: BRIDGE SLOWLY BUILDS */}
          {type === "Internship" && (
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              {/* Land shores */}
              <motion.path
                d="M0,80 L25,80 L20,95 L0,95 Z"
                fill="#475569"
                initial={{ x: -30 }}
                animate={{ x: 0 }}
                transition={{ duration: 1 }}
              />
              <motion.path
                d="M100,80 L75,80 L80,95 L100,95 Z"
                fill="#475569"
                initial={{ x: 30 }}
                animate={{ x: 0 }}
                transition={{ duration: 1 }}
              />

              {/* Water */}
              <path d="M20,95 L80,95 L75,90 L25,90 Z" fill="#1d4ed8" fillOpacity="0.5" />

              {/* Main Bridge Arch Path (Drawn sequentially) */}
              <motion.path
                d="M20,80 Q50,45 80,80"
                stroke="#fbbf24"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, delay: 0.8, ease: "easeOut" }}
              />

              {/* Support Pillars under arch */}
              <motion.path
                d="M35,68 L35,88 M50,62 L50,88 M65,68 L65,88"
                stroke="#d97706"
                strokeWidth="2"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                style={{ transformOrigin: "bottom" }}
                transition={{ duration: 1.2, delay: 2.2, ease: "easeOut" }}
              />

              {/* Bridge Pathway Top Deck */}
              <motion.path
                d="M16,77 L84,77"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, delay: 2.6 }}
              />

              {/* Little birds flying over the bridge */}
              <motion.g
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 120 }}
                transition={{ duration: 4, repeat: Infinity, delay: 3.5 }}
              >
                <path d="M10,25 Q13,18 16,25 Q19,18 22,25" stroke="#f1f5f9" strokeWidth="1.5" fill="none" />
                <path d="M25,28 Q28,22 31,28 Q34,22 37,28" stroke="#cbd5e1" strokeWidth="1" fill="none" />
              </motion.g>
            </svg>
          )}

          {/* 4. SCHOLARSHIP: CHERRY BLOSSOMS BLOOM */}
          {type === "Scholarship" && (
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              {/* Branch */}
              <motion.path
                d="M10,90 Q40,65 75,55"
                stroke="#5c3f25"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <motion.path
                d="M42,69 Q58,45 85,38"
                stroke="#5c3f25"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
              />

              {/* Blossoms on Branch */}
              {[
                { cx: 42, cy: 69, r: 6.5, delay: 1.2 },
                { cx: 58, cy: 45, r: 5.5, delay: 1.5 },
                { cx: 75, cy: 55, r: 7.0, delay: 1.8 },
                { cx: 85, cy: 38, r: 6.0, delay: 2.1 },
              ].map((b, idx) => (
                <g key={idx} transform={`translate(${b.cx}, ${b.cy})`}>
                  {/* Blossom circles */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r={b.r}
                    fill="#f43f5e"
                    fillOpacity="0.75"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 90, delay: b.delay }}
                  />
                  <motion.circle
                    cx="0"
                    cy="0"
                    r={b.r * 0.7}
                    fill="#fda4af"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: b.delay + 0.2 }}
                  />
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="1.8"
                    fill="#fef08a"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: b.delay + 0.4 }}
                  />
                </g>
              ))}

              {/* Falling Petals */}
              {[...Array(4)].map((_, i) => (
                <motion.path
                  key={i}
                  d="M10,10 Q12,18 8,24"
                  stroke="#fda4af"
                  strokeWidth="2.5"
                  fill="none"
                  animate={{
                    y: [-10, 110],
                    x: [20 + i * 22, -15 + i * 18],
                    rotate: [0, 360],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: 1.8 + i * 0.4,
                  }}
                />
              ))}
            </svg>
          )}

          {/* 5. SEMESTER COMPLETE: LAKE EXPANDS */}
          {type === "Semester" && (
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              {/* Distant Mountains Silhouette */}
              <motion.path
                d="M5,75 L28,45 L52,65 L78,35 L95,75 Z"
                fill="#2e2a56"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />

              {/* Star fields */}
              {[
                { x: 22, y: 20 },
                { x: 38, y: 14 },
                { x: 62, y: 25 },
                { x: 78, y: 18 },
              ].map((s, idx) => (
                <motion.circle
                  key={idx}
                  cx={s.x}
                  cy={s.y}
                  r="1.2"
                  fill="#ffffff"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.4 }}
                />
              ))}

              {/* Water base line */}
              <rect x="0" y="70" width="100" height="30" fill="#0891b2" fillOpacity="0.4" />

              {/* Cascading expanding lake ripples */}
              {[...Array(3)].map((_, i) => (
                <motion.ellipse
                  key={i}
                  cx="50"
                  cy="82"
                  rx="15"
                  ry="4.5"
                  stroke="#22d3ee"
                  strokeWidth="1.5"
                  fill="none"
                  initial={{ rx: 5, ry: 1.5, opacity: 0 }}
                  animate={{
                    rx: [5, 45],
                    ry: [1.5, 11],
                    opacity: [0, 0.75, 0],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Shimmer on lake */}
              <motion.path
                d="M40,73 H60"
                stroke="#a5f3fc"
                strokeWidth="1.2"
                strokeLinecap="round"
                animate={{ opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </svg>
          )}

          {/* 6. GRADUATION: SUN RISES BEHIND MOUNTAINS */}
          {type === "Graduation" && (
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              {/* Dynamic Sun disk rising up */}
              <motion.circle
                cx="50"
                cy="60"
                r="18"
                fill="#fca5a5"
                initial={{ y: 25, scale: 0.5 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              {/* Glowing aura */}
              <motion.circle
                cx="50"
                cy="60"
                r="30"
                fill="url(#sunGlow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Distant Mountains Silhouette overlaying sun */}
              <motion.path
                d="M-5,78 L32,54 L62,68 L88,48 L105,78 Z"
                fill="#312e81"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.5 }}
              />

              {/* Golden Sunrays drawing */}
              {[...Array(6)].map((_, i) => {
                const angle = 20 + i * 28;
                const rad = (angle * Math.PI) / 180;
                const x1 = 50 + Math.cos(rad) * 22;
                const y1 = 60 - Math.sin(rad) * 22;
                const x2 = 50 + Math.cos(rad) * 36;
                const y2 = 60 - Math.sin(rad) * 36;
                return (
                  <motion.line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#fde047"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                  />
                );
              })}

              {/* Ground silhouetted forest pines */}
              <path d="M12,78 L15,70 L18,78 Z M22,78 L25,66 L28,78 Z" fill="#1e1b4b" />
              <path d="M72,78 L75,68 L78,78 Z M82,78 L85,64 L88,78 Z" fill="#1e1b4b" />

              <defs>
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fca5a5" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          )}

        </div>

        {/* Dynamic Celebration Bottom Card info */}
        <div className="mt-6 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 3 }}
            className="px-4 py-2 bg-indigo-500/10 border border-indigo-400/20 rounded-xl flex items-center gap-2 text-xs text-indigo-200"
          >
            <Sparkles className="w-4 h-4 text-indigo-300 animate-spin-slow" />
            <span>SoulTree vitality boost: +15 points!</span>
          </motion.div>
          
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-400 hover:to-indigo-400 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            Acknowledge Growth 🌸
          </button>
        </div>

      </motion.div>
    </motion.div>
  );
};
