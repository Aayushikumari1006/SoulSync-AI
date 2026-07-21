import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TreePine,
  Flower,
  Sparkles,
  Award,
  Plus,
  RefreshCw,
  Flame,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  HelpCircle,
  Play,
  Pause,
  BookOpen,
  ArrowRight,
  User,
  Heart,
  ChevronRight,
  Compass,
  X,
  Compass as CompassIcon,
  Activity
} from "lucide-react";
import { StudentProfile, GrowthMission, AtmosphereType } from "../types";
import { CelebrationType } from "./AICelebrations";
import { saveForestItems, fetchForestItems } from "../lib/firebase";

interface ForestItem {
  id: string;
  type: "flower" | "tree" | "campfire" | "bridge" | "eagle" | "cherry" | "lake" | "sunrise";
  x: number;
  y: number;
  scale: number;
  label: string;
  date: string;
  growthProgress?: number; // 0.1 to 1.0 representing growth stages
}

interface SmartDeadline {
  id: string;
  title: string;
  category: "Assignment" | "Exam" | "Hackathon" | "Scholarship" | "Internship" | "Project";
  date: string;
  relativeDays: string;
  priority: "High" | "Medium" | "Low";
  impactText: string;
  isCustomRescheduled?: boolean;
}

interface LivingProgressViewProps {
  completedMissions: number;
  totalMissions: number;
  forestHealth: number;
  profile: StudentProfile;
  missions: GrowthMission[];
  onToggleMission: (id: string) => void;
  activeAtmosphere: AtmosphereType;
  onAddMission: (newMission: GrowthMission) => void;
  onTriggerCelebration?: (type: CelebrationType) => void;
  currentUser?: any;
}

export const LivingProgressView: React.FC<LivingProgressViewProps> = ({
  completedMissions,
  totalMissions,
  forestHealth,
  profile,
  missions,
  onToggleMission,
  activeAtmosphere,
  onAddMission,
  onTriggerCelebration,
  currentUser,
}) => {
  // Mobile active tab manager ("missions" | "forest" | "deadlines" | "timeline")
  const [mobileTab, setMobileTab] = useState<"missions" | "forest" | "deadlines" | "timeline">("forest");

  // Companion Upgrade State variables
  const [activeGardenView, setActiveGardenView] = useState<"forest" | "legacy">("forest");
  const [selectedMilestoneCard, setSelectedMilestoneCard] = useState<any | null>(null);
  const [showGratitudeOverlay, setShowGratitudeOverlay] = useState<boolean>(false);
  const [completedKindnessMissions, setCompletedKindnessMissions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("soulsync_kindness_missions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [timelineNotes, setTimelineNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("soulsync_timeline_notes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persist kindness and timeline notes
  useEffect(() => {
    localStorage.setItem("soulsync_kindness_missions", JSON.stringify(completedKindnessMissions));
  }, [completedKindnessMissions]);

  useEffect(() => {
    localStorage.setItem("soulsync_timeline_notes", JSON.stringify(timelineNotes));
  }, [timelineNotes]);

  // Local Storage persistence key for forest items
  const STORAGE_KEY = `soulsync_forest_items_${profile.name.replace(/\s+/g, "_")}`;

  // Pre-seed some beautiful visual assets in the forest
  const initialForestItems: ForestItem[] = [
    { id: "fi1", type: "tree", x: 100, y: 220, scale: 1.1, label: "NeuralStyleSieve Launch", date: "2025-11-12", growthProgress: 1.0 },
    { id: "fi2", type: "lake", x: 280, y: 240, scale: 1.0, label: "2nd Semester Finished", date: "2026-05-10", growthProgress: 1.0 },
    { id: "fi3", type: "campfire", x: 200, y: 235, scale: 0.9, label: "Bombay AI Hackathon Team camp", date: "2026-03-22", growthProgress: 1.0 },
    { id: "fi4", type: "flower", x: 60, y: 250, scale: 0.8, label: "First Python Script", date: "2025-09-01", growthProgress: 1.0 },
    { id: "fi5", type: "flower", x: 140, y: 245, scale: 0.7, label: "DBMS Indexing Practice", date: "2026-07-18", growthProgress: 1.0 },
  ];

  const [forestItems, setForestItems] = useState<ForestItem[]>([]);

  // Load from Firebase or local storage on start/auth change
  useEffect(() => {
    let active = true;
    const loadItems = async () => {
      if (currentUser) {
        try {
          const items = await fetchForestItems(currentUser.uid);
          if (active) {
            if (items && items.length > 0) {
              setForestItems(items);
            } else {
              setForestItems(initialForestItems);
              await saveForestItems(currentUser.uid, initialForestItems);
            }
          }
        } catch (err) {
          console.error("Failed to fetch forest items from Firestore:", err);
        }
      } else {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (active) {
          if (saved) {
            try {
              setForestItems(JSON.parse(saved));
            } catch (e) {
              setForestItems(initialForestItems);
            }
          } else {
            setForestItems(initialForestItems);
          }
        }
      }
    };
    loadItems();
    return () => { active = false; };
  }, [currentUser, STORAGE_KEY]);

  // Keep saved and synced on update
  useEffect(() => {
    if (forestItems.length === 0) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forestItems));
    if (currentUser) {
      saveForestItems(currentUser.uid, forestItems).catch((err) => {
        console.error("Auto sync forest items failed:", err);
      });
    }
  }, [forestItems, STORAGE_KEY, currentUser]);

  // Gradually grow any newly planted seeds/sprouts in the background
  useEffect(() => {
    const timer = setInterval(() => {
      setForestItems((prev) => {
        let changed = false;
        const next = prev.map((item) => {
          const currentProgress = item.growthProgress ?? 1.0;
          if (currentProgress < 1.0) {
            changed = true;
            return { ...item, growthProgress: Math.min(1.0, currentProgress + 0.05) };
          }
          return item;
        });
        return changed ? next : prev;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Selected tool from palette to manually plant in forest
  const [selectedPaletteItem, setSelectedPaletteItem] = useState<ForestItem["type"]>("flower");

  // Interactive Stopwatch/Timer state for the focus mission
  const [activeTimerMissionId, setActiveTimerMissionId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mentor Advice overlay state
  const [mentorAdviceMission, setMentorAdviceMission] = useState<GrowthMission | null>(null);

  // Custom added mission inputs
  const [showAddMissionModal, setShowAddMissionModal] = useState(false);
  const [newMissionTitle, setNewMissionTitle] = useState("");
  const [newMissionCategory, setNewMissionCategory] = useState<"Career" | "Academics" | "Skill" | "Wellbeing">("Career");
  const [newMissionEstTime, setNewMissionEstTime] = useState("1 hour");
  const [newMissionDeadline, setNewMissionDeadline] = useState("Today");
  const [newMissionDifficulty, setNewMissionDifficulty] = useState("Medium");
  const [newMissionPriority, setNewMissionPriority] = useState("Medium");

  // Dynamic state for custom interactive deadlines
  const [deadlines, setDeadlines] = useState<SmartDeadline[]>([
    {
      id: "dl1",
      title: "DBMS Indexing & Normalization Assignment",
      category: "Assignment",
      date: "2026-07-20",
      relativeDays: "Tomorrow",
      priority: "High",
      impactText: "🌿 Completing your DBMS assignment tomorrow keeps your Software Engineer roadmap moving forward.",
    },
    {
      id: "dl2",
      title: "Probability & Statistics Internal Mid-Term Exam",
      category: "Exam",
      date: "2026-07-22",
      relativeDays: "In 2 days",
      priority: "High",
      impactText: "⚡ Essential grade criteria for Google Research eligibility.",
    },
    {
      id: "dl3",
      title: "Smart India Hackathon (SIH) registrations close",
      category: "Hackathon",
      date: "2026-08-15",
      relativeDays: "In 25 days",
      priority: "High",
      impactText: "🏕 Spawns a national-level team validation campfire in your forest.",
    },
    {
      id: "dl4",
      title: "Google STEP software intern applications closing date",
      category: "Internship",
      date: "2026-08-30",
      relativeDays: "In 40 days",
      priority: "High",
      impactText: "🌉 Your pathway to the Google Research India dream career.",
    },
    {
      id: "dl5",
      title: "Reliance Foundation Scholarship Application submission",
      category: "Scholarship",
      date: "2026-09-30",
      relativeDays: "In 2 months",
      priority: "Medium",
      impactText: "🌸 Secures ₹2,00,000 yearly funding for academic peace of mind.",
    },
  ]);

  // Track if AI Smart Scheduling Plan has been applied to resolve overlaps
  const [isAIScheduled, setIsAIScheduled] = useState(false);

  // Ambient sound synthesizer using the Web Audio API (No external sound files required)
  const playSynthesizedChime = (type: "complete" | "sprout" | "click") => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const now = ctx.currentTime;
      if (type === "complete") {
        // High, sparkling, comforting major chord
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, now + i * 0.04);
          gain.gain.setValueAtTime(0.08, now + i * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8 + i * 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.04);
          osc.stop(now + 0.9 + i * 0.05);
        });
      } else if (type === "sprout") {
        // Wooden xylophone pop and flute rise
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();

        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(329.63, now); // E4
        osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.2); // E5
        gain1.gain.setValueAtTime(0.12, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(440.00, now + 0.1); // A4
        osc2.frequency.exponentialRampToValueAtTime(880.00, now + 0.3); // A5
        gain2.gain.setValueAtTime(0.08, now + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc1.start(now);
        osc1.stop(now + 0.4);
        osc2.start(now + 0.1);
        osc2.stop(now + 0.5);
      } else {
        // Simple subtle droplet sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (err) {
      console.warn("Web Audio API not initialized/allowed:", err);
    }
  };

  // Focus Timer controls
  const toggleFocusTimer = (missionId: string) => {
    if (activeTimerMissionId === missionId) {
      // Pause
      setIsTimerRunning(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    } else {
      // Start/Switch
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setActiveTimerMissionId(missionId);
      setTimerSeconds(0);
      setIsTimerRunning(true);
      playSynthesizedChime("click");
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  // Stop current active focus session
  const stopFocusTimer = () => {
    setIsTimerRunning(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setActiveTimerMissionId(null);
    setTimerSeconds(0);
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const formatTimerValue = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Manual Planting in Forest on click inside SVG
  const handleSVGClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 400);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 300);

    // Keep planting bounds strictly above the baseline and within visible grounds
    if (y < 120 || y > 275) return;

    // Map selected tool to correct reward description
    const labelMapping: Record<ForestItem["type"], string> = {
      flower: "Sprouted Wildflower",
      tree: "Planted Oak Tree",
      campfire: "Set Up Study Campfire",
      bridge: "Completed Career Bridge",
      eagle: "Drafted Research Eagle",
      cherry: "Nurtured Cherry Blossom",
      lake: "Paved Reflection Lake",
      sunrise: "Envisioned Graduation Sunrise",
    };

    const newItem: ForestItem = {
      id: "fi_" + Date.now(),
      type: selectedPaletteItem,
      x,
      y,
      scale: 0.6 + Math.random() * 0.5,
      label: labelMapping[selectedPaletteItem],
      date: new Date().toISOString().split("T")[0],
      growthProgress: 0.1, // Starts as a tiny seed/sprout
    };

    setForestItems((prev) => [...prev, newItem]);
    playSynthesizedChime("sprout");
  };

  // Auto-sprout reward helper when a mission is marked complete
  const handleMissionCompletion = (missionId: string, title: string, category: string) => {
    onToggleMission(missionId);

    // Determine what item sprouts based on the category of completed task
    let itemType: ForestItem["type"] = "flower";
    let label = `Sprouted for: ${title}`;

    if (category === "Career") {
      itemType = "campfire";
      label = `Hackathon Seed: ${title}`;
    } else if (category === "Academics") {
      itemType = "tree";
      label = `Academic Sapling: ${title}`;
    } else if (category === "Wellbeing") {
      itemType = "cherry";
      label = `Mindfulness Bloom: ${title}`;
    } else {
      itemType = "flower";
      label = `Skill Bud: ${title}`;
    }

    // Pick a random position within valid bounds
    const rx = 80 + Math.floor(Math.random() * 240);
    const ry = 180 + Math.floor(Math.random() * 80);

    const newItem: ForestItem = {
      id: "fi_auto_" + Date.now(),
      type: itemType,
      x: rx,
      y: ry,
      scale: 0.8 + Math.random() * 0.4,
      label: label,
      date: new Date().toISOString().split("T")[0],
      growthProgress: 0.15, // Starts small
    };

    setForestItems((prev) => [...prev, newItem]);
    playSynthesizedChime("complete");

    // Stop active timer if that completed mission was running
    if (activeTimerMissionId === missionId) {
      stopFocusTimer();
    }
  };

  // AI Scheduling plan for overlapping deadlines
  const applySmartSchedulingPlan = () => {
    setIsAIScheduled(true);
    // Push the probability exam revision block and shift DBMS practice to Sunday to release stress
    setDeadlines((prev) =>
      prev.map((dl) => {
        if (dl.id === "dl1") {
          return {
            ...dl,
            date: "2026-07-26",
            relativeDays: "Rescheduled to Sunday",
            isCustomRescheduled: true,
          };
        }
        return dl;
      })
    );
    playSynthesizedChime("complete");
  };

  const handleCreateCustomMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMissionTitle.trim()) return;

    const rewardMap: Record<string, string> = {
      Career: "🏕 Campfire Wood",
      Academics: "🌳 Ancient Oak Tree",
      Wellbeing: "🌸 Cherry Petals",
      Skill: "🌼 Golden Lily",
    };

    const newMission: GrowthMission = {
      id: "m_custom_" + Date.now(),
      title: newMissionTitle,
      deadline: newMissionDeadline,
      estimatedTime: newMissionEstTime,
      dreamImpact: `+${(Math.random() * 3 + 1).toFixed(1)}% to Career Goals`,
      completed: false,
      category: newMissionCategory,
    };

    onAddMission(newMission);
    setNewMissionTitle("");
    setShowAddMissionModal(false);
    playSynthesizedChime("sprout");
  };

  // Reset custom forest to initial preseed
  const resetForest = () => {
    setForestItems(initialForestItems);
    setIsAIScheduled(false);
    // Reset deadlines to default
    setDeadlines([
      {
        id: "dl1",
        title: "DBMS Indexing & Normalization Assignment",
        category: "Assignment",
        date: "2026-07-20",
        relativeDays: "Tomorrow",
        priority: "High",
        impactText: "🌿 Completing your DBMS assignment tomorrow keeps your Software Engineer roadmap moving forward.",
      },
      {
        id: "dl2",
        title: "Probability & Statistics Internal Mid-Term Exam",
        category: "Exam",
        date: "2026-07-22",
        relativeDays: "In 2 days",
        priority: "High",
        impactText: "⚡ Essential grade criteria for Google Research eligibility.",
      },
      {
        id: "dl3",
        title: "Smart India Hackathon (SIH) registrations close",
        category: "Hackathon",
        date: "2026-08-15",
        relativeDays: "In 25 days",
        priority: "High",
        impactText: "🏕 Spawns a national-level team validation campfire in your forest.",
      },
      {
        id: "dl4",
        title: "Google STEP software intern applications closing date",
        category: "Internship",
        date: "2026-08-30",
        relativeDays: "In 40 days",
        priority: "High",
        impactText: "🌉 Your pathway to the Google Research India dream career.",
      },
      {
        id: "dl5",
        title: "Reliance Foundation Scholarship Application submission",
        category: "Scholarship",
        date: "2026-09-30",
        relativeDays: "In 2 months",
        priority: "Medium",
        impactText: "🌸 Secures ₹2,00,000 yearly funding for academic peace of mind.",
      },
    ]);
    playSynthesizedChime("click");
  };

  // SVG drawing renders based on active atmosphere color palettes
  const atmosphereSkyClass = useMemo(() => {
    switch (activeAtmosphere) {
      case "rain": return "from-[#1e293b]/70 to-[#334155]/60";
      case "sunset": return "from-[#fdba74]/40 via-[#f97316]/20 to-[#6b21a8]/30";
      case "night": return "from-[#0f172a] via-[#1e1b4b]/80 to-[#311042]/70";
      case "forest": return "from-[#022c22]/40 via-[#064e3b]/30 to-[#0f172a]/50";
      case "snow": return "from-[#cbd5e1]/40 via-[#94a3b8]/30 to-[#475569]/50";
      case "spring": return "from-[#fbcfe8]/30 via-[#f472b6]/10 to-[#312e81]/40";
      case "lake": return "from-[#0d9488]/20 via-[#115e59]/30 to-[#0f172a]/70";
      case "morning":
      default: return "from-[#fef08a]/20 via-[#f43f5e]/10 to-[#475569]/40";
    }
  }, [activeAtmosphere]);

  // Generate continuous falling particles inside forest canvas based on atmosphere
  const weatherParticles = useMemo(() => {
    const particles = [];
    const count = activeAtmosphere === "rain" ? 30 : activeAtmosphere === "snow" ? 25 : activeAtmosphere === "night" ? 15 : activeAtmosphere === "spring" ? 18 : 8;
    for (let i = 0; i < count; i++) {
      particles.push({
        id: i,
        x: Math.random() * 400,
        y: Math.random() * 260,
        size: Math.random() * 2 + 1,
        speed: 1 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.6,
      });
    }
    return particles;
  }, [activeAtmosphere]);

  return (
    <div className="space-y-8 animate-fade-in text-white max-w-7xl mx-auto px-4 md:px-0 pb-16">
      
      {/* HEADER HERO AREA */}
      <div className="p-6 md:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-2xl">
              <TreePine className="w-6 h-6 animate-pulse" />
            </span>
            <span className="text-xs font-mono tracking-widest bg-emerald-400/10 text-emerald-200 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
              PORTFOLIO ECOSYSTEM
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
            Living Progress & Bloom Forest
          </h1>
          <p className="text-sm md:text-base text-white/80 font-light leading-relaxed">
            Your university journey isn't a transactional spreadsheet of grades. It's a living, breathing habitat. Complete focus sessions to nurture trees, bridge pipelines, and reflect on accomplishments.
          </p>
        </div>

        <div className="flex flex-row md:flex-col gap-3 shrink-0 bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-sm">
          <div className="text-center md:text-right">
            <span className="text-[10px] font-mono text-white/50 block uppercase font-bold">Overall Vitality</span>
            <span className="text-3xl font-mono font-extrabold text-emerald-300">{forestHealth}%</span>
          </div>
          <div className="h-full md:h-px w-px md:w-full bg-white/10 mx-2 md:my-2" />
          <div className="text-center md:text-right">
            <span className="text-[10px] font-mono text-white/50 block uppercase font-bold">Ecosystem Size</span>
            <span className="text-xl font-mono font-bold text-teal-200">{forestItems.length} Entities</span>
          </div>
        </div>
      </div>

      {/* MOBILE SWITCHING NAVIGATION TABS */}
      <div className="flex md:hidden bg-white/10 p-1.5 rounded-2xl border border-white/10 gap-1">
        {[
          { id: "forest", label: "🌳 Forest", icon: <TreePine className="w-4 h-4" /> },
          { id: "missions", label: "🌱 Missions", icon: <Flower className="w-4 h-4" /> },
          { id: "deadlines", label: "📅 Deadlines", icon: <Calendar className="w-4 h-4" /> },
          { id: "timeline", label: "📖 Timeline", icon: <BookOpen className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setMobileTab(tab.id as any);
              playSynthesizedChime("click");
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              mobileTab === tab.id
                ? "bg-white text-[#FF6B6B] shadow-md"
                : "text-white/70 hover:bg-white/5"
            }`}
          >
            {tab.icon}
            <span className="sr-only sm:not-sr-only">{tab.label.split(" ")[1]}</span>
          </button>
        ))}
      </div>

      {/* THREE COLUMN DESKTOP / MAIN BENTO RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= SECTION 1: TODAY'S GROWTH MISSIONS (3 Columns) ================= */}
        <section
          id="lp-missions-section"
          className={`${
            mobileTab === "missions" ? "block" : "hidden"
          } md:block lg:col-span-4 space-y-6 order-2 lg:order-1`}
        >
          <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-display font-bold tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  Today's Growth Missions
                </h2>
                <p className="text-xs text-white/70">
                  Customized from your SoulPrint parameters
                </p>
              </div>

              <button
                onClick={() => {
                  setShowAddMissionModal(true);
                  playSynthesizedChime("click");
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 border border-white/10 transition cursor-pointer"
                title="Add custom growth task"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Active Running stopwatch if any */}
            {activeTimerMissionId && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
                  <div>
                    <p className="text-[10px] font-mono uppercase text-emerald-200 font-bold">Active Deep Study Flow</p>
                    <p className="text-xs font-semibold truncate max-w-[140px]">
                      {missions.find((m) => m.id === activeTimerMissionId)?.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-mono font-extrabold text-white">
                    {formatTimerValue(timerSeconds)}
                  </span>
                  <button
                    onClick={stopFocusTimer}
                    className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition"
                  >
                    <Pause className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {missions.map((m) => {
                const isTimerRunningOnThis = activeTimerMissionId === m.id && isTimerRunning;
                return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                      m.completed
                        ? "bg-white/5 border-emerald-500/25 text-white/50"
                        : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 shadow-sm"
                    }`}
                  >
                    {/* Background Progress Highlight for running task */}
                    {isTimerRunningOnThis && (
                      <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none" />
                    )}

                    <div className="space-y-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <button
                            onClick={() => handleMissionCompletion(m.id, m.title, m.category)}
                            className={`mt-0.5 shrink-0 transition-transform hover:scale-110 cursor-pointer`}
                          >
                            {m.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-300 fill-emerald-500/20" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center hover:border-emerald-300 transition-colors bg-white/5" />
                            )}
                          </button>
                          
                          <div>
                            <h3 className={`text-xs font-semibold leading-relaxed ${m.completed ? "line-through text-white/40" : "text-white"}`}>
                              {m.title}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md ${
                                m.category === "Wellbeing"
                                  ? "bg-pink-500/20 text-pink-200 border border-pink-500/30"
                                  : m.category === "Academics"
                                  ? "bg-sky-500/20 text-sky-200 border border-sky-500/30"
                                  : m.category === "Career"
                                  ? "bg-indigo-500/20 text-indigo-200 border border-indigo-500/30"
                                  : "bg-amber-500/20 text-amber-200 border border-amber-500/30"
                              }`}>
                                {m.category}
                              </span>
                              <span className="text-[9px] text-white/40">• {m.estimatedTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detail row */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-white/5 pt-2.5 text-white/70">
                        <div>
                          <span className="text-white/40 block">Dream Impact:</span>
                          <span className="font-semibold text-emerald-300 truncate block">{m.dreamImpact}</span>
                        </div>
                        <div>
                          <span className="text-white/40 block">Bloom Reward:</span>
                          <span className="font-semibold text-teal-200 flex items-center gap-1">
                            {m.category === "Career" ? "🏕 Campfire" : m.category === "Academics" ? "🌳 Sapling" : m.category === "Wellbeing" ? "🌸 Blossom" : "🌼 Violet Flower"}
                          </span>
                        </div>
                      </div>

                      {/* Task Action Row */}
                      {!m.completed && (
                        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                          <button
                            onClick={() => toggleFocusTimer(m.id)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[10px] font-semibold transition ${
                              isTimerRunningOnThis
                                ? "bg-rose-500/20 text-rose-200 border border-rose-500/30"
                                : "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 hover:bg-emerald-500/30"
                            }`}
                          >
                            {isTimerRunningOnThis ? (
                              <>
                                <Pause className="w-3 h-3" /> Pause Focus
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3" /> Start Focus
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setMentorAdviceMission(m);
                              playSynthesizedChime("click");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-medium transition flex items-center justify-center gap-1"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-[#FF9D6C]" />
                            Ask Mentor
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quiet empty state */}
            {missions.length === 0 && (
              <div className="text-center py-8 text-white/50 space-y-2">
                <Flower className="w-8 h-8 mx-auto text-white/20" />
                <p className="text-xs">All missions are integrated. Ask your AI Mentor to seed more.</p>
              </div>
            )}
          </div>
        </section>

        {/* ================= SECTION 3: BLOOM FOREST CANONICAL CANVAS (5 Columns) ================= */}
        <section
          id="lp-forest-section"
          className={`${
            mobileTab === "forest" ? "block" : "hidden"
          } md:block lg:col-span-5 space-y-6 order-1 lg:order-2`}
        >
          <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 pb-2 border-b border-white/10 gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-white/50 font-bold block">Interactive Arboretum</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                    Atmosphere: <span className="uppercase text-white font-mono text-[10px]">{activeAtmosphere}</span>
                  </span>
                  <span className="text-xs text-white/30">•</span>
                  <span className="text-[10px] text-pink-300 font-semibold uppercase tracking-widest animate-pulse">Legacy Garden Unlocked</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <div className="flex rounded-lg bg-white/5 p-0.5 border border-white/10 text-[10px] font-semibold">
                  <button
                    onClick={() => {
                      setActiveGardenView("forest");
                      playSynthesizedChime("click");
                    }}
                    className={`px-2 py-1 rounded-md transition ${activeGardenView === "forest" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-white/60 hover:text-white"}`}
                  >
                    Living Forest
                  </button>
                  <button
                    onClick={() => {
                      setActiveGardenView("legacy");
                      playSynthesizedChime("complete");
                    }}
                    className={`px-2 py-1 rounded-md transition flex items-center gap-1 ${activeGardenView === "legacy" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-white/60 hover:text-white"}`}
                  >
                    <span>🌸</span> Legacy Garden
                  </button>
                </div>

                <button
                  onClick={resetForest}
                  className="text-[10px] font-mono text-white/40 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg border border-white/10 transition cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            {/* CANVAS INTERACTIVE CONTAINER */}
            <div className="relative rounded-2xl overflow-hidden mt-2 bg-slate-950/20 border border-white/5 shadow-inner">
              
              {/* BACKDROP GRADIENT ACCORDING TO ATMOSPHERE */}
              <div className={`absolute inset-0 bg-gradient-to-b ${atmosphereSkyClass} transition-all duration-700 pointer-events-none`} />

              {/* ATMOSPHERE FLOATING PARTICLE SIMULATION */}
              <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                <svg className="w-full h-full">
                  {weatherParticles.map((pt) => {
                    if (activeAtmosphere === "rain") {
                      return (
                        <line
                          key={pt.id}
                          x1={pt.x}
                          y1={pt.y}
                          x2={pt.x - 4}
                          y2={pt.y + 12}
                          stroke="#a5f3fc"
                          strokeWidth="1"
                          strokeOpacity={pt.opacity}
                          className="animate-pulse"
                        />
                      );
                    }
                    if (activeAtmosphere === "snow") {
                      return (
                        <circle
                          key={pt.id}
                          cx={pt.x}
                          cy={pt.y}
                          r={pt.size}
                          fill="#ffffff"
                          fillOpacity={pt.opacity}
                          className="animate-bounce"
                        />
                      );
                    }
                    if (activeAtmosphere === "night") {
                      return (
                        <circle
                          key={pt.id}
                          cx={pt.x}
                          cy={pt.y}
                          r={pt.size * 2}
                          fill="#fef08a"
                          fillOpacity={pt.opacity}
                          className="animate-pulse"
                          style={{
                            transformOrigin: `${pt.x}px ${pt.y}px`,
                            animation: `ping ${3 + Math.random() * 3}s infinite ease-in-out`
                          }}
                        />
                      );
                    }
                    if (activeAtmosphere === "spring") {
                      // Blossom drifting
                      return (
                        <path
                          key={pt.id}
                          d={`M ${pt.x} ${pt.y} q 5 5 2 10 q -5 2 -8 -5 z`}
                          fill="#fbcfe8"
                          fillOpacity={pt.opacity}
                        />
                      );
                    }
                    // Default warm pollen particles
                    return (
                      <circle
                        key={pt.id}
                        cx={pt.x}
                        cy={pt.y}
                        r={pt.size}
                        fill="#fde047"
                        fillOpacity={pt.opacity / 2}
                      />
                    );
                  })}
                </svg>
              </div>

              {/* MAIN SVG DRAWING CANVAS */}
              <svg
                viewBox="0 0 400 300"
                className="w-full h-auto cursor-crosshair relative z-20"
                onClick={handleSVGClick}
              >
                <defs>
                  {/* Bark gradients */}
                  <linearGradient id="barkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#451a03" />
                    <stop offset="50%" stopColor="#78350f" />
                    <stop offset="100%" stopColor="#451a03" />
                  </linearGradient>
                  <linearGradient id="barkGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#78350f" />
                    <stop offset="50%" stopColor="#9a3412" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>

                  {/* Leaf foliage gradients */}
                  <radialGradient id="leafGradDark" cx="50%" cy="40%" r="50%">
                    <stop offset="0%" stopColor="#15803d" />
                    <stop offset="70%" stopColor="#166534" />
                    <stop offset="100%" stopColor="#14532d" />
                  </radialGradient>
                  <radialGradient id="leafGradMid" cx="45%" cy="35%" r="50%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="75%" stopColor="#16a34a" />
                    <stop offset="100%" stopColor="#15803d" />
                  </radialGradient>
                  <radialGradient id="leafGradLight" cx="40%" cy="30%" r="50%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="80%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </radialGradient>

                  {/* Cherry blossom fluffy Sakura gradients */}
                  <radialGradient id="sakuraGradDark" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="75%" stopColor="#db2777" />
                    <stop offset="100%" stopColor="#9d174d" />
                  </radialGradient>
                  <radialGradient id="sakuraGradLight" cx="40%" cy="40%" r="50%">
                    <stop offset="0%" stopColor="#fbcfe8" />
                    <stop offset="75%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </radialGradient>

                  {/* Water Reflection gradients */}
                  <linearGradient id="lakeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.7" />
                    <stop offset="60%" stopColor="#0369a1" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#075985" stopOpacity="0.8" />
                  </linearGradient>

                  {/* Grass Base & Mid gradients */}
                  <linearGradient id="grassBase" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#14532d" />
                    <stop offset="100%" stopColor="#052e16" />
                  </linearGradient>
                  <linearGradient id="grassMid" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#15803d" />
                    <stop offset="100%" stopColor="#14532d" />
                  </linearGradient>

                  {/* Sun / Moon glow */}
                  <radialGradient id="solarGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
                    <stop offset="40%" stopColor="#fde047" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.9" />
                    <stop offset="35%" stopColor="#cbd5e1" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                    <stop offset="40%" stopColor="#ef4444" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* 1. Atmospheric Sky Elements (Sun, Moon, Lightning) */}
                <g className="animate-cinematic-bg">
                  {activeAtmosphere === "night" && (
                    <g>
                      <circle cx="320" cy="50" r="35" fill="url(#moonGlow)" />
                      <circle cx="320" cy="50" r="16" fill="#e2e8f0" />
                      {/* Moon craters */}
                      <circle cx="314" cy="45" r="3" fill="#cbd5e1" />
                      <circle cx="326" cy="54" r="2.5" fill="#cbd5e1" />
                      <circle cx="322" cy="42" r="2" fill="#cbd5e1" />
                    </g>
                  )}
                  {(activeAtmosphere === "morning" || activeAtmosphere === "forest") && (
                    <circle cx="320" cy="50" r="32" fill="url(#solarGlow)" />
                  )}
                  {activeAtmosphere === "sunset" && (
                    <g>
                      <circle cx="320" cy="80" r="42" fill="url(#solarGlow)" />
                      <circle cx="320" cy="80" r="18" fill="#f97316" />
                    </g>
                  )}
                  {activeAtmosphere === "rain" && (
                    <g>
                      {/* Lightning Flash Overlay */}
                      <rect x="0" y="0" width="400" height="300" fill="#ffffff" className="animate-lightning-flash pointer-events-none z-10" />
                      <rect x="0" y="0" width="400" height="300" fill="#475569" fillOpacity="0.2" />
                    </g>
                  )}
                  {activeAtmosphere === "snow" && (
                    <rect x="0" y="0" width="400" height="300" fill="#38bdf8" fillOpacity="0.1" />
                  )}

                  {/* Drifting Clouds in the background */}
                  <g className="animate-cloud-drift opacity-40">
                    <path d="M 10 30 Q 25 15 40 30 Q 55 15 70 30 Q 80 40 70 50 L 10 50 Z" fill="#ffffff" fillOpacity="0.8" />
                    <path d="M 200 45 Q 212 30 225 45 Q 238 30 250 45 Q 260 55 250 65 L 200 65 Z" fill="#ffffff" fillOpacity="0.7" />
                  </g>
                </g>

                {/* 2. Deep Parallax Mountains backdrop */}
                <g className="animate-cinematic-bg">
                  <path d="M 0 280 L 60 140 L 140 220 L 260 110 L 350 200 L 400 280 Z" fill="#1e293b" fillOpacity="0.08" />
                  <path d="M 0 280 L 100 170 L 200 240 L 310 130 L 400 280 Z" fill="#0f172a" fillOpacity="0.05" />
                </g>

                {/* 3. Layered Mossy Grasslands and Dirt Pathways */}
                <g className="animate-cinematic-fg">
                  {/* Winding pathways between camp and study centers */}
                  <path d="M 160 280 Q 210 240 280 250 Q 320 255 400 280" stroke="#78350f" strokeWidth="12" strokeOpacity="0.18" strokeLinecap="round" fill="none" />
                  <path d="M 160 280 Q 210 240 280 250 Q 320 255 400 280" stroke="#9a3412" strokeWidth="8" strokeOpacity="0.12" strokeLinecap="round" fill="none" />
                  <path d="M 20 280 Q 80 260 140 270" stroke="#78350f" strokeWidth="6" strokeOpacity="0.15" strokeLinecap="round" fill="none" />

                  {/* Base grassland hill layer */}
                  <path d="M 0 245 Q 110 215 250 235 Q 330 225 400 245 L 400 300 L 0 300 Z" fill="url(#grassBase)" />
                  <path d="M 0 260 Q 140 230 400 260 L 400 300 L 0 300 Z" fill="url(#grassMid)" />

                  {/* Dynamic weather overlays on ground (Rain Puddles or Snow Accumulation) */}
                  {activeAtmosphere === "rain" && (
                    <g>
                      <ellipse cx="140" cy="265" rx="16" ry="5" fill="#0284c7" fillOpacity="0.3" />
                      <ellipse cx="230" cy="275" rx="22" ry="6.5" fill="#0284c7" fillOpacity="0.25" />
                      <ellipse cx="140" cy="265" rx="10" ry="3.1" stroke="#38bdf8" strokeWidth="0.5" fill="none" className="animate-water-ripple" style={{ animationDelay: '1s' }} />
                      <ellipse cx="230" cy="275" rx="14" ry="4.2" stroke="#38bdf8" strokeWidth="0.5" fill="none" className="animate-water-ripple" style={{ animationDelay: '2.5s' }} />
                    </g>
                  )}
                  {activeAtmosphere === "snow" && (
                    <g>
                      <path d="M 0 245 Q 110 215 250 235 Q 330 225 400 245 L 400 250 Q 330 230 250 240 Q 110 220 0 250 Z" fill="#ffffff" fillOpacity="0.92" />
                      <path d="M 0 260 Q 140 230 400 260 L 400 264 Q 140 234 0 264 Z" fill="#f1f5f9" fillOpacity="0.95" />
                    </g>
                  )}

                  {/* Scattered rocks and pebbles */}
                  <ellipse cx="45" cy="258" rx="5.5" ry="2" fill="#475569" fillOpacity="0.8" />
                  <ellipse cx="48" cy="259" rx="3.5" ry="1.2" fill="#64748b" fillOpacity="0.7" />
                  <ellipse cx="185" cy="252" rx="7.5" ry="2.8" fill="#334155" fillOpacity="0.85" />
                  <ellipse cx="187" cy="251" rx="4.5" ry="1.8" fill="#475569" fillOpacity="0.75" />
                  <ellipse cx="320" cy="268" rx="4" ry="1.5" fill="#334155" fillOpacity="0.6" />

                  {/* Floating Autumn petals scattered on grass */}
                  <path d="M 55 264 C 57 264 59 262 57 260 C 55 260 53 262 55 264 Z" fill="#db2777" fillOpacity="0.6" />
                  <path d="M 120 272 C 122 272 124 270 122 268 C 120 268 118 270 120 272 Z" fill="#ec4899" fillOpacity="0.7" />
                  <path d="M 290 278 C 292 278 294 276 292 274 C 290 274 288 276 290 278 Z" fill="#fbcfe8" fillOpacity="0.8" />
                </g>

                {/* 4. Reflection Pond / Lake with aquatic life & reflection physics */}
                <g className="animate-cinematic-fg">
                  {/* Outer shoreline moss shadow */}
                  <ellipse cx="280" cy="255" rx="52" ry="17" fill="#0f172a" fillOpacity="0.15" />
                  {/* Reflection pool body */}
                  <ellipse cx="280" cy="255" rx="48" ry="14" fill="url(#lakeGrad)" stroke="#0284c7" strokeWidth="1" />

                  {/* Concentric ripples radiating */}
                  <ellipse cx="265" cy="253" rx="15" ry="4.5" stroke="#38bdf8" strokeWidth="0.8" fill="none" className="animate-water-ripple" style={{ animationDelay: '0s' }} />
                  <ellipse cx="295" cy="257" rx="20" ry="6" stroke="#0ea5e9" strokeWidth="0.5" fill="none" className="animate-water-ripple" style={{ animationDelay: '2s' }} />

                  {/* Swimming fish shadow */}
                  <g className="animate-fish-swim">
                    <path d="M 255 253 Q 260 251 265 253 Q 268 255 272 254" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.8" />
                    <polygon points="271,254 274,251 274,257" fill="#0284c7" opacity="0.8" />
                  </g>

                  {/* Floating sakura leaves in lake */}
                  <path d="M 255 252 C 257 252 258 250 256 249" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  <path d="M 295 258 C 297 258 298 256 296 255" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                  {/* Gliding Mother Duck & Duckling */}
                  <g className="animate-duck-glide pointer-events-none">
                    {/* Mother Duck */}
                    <path d="M 10 248 C 14 248 16 244 14 241 C 12 241 11 243 10 244 C 9 243 7 243 6 244 L 4 246 L 7 248 Z" fill="#ffffff" />
                    <polygon points="14,241 16,242 14,243" fill="#f59e0b" />
                    {/* Little Duckling */}
                    <path d="M 2 249 C 4 249 5 247 4 245 L 2 247 Z" fill="#fbbf24" />
                  </g>

                  {/* HIGH-FIDELITY ANIMATED COMPANION ELEMENTS (Living World) */}
                  {/* 1. Migrating Birds soaring gracefully across the sky */}
                  <g className="pointer-events-none opacity-40">
                    <path d="M 50 40 Q 55 35 60 40 Q 65 35 70 40" stroke="#94a3b8" strokeWidth="1.2" fill="none" className="animate-sway-gentle" style={{ animationDelay: '0s' }} />
                    <path d="M 85 48 Q 88 44 91 48 Q 94 44 97 48" stroke="#94a3b8" strokeWidth="1" fill="none" className="animate-sway-gentle" style={{ animationDelay: '1.2s' }} />
                    <path d="M 120 35 Q 124 31 128 35 Q 132 31 136 35" stroke="#94a3b8" strokeWidth="1" fill="none" className="animate-sway-gentle" style={{ animationDelay: '2.5s' }} />
                  </g>

                  {/* 2. Shimmering Fireflies floating dynamically during Sunset/Night */}
                  {(activeAtmosphere === "night" || activeAtmosphere === "sunset") && (
                    <g className="pointer-events-none">
                      <circle cx="80" cy="220" r="1.8" fill="#fbbf24" className="animate-firefly-glow" style={{ animationDelay: '0s' }} />
                      <circle cx="150" cy="180" r="2.2" fill="#fef08a" className="animate-firefly-glow" style={{ animationDelay: '1.5s' }} />
                      <circle cx="210" cy="210" r="1.5" fill="#fde047" className="animate-firefly-glow" style={{ animationDelay: '0.8s' }} />
                      <circle cx="270" cy="190" r="2.5" fill="#fef08a" className="animate-firefly-glow" style={{ animationDelay: '2.2s' }} />
                      <circle cx="340" cy="225" r="1.8" fill="#fbbf24" className="animate-firefly-glow" style={{ animationDelay: '3.1s' }} />
                    </g>
                  )}

                  {/* 3. Fluttering Butterflies dancing near flower clusters */}
                  {(activeAtmosphere === "morning" || activeAtmosphere === "spring" || activeAtmosphere === "forest") && (
                    <g className="pointer-events-none">
                      {/* Butterfly 1 */}
                      <g className="animate-bounce" style={{ animationDuration: '4s' }}>
                        <path d="M 60 170 Q 58 165 62 165 Q 64 168 62 170" fill="#f472b6" />
                        <path d="M 60 170 Q 62 165 58 165 Q 56 168 58 170" fill="#ec4899" />
                      </g>
                      {/* Butterfly 2 */}
                      <g className="animate-bounce" style={{ animationDuration: '5.5s', animationDelay: '2s' }}>
                        <path d="M 170 190 Q 168 185 172 185 Q 174 188 172 190" fill="#60a5fa" />
                        <path d="M 170 190 Q 172 185 168 185 Q 166 188 168 190" fill="#3b82f6" />
                      </g>
                    </g>
                  )}

                  {/* 4. Falling leaves/petals drifting gently across the screen */}
                  {activeAtmosphere !== "snow" && (
                    <g className="pointer-events-none opacity-60">
                      <path d="M 120 40 C 122 45 118 50 120 55" stroke="#f472b6" strokeWidth="1.5" fill="none" className="animate-leaf-float" style={{ animationDelay: '0s' }} />
                      <path d="M 220 20 C 218 26 222 32 220 38" stroke="#f472b6" strokeWidth="1.5" fill="none" className="animate-leaf-float" style={{ animationDelay: '3s' }} />
                      <path d="M 310 60 C 312 65 308 72 310 78" stroke="#10b981" strokeWidth="1.2" fill="none" className="animate-leaf-float" style={{ animationDelay: '1.5s' }} />
                      <path d="M 50 50 C 48 55 52 62 50 68" stroke="#f59e0b" strokeWidth="1.4" fill="none" className="animate-leaf-float" style={{ animationDelay: '4.5s' }} />
                    </g>
                  )}
                </g>

                {/* 5. Render Forest Items or Legacy Trees of Honor */}
                {activeGardenView === "forest" ? (
                  forestItems.map((item) => {
                    const hash = Math.abs(item.x * 17 + item.y * 31);
                    const growth = item.growthProgress ?? 1.0;
                    const windClass = activeAtmosphere === "rain" || activeAtmosphere === "snow" || activeAtmosphere === "spring"
                      ? "animate-sway-strong"
                      : "animate-sway-gentle";
                    const randomSwayDelay = `-${(hash % 50) / 10}s`;

                    // Procedural Parameters to ensure "No Duplicated Models" & realistic natural details
                    const trunkHeight = 24 + (hash % 11);
                    const branchSpread = 13 + (hash % 8);
                    const trunkSkew = ((hash % 5) - 2) * 0.4;
                    
                    // Varying Leaf cluster radiuses and positions
                    const lf1Radius = 14 + (hash % 5);
                    const lf2Radius = 13 + ((hash + 2) % 5);
                    const lf3Radius = 15 + ((hash + 4) % 6);
                    const lf4Radius = 10 + ((hash + 1) % 4);
                    const lf5Radius = 11 + ((hash + 3) % 4);

                    // Unique flower color palette per entity
                    const flowerHue = hash % 5;
                    const flowerColor1 = flowerHue === 0 ? "#f43f5e" : flowerHue === 1 ? "#ec4899" : flowerHue === 2 ? "#a855f7" : flowerHue === 3 ? "#f97316" : "#e11d48";
                    const flowerColor2 = flowerHue === 0 ? "#ec4899" : flowerHue === 1 ? "#f43f5e" : flowerHue === 2 ? "#d8b4fe" : flowerHue === 3 ? "#fdba74" : "#fb7185";
                    const flowerStemHeight = 13 + (hash % 6);
                    const petalCount = 4 + (hash % 3); // 4, 5, or 6 petals

                    // Cherry blossom organic curves
                    const cherryTrunkHeight = 21 + (hash % 9);
                    const cherrySpread = 11 + (hash % 6);
                    const cherryCurve = (hash % 6) - 3;

                    return (
                      <g
                        key={item.id}
                        transform={`translate(${item.x}, ${item.y}) scale(${item.scale * (0.3 + growth * 0.7)})`}
                        className="transition-transform duration-500"
                      >
                        <title>{item.label} ({Math.round(growth * 100)}% Grown - {item.date})</title>

                        {/* Floor shadow of the specific item */}
                        <ellipse cx="0" cy="1" rx={14 * growth} ry={3.5 * growth} fill="#064e3b" fillOpacity={0.25} />

                        {/* ===================== TYPE: TREE ===================== */}
                        {item.type === "tree" && (
                          <g className={windClass} style={{ animationDelay: randomSwayDelay }}>
                            {growth < 0.25 ? (
                              /* SEED / TINY GREEN SPROUT (Stage 1) */
                              <g>
                                {/* Cracked seed coat */}
                                <path d="M -5 0 Q -2 -6 0 0" stroke="#78350f" strokeWidth="2.5" fill="none" />
                                <path d="M 5 0 Q 2 -6 0 0" stroke="#78350f" strokeWidth="2.5" fill="none" />
                                {/* Small stem & dual leaves */}
                                <path d="M 0 0 Q -2 -10 -5 -15" stroke="#4ade80" strokeWidth="2" fill="none" strokeLinecap="round" />
                                <path d="M 0 0 Q 2 -8 5 -12" stroke="#4ade80" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                                <path d="M -5 -15 C -8 -18 -8 -13 -5 -15 Z" fill="#22c55e" />
                                <path d="M 5 -12 C 8 -15 8 -10 5 -12 Z" fill="#4ade80" />
                              </g>
                            ) : growth < 0.5 ? (
                              /* YOUNG STALK / PLANT (Stage 2) */
                              <g>
                                <path d={`M 0 0 Q ${trunkSkew} ${-trunkHeight/2} -3 ${-trunkHeight}`} stroke="url(#barkGrad)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                                {/* Thin delicate branches with leaf buds */}
                                <path d={`M -1.5 ${-trunkHeight/2} Q -6 ${-trunkHeight/2 - 6} -10 ${-trunkHeight/2 - 8}`} stroke="url(#barkGrad)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                                <path d={`M -1 ${-trunkHeight * 0.7} Q 5 ${-trunkHeight * 0.7 - 5} 8 ${-trunkHeight * 0.7 - 8}`} stroke="url(#barkGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                                {/* Leaf buds */}
                                <circle cx="-3" cy={-trunkHeight} r="5" fill="url(#leafGradMid)" />
                                <circle cx="-10" cy={-trunkHeight/2 - 8} r="4" fill="url(#leafGradLight)" />
                                <circle cx="8" cy={-trunkHeight * 0.7 - 8} r="3.5" fill="url(#leafGradLight)" />
                              </g>
                            ) : growth < 0.75 ? (
                              /* HEALTHY SAPLING (Stage 3) */
                              <g>
                                <rect x="-2" y={-trunkHeight} width="4.2" height={trunkHeight} fill="url(#barkGrad)" />
                                <path d={`M -2 0 L -1.5 ${-trunkHeight} Q ${trunkSkew - 1.5} ${-trunkHeight - 6} -8 ${-trunkHeight - 12}`} stroke="url(#barkGrad)" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                                {/* Foliage assembly */}
                                <circle cx="-8" cy={-trunkHeight - 12} r="11" fill="url(#leafGradDark)" />
                                <circle cx="-3" cy={-trunkHeight - 14} r="9.5" fill="url(#leafGradMid)" />
                                <circle cx="-11" cy={-trunkHeight - 10} r="8" fill="url(#leafGradLight)" />
                              </g>
                            ) : (
                              /* FULL MATURE / ANCIENT OAK TREE (Stage 4 & 5) */
                              <g>
                                {/* Multi-branched detailed bark-textured trunk */}
                                <path d={`M -5 0 Q -5 ${-trunkHeight} ${-branchSpread} ${-trunkHeight - 11} M 5 0 Q 5 ${-trunkHeight + 5} ${branchSpread} ${-trunkHeight - 7} M -2 ${-trunkHeight + 5} Q ${trunkSkew} ${-trunkHeight - 15} -4 ${-trunkHeight - 28}`} stroke="url(#barkGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                                <rect x="-5.5" y={-trunkHeight} width="11" height={trunkHeight} fill="url(#barkGrad)" />
                                {/* Tree trunk highlight lines */}
                                <path d={`M -2.5 0 L -2.5 ${-trunkHeight + 2}`} stroke="#9a3412" strokeWidth="1.2" strokeOpacity="0.45" />
                                <path d={`M 1.5 0 L 1.5 ${-trunkHeight + 6}`} stroke="#451a03" strokeWidth="1.5" strokeOpacity="0.6" />

                                {/* Overlapping highly dimensional leaf clusters */}
                                <circle cx={-branchSpread} cy={-trunkHeight - 11} r={lf1Radius} fill="url(#leafGradDark)" />
                                <circle cx={branchSpread} cy={-trunkHeight - 7} r={lf2Radius} fill="url(#leafGradDark)" />
                                <circle cx="-4" cy={-trunkHeight - 28} r={lf3Radius} fill="url(#leafGradMid)" />
                                <circle cx={-branchSpread + 2} cy={-trunkHeight - 21} r={lf4Radius} fill="url(#leafGradLight)" />
                                <circle cx={branchSpread - 8} cy={-trunkHeight - 19} r={lf5Radius} fill="url(#leafGradLight)" />
                                <circle cx="0" cy={-trunkHeight - 38} r="11" fill="#86efac" fillOpacity="0.8" />

                                {/* Glistening rain highlight droplets */}
                                {activeAtmosphere === "rain" && (
                                  <g opacity="0.8">
                                    <circle cx="-8" cy={-trunkHeight - 30} r="1" fill="#e0f2fe" />
                                    <circle cx="12" cy={-trunkHeight - 18} r="1" fill="#e0f2fe" />
                                    <circle cx="-2" cy={-trunkHeight - 10} r="1" fill="#e0f2fe" />
                                  </g>
                                )}

                                {/* Snow Caps accumulation on foliage and branches */}
                                {activeAtmosphere === "snow" && (
                                  <g>
                                    {/* Fluffy white snow layers directly on top of the canopy circles */}
                                    <path d={`M ${-branchSpread - 5} ${-trunkHeight - 40} Q 0 ${-trunkHeight - 50} ${branchSpread + 5} ${-trunkHeight - 40} Q 0 ${-trunkHeight - 35} ${-branchSpread - 5} ${-trunkHeight - 40}`} fill="#ffffff" fillOpacity="0.95" />
                                    <path d={`M ${-branchSpread - 12} ${-trunkHeight - 20} Q ${-branchSpread} ${-trunkHeight - 28} 0 ${-trunkHeight - 18} Q ${-branchSpread} ${-trunkHeight - 12} ${-branchSpread - 12} ${-trunkHeight - 20}`} fill="#ffffff" fillOpacity="0.9" />
                                    <path d={`M 0 ${-trunkHeight - 18} Q ${branchSpread} ${-trunkHeight - 24} ${branchSpread + 12} ${-trunkHeight - 14} Q ${branchSpread} ${-trunkHeight - 8} 0 ${-trunkHeight - 18}`} fill="#f1f5f9" fillOpacity="0.95" />
                                  </g>
                                )}
                              </g>
                            )}
                          </g>
                        )}

                        {/* ===================== TYPE: FLOWER ===================== */}
                        {item.type === "flower" && (
                          <g className={windClass} style={{ animationDelay: randomSwayDelay }}>
                            {growth < 0.35 ? (
                              /* Sprout shoot */
                              <line x1="0" y1="0" x2="0" y2="-8" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
                            ) : (
                              /* Blooming beautiful flower */
                              <g>
                                {/* Stem & leaf wings */}
                                <line x1="0" y1="0" x2="0" y2={-flowerStemHeight} stroke="#22c55e" strokeWidth="2" />
                                <path d={`M 0 ${-flowerStemHeight / 2} Q -6 ${-flowerStemHeight / 2 - 3} -9 ${-flowerStemHeight / 2}`} stroke="#22c55e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                                <path d={`M 0 ${-flowerStemHeight * 0.7} Q 6 ${-flowerStemHeight * 0.7 - 3} 9 ${-flowerStemHeight * 0.7}`} stroke="#22c55e" strokeWidth="1.5" fill="none" strokeLinecap="round" />

                                {/* Procedural multi-petal arrangement */}
                                {petalCount === 4 ? (
                                  <g>
                                    <circle cx="-5" cy={-flowerStemHeight - 5} r="4.8" fill={flowerColor1} />
                                    <circle cx="5" cy={-flowerStemHeight - 5} r="4.8" fill={flowerColor1} />
                                    <circle cx="0" cy={-flowerStemHeight - 10} r="4.8" fill={flowerColor2} />
                                    <circle cx="0" cy={-flowerStemHeight} r="4.8" fill={flowerColor2} />
                                  </g>
                                ) : petalCount === 5 ? (
                                  <g>
                                    <circle cx="-4" cy={-flowerStemHeight - 8} r="4.5" fill={flowerColor1} />
                                    <circle cx="4" cy={-flowerStemHeight - 8} r="4.5" fill={flowerColor1} />
                                    <circle cx="-5" cy={-flowerStemHeight - 2} r="4.5" fill={flowerColor2} />
                                    <circle cx="5" cy={-flowerStemHeight - 2} r="4.5" fill={flowerColor2} />
                                    <circle cx="0" cy={-flowerStemHeight - 11} r="4.5" fill={flowerColor1} />
                                  </g>
                                ) : (
                                  <g>
                                    {/* 6 Petals */}
                                    <circle cx="-5" cy={-flowerStemHeight - 5} r="4.2" fill={flowerColor1} />
                                    <circle cx="5" cy={-flowerStemHeight - 5} r="4.2" fill={flowerColor1} />
                                    <circle cx="-3" cy={-flowerStemHeight - 9} r="4.2" fill={flowerColor2} />
                                    <circle cx="3" cy={-flowerStemHeight - 9} r="4.2" fill={flowerColor2} />
                                    <circle cx="-3" cy={-flowerStemHeight - 1} r="4.2" fill={flowerColor2} />
                                    <circle cx="3" cy={-flowerStemHeight - 1} r="4.2" fill={flowerColor1} />
                                  </g>
                                )}
                                {/* Core center node */}
                                <circle cx="0" cy={-flowerStemHeight - 5} r="2.8" fill="#fef08a" stroke="#fbbf24" strokeWidth="1" />
                              </g>
                            )}
                          </g>
                        )}

                        {/* ===================== TYPE: CHERRY BLOSSOM ===================== */}
                        {item.type === "cherry" && (
                          <g className={windClass} style={{ animationDelay: randomSwayDelay }}>
                            {growth < 0.35 ? (
                              /* Petite pink shoot */
                              <g>
                                <line x1="0" y1="0" x2="0" y2="-12" stroke="#5c2d12" strokeWidth="2" />
                                <circle cx="0" cy="-14" r="4" fill="#fda4af" />
                              </g>
                            ) : (
                              /* Fully dimensional gorgeous Cherry Blossom tree */
                              <g>
                                {/* Organic detailed dark brown trunk */}
                                <path d={`M -4 0 L -3 ${-cherryTrunkHeight} Q ${-6 + cherryCurve} ${-cherryTrunkHeight - 9} ${-cherrySpread} ${-cherryTrunkHeight - 14} M 3 0 L 2 ${-cherryTrunkHeight + 4} Q ${5 + cherryCurve} ${-cherryTrunkHeight - 4} ${cherrySpread} ${-cherryTrunkHeight - 8}`} stroke="#5c2d12" strokeWidth="4" strokeLinecap="round" fill="none" />
                                <rect x="-3" y={-cherryTrunkHeight} width="6" height={cherryTrunkHeight} fill="#5c2d12" />

                                {/* Layered Sakura fluffy cotton clusters */}
                                <circle cx={-cherrySpread} cy={-cherryTrunkHeight - 14} r="15" fill="url(#sakuraGradDark)" />
                                <circle cx={cherrySpread} cy={-cherryTrunkHeight - 8} r="14" fill="url(#sakuraGradDark)" />
                                <circle cx="0" cy={-cherryTrunkHeight - 20} r="16.5" fill="url(#sakuraGradLight)" />
                                <circle cx={-cherrySpread + 4} cy={-cherryTrunkHeight - 18} r="11" fill="#fbcfe8" fillOpacity="0.9" />
                                <circle cx={cherrySpread - 3} cy={-cherryTrunkHeight - 14} r="11" fill="#fbcfe8" fillOpacity="0.9" />
                                <circle cx="0" cy={-cherryTrunkHeight - 30} r="10" fill="#ffffff" fillOpacity="0.8" />

                                {/* Snow cap layers */}
                                {activeAtmosphere === "snow" && (
                                  <g>
                                    <path d={`M ${-cherrySpread} ${-cherryTrunkHeight - 34} Q 0 ${-cherryTrunkHeight - 42} ${cherrySpread} ${-cherryTrunkHeight - 34} Q 0 ${-cherryTrunkHeight - 28} ${-cherrySpread} ${-cherryTrunkHeight - 34}`} fill="#ffffff" fillOpacity="0.95" />
                                  </g>
                                )}
                              </g>
                            )}
                          </g>
                        )}


                        {/* ===================== TYPE: CAMPFIRE ===================== */}
                        {item.type === "campfire" && (
                          <g>
                            {/* Wood logs layout */}
                            <line x1="-15" y1="-2" x2="15" y2="-6" stroke="#451a03" strokeWidth="4.5" strokeLinecap="round" />
                            <line x1="-12" y1="-6" x2="12" y2="-2" stroke="#451a03" strokeWidth="4.5" strokeLinecap="round" />
                            <line x1="-4" y1="-8" x2="6" y2="-8" stroke="#2d1301" strokeWidth="4" strokeLinecap="round" />

                            {/* Outer Warm Glowing Heat Sphere */}
                            <circle cx="0" cy="-12" r="25" fill="url(#fireGlow)" />

                            {/* Layered dynamic shifting fire flame path vectors */}
                            <path
                              d="M -9 -4 Q 0 -28 9 -4 Q 4 -16 0 -8 Q -4 -16 -9 -4 Z"
                              fill="#ea580c"
                              className="animate-pulse"
                              style={{ animationDuration: '0.6s' }}
                            />
                            <path
                              d="M -6 -4 Q 0 -22 6 -4 Q 2.5 -13 0 -7 Q -2.5 -13 -6 -4 Z"
                              fill="#f97316"
                              className="animate-pulse"
                              style={{ animationDuration: '0.45s' }}
                            />
                            <path
                              d="M -3 -4 Q 0 -15 3 -4 Q 1.5 -9 0 -5 Z"
                              fill="#facc15"
                              className="animate-pulse"
                              style={{ animationDuration: '0.3s' }}
                            />

                            {/* Spark particles rising */}
                            <circle cx="-5" cy="-28" r="1.5" fill="#fef08a" className="animate-bounce" />
                            <circle cx="4" cy="-34" r="1.2" fill="#fde047" className="animate-bounce" style={{ animationDelay: '0.4s' }} />
                          </g>
                        )}

                        {/* ===================== TYPE: BRIDGE ===================== */}
                        {item.type === "bridge" && (
                          <g>
                            {/* Rich wooden support pilings and beams */}
                            <path d="M -32 0 L -32 -6 L 32 -6 L 32 0" fill="#78350f" />
                            {/* Heavy Arch support line */}
                            <path d="M -32 0 Q 0 -22 32 0" stroke="#451a03" strokeWidth="5.5" fill="none" />
                            <path d="M -28 -7 L 28 -7" stroke="#9a3412" strokeWidth="3" />

                            {/* Individual plank vertical support rails */}
                            <line x1="-18" y1="-2" x2="-18" y2="-6" stroke="#451a03" strokeWidth="1.8" />
                            <line x1="-8" y1="-4" x2="-8" y2="-6" stroke="#451a03" strokeWidth="1.8" />
                            <line x1="8" y1="-4" x2="8" y2="-6" stroke="#451a03" strokeWidth="1.8" />
                            <line x1="18" y1="-2" x2="18" y2="-6" stroke="#451a03" strokeWidth="1.8" />

                            {/* Micro gold birds floating above the bridge */}
                            <path d="M -15 -28 Q -12 -32 -9 -28 Q -6 -32 -3 -28" stroke="#fbbf24" strokeWidth="1" fill="none" className="animate-bounce" />
                          </g>
                        )}

                        {/* ===================== TYPE: EAGLE ===================== */}
                        {item.type === "eagle" && (
                          <g className="animate-bounce" style={{ animationDuration: '3.5s' }}>
                            {/* Majestic eagle soaring wings and tail */}
                            <path
                              d="M -22 -22 Q -10 -30 0 -18 Q 10 -30 22 -22 Q 12 -12 0 -15 Q -12 -12 -22 -22 Z"
                              fill="#334155"
                            />
                            {/* Detailed head beak */}
                            <polygon points="0,-15 -2,-12 0,-10 2,-12" fill="#fbbf24" />
                            {/* Inner feather shadows */}
                            <path d="M -16 -21 Q -8 -25 0 -17 M 16 -21 Q 8 -25 0 -17" stroke="#1e293b" strokeWidth="1.2" fill="none" />
                          </g>
                        )}

                        {/* ===================== TYPE: LAKE ===================== */}
                        {item.type === "lake" && (
                          <g>
                            <ellipse cx="0" cy="0" rx="38" ry="13.5" fill="url(#lakeGrad)" stroke="#0284c7" strokeWidth="1.5" />
                            {/* Ripple lines inside nested lake */}
                            <ellipse cx="-8" cy="-1" rx="18" ry="6" stroke="#38bdf8" strokeWidth="0.8" fill="none" className="animate-water-ripple" />
                            <ellipse cx="10" cy="2" rx="12" ry="4" stroke="#0ea5e9" strokeWidth="0.5" fill="none" className="animate-water-ripple" style={{ animationDelay: '1.8s' }} />
                          </g>
                        )}

                        {/* ===================== TYPE: SUNRISE ===================== */}
                        {item.type === "sunrise" && (
                          <g>
                            {/* Golden solar rise disc */}
                            <path d="M -26 0 A 26 26 0 0 1 26 0" fill="url(#solarGlow)" />
                            {/* Solar beams drawing out */}
                            <line x1="-34" y1="0" x2="-22" y2="0" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="22" y1="0" x2="34" y2="0" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="0" y1="-34" x2="0" y2="-22" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="-22" y1="-22" x2="-14" y2="-14" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                            <line x1="14" y1="-14" x2="22" y2="-22" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                          </g>
                        )}
                      </g>
                    );
                  })
                ) : (
                  /* LEGACY GARDEN: RENDER MAGNIFICENT HISTORICAL MONUMENT TREES OF HONOR */
                  [
                    {
                      id: "lt1",
                      title: "First Compilation",
                      subtitle: "Admitted into B.Tech CSE, learned core structures.",
                      date: "July 2025",
                      x: 70,
                      y: 220,
                      color: "#60a5fa",
                      skills: ["Python Basics", "Algorithms"],
                      reflection: "Left home with a backpack full of dreams. The first time my binary tree code compiled successfully was an unforgettable spark.",
                      photoGradient: "from-blue-500/30 to-indigo-500/30",
                    },
                    {
                      id: "lt2",
                      title: "Neural Synthesis",
                      subtitle: "Built NeuralStyleSieve optimization model.",
                      date: "Nov 2025",
                      x: 170,
                      y: 200,
                      color: "#34d399",
                      skills: ["PyTorch", "Latency Minimization"],
                      reflection: "Spent three straight nights optimizing tensor convolutions. Seeing the mobile latency drop by 40% felt like magic.",
                      photoGradient: "from-emerald-500/30 to-teal-500/30",
                    },
                    {
                      id: "lt3",
                      title: "Indic Dialect Engine",
                      subtitle: "Fine-tuned IndicOCR handwriting scripts.",
                      date: "Jan 2026",
                      x: 270,
                      y: 230,
                      color: "#f472b6",
                      skills: ["OpenCV", "Regional OCR"],
                      reflection: "Recognizing handwritten Devanagari script offline with low power. This proved we can build tech that helps real rural communities.",
                      photoGradient: "from-pink-500/30 to-purple-500/30",
                    },
                    {
                      id: "lt4",
                      title: "National Hackathon",
                      subtitle: "Won Mumbai AI Regional Hackathon.",
                      date: "March 2026",
                      x: 350,
                      y: 215,
                      color: "#fbbf24",
                      skills: ["WebRTC", "FastAPI"],
                      reflection: "Coordinating with 4 team members on no sleep to ship the rural diagnosis toolkit. True engineering camaraderie.",
                      photoGradient: "from-orange-500/30 to-rose-500/30",
                    }
                  ].map((tree) => {
                    const hash = tree.id.charCodeAt(2) * 11;
                    const windClass = "animate-sway-gentle";
                    const trunkHeight = 35;
                    const branchSpread = 20;

                    return (
                      <g
                        key={tree.id}
                        transform={`translate(${tree.x}, ${tree.y}) scale(1.15)`}
                        className="transition-transform duration-500 cursor-pointer group"
                        onClick={() => {
                          setSelectedMilestoneCard(tree);
                          playSynthesizedChime("complete");
                        }}
                      >
                        <title>Click to open: {tree.title} Memory ({tree.date})</title>

                        {/* Outer celestial glowing halo aura */}
                        <circle cx="0" cy="-20" r="28" fill={tree.color} fillOpacity="0.1" className="animate-pulse" />
                        
                        {/* Floor golden ring glow shadow */}
                        <ellipse cx="0" cy="1" rx="20" ry="5.5" fill="#eab308" fillOpacity="0.15" />
                        <ellipse cx="0" cy="1" rx="14" ry="4" stroke="#fbbf24" strokeWidth="1" fill="none" className="animate-water-ripple" />

                        {/* Golden celestial trunk */}
                        <g className={windClass} style={{ animationDelay: `-${hash % 5}s` }}>
                          <path d={`M -4 0 Q -4 ${-trunkHeight} ${-branchSpread} ${-trunkHeight - 15} M 4 0 Q 4 ${-trunkHeight + 5} ${branchSpread} ${-trunkHeight - 10} M -1 ${-trunkHeight + 5} Q 0 ${-trunkHeight - 20} -2 ${-trunkHeight - 35}`} stroke="url(#barkGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
                          <rect x="-4" y={-trunkHeight} width="8" height={trunkHeight} fill="url(#barkGrad)" />
                          
                          {/* Celestial shining leaves in gold & pink pink gradients */}
                          <circle cx={-branchSpread} cy={-trunkHeight - 15} r="18" fill="url(#sakuraGradLight)" />
                          <circle cx={branchSpread} cy={-trunkHeight - 10} r="16" fill="url(#solarGlow)" />
                          <circle cx="-2" cy={-trunkHeight - 35} r="21" fill="url(#sakuraGradDark)" />
                          <circle cx="0" cy={-trunkHeight - 48} r="14" fill="#fef08a" fillOpacity="0.8" />

                          {/* Floating star particle above tree canopy */}
                          <polygon points="0,-72 3,-64 11,-64 5,-59 7,-51 0,-56 -7,-51 -5,-59 -11,-64 -3,-64" fill="#fbbf24" className="animate-bounce" />

                          {/* Interactive text label hovering beautifully */}
                          <g transform="translate(0, 15)">
                            <rect x="-45" y="-10" width="90" height="15" rx="4" fill="#1e293b" fillOpacity="0.85" stroke="#fbbf24" strokeWidth="0.5" />
                            <text x="0" y="1" textAnchor="middle" fill="#fef08a" fontSize="7" fontWeight="bold" fontFamily="monospace">
                              {tree.title.toUpperCase()}
                            </text>
                          </g>
                        </g>
                      </g>
                    );
                  })
                )}

                {/* 6. Dynamic Immersive Nature Life Creatures (Unobtrusive & Organic) */}
                <g id="nature-life-creatures" className="pointer-events-none">
                  {/* Fluttering Butterflies near flower fields */}
                  <g transform="translate(85, 235)" className="animate-butterfly-1">
                    {/* Left Wing */}
                    <ellipse cx="-2.5" cy="-2" rx="2.5" ry="3" fill="#f43f5e" className="animate-wing-flap" />
                    {/* Right Wing */}
                    <ellipse cx="2.5" cy="-2" rx="2.5" ry="3" fill="#f43f5e" className="animate-wing-flap" style={{ animationDelay: '0.06s' }} />
                    {/* Body */}
                    <line x1="0" y1="2" x2="0" y2="-4" stroke="#1e293b" strokeWidth="0.8" />
                  </g>
                  <g transform="translate(170, 242)" className="animate-butterfly-2">
                    {/* Left Wing */}
                    <ellipse cx="-2.2" cy="-1.8" rx="2.2" ry="2.7" fill="#a855f7" className="animate-wing-flap" />
                    {/* Right Wing */}
                    <ellipse cx="2.2" cy="-1.8" rx="2.2" ry="2.7" fill="#a855f7" className="animate-wing-flap" style={{ animationDelay: '0.04s' }} />
                    {/* Body */}
                    <line x1="0" y1="1.8" x2="0" y2="-3.5" stroke="#1e293b" strokeWidth="0.7" />
                  </g>

                  {/* Hovering Dragonfly over the reflection pond */}
                  <g transform="translate(258, 248)" className="animate-dragonfly">
                    {/* Translucent Wings */}
                    <ellipse cx="-4.5" cy="-1" rx="4.8" ry="1.2" fill="#e0f2fe" fillOpacity="0.75" className="animate-rapid-wing" />
                    <ellipse cx="4.5" cy="-1" rx="4.8" ry="1.2" fill="#e0f2fe" fillOpacity="0.75" className="animate-rapid-wing" style={{ animationDelay: '0.03s' }} />
                    <ellipse cx="-3.8" cy="0.5" rx="3.8" ry="1" fill="#e0f2fe" fillOpacity="0.65" className="animate-rapid-wing" style={{ animationDelay: '0.01s' }} />
                    <ellipse cx="3.8" cy="0.5" rx="3.8" ry="1" fill="#e0f2fe" fillOpacity="0.65" className="animate-rapid-wing" style={{ animationDelay: '0.04s' }} />
                    {/* Slender teal/cyan body */}
                    <line x1="0" y1="-3" x2="0" y2="7" stroke="#0d9488" strokeWidth="0.9" strokeLinecap="round" />
                    {/* Head */}
                    <circle cx="0" cy="-3.8" r="1.1" fill="#0d9488" />
                  </g>

                  {/* Gentle Hopping Rabbit on the left meadow */}
                  <g transform="translate(42, 248)" className="animate-rabbit-hop">
                    {/* Rabbit floor shadow */}
                    <ellipse cx="0" cy="2" rx="3" ry="1" fill="#064e3b" fillOpacity="0.18" />
                    {/* Body */}
                    <ellipse cx="0" cy="-2.2" rx="3.6" ry="2.6" fill="#f1f5f9" />
                    {/* Head */}
                    <circle cx="3.2" cy="-4.4" r="2.1" fill="#f1f5f9" />
                    {/* Ears */}
                    <ellipse cx="2.2" cy="-6.7" rx="0.8" ry="2.2" fill="#fda4af" stroke="#f1f5f9" strokeWidth="0.6" />
                    <ellipse cx="3.8" cy="-6.7" rx="0.8" ry="2.2" fill="#fda4af" stroke="#f1f5f9" strokeWidth="0.6" />
                    {/* Tail */}
                    <circle cx="-3.6" cy="-2.6" r="1.1" fill="#ffffff" />
                    {/* Eye */}
                    <circle cx="3.8" cy="-4.7" r="0.35" fill="#ef4444" />
                  </g>

                  {/* Majestic Buck Deer peering from the right forest edge */}
                  <g transform="translate(362, 235)" className="animate-deer-look">
                    {/* Shadow */}
                    <ellipse cx="0" cy="18" rx="8" ry="2" fill="#064e3b" fillOpacity="0.15" />
                    {/* Legs */}
                    <line x1="-3" y1="6" x2="-3" y2="18" stroke="#92400e" strokeWidth="1.2" />
                    <line x1="1" y1="6" x2="1" y2="18" stroke="#78350f" strokeWidth="1.2" />
                    {/* Body */}
                    <ellipse cx="-1.5" cy="5" rx="6.5" ry="4.5" fill="#b45309" />
                    {/* Neck */}
                    <path d="M 2.5 4 C 3 0 4 -4 5.5 -7" stroke="#b45309" strokeWidth="3" strokeLinecap="round" fill="none" />
                    {/* Head */}
                    <path d="M 5.5 -7 Q 8.5 -8 9.5 -6 Q 8.5 -4 5.5 -5 Z" fill="#b45309" />
                    {/* Ears */}
                    <ellipse cx="4.5" cy="-9.2" rx="1.1" ry="2.2" fill="#b45309" transform="rotate(-15, 4.5, -9.2)" />
                    {/* Underbelly white highlight */}
                    <ellipse cx="-2" cy="7" rx="4.5" ry="2.2" fill="#fef3c7" opacity="0.9" />
                    {/* Little Tail */}
                    <path d="M -7.5 3 Q -9.5 2 -7.5 0" stroke="#b45309" strokeWidth="1.5" fill="none" className="animate-tail-shake" />
                    {/* Majestic Antlers */}
                    <path d="M 4.5 -8.5 Q 2 -13 -1 -12 M 2 -11 Q 0 -13 0 -10" stroke="#78350f" strokeWidth="0.8" fill="none" />
                    <path d="M 5.5 -8.5 Q 6.5 -14 9 -14 M 7 -11.5 Q 8.5 -13.5 8 -11" stroke="#78350f" strokeWidth="0.8" fill="none" />
                    {/* Eye */}
                    <circle cx="7.2" cy="-6.8" r="0.4" fill="#000000" />
                  </g>
                </g>
              </svg>

              {/* Floating warning banner (Nothing dies) */}
              <div className="absolute top-3 left-3 right-3 text-[11px] bg-slate-900/80 backdrop-blur-md text-white/95 px-3 py-2.5 rounded-xl border border-white/10 pointer-events-none flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Your forest is waiting whenever you're ready to continue. Growth is a continuous river.
                </span>
              </div>

              <div className="absolute bottom-3 left-3 text-[10px] bg-slate-950/70 text-white/90 px-3 py-1.5 rounded-lg backdrop-blur-md pointer-events-none">
                ☝ Click on the grasslands to sow your selected item!
              </div>
            </div>

            {/* GROW PALETTE SELECTOR (Emotional rewards) */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono uppercase text-white/50 font-bold block">Sprout Seed Selection</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { type: "flower", icon: "🌼", label: "Flower", desc: "For Assignments" },
                  { type: "tree", icon: "🌳", label: "Tree", desc: "For Projects" },
                  { type: "campfire", icon: "🏕", label: "Camp", desc: "For Hackathons" },
                  { type: "bridge", icon: "🌉", label: "Bridge", desc: "For Internships" },
                  { type: "cherry", icon: "🌸", label: "Sakura", desc: "For Scholarships" },
                  { type: "eagle", icon: "🦅", label: "Eagle", desc: "For Papers" },
                  { type: "lake", icon: "🏞", label: "Lake", desc: "For Semesters" },
                  { type: "sunrise", icon: "🌄", label: "Sunrise", desc: "Graduation" },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => {
                      setSelectedPaletteItem(item.type as any);
                      playSynthesizedChime("click");
                    }}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                      selectedPaletteItem === item.type
                        ? "bg-emerald-500/20 border-emerald-400 text-white shadow-md ring-1 ring-emerald-500/20"
                        : "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                    }`}
                  >
                    <span className="text-lg block leading-none mb-1">{item.icon}</span>
                    <span className="text-[9px] font-bold block truncate w-full">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 2: SMART DEADLINE MANAGER (5 Columns) ================= */}
        <section
          id="lp-deadlines-section"
          className={`${
            mobileTab === "deadlines" ? "block" : "hidden"
          } md:block lg:col-span-3 space-y-6 order-3`}
        >
          <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg space-y-5">
            
            <div className="space-y-1">
              <h2 className="text-lg font-display font-bold tracking-tight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-300" />
                Smart Deadline Manager
              </h2>
              <p className="text-xs text-white/70">
                AI scans for calendar conflicts & study load
              </p>
            </div>

            {/* AI CONFLICT ALERT ZONE */}
            <div className={`p-4 rounded-2xl border transition-all duration-300 space-y-3 ${
              isAIScheduled
                ? "bg-emerald-500/10 border-emerald-400/40 text-emerald-100"
                : "bg-rose-500/15 border-rose-400/30 text-rose-100"
            }`}>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className={`w-5 h-5 shrink-0 ${isAIScheduled ? "text-emerald-400" : "text-rose-400"}`} />
                <div className="space-y-1 text-xs">
                  <p className="font-bold">
                    {isAIScheduled ? "✓ Study Plan Optimised!" : "⚠️ Overload Advisory!"}
                  </p>
                  <p className="text-white/80 leading-relaxed text-[11px]">
                    {isAIScheduled
                      ? "DBMS tasks have been distributed to Sunday, reducing your Thursday midterm preparation pressure."
                      : "Ayush, you have multiple deadlines on Thursday. Midterm prep and DBMS submissions might overlap."}
                  </p>
                </div>
              </div>

              {!isAIScheduled && (
                <button
                  onClick={applySmartSchedulingPlan}
                  className="w-full py-2 bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-semibold text-xs rounded-xl shadow-md transition duration-200 cursor-pointer text-center"
                >
                  Apply AI Smart Scheduling Plan
                </button>
              )}
            </div>

            {/* UNIFIED DEADLINES TIMELINE */}
            <div className="relative border-l border-white/15 pl-4 space-y-5 py-2">
              {deadlines.map((dl) => (
                <div key={dl.id} className="relative group text-xs space-y-1.5">
                  
                  {/* Timeline point indicator */}
                  <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border transition-all ${
                    dl.priority === "High"
                      ? "bg-rose-400 border-rose-500"
                      : "bg-amber-400 border-amber-500"
                  } ${dl.isCustomRescheduled ? "bg-emerald-400 border-emerald-500 scale-110" : ""}`} />

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-white/50 tracking-wider">
                      {dl.category}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      dl.isCustomRescheduled
                        ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30"
                        : dl.priority === "High"
                        ? "bg-rose-500/10 text-rose-300"
                        : "bg-amber-500/10 text-amber-300"
                    }`}>
                      {dl.relativeDays}
                    </span>
                  </div>

                  <h3 className={`font-semibold ${dl.isCustomRescheduled ? "text-emerald-300" : "text-white"}`}>
                    {dl.title}
                  </h3>

                  <p className="text-[10px] text-white/70 italic leading-relaxed pt-1">
                    {dl.impactText}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

      </div>

      {/* LOWER segment: SECTION 4 & SECTION 5 Side by Side or stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* ================= SECTION 4: JOURNEY TIMELINE (7 Columns) ================= */}
        <section
          id="lp-timeline-section"
          className={`${
            mobileTab === "timeline" ? "block" : "hidden"
          } md:block lg:col-span-7 space-y-6`}
        >
          <div className="p-6 md:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg space-y-6">
            
            <div className="space-y-1">
              <h2 className="text-xl font-display font-bold tracking-tight flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-emerald-400" />
                📖 Your Journey Timeline
              </h2>
              <p className="text-xs text-white/70">
                A visual history of memories, achievements, and structural growth
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  date: "July 2025",
                  title: "Enrolled in B.Tech CSE (IIT Delhi)",
                  reflection: "Left home with a backpack full of dreams. Transitioning into engineering life, establishing the foundations of Python, structures, and algorithmic logic.",
                  skills: ["Python", "Algorithm Basics", "Discrete Math"],
                  aiSummary: "🌟 Rooting step of Ayush's AI pipeline dream.",
                  photoGradient: "from-blue-500/30 to-indigo-500/30",
                },
                {
                  date: "Nov 2025",
                  title: "NeuralStyleSieve Prototype Launch",
                  reflection: "Engineered a custom latency-reduction optimization model for low-power edge nodes. Handled real-time styling parameters on mobile processors.",
                  skills: ["Python", "PyTorch", "Mobile GPUs"],
                  aiSummary: "📈 Practical skill leap on optimization pipelines.",
                  photoGradient: "from-emerald-500/30 to-teal-500/30",
                },
                {
                  date: "Jan 2026",
                  title: "IndicOCR Handwriting Engine Repo",
                  reflection: "Fine-tuned lightweight optical characters for Devanagari regional scripts. Tackled high distortion ratios and spatial alignments.",
                  skills: ["TensorFlow", "OpenCV", "Regional OCR"],
                  aiSummary: "🌸 Sparked localized public-good healthcare venture dreams.",
                  photoGradient: "from-pink-500/30 to-purple-500/30",
                },
                {
                  date: "March 2026",
                  title: "Mumbai AI Regional Hackathon (Best Prototype)",
                  reflection: "Built offline-first voice diagnostics toolkit for rural dispensaries in Maharashtra. Understood teammate coordination and high-speed delivery.",
                  skills: ["WebRTC", "FastAPI", "Voice Models"],
                  aiSummary: "🏕 Sprouted the national-tier campfire validation.",
                  photoGradient: "from-orange-500/30 to-rose-500/30",
                },
              ].map((milestone, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row gap-5 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition group"
                >
                  {/* Styled memory placeholder */}
                  <div className={`w-full md:w-32 h-24 rounded-xl bg-gradient-to-tr ${milestone.photoGradient} border border-white/10 flex flex-col items-center justify-center text-center p-2 shrink-0 relative overflow-hidden`}>
                    <span className="text-xl">📸</span>
                    <span className="text-[9px] font-mono mt-1 text-white/60 uppercase tracking-widest">Memory Captured</span>
                    <span className="text-[10px] font-bold block mt-1">{milestone.date}</span>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition duration-300" />
                  </div>

                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-sm text-white group-hover:text-[#FF9D6C] transition">
                        {milestone.title}
                      </h3>
                      <span className="text-[10px] font-mono text-white/40">{milestone.date}</span>
                    </div>

                    <p className="text-xs text-white/80 leading-relaxed font-light">
                      {milestone.reflection}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {milestone.skills.map((sk) => (
                        <span key={sk} className="text-[9px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 border border-white/5">
                          {sk}
                        </span>
                      ))}
                    </div>

                    <div className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-400/10 text-[10px] italic text-emerald-300">
                      {milestone.aiSummary}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ================= SECTION 5: WEEKLY SUNDAY REFLECTION (5 Columns) ================= */}
        <section className="lg:col-span-5 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg space-y-6">
            
            <div className="space-y-1">
              <h2 className="text-xl font-display font-bold tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-300" />
                📊 Weekly Sunday Reflection
              </h2>
              <p className="text-xs text-white/70">
                AI-synthesised organic evaluation of this week's alignment
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Bullet Reflection 1 */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-white/50 font-bold">Dream Goal Growth</span>
                  <span className="text-xs font-mono font-bold text-emerald-300">+3.2% completed</span>
                </div>
                <p className="text-xs leading-relaxed text-white/85">
                  Ayush, completing your CNN Real-time Convolutional Filters project and updating your DBMS foundations has boosted your DreamPath profile readiness for senior research internships.
                </p>
              </div>

              {/* Bullet Reflection 2 */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-white/50 font-bold">Forest Growth</span>
                  <span className="text-xs font-mono font-bold text-pink-300">Planted 1 Sakura & 1 Campfire</span>
                </div>
                <p className="text-xs leading-relaxed text-white/85">
                  You added a glowing campfire for the Smart India Hackathon brainstorming and a beautiful Cherry Blossom for your mental wellness grounding session.
                </p>
              </div>

              {/* Bullet Reflection 3 */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-white/50 font-bold">Academic Balance</span>
                  <span className="text-xs font-mono font-bold text-teal-300">Resilient Preparation</span>
                </div>
                <p className="text-xs leading-relaxed text-white/85">
                  You encountered mid-term exam overlaps but wisely utilized the AI smart scheduler to space out DBMS indexing assignments, preserving your sleep pattern.
                </p>
              </div>

              {/* Gentle Mentor Message (Strict non-guilt-tripping guideline) */}
              <div className="p-5 rounded-2xl bg-[#FF6B6B]/15 border border-pink-500/25 relative overflow-hidden space-y-2.5">
                <div className="absolute top-2 right-2 text-xl opacity-20">🌿</div>
                <h3 className="text-xs font-bold uppercase text-pink-200 tracking-widest">
                  Elder Sibling Advisory
                </h3>
                <p className="text-xs md:text-sm font-sans font-medium italic text-white/95 leading-relaxed">
                  "Ayush, some weeks are naturally slower. If you didn't check every box, your forest hasn't withered. It is simply resting, preparing for the rain. Let's restart with one meaningful step tomorrow. Sleep well, models can retrain tomorrow, your mind deserves today's rest."
                </p>
              </div>

            </div>

          </div>
        </section>

      </div>

      {/* ================= MENTOR ADVICE OVERLAY MODAL ================= */}
      <AnimatePresence>
        {mentorAdviceMission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-white/15 shadow-2xl text-white space-y-5">
              
              <button
                onClick={() => setMentorAdviceMission(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <span className="text-2xl">🌿</span>
                <div>
                  <h3 className="font-display font-extrabold text-base text-[#FF9D6C]">
                    Senior Mentor Advice
                  </h3>
                  <p className="text-[10px] font-mono text-white/50">
                    Helping you master: {mentorAdviceMission.title}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed">
                
                <div className="space-y-1">
                  <h4 className="font-bold text-[#FF6B6B] uppercase tracking-wider text-[10px]">
                    Why this matters for your SoulPrint
                  </h4>
                  <p className="text-white/80 font-light">
                    {mentorAdviceMission.category === "Academics"
                      ? "Getting DBMS Normalization right guarantees excellent backend optimization structures. Google STEP and startups look closely at database core competence."
                      : mentorAdviceMission.category === "Career"
                      ? "Smart India Hackathon is India's most prestigious collegiate contest. Your team ideation on localized public-healthcare speech tools fits perfectly in your co-founder roadmap."
                      : "A deep breathing detox resets cognitive fatigue. Your ML models will load faster if your focus centers aren't overloaded."}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                    Actionable Steps
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-white/85 font-light">
                    {mentorAdviceMission.category === "Academics" ? (
                      <>
                        <li>Draw out the functional dependencies on paper before writing SQL.</li>
                        <li>Do a quick practice on 3NF versus BCNF anomalies.</li>
                        <li>Ask other classmates to review your indexing flow.</li>
                      </>
                    ) : mentorAdviceMission.category === "Career" ? (
                      <>
                        <li>List the localized public-healthcare speech processing nodes.</li>
                        <li>Prepare a clean 3-slide PDF explaining why edge computing matters.</li>
                        <li>Schedule a quick call with your teammates to review.</li>
                      </>
                    ) : (
                      <>
                        <li>Sit comfortably, close your eyes, and follow the 4-7-8 timing.</li>
                        <li>Listen to the Synthesized rain ambient sounds to anchor attention.</li>
                        <li>Don't judge the thoughts; let them drift away like clouds.</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-[11px] italic text-white/70">
                  "Take it step by step, Ayush. Don't rush. You're doing incredible work."
                </div>

              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setMentorAdviceMission(null)}
                  className="px-5 py-2 rounded-xl bg-white text-slate-900 font-semibold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  Got it, thanks!
                </button>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= LEGACY GARDEN MILESTONE CARD MODAL ================= */}
      <AnimatePresence>
        {selectedMilestoneCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-white/15 shadow-2xl text-white space-y-5">
              
              <button
                onClick={() => setSelectedMilestoneCard(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <span className="text-2xl">🌸</span>
                <div>
                  <h3 className="font-display font-extrabold text-base text-[#FF9D6C]">
                    Legacy Garden Memory of Honor
                  </h3>
                  <p className="text-[10px] font-mono text-white/50">
                    Milestone Achieved • {selectedMilestoneCard.date}
                  </p>
                </div>
              </div>

              {/* High-Fidelity Milestone Banner */}
              <div className={`w-full h-32 rounded-2xl bg-gradient-to-tr ${selectedMilestoneCard.photoGradient} border border-white/10 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden`}>
                <span className="text-3xl animate-bounce">🏆</span>
                <h4 className="font-display font-bold text-lg mt-2 text-white drop-shadow-md">
                  {selectedMilestoneCard.title}
                </h4>
                <p className="text-xs text-white/90 font-light mt-1 max-w-sm line-clamp-2">
                  {selectedMilestoneCard.subtitle}
                </p>
                <div className="absolute inset-0 bg-white/5 pointer-events-none" />
              </div>

              {/* Reflection Details */}
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="space-y-1">
                  <h4 className="font-bold text-indigo-300 uppercase tracking-wider text-[10px]">
                    Original Journal & Reflection
                  </h4>
                  <p className="text-white/80 font-light italic leading-relaxed">
                    "{selectedMilestoneCard.reflection}"
                  </p>
                </div>

                {/* Skills Unlocked */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                    Skills Certified
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMilestoneCard.skills?.map((sk: string) => (
                      <span key={sk} className="text-[9px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 border border-white/5">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timeline Notes/Reflection Input */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <h4 className="font-bold text-pink-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <span>📝</span> Expand Your Memory (Your Companion Notes)
                  </h4>
                  <textarea
                    value={timelineNotes[selectedMilestoneCard.id] || ""}
                    onChange={(e) => {
                      setTimelineNotes((prev) => ({
                        ...prev,
                        [selectedMilestoneCard.id]: e.target.value
                      }));
                    }}
                    placeholder="Write a personal note of gratitude, learnings, or how this memory has shaped who you are today..."
                    className="w-full h-20 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:border-pink-400 focus:outline-none resize-none leading-relaxed"
                  />
                  <p className="text-[9px] text-white/40 italic">
                    Saved automatically to your SoulPrint timeline.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <button
                  onClick={() => {
                    setShowGratitudeOverlay(true);
                    playSynthesizedChime("complete");
                    setTimeout(() => setShowGratitudeOverlay(false), 5000);
                  }}
                  className="px-4 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/35 border border-pink-500/30 text-pink-200 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>✨</span> Celebrate Gratitude
                </button>

                <button
                  onClick={() => setSelectedMilestoneCard(null)}
                  className="px-5 py-2 rounded-xl bg-white text-slate-900 font-semibold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  Close Memory
                </button>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= GRATITUDE CELEBRATION OVERLAY ================= */}
      <AnimatePresence>
        {showGratitudeOverlay && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md pointer-events-none">
            <div className="text-center space-y-4 max-w-md px-6 animate-pulse">
              <span className="text-6xl block animate-bounce">🌸</span>
              <h2 className="text-2xl font-display font-extrabold text-pink-300 tracking-tight">
                Quiet Celebration of Growth
              </h2>
              <p className="text-sm text-white/80 font-light leading-relaxed">
                "Take a moment to breathe in your progress, Ayush. Every milestone is a branch in your magnificent tree. You are becoming exactly who you were meant to be."
              </p>
              <div className="text-xs text-emerald-400 font-mono tracking-widest uppercase">
                Gratitude Registered in SoulPrint
              </div>
            </div>

            {/* Falling virtual petals */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <svg className="w-full h-full">
                {[...Array(30)].map((_, idx) => (
                  <path
                    key={idx}
                    d="M 10 10 q 5 5 2 10 q -5 2 -8 -5 z"
                    fill="#fbcfe8"
                    fillOpacity={0.6 + Math.random() * 0.4}
                    transform={`translate(${Math.random() * 1000}, ${Math.random() * 800}) scale(${0.5 + Math.random() * 1.5}) rotate(${Math.random() * 360})`}
                    className="animate-leaf-float"
                    style={{ animationDelay: `${Math.random() * 3}s` }}
                  />
                ))}
              </svg>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= ADD CUSTOM GROWTH MISSION MODAL ================= */}
      <AnimatePresence>
        {showAddMissionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-white/15 shadow-2xl text-white">
              
              <button
                onClick={() => setShowAddMissionModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-display font-extrabold text-base text-[#FF9D6C] border-b border-white/10 pb-3 mb-4">
                🌱 Seed Custom Growth Mission
              </h3>

              <form onSubmit={handleCreateCustomMission} className="space-y-4 text-xs">
                
                <div className="space-y-1">
                  <label className="text-white/60 block font-bold">Mission Title</label>
                  <input
                    type="text"
                    required
                    value={newMissionTitle}
                    onChange={(e) => setNewMissionTitle(e.target.value)}
                    placeholder="e.g. Refine IndicOCR CNN model weights"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-white/60 block font-bold">Category</label>
                    <select
                      value={newMissionCategory}
                      onChange={(e) => setNewMissionCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none"
                    >
                      <option value="Career">Career</option>
                      <option value="Academics">Academics</option>
                      <option value="Wellbeing">Wellbeing</option>
                      <option value="Skill">Skill</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/60 block font-bold">Est. Time</label>
                    <input
                      type="text"
                      value={newMissionEstTime}
                      onChange={(e) => setNewMissionEstTime(e.target.value)}
                      placeholder="e.g. 1.5 hours"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-white/60 block font-bold">Deadline</label>
                    <input
                      type="text"
                      value={newMissionDeadline}
                      onChange={(e) => setNewMissionDeadline(e.target.value)}
                      placeholder="e.g. In 2 days"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/60 block font-bold">Priority</label>
                    <select
                      value={newMissionPriority}
                      onChange={(e) => setNewMissionPriority(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddMissionModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
                  >
                    Plant Mission
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 🌟 MILESTONE CELEBRATION THEATRE SHOWCASE */}
      {onTriggerCelebration && (
        <div className="p-6 md:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg space-y-4 max-w-6xl mx-auto mt-8">
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-lg flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-pink-300 animate-pulse" />
              Ecosystem Milestone Celebrations Showcase
            </h3>
            <p className="text-xs text-white/70">
              Celebrate your key life milestones. Click below to experience your virtual ecosystem expanding:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { type: "Assignment", label: "Assignment Complete", icon: "🌸", desc: "Flower blooms" },
              { type: "Hackathon", label: "Hackathon Submitted", icon: "🔥", desc: "Campfire lights up" },
              { type: "Internship", label: "Internship Earned", icon: "Bridge", desc: "Bridge slowly builds" },
              { type: "Scholarship", label: "Scholarship Won", icon: "🌸", desc: "Cherry Blossom blooms" },
              { type: "Semester", label: "Semester Complete", icon: "🌊", desc: "Lake expands" },
              { type: "Graduation", label: "Graduation", icon: "🌅", desc: "Sun rises behind mountains" },
            ].map((celebration) => (
              <button
                key={celebration.type}
                onClick={() => onTriggerCelebration(celebration.type as any)}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-400/50 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer hover:scale-[1.03] active:scale-95 group shadow-sm"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                  {celebration.icon === "Bridge" ? "🌉" : celebration.icon}
                </span>
                <span className="text-[10px] font-bold text-white block">{celebration.label}</span>
                <span className="text-[9px] text-white/55 font-mono mt-1 font-medium">{celebration.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
