import React, { useState, useMemo } from "react";
import { StudentProfile, StudentDream, SkillDetail, AtmosphereType, AccessibilitySettings } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  GraduationCap,
  Briefcase,
  Sparkles,
  BookOpen,
  Clock,
  Globe,
  Plus,
  Trash2,
  Edit3,
  Check,
  Calendar,
  Settings,
  Shield,
  AlertTriangle,
  Archive,
  RefreshCw,
  TrendingUp,
  Brain,
  Info,
  CheckCircle2,
  ArrowRight,
  Search,
  Sliders,
  Sparkle,
  Trash
} from "lucide-react";

interface SoulPrintViewProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  activeAtmosphere: AtmosphereType;
  accessibility: AccessibilitySettings;
}

// Fixed Predefined Interests Pool
const PREDEFINED_INTERESTS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Cybersecurity",
  "Software Development",
  "Web Development",
  "Cloud",
  "Data Science",
  "DevOps",
  "Blockchain",
  "UI/UX",
  "Entrepreneurship",
  "Research",
  "Competitive Programming",
  "Open Source",
  "Robotics",
  "IoT",
  "Game Development",
];

export const SoulPrintView: React.FC<SoulPrintViewProps> = ({
  profile,
  onUpdateProfile,
  activeAtmosphere,
  accessibility,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState<StudentProfile>({ ...profile });
  
  // Tab states for some sub-sections in Mobile/Tablet for layout
  const [activeMobileSection, setActiveMobileSection] = useState<string>("about");
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [interestsSearch, setInterestsSearch] = useState("");
  
  // State for new additions
  const [newDreamTitle, setNewDreamTitle] = useState("");
  const [newDreamType, setNewDreamType] = useState<"Primary" | "Secondary" | "Future" | "Custom">("Custom");
  const [newDreamMotivation, setNewDreamMotivation] = useState("");
  const [newDreamTarget, setNewDreamTarget] = useState("2028");
  const [newDreamPriority, setNewDreamPriority] = useState<"High" | "Medium" | "Low">("Medium");

  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<"Beginner" | "Intermediate" | "Expert">("Intermediate");
  const [newSkillProgress, setNewSkillProgress] = useState(50);
  const [newSkillConfidence, setNewSkillConfidence] = useState(60);

  // Fallbacks if profile doesn't have the new extended fields populated yet
  const dreams = edited.dreams || [];
  const skillDetails = edited.skillDetails || [];
  const memories = edited.memories || [];
  const rememberSettings = edited.rememberSettings || {
    learningPreferences: true,
    goals: true,
    skills: true,
    mentorConversations: true,
    completedMissions: true,
    askPermission: true
  };
  const preferredLearningMethod = edited.preferredLearningMethod || "Interactive Practice";
  const preferredSessionLength = edited.preferredSessionLength || "60 min";
  const preferredStudyTime = edited.preferredStudyTime || "Night";
  const weeklyAvailabilityGrid = edited.weeklyAvailabilityGrid || Array(7).fill(null).map(() => Array(4).fill(false));

  // Dynamic calculations
  const totalWeeklyHours = useMemo(() => {
    // Count active blocks in the calendar grid. Say each block is worth 4 hours (e.g. morning, afternoon, evening, night shifts).
    let count = 0;
    weeklyAvailabilityGrid.forEach(row => {
      row.forEach(val => {
        if (val) count += 4;
      });
    });
    return count;
  }, [weeklyAvailabilityGrid]);

  // Handle updates to profile structure
  const handleSave = () => {
    // Sync old-compatibility arrays with the new structure
    const updatedProfile = {
      ...edited,
      skills: skillDetails.map(s => s.name),
      weeklyAvailability: totalWeeklyHours || edited.weeklyAvailability || 12,
    };
    onUpdateProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEdited({ ...profile });
    setIsEditing(false);
  };

  // Multiple Dreams Managers
  const handleAddDream = () => {
    if (!newDreamTitle.trim()) return;
    const added: StudentDream = {
      id: "dream_" + Date.now(),
      type: newDreamType,
      title: newDreamTitle.trim(),
      motivation: newDreamMotivation.trim() || "Pursuing individual growth parameters in this field.",
      targetYear: newDreamTarget,
      confidence: 70,
      priority: newDreamPriority,
      status: "Active",
      dateAdded: new Date().toISOString().split("T")[0]
    };
    const updatedDreams = [...dreams, added];
    setEdited({
      ...edited,
      dreams: updatedDreams,
      careerGoal: added.type === "Primary" ? added.title : edited.careerGoal
    });
    setNewDreamTitle("");
    setNewDreamMotivation("");
  };

  const handleArchiveDream = (id: string) => {
    const updated = dreams.map(d => d.id === id ? { ...d, status: d.status === "Archived" ? "Active" : "Archived" as const } : d);
    setEdited({ ...edited, dreams: updated });
  };

  const handleDeleteDream = (id: string) => {
    const updated = dreams.filter(d => d.id !== id);
    setEdited({ ...edited, dreams: updated });
  };

  const handleUpdateDreamConfidence = (id: string, conf: number) => {
    const updated = dreams.map(d => d.id === id ? { ...d, confidence: conf } : d);
    setEdited({ ...edited, dreams: updated });
  };

  // Interests Managers
  const handleToggleInterest = (interest: string) => {
    let updatedInterests = [...edited.interests];
    if (updatedInterests.includes(interest)) {
      updatedInterests = updatedInterests.filter(i => i !== interest);
    } else {
      updatedInterests.push(interest);
    }
    setEdited({ ...edited, interests: updatedInterests });
  };

  const handlePrioritizeInterest = (interest: string) => {
    // Pull interests to top
    const updatedInterests = [interest, ...edited.interests.filter(i => i !== interest)];
    setEdited({ ...edited, interests: updatedInterests });
  };

  // Skills Managers
  const handleAddSkillDetail = () => {
    if (!newSkillName.trim()) return;
    if (skillDetails.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) return;

    const added: SkillDetail = {
      name: newSkillName.trim(),
      level: newSkillLevel,
      progress: newSkillProgress,
      confidence: newSkillConfidence
    };
    setEdited({
      ...edited,
      skillDetails: [...skillDetails, added]
    });
    setNewSkillName("");
    setNewSkillProgress(50);
    setNewSkillConfidence(60);
  };

  const handleRemoveSkillDetail = (name: string) => {
    const updated = skillDetails.filter(s => s.name !== name);
    setEdited({ ...edited, skillDetails: updated });
  };

  const handleUpdateSkillDetail = (name: string, fields: Partial<SkillDetail>) => {
    const updated = skillDetails.map(s => s.name === name ? { ...s, ...fields } : s);
    setEdited({ ...edited, skillDetails: updated });
  };

  // Availability Grid Clicker
  const handleToggleAvailabilitySlot = (dayIdx: number, slotIdx: number) => {
    const gridCopy = weeklyAvailabilityGrid.map(row => [...row]);
    gridCopy[dayIdx][slotIdx] = !gridCopy[dayIdx][slotIdx];
    
    // Calculate new total hours
    let count = 0;
    gridCopy.forEach(row => {
      row.forEach(val => {
        if (val) count += 4;
      });
    });

    setEdited({
      ...edited,
      weeklyAvailabilityGrid: gridCopy,
      weeklyAvailability: count
    });
  };

  // Memory Managers
  const handleForgetMemory = (id: string) => {
    const updatedMemories = memories.filter(m => m.id !== id);
    setEdited({ ...edited, memories: updatedMemories });
  };

  const handleToggleRememberSetting = (key: keyof typeof rememberSettings) => {
    const updatedSettings = {
      ...rememberSettings,
      [key]: !rememberSettings[key]
    };
    setEdited({ ...edited, rememberSettings: updatedSettings });
  };

  // Dynamically generated realistic AI Insights using current profile data
  const calculatedInsights = useMemo(() => {
    const activeDreams = dreams.filter(d => d.status === "Active");
    const topDream = activeDreams.find(d => d.type === "Primary") || activeDreams[0];
    const topSkills = skillDetails.filter(s => s.level === "Expert" || s.progress > 75);
    const growthSkills = skillDetails.filter(s => s.progress < 50);
    const hasAIInterest = edited.interests.includes("Artificial Intelligence") || edited.interests.includes("Machine Learning");

    // Realistic bullet list arrays
    const strengths = [
      topSkills.length > 0 
        ? `Demonstrates established capabilities in ${topSkills.slice(0, 2).map(s => s.name).join(" and ")}`
        : "Maintains structured foundational learning methodologies",
      preferredLearningMethod === "Projects" || preferredLearningMethod === "Interactive Practice"
        ? "Translates theoretical computer science structures rapidly into working prototypes"
        : "Maintains strong comprehension of academic documentation standards",
      totalWeeklyHours > 12 
        ? `Highly disciplined study routine allocating ${totalWeeklyHours} hrs weekly to technical growth`
        : "Highly focused micro-session absorption capacity"
    ];

    const growthAreas = [
      growthSkills.length > 0
        ? `Consolidate hands-on implementation patterns in ${growthSkills.slice(0, 2).map(s => s.name).join(" & ")}`
        : "Expand structural mastery of deployment and scaling workflows",
      dreams.length > 1
        ? "Parallel development paths identified; balance academic semester markers with future venture timelines"
        : "Broaden career horizons by mapping alternate technology stacks",
      "Develop consistent open-source contribution patterns on Github profiles"
    ];

    const recommendedFocus = [];
    if (topDream) {
      if (topDream.title.toLowerCase().includes("ai") || hasAIInterest) {
        recommendedFocus.push("Advanced deep learning models & transformer optimizations");
        recommendedFocus.push("Participate in upcoming national hackathons like Smart India Hackathon (SIH)");
        recommendedFocus.push("Integrate API structures securely in project portfolios");
      } else {
        recommendedFocus.push(`Advanced specialization alignments related to ${topDream.title}`);
        recommendedFocus.push("Construct full-stack portfolios demonstrating end-to-end integration");
      }
    } else {
      recommendedFocus.push("Map structural milestones for a primary career target");
      recommendedFocus.push("Increase engagement with technical peer communities");
    }

    return { strengths, growthAreas, recommendedFocus };
  }, [dreams, skillDetails, edited.interests, preferredLearningMethod, totalWeeklyHours]);

  const triggerInsightsRecalculation = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 1200);
  };

  // Filter Predefined Interests
  const filteredInterestsPool = PREDEFINED_INTERESTS.filter(item =>
    item.toLowerCase().includes(interestsSearch.toLowerCase()) &&
    !edited.interests.includes(item)
  );

  // Time blocks labels for calendar
  const TIME_SLOTS = ["Morning", "Afternoon", "Evening", "Night"];
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Floating Atmosphere Particles Rendering
  const renderAtmosphericParticles = () => {
    if (accessibility.staticBackground) return null;

    switch (activeAtmosphere) {
      case "rain":
        return (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-[1px] h-12 bg-sky-200"
                style={{
                  left: `${15 + i * 11}%`,
                  top: `-${10 + i * 2}%`
                }}
                animate={{
                  y: ["0vh", "100vh"],
                }}
                transition={{
                  duration: 2 + (i % 3),
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.4
                }}
              />
            ))}
          </div>
        );
      case "forest":
        return (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Glowing Butterflies */}
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-emerald-300/40 blur-[2px]"
                style={{
                  left: `${20 + i * 25}%`,
                  top: `${40 + i * 15}%`
                }}
                animate={{
                  x: [0, 40, -20, 0],
                  y: [0, -60, -30, 0],
                  scale: [1, 1.2, 0.9, 1],
                  opacity: [0.3, 0.8, 0.4, 0.3]
                }}
                transition={{
                  duration: 6 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 1.5
                }}
              />
            ))}
          </div>
        );
      case "night":
        return (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Blinking Fireflies */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-yellow-200/50"
                style={{
                  left: `${10 + i * 16}%`,
                  top: `${15 + i * 12}%`
                }}
                animate={{
                  opacity: [0.1, 0.9, 0.2, 0.1],
                  scale: [0.8, 1.2, 0.8],
                  y: [0, -15, 0]
                }}
                transition={{
                  duration: 3 + (i % 2),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.6
                }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Sunset ambient warm lighting glow class
  const cardGlowClass = activeAtmosphere === "sunset" 
    ? "shadow-[0_0_15px_rgba(251,113,133,0.12)] border-rose-300/20" 
    : "border-white/10";

  return (
    <div className="relative space-y-8 animate-fade-in text-white z-10 w-full">
      {/* Atmosphere Backing Overlays */}
      {renderAtmosphericParticles()}

      {/* Header Banner */}
      <div className={`p-6 md:p-8 rounded-3xl bg-white/10 backdrop-blur-md border shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden ${cardGlowClass}`}>
        <div className="space-y-2 max-w-xl z-10">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 text-pink-300 flex items-center justify-center font-bold text-2xl border border-white/15">
              🧠
            </div>
            <div>
              <h1 className="text-3xl font-display font-extrabold tracking-tight">SoulPrint AI</h1>
              <p className="text-[10px] font-mono uppercase tracking-widest text-pink-300">Your Evolving Digital Growth Identity</p>
            </div>
          </div>
          <p className="text-xs text-white/85 leading-relaxed">
            The neural anchor of SoulSync AI. It continuously maps your academic metrics, multi-layered aspirations, interactive learning behaviors, and active skill clusters to harmonize personalized pathways.
          </p>
        </div>
        
        <div className="z-10 shrink-0">
          {!isEditing ? (
            <button
              id="refine-soulprint-button"
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer border border-white/15"
            >
              <Edit3 className="w-4 h-4" />
              <span>Refine SoulPrint</span>
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer border border-white/10"
              >
                <Check className="w-4 h-4" />
                <span>Save SoulPrint</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* THREE-COLUMN BENTO GRID SYSTEM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
        
        {/* COLUMN 1: Academic Identity, Memory & Preview (4 COLS on lg) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* ABOUT ME SECTION */}
          <div className={`p-6 rounded-3xl bg-white/10 backdrop-blur-md border shadow-lg space-y-6 relative overflow-hidden ${cardGlowClass}`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-display font-bold uppercase tracking-wider flex items-center gap-2">
                <User className="w-4.5 h-4.5 text-pink-300" />
                1️⃣ About Me
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">Metric ID</span>
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-indigo-500 flex items-center justify-center font-extrabold text-lg text-white shadow-md">
                    {edited.name[0] || "A"}
                  </div>
                  <div>
                    <h4 className="text-base font-bold">{edited.name}</h4>
                    <p className="text-[11px] text-white/70 font-semibold">{edited.degree}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3.5 pt-2 text-xs text-white/80 border-t border-white/5">
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono">Branch</span>
                    <span className="font-semibold text-right">{edited.branch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono">Semester</span>
                    <span className="font-semibold">{edited.semester}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono">Graduation Year</span>
                    <span className="font-semibold text-pink-300">{edited.graduationYear || "2028"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono">City / Location</span>
                    <span className="font-semibold">{edited.city || "Mumbai"}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-white/50 font-mono shrink-0">College</span>
                    <span className="font-semibold text-right text-[11px] leading-relaxed max-w-[200px]">{edited.college}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase text-white/60">Full Name</label>
                  <input
                    type="text"
                    value={edited.name}
                    onChange={(e) => setEdited({ ...edited, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-pink-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono uppercase text-white/60">Degree</label>
                    <input
                      type="text"
                      value={edited.degree}
                      onChange={(e) => setEdited({ ...edited, degree: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-pink-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono uppercase text-white/60">Semester</label>
                    <input
                      type="text"
                      value={edited.semester}
                      onChange={(e) => setEdited({ ...edited, semester: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-pink-300"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase text-white/60">Branch / Specialization</label>
                  <input
                    type="text"
                    value={edited.branch}
                    onChange={(e) => setEdited({ ...edited, branch: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-pink-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono uppercase text-white/60">Grad Year</label>
                    <input
                      type="text"
                      value={edited.graduationYear || "2028"}
                      onChange={(e) => setEdited({ ...edited, graduationYear: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-pink-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono uppercase text-white/60">City</label>
                    <input
                      type="text"
                      value={edited.city || "Mumbai"}
                      onChange={(e) => setEdited({ ...edited, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-pink-300"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase text-white/60">College / Institute</label>
                  <input
                    type="text"
                    value={edited.college}
                    onChange={(e) => setEdited({ ...edited, college: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-pink-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* MEMORY SETTINGS SECTION */}
          <div className={`p-6 rounded-3xl bg-white/10 backdrop-blur-md border shadow-lg space-y-5 ${cardGlowClass}`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-display font-bold uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-4.5 h-4.5 text-indigo-300" />
                Companion Memories
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-indigo-300">Auditable</span>
            </div>

            <p className="text-[11px] text-white/70 leading-relaxed">
              Transparent parameters of student-authorized facts saved by the AI Mentor during chats. You can purge discrete nodes.
            </p>

            {/* Individual memory tags */}
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1.5 scrollbar-thin">
              <AnimatePresence mode="popLayout">
                {memories.map((m) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-2 text-[10px] leading-snug group"
                  >
                    <span>{m.text}</span>
                    <button
                      onClick={() => handleForgetMemory(m.id)}
                      className="p-1 rounded bg-white/5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer shrink-0 transition"
                      title="Forget this specific item"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {memories.length === 0 && (
                <div className="text-center py-4 text-[11px] text-white/40 font-mono">
                  No registered active memories.
                </div>
              )}
            </div>

            {/* Consent Control */}
            <div className="space-y-3 pt-3 border-t border-white/5 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-[11px]">Strict User Consent Gate</h5>
                  <p className="text-[9px] text-white/50">Prompt for approval before storing new memory arrays</p>
                </div>
                <button
                  onClick={() => handleToggleRememberSetting("askPermission")}
                  className={`w-10 h-6 rounded-full p-1 transition duration-200 cursor-pointer ${
                    rememberSettings.askPermission ? "bg-emerald-500" : "bg-white/10"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition duration-200 ${
                    rememberSettings.askPermission ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Specific persistence categories */}
              <div className="space-y-2 pt-2 border-t border-white/5 text-[10px]">
                <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono font-bold block">Authorized States</span>
                {[
                  { key: "learningPreferences", label: "Learning Preferences" },
                  { key: "goals", label: "Careers & Ambitions" },
                  { key: "skills", label: "Skills Dashboard Levels" },
                  { key: "mentorConversations", label: "Mentor Chat Nuances" },
                  { key: "completedMissions", label: "Completed Growth Progress" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between p-1.5 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition">
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={rememberSettings[item.key as keyof typeof rememberSettings]}
                      onChange={() => handleToggleRememberSetting(item.key as keyof typeof rememberSettings)}
                      className="accent-pink-400 w-3.5 h-3.5"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* LIVE PERSONALIZATION PREVIEW */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-500/10 via-indigo-500/10 to-indigo-800/15 border border-white/10 shadow-lg space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-pink-300 font-bold flex items-center gap-1.5">
              <Sparkle className="w-4 h-4 animate-spin-slow" />
              Live Personalization Preview
            </h4>
            <p className="text-[11px] text-white/80 leading-relaxed">
              This compiled SoulPrint details feed powers and modifies subsequent system recommendations dynamically:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
              {[
                "DreamPath Milestone Steps",
                "Opportunity Compass Filter",
                "AI Companion Guidance",
                "Daily Micro Growth Missions",
                "Bloom Forest Vitality",
                "Empathetic Mindsets Advisor"
              ].map((val, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-white/80 text-[10px] leading-tight">{val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* COLUMN 2: Careers/Dreams, Interests & Learning Preferences (5 COLS on lg) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* MY DREAMS & TIMELINE SECTION */}
          <div className={`p-6 rounded-3xl bg-white/10 backdrop-blur-md border shadow-lg space-y-6 ${cardGlowClass}`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-display font-bold uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4.5 h-4.5 text-emerald-300" />
                2️⃣ My Dreams & Evolution
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-emerald-300">Sequential</span>
            </div>

            {/* Display active dreams in beautiful cards */}
            <div className="space-y-4">
              {dreams.map((dream) => {
                const isActive = dream.status === "Active";
                return (
                  <div
                    key={dream.id}
                    className={`p-4 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden transition group ${
                      !isActive ? "opacity-50" : ""
                    }`}
                  >
                    {/* Glowing highlight for Primary */}
                    {dream.type === "Primary" && isActive && (
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-500" />
                    )}

                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                          dream.type === "Primary" ? "bg-pink-500/20 text-pink-300 border border-pink-500/30" : "bg-white/5 text-white/60"
                        }`}>
                          {dream.type} Dream
                        </span>
                        <h4 className="font-display font-bold text-sm mt-1.5 text-white">{dream.title}</h4>
                      </div>
                      
                      <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleArchiveDream(dream.id)}
                          className="p-1 rounded text-white/50 hover:text-emerald-300 hover:bg-white/5 cursor-pointer"
                          title={isActive ? "Archive dream" : "Activate dream"}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDream(dream.id)}
                          className="p-1 rounded text-white/50 hover:text-rose-400 hover:bg-white/5 cursor-pointer"
                          title="Delete dream"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-white/70 leading-relaxed mt-2 pl-1 italic">
                      "{dream.motivation}"
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-white/5 text-[10px]">
                      <div>
                        <span className="text-white/40 block">Target Year</span>
                        <span className="font-bold text-white">{dream.targetYear}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block">Priority</span>
                        <span className={`font-bold ${
                          dream.priority === "High" ? "text-pink-300" : dream.priority === "Medium" ? "text-amber-300" : "text-sky-300"
                        }`}>{dream.priority}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block">Confidence</span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-white">{dream.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Slider inside display for ease of use */}
                    {isEditing && (
                      <div className="space-y-1 pt-2">
                        <label className="block text-[9px] text-white/50">Adjust Confidence Level</label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={dream.confidence}
                          onChange={(e) => handleUpdateDreamConfidence(dream.id, parseInt(e.target.value))}
                          className="w-full accent-pink-400 h-1 rounded bg-white/10"
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {dreams.length === 0 && (
                <div className="text-center py-6 text-xs text-white/50 font-mono">
                  No dreams registered. Map your first goal!
                </div>
              )}
            </div>

            {/* Form to Add New Dreams */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3.5 text-xs">
              <h5 className="font-bold text-xs flex items-center gap-1 text-pink-300">
                <Plus className="w-4 h-4" />
                Add Evolving Dream Anchor
              </h5>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/60">Aspiration Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Robotics Lead"
                    value={newDreamTitle}
                    onChange={(e) => setNewDreamTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-white/60">Type</label>
                  <select
                    value={newDreamType}
                    onChange={(e) => setNewDreamType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#342D5A] text-white focus:outline-none"
                  >
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                    <option value="Future">Future</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/60">Core Motivation Quote / Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Build modular robotic limbs..."
                  value={newDreamMotivation}
                  onChange={(e) => setNewDreamMotivation(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/60">Milestone Year</label>
                  <input
                    type="text"
                    placeholder="2028"
                    value={newDreamTarget}
                    onChange={(e) => setNewDreamTarget(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-white/60">Priority Alignment</label>
                  <select
                    value={newDreamPriority}
                    onChange={(e) => setNewDreamPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#342D5A] text-white focus:outline-none"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleAddDream}
                className="w-full py-2 rounded-xl bg-pink-500 hover:bg-pink-400 font-bold transition text-[11px] uppercase tracking-wider cursor-pointer"
              >
                Register Evolving Goal
              </button>
            </div>

            {/* CHRONOLOGICAL TIMELINE GRAPHIC */}
            <div className="pt-4 border-t border-white/10 space-y-2.5">
              <span className="text-[10px] font-mono uppercase text-white/40 font-bold tracking-widest block">
                Dream Evolution Chronology
              </span>
              
              <div className="relative pl-6 space-y-4">
                <div className="absolute left-2 top-1.5 bottom-1.5 w-0.5 bg-white/10" />

                {dreams.map((dream, idx) => (
                  <div key={dream.id} className="relative text-xs">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border-2 border-[#FF6B6B] bg-slate-900" />
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-pink-300 font-mono text-[10px]">{dream.targetYear}</span>
                      <span className="text-white/40">•</span>
                      <span className="font-semibold text-white">{dream.title}</span>
                      <span className="text-[9px] px-1.5 rounded bg-white/5 text-white/50">{dream.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MY INTERESTS CHIPS SECTION */}
          <div className={`p-6 rounded-3xl bg-white/10 backdrop-blur-md border shadow-lg space-y-5 ${cardGlowClass}`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-display font-bold uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-pink-300" />
                3️⃣ My Interests
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-pink-300">Chips</span>
            </div>

            {/* Interactive chip container */}
            <div className="space-y-3.5">
              <div className="flex flex-wrap gap-2">
                <AnimatePresence mode="popLayout">
                  {edited.interests.map((interest, idx) => (
                    <motion.span
                      key={interest}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/20 text-pink-200 border border-pink-500/30 text-xs font-semibold"
                    >
                      <span>{interest}</span>
                      {idx > 0 && (
                        <button
                          onClick={() => handlePrioritizeInterest(interest)}
                          className="p-0.5 rounded-full text-pink-400 hover:text-white cursor-pointer"
                          title="Prioritize (bump to top)"
                        >
                          ★
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleInterest(interest)}
                        className="text-pink-300 hover:text-white font-bold ml-1 cursor-pointer text-xs"
                      >
                        ×
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>

              {/* Interest Search Pool */}
              <div className="space-y-2 pt-2.5 border-t border-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search interest chips..."
                    value={interestsSearch}
                    onChange={(e) => setInterestsSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-white/40 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto pr-1">
                  {filteredInterestsPool.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleToggleInterest(item)}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 hover:border-pink-300/40 text-white/70 hover:text-white transition cursor-pointer"
                    >
                      + {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MY LEARNING STYLE SECTION */}
          <div className={`p-6 rounded-3xl bg-white/10 backdrop-blur-md border shadow-lg space-y-6 ${cardGlowClass}`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-display font-bold uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-indigo-300" />
                4️⃣ My Learning Style
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-indigo-300">Attributes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              
              {/* Learning Method */}
              <div className="space-y-1.5 bg-white/5 p-3 rounded-2xl border border-white/5">
                <label className="text-[10px] font-mono text-white/50 block uppercase font-bold">Preferred Method</label>
                {isEditing ? (
                  <select
                    value={preferredLearningMethod}
                    onChange={(e) => setEdited({ ...edited, preferredLearningMethod: e.target.value })}
                    className="w-full p-1 border border-white/10 bg-[#342D5A] rounded text-white"
                  >
                    <option value="Videos">Videos</option>
                    <option value="Interactive Practice">Interactive Practice</option>
                    <option value="Reading">Reading</option>
                    <option value="Projects">Projects</option>
                    <option value="Documentation">Documentation</option>
                  </select>
                ) : (
                  <span className="font-bold text-white text-xs block">{preferredLearningMethod}</span>
                )}
              </div>

              {/* Session Length */}
              <div className="space-y-1.5 bg-white/5 p-3 rounded-2xl border border-white/5">
                <label className="text-[10px] font-mono text-white/50 block uppercase font-bold">Session Length</label>
                {isEditing ? (
                  <select
                    value={preferredSessionLength}
                    onChange={(e) => setEdited({ ...edited, preferredSessionLength: e.target.value })}
                    className="w-full p-1 border border-white/10 bg-[#342D5A] rounded text-white"
                  >
                    <option value="30 min">30 min</option>
                    <option value="45 min">45 min</option>
                    <option value="60 min">60 min</option>
                    <option value="90 min">90 min</option>
                  </select>
                ) : (
                  <span className="font-bold text-white text-xs block">{preferredSessionLength}</span>
                )}
              </div>

              {/* Session Time */}
              <div className="space-y-1.5 bg-white/5 p-3 rounded-2xl border border-white/5">
                <label className="text-[10px] font-mono text-white/50 block uppercase font-bold">Study Time</label>
                {isEditing ? (
                  <select
                    value={preferredStudyTime}
                    onChange={(e) => setEdited({ ...edited, preferredStudyTime: e.target.value })}
                    className="w-full p-1 border border-white/10 bg-[#342D5A] rounded text-white"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                ) : (
                  <span className="font-bold text-white text-xs block">{preferredStudyTime}</span>
                )}
              </div>

            </div>

            {/* INTERACTIVE WEEKLY CALENDAR SELECTOR */}
            <div className="space-y-3.5 pt-3 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <h5 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-pink-300" />
                    Weekly Availability Calendar
                  </h5>
                  <p className="text-[9px] text-white/50">Each clicked block allocates 4 hours of focus</p>
                </div>
                <span className="font-mono text-pink-300 font-bold bg-white/5 px-2.5 py-1 rounded-xl">
                  {totalWeeklyHours} hrs/wk
                </span>
              </div>

              {/* Grid block representation */}
              <div className="space-y-1.5">
                {/* Time slot headers */}
                <div className="grid grid-cols-8 gap-1 text-[8px] font-mono font-bold uppercase text-white/40 text-center">
                  <div />
                  {TIME_SLOTS.map((slot) => (
                    <div key={slot} className="truncate">{slot}</div>
                  ))}
                  <div className="col-span-3" />
                </div>

                {/* Day rows */}
                {DAYS.map((day, dIdx) => (
                  <div key={day} className="grid grid-cols-8 gap-1.5 items-center">
                    <div className="text-[10px] font-bold font-mono text-white/50">{day}</div>
                    
                    {TIME_SLOTS.map((slot, sIdx) => {
                      const isActive = weeklyAvailabilityGrid[dIdx]?.[sIdx] || false;
                      return (
                        <button
                          key={slot}
                          onClick={() => handleToggleAvailabilitySlot(dIdx, sIdx)}
                          className={`h-7 rounded-lg border transition duration-150 cursor-pointer ${
                            isActive
                              ? "bg-pink-500 border-pink-400 text-white font-bold text-[9px]"
                              : "bg-white/5 border-white/5 hover:bg-white/10"
                          }`}
                          title={`Toggle study time for ${day} ${slot}`}
                        />
                      );
                    })}
                    <div className="col-span-3" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN 3: Skills Dashboard & AI Insights (3 COLS on lg) */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* MY CURRENT SKILLS DASHBOARD */}
          <div className={`p-6 rounded-3xl bg-white/10 backdrop-blur-md border shadow-lg space-y-6 ${cardGlowClass}`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-display font-bold uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-pink-300" />
                5️⃣ My Skills
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-pink-300">Level/Metrics</span>
            </div>

            {/* List skill detail cards */}
            <div className="space-y-4">
              {skillDetails.map((skill) => (
                <div key={skill.name} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2.5 relative group">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-white text-xs">{skill.name}</h4>
                      <span className="text-[9px] font-mono text-pink-300 tracking-wider font-bold">
                        {skill.level}
                      </span>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkillDetail(skill.name)}
                        className="p-1 rounded bg-white/5 text-white/40 hover:text-rose-400 cursor-pointer"
                        title="Remove Skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Level Slider / Selector in edit mode, Progress Bar in display mode */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-mono text-white/50">
                      <span>Progress</span>
                      <span className="font-bold text-white">{skill.progress}%</span>
                    </div>
                    {isEditing ? (
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={skill.progress}
                        onChange={(e) => handleUpdateSkillDetail(skill.name, { progress: parseInt(e.target.value) })}
                        className="w-full accent-pink-400 h-1 rounded bg-white/10 cursor-pointer"
                      />
                    ) : (
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-pink-500 to-indigo-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Confidence metrics */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-mono text-white/50">
                      <span>Confidence</span>
                      <span className="font-bold text-white">{skill.confidence}%</span>
                    </div>
                    {isEditing ? (
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={skill.confidence}
                        onChange={(e) => handleUpdateSkillDetail(skill.name, { confidence: parseInt(e.target.value) })}
                        className="w-full accent-emerald-400 h-1 rounded bg-white/10 cursor-pointer"
                      />
                    ) : (
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.confidence}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-sky-400"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Skills adder panel */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-3 text-xs">
              <h5 className="font-bold text-pink-300 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Skill Metrics
              </h5>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="e.g. TensorFlow"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white text-xs focus:outline-none"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#342D5A] text-white text-[11px] focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <button
                    onClick={handleAddSkillDetail}
                    className="px-2 py-1.5 rounded-lg bg-pink-500 text-white font-bold text-[11px] cursor-pointer hover:bg-pink-400 transition flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI INSIGHTS PANEL (HIGHLIGHT) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#4D3E77] via-[#5C4596] to-[#2D1B4E] border border-pink-400/20 shadow-2xl relative overflow-hidden space-y-5">
            
            {/* Soft decorative background spotlight */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-500/20 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-pink-300 animate-pulse" />
                <div>
                  <h3 className="text-sm font-display font-extrabold uppercase tracking-wider text-white">
                    SoulPrint AI Insights
                  </h3>
                  <span className="text-[8px] font-mono uppercase tracking-widest text-pink-300 block">Personalized Synthesis</span>
                </div>
              </div>
              <button
                onClick={triggerInsightsRecalculation}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-white transition cursor-pointer"
                title="Recalculate insights"
                disabled={isRecalculating}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? "animate-spin" : ""}`} />
              </button>
            </div>

            <p className="text-[10px] text-white/70 leading-relaxed italic">
              Heuristic insights dynamically derived from your authorized skills matrix, calendar availability grid, and career goal structures.
            </p>

            <AnimatePresence mode="wait">
              {isRecalculating ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center justify-center space-y-3.5 text-xs text-pink-300"
                >
                  <RefreshCw className="w-8 h-8 animate-spin" />
                  <span className="font-mono text-[10px] uppercase tracking-wider">Syncing Soul Print Neural Weights...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 text-xs"
                >
                  {/* Strengths */}
                  <div className="space-y-1.5">
                    <h5 className="font-extrabold text-[11px] text-emerald-300 flex items-center gap-1">
                      🌟 Strengths
                    </h5>
                    <ul className="space-y-1 pl-1">
                      {calculatedInsights.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-white/80 leading-normal text-[11px]">
                          <span className="text-emerald-400 font-bold shrink-0">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Growth Areas */}
                  <div className="space-y-1.5">
                    <h5 className="font-extrabold text-[11px] text-pink-300 flex items-center gap-1">
                      🌱 Growth Areas
                    </h5>
                    <ul className="space-y-1 pl-1">
                      {calculatedInsights.growthAreas.map((g, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-white/80 leading-normal text-[11px]">
                          <span className="text-pink-400 font-bold shrink-0">•</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Focus */}
                  <div className="space-y-1.5">
                    <h5 className="font-extrabold text-[11px] text-sky-300 flex items-center gap-1">
                      🎯 Recommended Focus
                    </h5>
                    <ul className="space-y-1 pl-1">
                      {calculatedInsights.recommendedFocus.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-white/80 leading-normal text-[11px]">
                          <span className="text-sky-300 font-bold shrink-0">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
};
