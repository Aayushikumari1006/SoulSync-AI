import { useState, useMemo, useEffect } from "react";
import { AtmosphereType, StudentProfile, GrowthMission, AccessibilitySettings } from "./types";
import { initialStudentProfile, defaultMissions, mockOpportunities } from "./data";
import { motion, AnimatePresence } from "motion/react";
import { 
  subscribeToAuthChanges, 
  saveUserProfile, 
  fetchUserProfile, 
  saveGrowthMissions, 
  fetchGrowthMissions 
} from "./lib/firebase";

// Views
import { HomeDashboard } from "./components/HomeDashboard";
import { SoulPrintView } from "./components/SoulPrintView";
import { DreamPathView } from "./components/DreamPathView";
import { OpportunityCompassView } from "./components/OpportunityCompassView";
import { GentleGuideView } from "./components/GentleGuideView";
import { LivingProgressView } from "./components/LivingProgressView";
import { SettingsView } from "./components/SettingsView";
import { PresentationGuide } from "./components/PresentationGuide";

// Systems
import { AtmosphereVisualizer } from "./components/AtmosphereVisualizer";
import { AIMentorPanel } from "./components/AIMentorPanel";
import { IntroSplash } from "./components/IntroSplash";
import { AICelebrations, CelebrationType } from "./components/AICelebrations";

// Icons
import {
  Home,
  User,
  Compass,
  Heart,
  TreePine,
  Settings,
  Bell,
  Search,
  CloudRain,
  Sun,
  Sunset,
  Moon,
  TreeDeciduous,
  Anchor,
  Snowflake,
  Flower,
  Menu,
  X,
  Check,
  AlertCircle,
  HelpCircle,
  Volume2,
  VolumeX
} from "lucide-react";

export default function App() {
  // Local storage helper
  const loadSavedState = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  // Navigation & Core States
  const [activeView, setActiveView] = useState<string>("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>(() => loadSavedState("soulsync_profile", initialStudentProfile));
  const [missions, setMissions] = useState<GrowthMission[]>(() => loadSavedState("soulsync_missions", defaultMissions));
  const [activeAtmosphere, setActiveAtmosphere] = useState<AtmosphereType>("morning");
  const [isLiveMode, setIsLiveMode] = useState(() => loadSavedState("soulsync_is_live", false));
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Splash and Celebration States
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeCelebration, setActiveCelebration] = useState<CelebrationType | null>(null);

  // Accessibility States
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => loadSavedState("soulsync_accessibility", {
    reducedMotion: false,
    highContrast: false,
    staticBackground: false,
    muteSounds: false,
    soundVolume: 50,
    lowPerformanceMode: false,
  }));

  // UI state managers
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showAtmospherePicker, setShowAtmospherePicker] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!profile.isOnboardingCompleted);
  const [showPresentationGuide, setShowPresentationGuide] = useState(false);

  // Offline States
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const offlineActive = isOffline || isOfflineSimulated;

  // Global Search States
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Custom student alerts list (Default alerts)
  const systemAlerts = [
    { id: "a1", text: "Smart India Hackathon (SIH) 2026 registrations are closing soon!", read: false },
    { id: "a2", text: "Google STEP software engineering intern applications are active.", read: false },
    { id: "a3", text: "Time for a quick 5-minute study detox breathing session?", read: true },
    { id: "a4", text: "📅 Assignment reminder: DBMS Assignment is due tomorrow! Plan your tasks.", read: false },
    { id: "a5", text: "🎓 Scholarship Opportunity: Reliance Foundation applications are active.", read: false },
    { id: "a6", text: "🧠 Mentor Suggestion: Ayush, your progress is at 37%. Practice a 5-minute study detox when transitioning to your CNN Project.", read: false }
  ];
  const [alerts, setAlerts] = useState<any[]>(() => loadSavedState("soulsync_alerts", systemAlerts));
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Initialize time-of-day atmosphere on launch
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 5) {
      setActiveAtmosphere("night");
    } else if (hour >= 16) {
      setActiveAtmosphere("sunset");
    } else {
      setActiveAtmosphere("morning");
    }
  }, []);

  // Listen to Auth State Changes & Sync dynamic documents
  useEffect(() => {
    const unsub = subscribeToAuthChanges(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const cloudProfile = await fetchUserProfile(user.uid);
          if (cloudProfile) {
            setProfile(cloudProfile);
          } else {
            await saveUserProfile(user.uid, profile);
          }

          const cloudMissions = await fetchGrowthMissions(user.uid);
          if (cloudMissions && cloudMissions.length > 0) {
            setMissions(cloudMissions);
          } else {
            await saveGrowthMissions(user.uid, missions);
          }
        } catch (err) {
          console.error("Auto Sync: Failed to download cloud context", err);
        }
      }
    });
    return () => unsub();
  }, []);

  // Save to Local Storage on updates (Auto Save)
  useEffect(() => {
    localStorage.setItem("soulsync_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("soulsync_missions", JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem("soulsync_accessibility", JSON.stringify(accessibility));
  }, [accessibility]);

  useEffect(() => {
    localStorage.setItem("soulsync_is_live", JSON.stringify(isLiveMode));
  }, [isLiveMode]);

  useEffect(() => {
    localStorage.setItem("soulsync_alerts", JSON.stringify(alerts));
  }, [alerts]);

  // Sync Onboarding banner with profile
  useEffect(() => {
    setShowOnboarding(!profile.isOnboardingCompleted);
  }, [profile.isOnboardingCompleted]);

  // Offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Update profile handler
  const handleUpdateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      if (currentUser) {
        saveUserProfile(currentUser.uid, next).catch((e) => console.error("Auto sync update profile failed", e));
      }
      return next;
    });
  };

  // Toggle Growth Mission Completion
  const handleToggleMission = (id: string) => {
    setMissions((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m));
      const target = updated.find((m) => m.id === id);
      if (target && target.completed) {
        // Map category to standard custom celebrations
        if (target.category === "Academics") {
          setActiveCelebration("Assignment");
        } else if (target.category === "Career") {
          setActiveCelebration("Hackathon");
        } else if (target.category === "Wellbeing") {
          setActiveCelebration("Scholarship");
        } else {
          setActiveCelebration("Internship");
        }

        // Add smart notification on completion
        const supportiveMsg = `🎉 Mission completed: "${target.title}"! Your SoulTree has grown stronger (+15 vitality). Keep up the momentum, Ayush!`;
        setAlerts((alertsPrev) => [
          { id: "completed_alert_" + Date.now(), text: supportiveMsg, read: false },
          ...alertsPrev
        ]);
      }
      if (currentUser) {
        saveGrowthMissions(currentUser.uid, updated).catch((e) => console.error("Auto sync missions status failed", e));
      }
      return updated;
    });
  };

  // Add growth mission helper with smart notification
  const handleAddMission = (newMission: GrowthMission) => {
    setMissions((prev) => {
      const updated = [...prev, newMission];
      if (currentUser) {
        saveGrowthMissions(currentUser.uid, updated).catch((e) => console.error("Auto sync add mission failed", e));
      }
      return updated;
    });
    // Push alert
    const addMsg = `📋 New growth mission registered: "${newMission.title}". Small daily efforts pave the path to your AI Engineer dream!`;
    setAlerts((alertsPrev) => [
      { id: "add_alert_" + Date.now(), text: addMsg, read: false },
      ...alertsPrev
    ]);
  };

  // Update accessibility settings
  const handleUpdateAccessibility = (updated: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Special Demo Mode Activator for AI Impact Festival Judges
  const handleActivateDemoMode = () => {
    const demoProfile: StudentProfile = {
      ...initialStudentProfile,
      name: "Ayush",
      isOnboardingCompleted: true,
      degree: "B.Tech CSE (AI & ML)",
      branch: "Computer Science & Engineering",
      semester: "2nd Semester",
      college: "Indian Institute of Technology (IIT), Delhi",
      graduationYear: "2029",
      city: "New Delhi",
      careerGoal: "AI Engineer",
    };

    setProfile(demoProfile);
    setMissions(defaultMissions);
    setIsLiveMode(false);
    setShowIntro(false);
    setShowOnboarding(false);
    setCurrentUser({
      uid: "demo_guest_ayush",
      displayName: "Ayush",
      email: "ayush@iitd.ac.in",
      isAnonymous: true
    });

    localStorage.setItem("soulsync_profile", JSON.stringify(demoProfile));
    localStorage.setItem("soulsync_missions", JSON.stringify(defaultMissions));
    localStorage.setItem("soulsync_is_live", JSON.stringify(false));
    
    const demoForestItems = [
      { id: "fi1", type: "tree", x: 100, y: 220, scale: 1.1, label: "NeuralStyleSieve Launch", date: "2025-11-12", growthProgress: 1.0 },
      { id: "fi2", type: "lake", x: 280, y: 240, scale: 1.0, label: "2nd Semester Finished", date: "2026-05-10", growthProgress: 1.0 },
      { id: "fi3", type: "campfire", x: 200, y: 235, scale: 0.9, label: "Bombay AI Hackathon Team camp", date: "2026-03-22", growthProgress: 1.0 },
      { id: "fi4", type: "flower", x: 60, y: 250, scale: 0.8, label: "First Python Script", date: "2025-09-01", growthProgress: 1.0 },
      { id: "fi5", type: "flower", x: 140, y: 245, scale: 0.7, label: "DBMS Indexing Practice", date: "2026-07-18", growthProgress: 1.0 },
    ];
    localStorage.setItem("soulsync_forest_items_Ayush", JSON.stringify(demoForestItems));

    const welcomeAlert = {
      id: "demo_welcome_" + Date.now(),
      text: "🌿 Special Demo Mode initiated! Welcome, AI Impact Festival Judges. Experience our complete interactive roadmaps, career identity sways, and progress forests. No sign-up required.",
      read: false
    };
    setAlerts((prev) => [welcomeAlert, ...prev]);
    setActiveView("home");
  };

  // Calculate dynamic Bloom Forest Vitality based on completed missions
  const forestHealth = useMemo(() => {
    const completed = missions.filter((m) => m.completed).length;
    return Math.round((completed / Math.max(missions.length, 1)) * 100);
  }, [missions]);

  // Global Search results lookup
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();

    const matches: { category: string; title: string; subtitle: string; actionView: string; icon: string }[] = [];

    // Search Dreams
    profile.dreams?.forEach((d) => {
      if (d.title.toLowerCase().includes(q) || d.motivation.toLowerCase().includes(q)) {
        matches.push({
          category: "🌱 DreamPath Goal",
          title: d.title,
          subtitle: d.motivation,
          actionView: "dreampath",
          icon: "🌟"
        });
      }
    });

    // Search Opportunities (Scholarships, Internships, Hackathons)
    mockOpportunities.forEach((o) => {
      if (o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q) || o.provider.toLowerCase().includes(q)) {
        matches.push({
          category: `🎓 Recommended ${o.type}`,
          title: o.title,
          subtitle: `${o.provider} • Deadline: ${o.deadline}`,
          actionView: "opportunity",
          icon: o.type === "Hackathon" ? "🔥" : o.type === "Scholarship" ? "🌸" : "💼"
        });
      }
    });

    // Search Projects
    profile.projects?.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
        matches.push({
          category: "💻 Student Project",
          title: p.name,
          subtitle: p.description,
          actionView: "soulprint",
          icon: "🚀"
        });
      }
    });

    // Search Skills
    profile.skillDetails?.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.level.toLowerCase().includes(q)) {
        matches.push({
          category: "🛠️ Skill & Mastery",
          title: s.name,
          subtitle: `Mastery Level: ${s.level} (${s.progress}% progress)`,
          actionView: "soulprint",
          icon: "⚡"
        });
      }
    });

    // Search Mentor History & Memories
    profile.memories?.forEach((m) => {
      if (m.text.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)) {
        matches.push({
          category: "🧠 Mentor Insights & Memory",
          title: `Insight on ${m.category}`,
          subtitle: m.text,
          actionView: "guide",
          icon: "💡"
        });
      }
    });

    // Search Growth Missions
    missions.forEach((m) => {
      if (m.title.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)) {
        matches.push({
          category: `📋 Growth Mission (${m.completed ? "Completed" : "Active"})`,
          title: m.title,
          subtitle: `Impact: ${m.dreamImpact} • Deadline: ${m.deadline}`,
          actionView: "progress",
          icon: m.completed ? "✅" : "⏳"
        });
      }
    });

    return matches;
  }, [searchQuery, profile, missions]);

  // Atmosphere descriptions
  const atmospheres = [
    { type: "morning" as AtmosphereType, icon: <Sun className="w-4 h-4 text-amber-500" />, label: "Morning" },
    { type: "rain" as AtmosphereType, icon: <CloudRain className="w-4 h-4 text-sky-500" />, label: "Rain" },
    { type: "sunset" as AtmosphereType, icon: <Sunset className="w-4 h-4 text-orange-500" />, label: "Sunset" },
    { type: "night" as AtmosphereType, icon: <Moon className="w-4 h-4 text-indigo-400" />, label: "Night" },
    { type: "forest" as AtmosphereType, icon: <TreeDeciduous className="w-4 h-4 text-emerald-500" />, label: "Forest" },
    { type: "lake" as AtmosphereType, icon: <Anchor className="w-4 h-4 text-teal-500" />, label: "Lake" },
    { type: "snow" as AtmosphereType, icon: <Snowflake className="w-4 h-4 text-blue-300" />, label: "Snow" },
    { type: "spring" as AtmosphereType, icon: <Flower className="w-4 h-4 text-pink-400" />, label: "Spring" },
  ];

  return (
    <div
      className={`min-h-screen relative flex flex-col font-sans transition-all duration-500 overflow-hidden ${
        accessibility.highContrast
          ? "bg-white text-slate-900 border-4 border-black"
          : "bg-gradient-to-br from-[#FF9D6C] via-[#FF6B6B] to-[#4D3E77] text-white"
      }`}
    >
      {/* Immersive UI Background Highlights & Overlays */}
      {!accessibility.highContrast && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.22)_0%,transparent_60%)] pointer-events-none z-0"></div>
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/15 to-transparent pointer-events-none z-0"></div>
        </>
      )}

      {/* 1. Global Living Atmosphere Engine Visualizer Backing */}
      <AtmosphereVisualizer atmosphere={activeAtmosphere} accessibility={accessibility} />

      {/* 2. TOP NAVIGATION HEADER */}
      <header className={`sticky top-0 z-40 px-4 py-3.5 flex items-center justify-between ${
        accessibility.highContrast
          ? "bg-white border-b-2 border-black"
          : "bg-white/10 backdrop-blur-md border-b border-white/10"
      }`}>
        
        {/* Brand & Toggle Drawer Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-xl md:hidden transition ${
              accessibility.highContrast
                ? "bg-white border border-black text-black"
                : "bg-white/10 border border-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex flex-col">
            <span className={`text-xl font-extrabold tracking-tight flex items-center gap-1 ${
              accessibility.highContrast
                ? "text-black"
                : "bg-gradient-to-r from-white via-white/95 to-indigo-100 bg-clip-text text-transparent"
            }`}>
              🌱 SoulSync AI
            </span>
            <span className={`hidden sm:inline text-[9px] font-mono tracking-widest uppercase font-bold ${
              accessibility.highContrast ? "text-black" : "text-white/60"
            }`}>
              "Understanding You Beyond Your Goals."
            </span>
          </div>
        </div>

        {/* Global Controls Row */}
        <div className="flex items-center space-x-2.5">
          
          {/* Quick atmosphere selector button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowAtmospherePicker(!showAtmospherePicker);
                setShowNotificationCenter(false);
              }}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-sans font-medium flex items-center gap-1.5 shadow-sm transition ${
                accessibility.highContrast
                  ? "bg-white border border-black text-black"
                  : "bg-white/10 border border-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <span>{atmospheres.find((a) => a.type === activeAtmosphere)?.icon}</span>
              <span className="hidden md:inline">{atmospheres.find((a) => a.type === activeAtmosphere)?.label}</span>
            </button>

            {/* Atmosphere selection drop bubble */}
            {showAtmospherePicker && (
              <div className={`absolute right-0 mt-2 w-48 rounded-2xl p-2.5 shadow-2xl z-50 animate-scale-up grid grid-cols-2 gap-1.5 ${
                accessibility.highContrast
                  ? "bg-white border-2 border-black"
                  : "bg-slate-900/85 backdrop-blur-xl border border-white/10 text-white"
              }`}>
                {atmospheres.map((a) => (
                  <button
                    key={a.type}
                    onClick={() => {
                      setActiveAtmosphere(a.type);
                      setShowAtmospherePicker(false);
                    }}
                    className={`p-2 rounded-xl text-center flex flex-col items-center justify-center gap-1 text-[10px] font-medium border transition ${
                      activeAtmosphere === a.type
                        ? "bg-indigo-500/20 border-indigo-400 text-indigo-300 font-bold"
                        : "border-transparent hover:bg-white/10"
                    }`}
                  >
                    {a.icon}
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Presentation Mode Toggle */}
          <button
            id="toggle-presentation-button"
            onClick={() => {
              setShowPresentationGuide(!showPresentationGuide);
              if (!showPresentationGuide && (profile.name === "Guest" || profile.name === "")) {
                handleActivateDemoMode();
              }
            }}
            className={`px-3 py-1.5 rounded-2xl text-[10px] font-sans font-black tracking-wider uppercase border transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
              showPresentationGuide
                ? "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.45)]"
                : "bg-[#251B4F] hover:bg-[#2c205c] border-indigo-400/20 text-indigo-300 hover:text-white"
            }`}
          >
            <span>🎭</span>
            <span>Presentation Mode</span>
          </button>

          {/* Quick Mode Toggle */}
          <button
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={`px-3 py-1.5 rounded-2xl text-[10px] font-mono font-bold tracking-wider uppercase border transition-all ${
              accessibility.highContrast
                ? isLiveMode ? "bg-black text-white" : "bg-white text-black border-black"
                : isLiveMode
                  ? "bg-white text-[#FF6B6B] border-white shadow-md font-extrabold"
                  : "bg-white/10 border-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isLiveMode ? "LIVE ACTIVE" : "DEMO RUN"}
          </button>

          {/* Quick Volume & Sound Controller */}
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/10 p-1.5 rounded-2xl relative shadow-sm hover:bg-white/15 transition group">
            <button
              onClick={() => handleUpdateAccessibility({ muteSounds: !accessibility.muteSounds })}
              className="text-white/80 hover:text-white transition cursor-pointer"
              title={accessibility.muteSounds ? "Unmute sounds" : "Mute sounds"}
            >
              {accessibility.muteSounds ? (
                <VolumeX className="w-4 h-4 text-rose-300" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-300" />
              )}
            </button>
            <div className="w-0 overflow-hidden group-hover:w-16 transition-all duration-300 flex items-center pr-1">
              <input
                type="range"
                min="0"
                max="100"
                value={accessibility.soundVolume ?? 50}
                onChange={(e) => handleUpdateAccessibility({ soundVolume: parseInt(e.target.value) })}
                className="w-14 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-400"
              />
            </div>
          </div>

          {/* Global Search Button */}
          <button
            onClick={() => setShowSearch(true)}
            className={`p-2 rounded-full relative shadow-sm transition ${
              accessibility.highContrast
                ? "bg-white border border-black text-black"
                : "bg-white/10 border border-white/10 hover:bg-white/20 text-white"
            }`}
            title="Global Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notification Alert button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationCenter(!showNotificationCenter);
                setShowAtmospherePicker(false);
              }}
              className={`p-2 rounded-full relative shadow-sm transition ${
                accessibility.highContrast
                  ? "bg-white border border-black text-black"
                  : "bg-white/10 border border-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <Bell className="w-4 h-4" />
              {alerts.some((a) => !a.read) && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            {/* Notification alert card */}
            {showNotificationCenter && (
              <div className={`absolute right-0 mt-2 w-72 rounded-2xl p-4 shadow-2xl z-50 animate-scale-up space-y-3.5 ${
                accessibility.highContrast
                  ? "bg-white border-2 border-black"
                  : "bg-slate-900/85 backdrop-blur-xl border border-white/10 text-white"
              }`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/60">Student Advisories</h4>
                  <button
                    onClick={() => setAlerts(alerts.map((a) => ({ ...a, read: true })))}
                    className="text-[9px] text-pink-300 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="space-y-2.5 max-h-[180px] overflow-y-auto">
                  {alerts.map((a) => (
                    <div
                      key={a.id}
                      className={`p-2.5 rounded-xl border text-[11px] leading-relaxed transition ${
                        accessibility.highContrast
                          ? "bg-white border border-black text-black"
                          : a.read
                            ? "bg-white/5 border-white/5 text-white/55"
                            : "bg-white/10 border-white/20 text-white font-medium"
                      }`}
                    >
                      {a.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Student Avatar */}
          <div
            onClick={() => setActiveView("soulprint")}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-white to-indigo-100 text-[#FF6B6B] flex items-center justify-center font-bold text-xs shadow-md cursor-pointer border border-white/20 hover:scale-105 transition"
          >
            {profile.name[0] || "A"}
          </div>

        </div>

      </header>

      {/* 3. CORE TWO-COLUMN MAIN FRAMEWORK */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10">
        
        {/* LEFT COMPANION NAVIGATION DRAWER */}
        <aside
          className={`fixed inset-y-0 left-0 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static transition-transform duration-300 z-30 w-60 p-4 flex flex-col justify-between ${
            accessibility.highContrast
              ? "bg-white border-r-2 border-black text-black"
              : "bg-white/10 backdrop-blur-md border-r border-white/10 text-white"
          }`}
        >
          
          <div className="space-y-6">
            
            <div className={`hidden md:flex flex-col items-center text-center p-3.5 rounded-2xl ${
              accessibility.highContrast
                ? "border border-black"
                : "bg-white/10 border border-white/10"
            }`}>
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-white to-indigo-100 text-[#FF6B6B] flex items-center justify-center text-lg font-extrabold shadow-md">
                {profile.name[0]}
              </div>
              <h4 className="font-extrabold text-sm mt-3 text-white">{profile.name}</h4>
              <p className="text-[10px] text-white/60 font-medium">{profile.degree} • {profile.semester}</p>
            </div>

            {/* Navigation options */}
            <nav className="space-y-1">
              {[
                { view: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
                { view: "soulprint", label: "SoulPrint", icon: <User className="w-4 h-4" /> },
                { view: "dreampath", label: "DreamPath", icon: <TreePine className="w-4 h-4" /> },
                { view: "opportunity", label: "Opportunity Compass", icon: <Compass className="w-4 h-4" /> },
                { view: "guide", label: "Gentle Guide", icon: <Heart className="w-4 h-4" /> },
                { view: "progress", label: "Living Progress", icon: <TreePine className="w-4 h-4" /> },
                { view: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
              ].map((item) => {
                const isActive = activeView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => {
                      setActiveView(item.view);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-2xl text-xs font-medium font-sans border transition ${
                      isActive
                        ? accessibility.highContrast
                          ? "bg-black text-white border-black"
                          : "bg-white text-[#FF6B6B] border-white shadow-md font-bold"
                        : accessibility.highContrast
                          ? "bg-transparent border-transparent text-black hover:bg-slate-100"
                          : "bg-transparent border-transparent text-white/85 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-white/10 text-center">
            <span className={`text-[9px] uppercase tracking-widest font-mono block ${
              accessibility.highContrast ? "text-black" : "text-white/50"
            }`}>
              SoulSync v1.0.0
            </span>
          </div>

        </aside>

        {/* MAIN INTERACTIVE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 relative z-10">
          
          {/* ADAPTIVE ONBOARDING FLOATING GREETING CARD */}
          {showOnboarding && activeView === "home" && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600/15 via-indigo-600/10 to-pink-500/10 backdrop-blur-xl border border-indigo-500/20 shadow-md relative overflow-hidden animate-scale-up space-y-4 max-w-6xl mx-auto">
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-lg shrink-0">
                    🌱
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-100">
                      Welcome to SoulSync AI 🌱
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                      Let's grow together. I'll learn about you gradually so I can personalize every step of your journey.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="p-1.5 rounded-full hover:bg-white/45 dark:hover:bg-slate-900/40 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    setActiveView("soulprint");
                    setShowOnboarding(false);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-medium text-xs rounded-xl transition shadow-sm"
                >
                  Refine Student Profile
                </button>
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-medium text-xs rounded-xl transition"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          )}

          {/* SWITCH VIEW CONTROLLER WITH DELIGHTFUL PAGE TRANSITIONS */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, scale: 0.98, filter: "blur(8px)", y: 15 }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)", y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {activeView === "home" && (
                <HomeDashboard
                  profile={profile}
                  missions={missions}
                  onToggleMission={handleToggleMission}
                  opportunities={mockOpportunities}
                  activeView={activeView}
                  onNavigate={setActiveView}
                  forestHealth={forestHealth}
                />
              )}

              {activeView === "soulprint" && (
                <SoulPrintView
                  profile={profile}
                  onUpdateProfile={handleUpdateProfile}
                  activeAtmosphere={activeAtmosphere}
                  accessibility={accessibility}
                />
              )}

              {activeView === "dreampath" && (
                <DreamPathView
                  profile={profile}
                  onUpdateProfile={handleUpdateProfile}
                  activeAtmosphere={activeAtmosphere}
                  accessibility={accessibility}
                />
              )}

              {activeView === "opportunity" && (
                <OpportunityCompassView
                  profile={profile}
                  onUpdateProfile={handleUpdateProfile}
                  activeAtmosphere={activeAtmosphere}
                  accessibility={accessibility}
                  missions={missions}
                  onAddMission={handleAddMission}
                  currentUser={currentUser}
                />
              )}

              {activeView === "guide" && (
                <GentleGuideView
                  profile={profile}
                  missions={missions}
                  onToggleMission={handleToggleMission}
                  activeAtmosphere={activeAtmosphere}
                  setActiveAtmosphere={setActiveAtmosphere}
                  isLiveMode={isLiveMode}
                  accessibility={accessibility}
                  selectedMood={selectedMood}
                  onSelectMood={setSelectedMood}
                />
              )}

              {activeView === "progress" && (
                <LivingProgressView
                  completedMissions={missions.filter((m) => m.completed).length}
                  totalMissions={missions.length}
                  forestHealth={forestHealth}
                  profile={profile}
                  missions={missions}
                  onToggleMission={handleToggleMission}
                  activeAtmosphere={activeAtmosphere}
                  onAddMission={handleAddMission}
                  onTriggerCelebration={(type) => setActiveCelebration(type)}
                  currentUser={currentUser}
                />
              )}

              {activeView === "settings" && (
                <SettingsView
                  accessibility={accessibility}
                  onChangeAccessibility={handleUpdateAccessibility}
                  isLiveMode={isLiveMode}
                  onToggleLiveMode={setIsLiveMode}
                  isOfflineSimulated={isOfflineSimulated}
                  onToggleOfflineSimulated={setIsOfflineSimulated}
                />
              )}
            </motion.div>
          </AnimatePresence>

        </main>

      </div>

      {/* 4. FLOATING AI MENTOR COMPANION COMPONENT (Always persistent bottom-right) */}
      <AIMentorPanel
        profile={profile}
        isLiveMode={isLiveMode}
        selectedMood={selectedMood}
        missions={missions}
        currentUser={currentUser}
      />

      {/* 5. FIRST IMPRESSION INTRO SPLASH OVERLAY */}
      <AnimatePresence>
        {showIntro && (
          <IntroSplash
            onComplete={() => setShowIntro(false)}
            onExploreDemo={handleActivateDemoMode}
            accessibilityEnabled={accessibility.reducedMotion}
          />
        )}
      </AnimatePresence>

      {/* 6. MILESTONE CELEBRATIONS MOUNT OVERLAY */}
      <AnimatePresence>
        {activeCelebration && (
          <AICelebrations
            type={activeCelebration}
            onClose={() => setActiveCelebration(null)}
            accessibilityEnabled={accessibility.reducedMotion}
          />
        )}
      </AnimatePresence>

      {/* 6.5. AI IMPACT FESTIVAL PRESENTATION GUIDE OVERLAY */}
      <AnimatePresence>
        {showPresentationGuide && (
          <PresentationGuide
            activeView={activeView}
            setActiveView={setActiveView}
            onClose={() => setShowPresentationGuide(false)}
            accessibilityEnabled={accessibility.reducedMotion}
          />
        )}
      </AnimatePresence>

      {/* GLOBAL OFFLINE NOTICE */}
      <AnimatePresence>
        {offlineActive && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg"
          >
            <div className="p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 shadow-xl flex items-start gap-3 text-white">
              <span className="text-xl animate-pulse shrink-0 mt-0.5">📡</span>
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-300">You're offline</p>
                <p className="text-[11px] text-white/80 leading-relaxed mt-0.5">
                  Your journey is safely stored locally. We'll sync everything once you're connected. You can still fully view your <span className="font-semibold text-pink-300">DreamPath</span>, <span className="font-semibold text-pink-300">SoulPrint</span>, <span className="font-semibold text-pink-300">Missions</span>, <span className="font-semibold text-pink-300">Forest</span>, and <span className="font-semibold text-pink-300">Reflections</span>.
                </p>
              </div>
              {isOfflineSimulated && (
                <button
                  onClick={() => setIsOfflineSimulated(false)}
                  className="text-[9px] font-mono bg-white/10 hover:bg-white/20 border border-white/10 px-1.5 py-0.5 rounded-md text-amber-200 cursor-pointer font-bold shrink-0 self-center"
                >
                  Reconnect
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. GLOBAL INTELLIGENT SEARCH MODAL */}
      <AnimatePresence>
        {showSearch && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowSearch(false);
                setSearchQuery("");
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border ${
                accessibility.highContrast
                  ? "bg-white border-2 border-black text-black"
                  : "bg-slate-900/90 backdrop-blur-2xl border-white/10 text-white"
              }`}
            >
              {/* Header Input */}
              <div className="p-4 flex items-center gap-3 border-b border-white/10 relative">
                <Search className="w-5 h-5 text-white/50 shrink-0" />
                <input
                  type="text"
                  placeholder="Type to search dreams, scholarships, projects, missions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent border-none outline-none text-sm placeholder-white/40 text-white py-1 pr-8 font-sans"
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-4 p-1 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search results body */}
              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
                {searchQuery.trim() === "" ? (
                  <div className="py-8 text-center space-y-2">
                    <p className="text-sm text-white/55">What are you looking for today, Ayush?</p>
                    <p className="text-[11px] text-white/35 font-mono">Try typing: "CNN", "Google", "DBMS", "Scholarship", or "Breath"</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="py-8 text-center text-white/50 text-sm">
                    No matching coordinates found for <span className="text-pink-300 font-semibold font-mono">"{searchQuery}"</span>.
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono tracking-wider uppercase text-white/40 font-bold mb-3">
                      Found {searchResults.length} matches
                    </p>
                    <div className="space-y-1.5">
                      {searchResults.map((result, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setActiveView(result.actionView);
                            setShowSearch(false);
                            setSearchQuery("");
                          }}
                          className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 hover:bg-indigo-500/25 border border-white/5 hover:border-indigo-400/40 transition duration-150 cursor-pointer group"
                        >
                          <span className="text-xl p-1.5 rounded-xl bg-white/5 group-hover:bg-white/10 transition shrink-0">
                            {result.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-pink-300">
                                {result.category}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-white truncate mt-0.5 group-hover:text-pink-100 transition">
                              {result.title}
                            </p>
                            <p className="text-xs text-white/60 truncate mt-0.5">
                              {result.subtitle}
                            </p>
                          </div>
                          <span className="text-xs text-white/30 group-hover:text-white/70 self-center font-mono">
                            Go ➔
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
