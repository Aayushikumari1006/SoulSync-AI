import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Pause,
  Award,
  BookOpen,
  User,
  Compass,
  Heart,
  TreePine,
  Briefcase,
  Layers,
  Zap
} from "lucide-react";

interface PresentationGuideProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onClose: () => void;
  accessibilityEnabled: boolean;
}

interface Step {
  id: string;
  title: string;
  view: string;
  icon: React.ReactNode;
  category: string;
  description: string;
  keyFeature: string;
  judgesHighlight: string;
}

export const PresentationGuide: React.FC<PresentationGuideProps> = ({
  activeView,
  setActiveView,
  onClose,
  accessibilityEnabled
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(25); // 25 seconds per slide for auto-play

  const steps: Step[] = [
    {
      id: "soulprint",
      title: "SoulPrint",
      view: "soulprint",
      category: "INNER IDENTITY ENGINE",
      icon: <User className="w-5 h-5 text-pink-400" />,
      description: "Unlike traditional cold resume templates, SoulSync begins with the student's inner landscape. It maps Myers-Briggs traits, Ikigai coordinates, learning patterns, academic memory sways, and active skills into an empathetic digital reflection.",
      keyFeature: "Psychological & competency profiling synced dynamically.",
      judgesHighlight: "Scroll to view the 'Aspirations & Ikigai Map' and custom 'Weekly Rhythm Planner'."
    },
    {
      id: "dreampath",
      title: "DreamPath Interactive Roadmaps",
      view: "dreampath",
      category: "ACADEMIC NAVIGATOR",
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      description: "Next, we map those aspirations onto 12 detailed career roadmap tracks custom-tailored for higher education in India. Each milestone is packed with direct tutorials, mini-projects, local scholarship listings, and expert pitfall advisories.",
      keyFeature: "Indian higher education curriculum alignment & regional insights.",
      judgesHighlight: "Check the milestone nodes. Note how each includes direct 'Mistakes to Avoid' and 'Study tips'!"
    },
    {
      id: "forest",
      title: "Bloom Forest",
      view: "progress",
      category: "LIVING PROGRESS ENGINE",
      icon: <TreePine className="w-5 h-5 text-emerald-400" />,
      description: "We completely banish stress-inducing numeric progress bars. In SoulSync, student progress grows a gorgeous interactive Bloom Forest! Completed milestones sprout realistic trees, campfires, lakes, and flowers.",
      keyFeature: "Restorative psychological release through generative organic growth.",
      judgesHighlight: "See the active virtual forest at the top. Moving mouse creates wind sway and particle reactions."
    },
    {
      id: "compass",
      title: "Opportunity Compass",
      view: "opportunity",
      category: "MATCHMAKING COMPASS",
      icon: <Compass className="w-5 h-5 text-amber-400" />,
      description: "The Opportunity Compass dynamically tracks, filters, and matches regional Indian scholarships, high-impact national hackathons (like SIH), and open internships directly to the student's current semester, interests, and skill levels.",
      keyFeature: "Automatic matchmaking based on student's current local readiness.",
      judgesHighlight: "Observe the custom 'Scholarship Alerts' matching our demo student (Ayush's) semester requirements."
    },
    {
      id: "guide",
      title: "Gentle Guide",
      view: "guide",
      category: "EMOTIONAL WELLBEING",
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      description: "Indian college students face intense academic pressure. Gentle Guide is our emotional sanctuary—offering friendly mood trackers, study-detox breathing cycles, and empathetic deep listening chat support to prevent burnout.",
      keyFeature: "Empathetic active listening & mood-adaptive atmosphere engine.",
      judgesHighlight: "Try clicking a mood or starting the 'Guided study-detox breathing session' for a calming visual rhythm."
    },
    {
      id: "career",
      title: "Career Identity Engine",
      view: "dreampath",
      category: "PLACEMENT & PORTFOLIO",
      icon: <Briefcase className="w-5 h-5 text-teal-400" />,
      description: "Preparing for placements? Under DreamPath, click the 'Career Identity Engine' button to explore the AI LinkedIn Assistant, custom Resume feedback, Interview story vaults, and readiness checklists.",
      keyFeature: "Instant placement-readiness feedback and structured stories.",
      judgesHighlight: "Review the 'Interview Stories' and AI feedback on LinkedIn profiles."
    },
    {
      id: "future",
      title: "Future You (Digital Twin Letters)",
      view: "soulprint",
      category: "PSYCHOLOGICAL RESILIENCE",
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      description: "Students can pen self-reflective, emotional letters to their future selves at graduation. This creates a powerful baseline for mental resilience, helping students navigate rough times with a long-term focus.",
      keyFeature: "Empathetic reflection storage with local and cloud encryption.",
      judgesHighlight: "Scroll to the bottom of SoulPrint to find the Future Letters module and write a prompt to see its interactive save state."
    },
    {
      id: "replay",
      title: "Journey Replay",
      view: "progress",
      category: "CELEBRATION ENGINE",
      icon: <Award className="w-5 h-5 text-purple-400" />,
      description: "Finally, the entire semester's efforts can be reviewed at any time. Clicking 'Replay Journey' inside Living Progress triggers a beautiful chronological visual replay of how your forest sprouted step-by-step.",
      keyFeature: "Nostalgic, rewarding replay animation celebrating student milestones.",
      judgesHighlight: "In Living Progress, click 'Replay Journey' to see the forest items emerge from seeds with elegant chime sound simulations."
    }
  ];

  // Auto-switch view when step changes
  useEffect(() => {
    const currentStep = steps[currentStepIdx];
    if (activeView !== currentStep.view) {
      setActiveView(currentStep.view);
    }
  }, [currentStepIdx]);

  // Handle auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleNext();
            return 25;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentStepIdx]);

  const handleNext = () => {
    setCurrentStepIdx((prev) => (prev + 1) % steps.length);
    setTimeLeft(25);
  };

  const handlePrev = () => {
    setCurrentStepIdx((prev) => (prev - 1 + steps.length) % steps.length);
    setTimeLeft(25);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const currentStep = steps[currentStepIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 120 }}
      className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[480px] z-50 bg-[#16122c]/95 backdrop-blur-2xl border-2 border-emerald-500/40 rounded-3xl shadow-[0_15px_50px_rgba(16,185,129,0.25)] p-5 md:p-6 text-white text-left overflow-hidden flex flex-col"
    >
      {/* Decorative top border shine */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500" />
      
      {/* Header section */}
      <div className="flex items-start justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-300">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest bg-gradient-to-r from-emerald-300 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
              Festival Presentation Mode
            </h3>
            <p className="text-[10px] text-white/50 font-mono font-bold">GUIDED JUDGES WALKTHROUGH</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
          title="Exit Presentation"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main slide presentation area with transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 flex-1"
        >
          {/* Step Count & Category */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black text-emerald-400 tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              {currentStep.category}
            </span>
            <span className="text-xs font-mono text-white/40 font-bold">
              Step {currentStepIdx + 1} of {steps.length}
            </span>
          </div>

          {/* Title & Icon */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-white/5 border border-white/10">
              {currentStep.icon}
            </div>
            <h4 className="text-base font-extrabold tracking-tight text-white leading-tight">
              {currentStep.title}
            </h4>
          </div>

          {/* Description */}
          <p className="text-xs text-white/80 leading-relaxed font-sans">
            {currentStep.description}
          </p>

          {/* Core Feature highlight */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="flex items-start gap-2 text-xs">
              <span className="text-emerald-400 mt-0.5 font-bold">⚡ Core Innovation:</span>
              <p className="text-white/90 font-medium">{currentStep.keyFeature}</p>
            </div>
            
            <div className="flex items-start gap-2 text-[11px] border-t border-white/5 pt-2">
              <span className="text-indigo-300 font-bold">💡 Try it out:</span>
              <p className="text-indigo-200">{currentStep.judgesHighlight}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Footer controls */}
      <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-white/10">
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition cursor-pointer"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg cursor-pointer border border-emerald-400/20"
          >
            <span>Next Step</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Auto Play controller */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title={isPlaying ? "Pause autoplay" : "Start autoplay"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[10px] text-amber-300">{timeLeft}s</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Autoplay</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
