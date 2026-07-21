import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StudentProfile, StudentAchievement, AccessibilitySettings, AtmosphereType } from "../types";
import {
  Sparkles,
  Award,
  Briefcase,
  FileText,
  Globe,
  Layers,
  Linkedin,
  Cpu,
  Bookmark,
  Calendar,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  Share2,
  Copy,
  Check,
  TrendingUp,
  FileUp,
  Search,
  BookOpen,
  Info,
  ChevronRight,
  Zap,
  Star,
  RefreshCw,
  Eye,
  Settings,
  Flame,
  AlertCircle
} from "lucide-react";

interface CareerIdentityViewProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  accessibility: AccessibilitySettings;
  activeAtmosphere: AtmosphereType;
}

// Simulated Achievement Vault Item
interface VaultItem {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
  tags: string[];
}

export const CareerIdentityView: React.FC<CareerIdentityViewProps> = ({
  profile,
  onUpdateProfile,
  accessibility,
  activeAtmosphere
}) => {
  // Navigation tabs for the 10 modules
  const tabs = [
    { id: "dashboard", label: "Readiness Index", icon: TrendingUp, num: "7" },
    { id: "resume", label: "AI Resume Builder", icon: FileText, num: "1" },
    { id: "portfolio", label: "AI Portfolio Web", icon: Globe, num: "2" },
    { id: "showcase", label: "Project Showroom", icon: Cpu, num: "3" },
    { id: "linkedin", label: "LinkedIn Copilot", icon: Linkedin, num: "4" },
    { id: "star", label: "Interview Stories", icon: Star, num: "5" },
    { id: "skills", label: "Skill Progression", icon: Layers, num: "6" },
    { id: "vault", label: "Credentials Vault", icon: FileUp, num: "8" },
    { id: "timeline", label: "Growth Timeline", icon: Calendar, num: "9" },
    { id: "coach", label: "AI Career Coach", icon: Sparkles, num: "10" }
  ];

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-fill fallback achievements if profile lacks them
  const currentAchievements = profile.achievements || [];

  // --- GENERAL STATE & LOCAL PERSISTENCE CACHING ---
  const [achievements, setAchievements] = useState<StudentAchievement[]>(currentAchievements);
  const [newAchType, setNewAchType] = useState<string>("project");
  const [newAchTitle, setNewAchTitle] = useState("");
  const [newAchSubtitle, setNewAchSubtitle] = useState("");
  const [newAchDate, setNewAchDate] = useState("");
  const [newAchDesc, setNewAchDesc] = useState("");
  const [newAchSkills, setNewAchSkills] = useState("");
  const [showAddAchModal, setShowAddAchModal] = useState(false);

  // Sync state back to profile
  const syncAchievementsToProfile = (updated: StudentAchievement[]) => {
    setAchievements(updated);
    onUpdateProfile({ achievements: updated });
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchTitle || !newAchDesc) return;

    const newAch: StudentAchievement = {
      id: "ach_" + Date.now(),
      type: newAchType as any,
      title: newAchTitle,
      subtitle: newAchSubtitle || undefined,
      date: newAchDate || "Present",
      description: newAchDesc,
      skills: newAchSkills
        ? newAchSkills.split(",").map(s => s.trim()).filter(Boolean)
        : [],
      details: {
        summary: newAchDesc,
        problem: "No localized problem statement registered yet.",
        approach: "Standard developmental approach.",
        architectureDiagram: "[Input Data] ──> [Processing Logic] ──> [Outcome Output]",
        keyLearnings: "Gained hands-on integration understanding.",
        futureImprovements: "Refactoring components for scalability.",
        impact: "Integrated and cataloged in SoulSync Career Engine.",
        starStory: {
          situation: `During the completion of my ${newAchTitle} milestone...`,
          task: "Integrate and catalog this benchmark accomplishment on my DreamPath.",
          action: "Drafted technical outlines, organized repositories, and coordinated development phases.",
          result: "Successfully completed and validated this milestone, pushing my overall readiness scores higher."
        },
        linkedinPost: `🚀 Thrilled to share that I've completed: ${newAchTitle}! \n\n${newAchDesc}\n\n#ProfessionalGrowth #UndergradSprints #${newAchType.toUpperCase()} #ContinuousLearning`
      }
    };

    const next = [newAch, ...achievements];
    syncAchievementsToProfile(next);
    setShowAddAchModal(false);

    // Reset Form Fields
    setNewAchTitle("");
    setNewAchSubtitle("");
    setNewAchDate("");
    setNewAchDesc("");
    setNewAchSkills("");

    // Trigger score recalculation visual celebration
    triggerActionCelebration("achievement_logged");
  };

  const handleDeleteAchievement = (id: string) => {
    const next = achievements.filter(a => a.id !== id);
    syncAchievementsToProfile(next);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // --- STATE 1: RESUME BUILDER ---
  const [resumePreset, setResumePreset] = useState<string>("internship");
  const [isResumeAutoUpdate, setIsResumeAutoUpdate] = useState<boolean>(true);
  const [customResumeBio, setCustomResumeBio] = useState<string>(
    `An ambitious ${profile.branch} student at ${profile.college}, specializing in high-performance model compression, deep learning filters, and regional OCR platforms. Expert-level Python foundations paired with agile development methodologies.`
  );
  const [isEditingResume, setIsEditingResume] = useState<boolean>(false);

  // Resume ATS-score calculation
  const resumeATSReport = React.useMemo(() => {
    const hasProjects = achievements.some(a => a.type === "project");
    const hasInternships = achievements.some(a => a.type === "internship");
    const hasCertificates = achievements.some(a => a.type === "certificate");
    const charCount = customResumeBio.length;

    let score = 55;
    const items: string[] = [];
    const gaps: string[] = [];

    if (hasProjects) { score += 15; items.push("Solid technical projects listed"); }
    else { gaps.push("Add concrete technical projects to bolster practical weight"); }

    if (hasInternships) { score += 15; items.push("Professional internship experience verified"); }
    else { gaps.push("Secure and catalog a summer internship to prove industry compatibility"); }

    if (hasCertificates) { score += 10; items.push("Recognized credentials attached"); }
    else { gaps.push("Include industry-vetted certifications (Stanford, Coursera, DeepLearning.AI)"); }

    if (charCount > 100) { score += 5; items.push("Comprehensive summary profile block"); }
    else { gaps.push("Slightly extend your objective statement to highlight unique research niches"); }

    return { score: Math.min(score, 100), items, gaps };
  }, [achievements, customResumeBio]);

  // --- STATE 2: PORTFOLIO WEBSITE ---
  const [portfolioTheme, setPortfolioTheme] = useState<string>("glass");
  const [isPortfolioHosted, setIsPortfolioHosted] = useState<boolean>(false);
  const [publishingProgress, setPublishingProgress] = useState<number>(0);

  const handlePublishPortfolio = () => {
    setIsPortfolioHosted(true);
    setPublishingProgress(0);
    const interval = setInterval(() => {
      setPublishingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  // Theme styling for live mockup frame
  const getThemeFrameStyles = () => {
    switch (portfolioTheme) {
      case "swiss":
        return "bg-white text-neutral-900 font-sans p-6 rounded-2xl shadow-inner border border-neutral-200";
      case "terminal":
        return "bg-black text-emerald-400 font-mono p-6 rounded-2xl shadow-inner border border-emerald-950";
      case "minimalist":
        return "bg-zinc-50 text-zinc-700 font-serif p-6 rounded-2xl shadow-inner border border-zinc-200";
      default:
        return "bg-slate-950/85 text-white font-sans p-6 rounded-2xl border border-white/10 shadow-inner backdrop-blur-md";
    }
  };

  // --- STATE 3: PROJECT SHOWCASE ---
  const projectAchievements = achievements.filter(a => a.type === "project");
  const [selectedShowcaseId, setSelectedShowcaseId] = useState<string>(
    projectAchievements[0]?.id || "default_ocr"
  );
  const [isEditingShowcase, setIsEditingShowcase] = useState<boolean>(false);

  const selectedShowcaseProject = React.useMemo(() => {
    const found = achievements.find(a => a.id === selectedShowcaseId);
    if (found) return found;
    // Hardcoded default fallback for IndicOCR-Lite
    return achievements.find(a => a.type === "project") || null;
  }, [achievements, selectedShowcaseId]);

  const [scSummary, setScSummary] = useState("");
  const [scProblem, setScProblem] = useState("");
  const [scApproach, setScApproach] = useState("");
  const [scLearnings, setScLearnings] = useState("");
  const [scImpact, setScImpact] = useState("");

  // Sync selected project contents into editable local state
  useEffect(() => {
    if (selectedShowcaseProject) {
      setScSummary(selectedShowcaseProject.details?.summary || selectedShowcaseProject.description || "");
      setScProblem(selectedShowcaseProject.details?.problem || "Explain the core challenge solved...");
      setScApproach(selectedShowcaseProject.details?.approach || "Detail the training, frameworks, or deployment models...");
      setScLearnings(selectedShowcaseProject.details?.keyLearnings || "Specify what you discovered during memory profiling...");
      setScImpact(selectedShowcaseProject.details?.impact || "State latency, accuracy, or efficiency scores...");
    }
  }, [selectedShowcaseProject]);

  const handleSaveShowcase = () => {
    if (!selectedShowcaseProject) return;
    const next = achievements.map(a => {
      if (a.id === selectedShowcaseProject.id) {
        return {
          ...a,
          description: scSummary,
          details: {
            ...a.details,
            summary: scSummary,
            problem: scProblem,
            approach: scApproach,
            keyLearnings: scLearnings,
            impact: scImpact
          }
        };
      }
      return a;
    });
    syncAchievementsToProfile(next);
    setIsEditingShowcase(false);
    triggerActionCelebration("showcase_updated");
  };

  // --- STATE 5: INTERVIEW STAR stories ---
  const [selectedStarId, setSelectedStarId] = useState<string>(
    achievements.find(a => a.details?.starStory)?.id || ""
  );
  const [starStep, setStarStep] = useState<number>(0);
  const [starS, setStarS] = useState("");
  const [starT, setStarT] = useState("");
  const [starA, setStarA] = useState("");
  const [starR, setStarR] = useState("");
  const [starTargetAchId, setStarTargetAchId] = useState("");

  const activeStarStory = React.useMemo(() => {
    const found = achievements.find(a => a.id === selectedStarId);
    return found?.details?.starStory || null;
  }, [achievements, selectedStarId]);

  const handleSaveCustomSTAR = () => {
    if (!starTargetAchId || !starS || !starT || !starA || !starR) return;
    const next = achievements.map(a => {
      if (a.id === starTargetAchId) {
        return {
          ...a,
          details: {
            ...a.details,
            starStory: {
              situation: starS,
              task: starT,
              action: starA,
              result: starR
            }
          }
        };
      }
      return a;
    });
    syncAchievementsToProfile(next);
    setSelectedStarId(starTargetAchId);
    setStarStep(0);
    // Reset wizard fields
    setStarS("");
    setStarT("");
    setStarA("");
    setStarR("");
    triggerActionCelebration("star_compiled");
  };

  // --- STATE 8: CREDENTIALS VAULT ---
  const initialVaultItems: VaultItem[] = [
    { id: "v1", name: "DeepLearning.AI_ML_Specialization.pdf", size: "1.4 MB", type: "Certificate", date: "Mar 2026", tags: ["AI", "Credentials"] },
    { id: "v2", name: "SIH_Internal_Winner_Ltr.pdf", size: "850 KB", type: "Award", date: "Jul 2026", tags: ["Hackathon", "Winner Badge"] },
    { id: "v3", name: "Reliance_Undergrad_Offer_2026.pdf", size: "1.2 MB", type: "Scholarship", date: "Jan 2026", tags: ["Scholarship", "Financial"] },
    { id: "v4", name: "IITD_Semester2_Transcript.pdf", size: "640 KB", type: "Transcript", date: "Jun 2026", tags: ["Academics"] }
  ];

  const [vaultItems, setVaultItems] = useState<VaultItem[]>(initialVaultItems);
  const [vaultSearch, setVaultSearch] = useState("");
  const [isUploadingVault, setIsUploadingVault] = useState(false);
  const [vaultFileTag, setVaultFileTag] = useState("AI");

  const handleVaultUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVault(true);
    setTimeout(() => {
      const newItem: VaultItem = {
        id: "vault_" + Date.now(),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        type: "Certificate",
        date: "Today",
        tags: [vaultFileTag, "Uploaded"]
      };
      setVaultItems([newItem, ...vaultItems]);
      setIsUploadingVault(false);
      triggerActionCelebration("credential_archived");
    }, 1200);
  };

  const filteredVaultItems = vaultItems.filter(item => {
    const q = vaultSearch.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q)) ||
      item.type.toLowerCase().includes(q)
    );
  });

  // --- STATE 10: CAREER COACH AI ---
  const [coachResponse, setCoachResponse] = useState<any>(null);
  const [isCallingCoach, setIsCallingCoach] = useState(false);

  const fetchCoachAnalysis = async () => {
    setIsCallingCoach(true);
    try {
      const res = await fetch("/api/career-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            ...profile,
            achievements
          },
          mode: "live"
        })
      });
      const data = await res.json();
      setCoachResponse(data);
    } catch (e) {
      console.error("Coach retrieval failed:", e);
    } finally {
      setIsCallingCoach(false);
    }
  };

  // Load Coach Diagnostic on Mount
  useEffect(() => {
    fetchCoachAnalysis();
  }, []);

  // --- GLOBAL SCORE CALCULATOR (Module 7) ---
  const finalReadinessScores = React.useMemo(() => {
    if (coachResponse?.readinessScores) {
      return coachResponse.readinessScores;
    }
    // Dynamic fallback matching achievements
    const scoreBase = achievements.length * 6;
    return {
      resume: Math.min(65 + scoreBase, 95),
      portfolio: Math.min(55 + scoreBase, 90),
      interview: Math.min(50 + scoreBase, 88),
      github: Math.min(60 + scoreBase, 92),
      linkedin: Math.min(45 + scoreBase, 85),
      placement: Math.min(70 + scoreBase, 96),
      research: Math.min(50 + scoreBase, 86),
      startup: Math.min(55 + scoreBase, 90)
    };
  }, [achievements, coachResponse]);

  const overallReadinessIndex = React.useMemo(() => {
    const vals = Object.values(finalReadinessScores) as number[];
    const sum = vals.reduce((a, b) => a + b, 0);
    return Math.round(sum / vals.length);
  }, [finalReadinessScores]);

  // --- GLOBAL INTEGRATION VISUAL CELEBRATIONS ---
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  const triggerActionCelebration = (type: string) => {
    let msg = "";
    switch (type) {
      case "achievement_logged":
        msg = "⭐ Career Identity Updated! Bloom Forest Nurtured +50 pts. Resume, Portfolio, & LinkedIn drafts auto-aligned.";
        break;
      case "showcase_updated":
        msg = "📝 Project Showroom Saved! Technical narrative synced to Resume compilation blocks.";
        break;
      case "star_compiled":
        msg = "🔥 Behavioral STAR Story Compiled! Sibling coach indexed scenario into interview readiness vectors.";
        break;
      case "credential_archived":
        msg = "📂 Credentials Archiver: File securely saved in Achievement Vault. Tags registered.";
        break;
    }
    setCelebrationMessage(msg);
    setTimeout(() => setCelebrationMessage(null), 5000);
  };

  return (
    <div className="relative text-white space-y-6">
      
      {/* GLOBAL CELEBRATION FLOATING CARD */}
      <AnimatePresence>
        {celebrationMessage && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-pink-500/90 to-indigo-600/90 border border-pink-300/30 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md max-w-md text-xs font-medium"
          >
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin shrink-0" />
            <p className="text-white/95 leading-relaxed leading-snug">{celebrationMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER STATEMENT & SUB NAVIGATION TAB LIST */}
      <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5 mb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full tracking-wider uppercase">
                SILENT BACKGROUND IDENTITY ENGINE
              </span>
              <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-300">
                <CheckCircle2 className="w-3 h-3" /> Fully Synced
              </span>
            </div>
            <h2 className="text-xl font-display font-black text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-pink-300 shrink-0" /> Career Identity Suite
            </h2>
            <p className="text-xs text-white/60">
              Continuously compiles and formats your achievements. Never build resumes manually at the end of college.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddAchModal(true)}
              className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center gap-1.5 transition duration-200 cursor-pointer shadow-md hover:shadow-pink-500/10"
            >
              <Plus className="w-4 h-4" /> Log Achievement
            </button>
            <button
              onClick={fetchCoachAnalysis}
              disabled={isCallingCoach}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 hover:text-white transition cursor-pointer"
              title="Recalculate Diagnostics"
            >
              <RefreshCw className={`w-4 h-4 ${isCallingCoach ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* TAB NAVIGATION SCROLL BAR */}
        <div className="flex items-center overflow-x-auto gap-1.5 pb-2 -mx-2 px-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl font-medium text-xs flex items-center gap-1.5 shrink-0 transition duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#342D5A] border border-pink-500/30 text-pink-300 shadow"
                    : "bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/8"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-pink-300" : "text-white/50"}`} />
                <span>{tab.label}</span>
                <span className={`text-[8px] px-1 py-0.2 rounded font-mono ${isActive ? "bg-pink-500/20 text-pink-300" : "bg-white/5 text-white/40"}`}>
                  M{tab.num}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDER ACTIVE MODULE CONTENT */}
      <div className="min-h-[480px]">
        
        {/* --- MODULE 7: CAREER READINESS DASHBOARD --- */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left side overall score */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white/10 border border-white/10 shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-white/5 pb-3">
                  <h3 className="text-sm font-display font-bold text-white flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-pink-300" /> Professional Standing
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono font-bold">
                    Tier-1 Target Match
                  </span>
                </div>

                <div className="py-6 flex flex-col items-center justify-center">
                  <div className="relative flex items-center justify-center w-36 h-36">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="54" className="stroke-white/5 fill-none" strokeWidth="8" />
                      <circle
                        cx="64"
                        cy="64"
                        r="54"
                        className="stroke-pink-500 fill-none transition-all duration-1000 ease-out"
                        strokeWidth="8"
                        strokeDasharray={339.1}
                        strokeDashoffset={339.1 - (339.1 * overallReadinessIndex) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-3.5xl font-display font-black text-white">{overallReadinessIndex}%</span>
                      <span className="text-[8px] font-mono uppercase text-white/40 block tracking-wider">Overall Readiness</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-white/80 leading-relaxed text-center font-medium">
                  Your Career Identity score is in the <strong className="text-pink-300">top 5%</strong> for engineering undergraduates targeting <strong className="text-indigo-300">{profile.dreamCompany}</strong>.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 gap-3 text-center text-xs font-mono">
                <div className="p-2.5 rounded-2xl bg-white/5">
                  <span className="text-white/40 text-[9px] block">Achievements</span>
                  <span className="text-white font-bold text-base">{achievements.length} Verified</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5">
                  <span className="text-white/40 text-[9px] block">Growth Missions</span>
                  <span className="text-emerald-400 font-bold text-base">37% Done</span>
                </div>
              </div>
            </div>

            {/* Right side component score breakdowns */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white/10 border border-white/10 shadow-lg space-y-6">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-display font-bold text-white">Continuous Sub-Metric Diagnostics</h3>
                <p className="text-[10px] text-white/40">These indexes reflect verified achievements logged in your profile</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Resume Completeness", val: finalReadinessScores.resume, tag: "ATS Friendly", color: "from-pink-500 to-rose-500" },
                  { label: "Portfolio Strength", val: finalReadinessScores.portfolio, tag: "Web Showcase", color: "from-indigo-500 to-purple-500" },
                  { label: "Interview Scenarios", val: finalReadinessScores.interview, tag: "STAR Method", color: "from-amber-500 to-yellow-500" },
                  { label: "GitHub Core Commits", val: finalReadinessScores.github, tag: "Code Quality", color: "from-sky-500 to-blue-500" },
                  { label: "LinkedIn Footprint", val: finalReadinessScores.linkedin, tag: "Public Outreach", color: "from-blue-600 to-indigo-600" },
                  { label: "Placement Alignment", val: finalReadinessScores.placement, tag: "Tier-1 Screen", color: "from-emerald-500 to-teal-500" },
                  { label: "Research Incubator", val: finalReadinessScores.research, tag: "SOP & Citation", color: "from-rose-500 to-pink-500" },
                  { label: "Startup Potentials", val: finalReadinessScores.startup, tag: "Orchestration", color: "from-violet-500 to-fuchsia-500" }
                ].map((score, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-2 hover:bg-white/8 transition">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-semibold text-white/90">{score.label}</span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/50">{score.tag}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${score.color}`} style={{ width: `${score.val}%` }} />
                      </div>
                      <span className="font-mono text-xs font-bold text-white shrink-0">{score.val}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Strengths vs Gaps Analysis */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-3xl bg-white/5 border border-white/5">
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Strong Professional Verticals
                </h4>
                <ul className="space-y-2 text-xs text-white/80 pl-1">
                  {(coachResponse?.strengths || [
                    "Expert Python competency with core neural visual processing framework layers (PyTorch).",
                    "Atypical project benchmark solving local device constraints offline (IndicOCR-Lite).",
                    "Scholarship and hackathon wins confirming competitive merit peer-group standing."
                  ]).map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Recommended Skill Gaps
                </h4>
                <ul className="space-y-2 text-xs text-white/80 pl-1">
                  {(coachResponse?.gaps || [
                    "LinkedIn index is low. Draft and publish post updates detailing edge optimization.",
                    "Fewer behavioral conflict resolution scenarios registered in STAR narratives.",
                    "Limited contributions to prominent open-source deep learning compilers."
                  ]).map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-amber-400 shrink-0 font-bold">!</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* --- MODULE 1: AI RESUME BUILDER --- */}
        {activeTab === "resume" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Control Sidebar */}
            <div className="lg:col-span-4 p-5 rounded-3xl bg-white/10 border border-white/10 shadow-lg space-y-6">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-display font-bold text-white">Resume Configuration</h3>
                <p className="text-[10px] text-white/40">Select specialized formatting blocks dynamically</p>
              </div>

              {/* Preset Selectors */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-white/50 uppercase">Formatting Preset</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: "internship", label: "Internship" },
                    { id: "placement", label: "Campus Placement" },
                    { id: "research", label: "Research SOP" },
                    { id: "onepage", label: "Standard One Page" }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setResumePreset(p.id)}
                      className={`p-2 rounded-xl text-center text-xs font-medium cursor-pointer transition ${
                        resumePreset === p.id
                          ? "bg-[#342D5A] border border-pink-500/30 text-pink-300"
                          : "bg-white/5 hover:bg-white/8 border border-white/5 text-white/70"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto update toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold block text-white/95">Dynamic Autoupdate</span>
                  <span className="text-[10px] text-white/40">Sync achievements automatically</span>
                </div>
                <button
                  onClick={() => setIsResumeAutoUpdate(!isResumeAutoUpdate)}
                  className={`w-10 h-5.5 rounded-full p-1 transition-colors cursor-pointer ${
                    isResumeAutoUpdate ? "bg-pink-500" : "bg-white/20"
                  }`}
                >
                  <div className={`bg-white w-3.5 h-3.5 rounded-full transition-transform ${isResumeAutoUpdate ? "translate-x-4.5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* ATS Checker Report */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-pink-500/10 border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-indigo-300">ATS CO-ALIGNMENT SCORE</span>
                  <span className="font-mono text-xs font-extrabold text-white bg-[#342D5A] border border-pink-500/30 px-2 py-0.5 rounded-md">
                    {resumeATSReport.score}/100
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-pink-500" style={{ width: `${resumeATSReport.score}%` }} />
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <span className="text-emerald-400 font-bold block">✓ High Compatibility:</span>
                  <p className="text-white/75 leading-relaxed">
                    Custom OCR structures and PyTorch forward activation projects pass ATS sequence matching.
                  </p>
                </div>
              </div>

              {/* Edit Bio */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-white/50 uppercase">
                  <span>Profile Objective Summary</span>
                  <button
                    onClick={() => setIsEditingResume(!isEditingResume)}
                    className="text-pink-300 hover:underline cursor-pointer"
                  >
                    {isEditingResume ? "Done" : "Manual Edit"}
                  </button>
                </div>
                {isEditingResume ? (
                  <textarea
                    value={customResumeBio}
                    onChange={(e) => setCustomResumeBio(e.target.value)}
                    className="w-full h-24 p-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-pink-500"
                  />
                ) : (
                  <p className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-white/80 leading-relaxed italic">
                    "{customResumeBio}"
                  </p>
                )}
              </div>
            </div>

            {/* Resume Canvas Preview */}
            <div className="lg:col-span-8 p-6 md:p-8 rounded-3xl bg-slate-950 border border-white/10 shadow-2xl relative overflow-hidden text-neutral-300 space-y-6">
              
              {/* Top Banner Contact Block */}
              <div className="text-center space-y-1.5 border-b border-neutral-800 pb-4">
                <h2 className="text-lg font-bold font-sans text-white uppercase tracking-wider">{profile.name}</h2>
                <p className="text-[10px] font-mono text-pink-300">
                  {profile.degree} | {profile.semester} | {profile.college}
                </p>
                <p className="text-[10px] text-neutral-400">
                  New Delhi, India | ayush@iitd.ac.in | github.com/ayush-iitd | linkedin.com/in/ayush-iitd
                </p>
              </div>

              {/* Bio block */}
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-0.5">
                  Professional Profile Summary
                </h3>
                <p className="text-[11px] leading-relaxed text-neutral-400">
                  {customResumeBio}
                </p>
              </div>

              {/* Education Block */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-0.5">
                  Education Details
                </h3>
                <div className="flex justify-between text-[11px]">
                  <div>
                    <strong className="text-neutral-200">{profile.college}</strong>
                    <span className="block text-neutral-400">{profile.degree} (Branch: {profile.branch})</span>
                  </div>
                  <div className="text-right text-neutral-400">
                    <span>Graduation: {profile.graduationYear || "2029"}</span>
                    <span className="block text-pink-300 font-mono font-bold">CGPA: 8.9 / 10.0</span>
                  </div>
                </div>
              </div>

              {/* Technical Skills Block */}
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-0.5">
                  Verified Skill sets
                </h3>
                <p className="text-[11px] leading-relaxed text-neutral-400">
                  <strong className="text-neutral-300">Languages & Core:</strong> Python (Expert), SQL, C++, Data Structures, Linear Algebra<br />
                  <strong className="text-neutral-300">Frameworks & Tools:</strong> PyTorch, TensorFlow Lite, OpenCV, Git & GitHub workflows, Scikit-Learn
                </p>
              </div>

              {/* Achievements Sprints Block */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-0.5">
                  Technical Project Landmarks & Experience
                </h3>

                <div className="space-y-3">
                  {achievements.slice(0, 3).map((ach) => (
                    <div key={ach.id} className="space-y-1 text-[11px]">
                      <div className="flex justify-between items-baseline">
                        <strong className="text-neutral-200">{ach.title}</strong>
                        <span className="font-mono text-[9px] text-neutral-400">{ach.date}</span>
                      </div>
                      <p className="text-neutral-400 text-[10px] italic">
                        {ach.subtitle || ach.type.toUpperCase()} | Key Stack: {ach.skills.join(", ")}
                      </p>
                      <p className="text-neutral-400 leading-relaxed text-[10.5px]">
                        • {ach.description}
                      </p>
                      {ach.details?.starStory && (
                        <p className="text-neutral-400 leading-relaxed text-[10.5px]">
                          • <strong className="text-pink-300/80">STAR Impact:</strong> {ach.details.starStory.result}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="pt-4 border-t border-neutral-800 text-center text-[9px] text-neutral-500 font-mono">
                Resume is compiled in clean, single-column ATS parser friendly markdown format. Click 'Download' to copy the raw layout.
              </div>

              {/* Action buttons */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => handleCopy(
                    `AYUSH RESUME\nObjective: ${customResumeBio}\nEducation: ${profile.college}\nSkills: ${profile.skills.join(", ")}\nAchievements: ${achievements.map(a => `${a.title}: ${a.description}`).join("\n")}`,
                    "resume_txt"
                  )}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === "resume_txt" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === "resume_txt" ? "Copied Raw" : "Copy Raw Text"}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* --- MODULE 2: AI PORTFOLIO WEBSITE --- */}
        {activeTab === "portfolio" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Control Column */}
            <div className="lg:col-span-4 p-5 rounded-3xl bg-white/10 border border-white/10 shadow-lg space-y-6">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-display font-bold text-white">Portfolio Configuration</h3>
                <p className="text-[10px] text-white/40">Choose design layouts and publish parameters</p>
              </div>

              {/* Template Theme Selectors */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-white/50 uppercase">Theme Template</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "glass", label: "Glassmorphic Aura" },
                    { id: "swiss", label: "Swiss Modernist" },
                    { id: "terminal", label: "Cyberpunk Terminal" },
                    { id: "minimalist", label: "Soft Minimalist" }
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setPortfolioTheme(theme.id)}
                      className={`p-2 rounded-xl text-center text-xs font-semibold cursor-pointer transition ${
                        portfolioTheme === theme.id
                          ? "bg-[#342D5A] border border-pink-500/30 text-pink-300"
                          : "bg-white/5 hover:bg-white/8 border border-white/5 text-white/70"
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hosting action */}
              <div className="p-4 rounded-2xl bg-[#1A1235] border border-white/5 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white block">Publish Landing Page</span>
                  <p className="text-[10px] text-white/50">Generates an interactive hosted link</p>
                </div>

                {isPortfolioHosted ? (
                  <div className="space-y-2">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-mono flex items-center justify-between">
                      <span>soulsync.ai/ayush-iitd</span>
                      <button
                        onClick={() => handleCopy("https://soulsync.ai/ayush-iitd", "port_url")}
                        className="text-pink-300 hover:underline cursor-pointer"
                      >
                        {copiedId === "port_url" ? "Copied" : "Copy"}
                      </button>
                    </div>
                    {publishingProgress < 100 && (
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-pink-500 transition-all duration-300" style={{ width: `${publishingProgress}%` }} />
                        </div>
                        <span className="text-[9px] font-mono text-white/40 block text-right">Bundling and syncing assets...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handlePublishPortfolio}
                    className="w-full py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5"
                  >
                    <Globe className="w-4 h-4" /> Publish to Cloud
                  </button>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-[11px] text-white/60 leading-relaxed">
                <Info className="w-4 h-4 text-indigo-300 shrink-0 inline-block mr-1.5 -mt-0.5" />
                The portfolio matches all logged achievements. Any modification in achievements automatically triggers a quiet incremental rebuild of assets, guaranteeing offline compatibility.
              </div>
            </div>

            {/* Portfolio Mockup Frame Preview */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center bg-[#1E193C] px-4 py-2 rounded-t-2xl border-t border-x border-white/10">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-mono text-white/40">Portfolio Website Live Preview</span>
                <span className="text-[10px] font-mono text-pink-300">Responsive Frame</span>
              </div>

              <div className={getThemeFrameStyles()}>
                
                {/* Navbar mock */}
                <div className="flex justify-between items-center border-b pb-4 mb-4 border-current/10 text-xs">
                  <span className="font-bold uppercase tracking-wider">{profile.name}.ai</span>
                  <div className="flex gap-3 font-mono text-[9px] uppercase tracking-wide opacity-80">
                    <span>About</span>
                    <span>Projects</span>
                    <span>Skills</span>
                    <span>Contact</span>
                  </div>
                </div>

                {/* Hero section */}
                <div className="space-y-3 py-6 text-center md:text-left">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase opacity-60">WELCOME TO MY DIGITAL CAREER ROADMAP</span>
                  <h1 className="text-2xl font-black font-display leading-tight">
                    Hi, I'm <span className="text-pink-500">{profile.name}</span>, a B.Tech CSE Student & AI Innovator
                  </h1>
                  <p className="text-xs leading-relaxed opacity-85 max-w-lg">
                    I build lightweight, high-performance deep neural network models and real-world computer vision systems. Based in IIT Delhi, I solve low-resource and offline computational problems.
                  </p>
                </div>

                {/* Projects grid mock */}
                <div className="space-y-4 pt-4 border-t border-current/10">
                  <h3 className="text-xs font-bold font-mono tracking-wider uppercase opacity-70">Benchmark Projects</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {achievements.slice(0, 2).map((ach) => (
                      <div key={ach.id} className="p-3.5 rounded-xl bg-current/5 border border-current/10 space-y-2">
                        <span className="text-[8px] font-mono uppercase bg-current/10 px-1.5 py-0.5 rounded font-bold">
                          {ach.type}
                        </span>
                        <h4 className="text-xs font-bold font-display leading-tight">{ach.title}</h4>
                        <p className="text-[10px] leading-relaxed opacity-75">{ach.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {ach.skills.map((s, idx) => (
                            <span key={idx} className="text-[8px] font-mono px-1 rounded bg-current/5">{s}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills mock */}
                <div className="space-y-2 pt-6">
                  <h3 className="text-xs font-bold font-mono tracking-wider uppercase opacity-70">Core Capabilities</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((s, idx) => (
                      <span key={idx} className="text-[9px] px-2 py-0.5 rounded bg-pink-500/15 text-pink-300 font-medium">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Footer mock */}
                <div className="mt-8 pt-4 border-t border-current/10 text-center text-[9px] opacity-50 flex justify-between">
                  <span>© {new Date().getFullYear()} {profile.name}</span>
                  <div className="flex gap-2">
                    <span>GitHub</span>
                    <span>•</span>
                    <span>LinkedIn</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* --- MODULE 3: PROJECT SHOWCASE --- */}
        {activeTab === "showcase" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left side project selector list */}
            <div className="lg:col-span-4 p-5 rounded-3xl bg-white/10 border border-white/10 shadow-lg space-y-4">
              <div className="border-b border-white/5 pb-2">
                <h3 className="text-sm font-display font-bold text-white">Select Benchmark Project</h3>
                <p className="text-[10px] text-white/40">Select a project to view and edit its continuous showcase documentation</p>
              </div>

              <div className="space-y-2">
                {projectAchievements.length > 0 ? (
                  projectAchievements.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedShowcaseId(p.id)}
                      className={`w-full p-3 rounded-2xl text-left transition text-xs border cursor-pointer ${
                        selectedShowcaseId === p.id
                          ? "bg-[#342D5A] border-pink-500/30 text-white"
                          : "bg-white/5 border-white/5 text-white/70 hover:bg-white/8"
                      }`}
                    >
                      <strong className="block font-semibold">{p.title}</strong>
                      <span className="text-[9px] text-white/40 mt-1 block font-mono">{p.date}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-white/40 text-center py-6">No projects logged. Log a custom project milestone at the top!</p>
                )}
              </div>
            </div>

            {/* Right side detailed showcase workspace */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white/10 border border-white/10 shadow-lg space-y-6">
              
              {selectedShowcaseProject ? (
                <div className="space-y-6">
                  
                  {/* Title & metadata */}
                  <div className="flex justify-between items-start border-b border-white/5 pb-3">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-pink-300 font-bold uppercase">Dynamic Project Showroom</span>
                      <h3 className="text-base font-display font-black text-white">{selectedShowcaseProject.title}</h3>
                    </div>
                    <button
                      onClick={() => {
                        if (isEditingShowcase) {
                          handleSaveShowcase();
                        } else {
                          setIsEditingShowcase(true);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#342D5A] border border-pink-500/30 text-pink-300 text-xs font-bold hover:bg-opacity-80 transition cursor-pointer"
                    >
                      {isEditingShowcase ? "Save Showcase Documentation" : "Edit Details"}
                    </button>
                  </div>

                  {/* Summary / Concept */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-white/40 uppercase">Summary & Concept</span>
                    {isEditingShowcase ? (
                      <textarea
                        value={scSummary}
                        onChange={(e) => setScSummary(e.target.value)}
                        className="w-full h-16 p-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none"
                      />
                    ) : (
                      <p className="text-xs text-white/80 leading-relaxed font-medium">
                        {selectedShowcaseProject.details?.summary || selectedShowcaseProject.description}
                      </p>
                    )}
                  </div>

                  {/* Two-Column Problem vs Approach */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-pink-300 uppercase">1. Problem Statement</span>
                      {isEditingShowcase ? (
                        <textarea
                          value={scProblem}
                          onChange={(e) => setScProblem(e.target.value)}
                          className="w-full h-24 p-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none"
                        />
                      ) : (
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-white/70 leading-relaxed">
                          {selectedShowcaseProject.details?.problem || "No problem statement registered."}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-indigo-300 uppercase">2. Approach & Architecture</span>
                      {isEditingShowcase ? (
                        <textarea
                          value={scApproach}
                          onChange={(e) => setScApproach(e.target.value)}
                          className="w-full h-24 p-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none"
                        />
                      ) : (
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-white/70 leading-relaxed">
                          {selectedShowcaseProject.details?.approach || "No technical approach registered."}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Architecture Diagram */}
                  {selectedShowcaseProject.details?.architectureDiagram && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-white/40 uppercase">Interactive System Architecture Diagram</span>
                      <pre className="p-4 bg-slate-950 rounded-2xl border border-white/5 text-[10px] font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                        {selectedShowcaseProject.details.architectureDiagram}
                      </pre>
                    </div>
                  )}

                  {/* Learnings & Impact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-amber-300 uppercase">3. Key Learnings</span>
                      {isEditingShowcase ? (
                        <textarea
                          value={scLearnings}
                          onChange={(e) => setScLearnings(e.target.value)}
                          className="w-full h-20 p-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none"
                        />
                      ) : (
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-white/70 leading-relaxed">
                          {selectedShowcaseProject.details?.keyLearnings || "No learnings recorded."}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase">4. Quantified Project Impact</span>
                      {isEditingShowcase ? (
                        <textarea
                          value={scImpact}
                          onChange={(e) => setScImpact(e.target.value)}
                          className="w-full h-20 p-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none"
                        />
                      ) : (
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-white/70 leading-relaxed font-semibold text-emerald-200">
                          {selectedShowcaseProject.details?.impact || "No metrics recorded."}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sync warning */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] text-white/40">
                    Publishing updates triggers an immediate sync of data parameters across your active AI Resume modules and AI Portfolio templates, ensuring absolute architectural consistency.
                  </div>

                </div>
              ) : (
                <div className="text-center py-12 text-white/40">
                  Select a project to explore dynamic, compiler-friendly showcase documentation.
                </div>
              )}

            </div>

          </div>
        )}

        {/* --- MODULE 4: LINKEDIN ASSISTANT --- */}
        {activeTab === "linkedin" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Headline and profile helper */}
            <div className="lg:col-span-5 p-5 rounded-3xl bg-white/10 border border-white/10 shadow-lg space-y-5">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-display font-bold text-white">LinkedIn Identity Helper</h3>
                <p className="text-[10px] text-white/40">Draft expert positioning headlines</p>
              </div>

              {/* Dynamic Headline */}
              <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[9px] font-mono text-pink-300 font-bold block uppercase">AI GENERATED POSITIONING HEADLINE</span>
                <p className="text-xs font-semibold text-white leading-relaxed">
                  "B.Tech CSE (AI & ML) @ IIT Delhi | Deep Learning Developer | Project Lead: IndicOCR-Lite | Winner SIH Hackathon | PyTorch & Model Optimization Enthusiast"
                </p>
                <div className="pt-2 text-right">
                  <button
                    onClick={() => handleCopy("B.Tech CSE (AI & ML) @ IIT Delhi | Deep Learning Developer | Project Lead: IndicOCR-Lite | Winner SIH Hackathon | PyTorch & Model Optimization Enthusiast", "headline")}
                    className="text-[10px] font-mono text-pink-300 hover:underline cursor-pointer"
                  >
                    {copiedId === "headline" ? "Copied" : "Copy Headline"}
                  </button>
                </div>
              </div>

              {/* Dynamic About profile block */}
              <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[9px] font-mono text-indigo-300 font-bold block uppercase">DRAFTED PROFILE 'ABOUT' STATEMENT</span>
                <p className="text-xs text-white/80 leading-relaxed text-justify">
                  "As an undergraduate Computer Science student specializing in AI & ML at IIT Delhi, I'm passionate about engineering lightweight deep learning models that make highly demanding applications offline-accessible. From custom CNN hook visualizers to low-resource OCR networks, I bridge the gap between heavy academic models and compact edge runtimes."
                </p>
                <div className="pt-2 text-right">
                  <button
                    onClick={() => handleCopy("As an undergraduate Computer Science student specializing in AI & ML at IIT Delhi, I'm passionate about engineering lightweight deep learning models that make highly demanding applications offline-accessible. From custom CNN hook visualizers to low-resource OCR networks, I bridge the gap between heavy academic models and compact edge runtimes.", "about")}
                    className="text-[10px] font-mono text-pink-300 hover:underline cursor-pointer"
                  >
                    {copiedId === "about" ? "Copied" : "Copy Summary"}
                  </button>
                </div>
              </div>
            </div>

            {/* Auto-generated update post helper */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white/10 border border-white/10 shadow-lg space-y-5">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-display font-bold text-white">Dynamic Post Drafts</h3>
                <p className="text-[10px] text-white/40">Select an achievement to retrieve its prepared LinkedIn post template</p>
              </div>

              <div className="space-y-4">
                {achievements.slice(0, 3).map((ach) => (
                  <div key={ach.id} className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-3 relative">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono uppercase bg-pink-500/20 text-pink-300 px-1.5 py-0.2 rounded">
                          {ach.type}
                        </span>
                        <strong className="text-xs text-white font-medium">{ach.title}</strong>
                      </div>
                      <button
                        onClick={() => handleCopy(ach.details?.linkedinPost || ach.description, ach.id)}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-pink-300 transition shrink-0 cursor-pointer"
                        title="Copy Post Draft"
                      >
                        {copiedId === ach.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <p className="text-xs text-white/85 leading-relaxed whitespace-pre-wrap font-sans max-h-32 overflow-y-auto pr-1">
                      {ach.details?.linkedinPost || ach.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* --- MODULE 5: INTERVIEW STORY BUILDER (STAR) --- */}
        {activeTab === "star" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Story List Panel */}
            <div className="lg:col-span-4 p-5 rounded-3xl bg-white/10 border border-white/10 shadow-lg space-y-4">
              <div className="border-b border-white/5 pb-2">
                <h3 className="text-sm font-display font-bold text-white">STAR Narratives</h3>
                <p className="text-[10px] text-white/40">Select a story mapped to your active technical achievements</p>
              </div>

              <div className="space-y-2">
                {achievements.filter(a => a.details?.starStory).map((ach) => (
                  <button
                    key={ach.id}
                    onClick={() => setSelectedStarId(ach.id)}
                    className={`w-full p-3 rounded-2xl text-left transition border text-xs cursor-pointer ${
                      selectedStarId === ach.id
                        ? "bg-[#342D5A] border-pink-500/30 text-white"
                        : "bg-white/5 border-white/5 text-white/70 hover:bg-white/8"
                    }`}
                  >
                    <strong className="block font-semibold">{ach.title}</strong>
                    <span className="text-[9px] text-pink-300 font-mono mt-1 block">STAR Active ✓</span>
                  </button>
                ))}
              </div>

              {/* Begin story compile block */}
              <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 border border-white/10 rounded-2xl text-center space-y-3">
                <h4 className="text-xs font-bold text-white leading-snug">Compile Behavioral Story</h4>
                <p className="text-[10px] text-white/60 leading-relaxed">
                  Map a challenging scenario (team conflict, latency spike, crash) into the classic STAR layout.
                </p>
                <button
                  onClick={() => setStarStep(1)}
                  className="w-full py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl cursor-pointer transition"
                >
                  Launch STAR Wizard
                </button>
              </div>
            </div>

            {/* Wizard and story display workspace */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white/10 border border-white/10 shadow-lg">
              
              {/* STAR Wizard steps */}
              {starStep > 0 ? (
                <div className="space-y-5">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h3 className="text-sm font-display font-bold text-pink-300">STAR Compilation Wizard (Step {starStep}/4)</h3>
                    <button
                      onClick={() => setStarStep(0)}
                      className="text-xs text-white/50 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  {starStep === 1 && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white block">1. Select Target Milestone / Achievement</label>
                        <select
                          value={starTargetAchId}
                          onChange={(e) => setStarTargetAchId(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                        >
                          <option value="">-- Choose project or milestone --</option>
                          {achievements.map(a => (
                            <option key={a.id} value={a.id}>{a.title} ({a.type})</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white block">2. Situation (S)</label>
                        <p className="text-[10px] text-white/40">What was the context or challenge? (e.g. "Google STEP closing, felt imposter syndrome", "Mobile app latency spikes")</p>
                        <textarea
                          value={starS}
                          onChange={(e) => setStarS(e.target.value)}
                          placeholder="Describe the context..."
                          className="w-full h-20 p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none"
                        />
                      </div>

                      <div className="text-right">
                        <button
                          disabled={!starTargetAchId || !starS}
                          onClick={() => setStarStep(2)}
                          className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 font-bold text-xs cursor-pointer disabled:opacity-40"
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  )}

                  {starStep === 2 && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white block">3. Task (T)</label>
                        <p className="text-[10px] text-white/40">What was your specific responsibility? (e.g. "I needed to compress the model to fit on local mobile storage")</p>
                        <textarea
                          value={starT}
                          onChange={(e) => setStarT(e.target.value)}
                          placeholder="Describe your responsibility..."
                          className="w-full h-24 p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none"
                        />
                      </div>

                      <div className="flex justify-between">
                        <button onClick={() => setStarStep(1)} className="px-4 py-1.5 rounded-xl bg-white/5 text-xs">Back</button>
                        <button
                          disabled={!starT}
                          onClick={() => setStarStep(3)}
                          className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 font-bold text-xs"
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  )}

                  {starStep === 3 && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white block">4. Action (A)</label>
                        <p className="text-[10px] text-white/40">What actions did YOU take? Highlight your unique choices, frameworks, and techniques.</p>
                        <textarea
                          value={starA}
                          onChange={(e) => setStarA(e.target.value)}
                          placeholder="Describe your active actions..."
                          className="w-full h-24 p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none"
                        />
                      </div>

                      <div className="flex justify-between">
                        <button onClick={() => setStarStep(2)} className="px-4 py-1.5 rounded-xl bg-white/5 text-xs">Back</button>
                        <button
                          disabled={!starA}
                          onClick={() => setStarStep(4)}
                          className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 font-bold text-xs"
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  )}

                  {starStep === 4 && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white block">5. Result (R)</label>
                        <p className="text-[10px] text-white/40">What was the specific, quantified outcome? (e.g. "Slashed latency by 85%, won SIH Internal 1st place")</p>
                        <textarea
                          value={starR}
                          onChange={(e) => setStarR(e.target.value)}
                          placeholder="Quantify the output..."
                          className="w-full h-24 p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none"
                        />
                      </div>

                      <div className="flex justify-between">
                        <button onClick={() => setStarStep(3)} className="px-4 py-1.5 rounded-xl bg-white/5 text-xs">Back</button>
                        <button
                          disabled={!starR}
                          onClick={handleSaveCustomSTAR}
                          className="px-5 py-2 bg-gradient-to-r from-pink-500 to-indigo-500 font-bold text-xs rounded-xl cursor-pointer"
                        >
                          Compile STAR Narrative
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ) : activeStarStory ? (
                <div className="space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <span className="text-[9px] font-mono uppercase text-pink-300 font-bold">ACTIVE INTERVIEW SCENARIO</span>
                    <h3 className="text-sm font-bold text-white font-display">Behavioral Scenario: STAR Method Representation</h3>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-[#1A153A] border border-pink-500/10 space-y-1">
                      <strong className="text-pink-300 uppercase font-mono text-[10px] tracking-wider block">Situation (S)</strong>
                      <p className="text-white/85 leading-relaxed">{activeStarStory.situation}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                      <strong className="text-indigo-300 uppercase font-mono text-[10px] tracking-wider block">Task (T)</strong>
                      <p className="text-white/85 leading-relaxed">{activeStarStory.task}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                      <strong className="text-amber-300 uppercase font-mono text-[10px] tracking-wider block">Action (A)</strong>
                      <p className="text-white/85 leading-relaxed">{activeStarStory.action}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#152C32] border border-emerald-500/10 space-y-1">
                      <strong className="text-emerald-400 uppercase font-mono text-[10px] tracking-wider block">Result (R)</strong>
                      <p className="text-white/90 leading-relaxed font-semibold">{activeStarStory.result}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#342D5A]/30 border border-white/5 rounded-2xl text-[10px] text-white/50 leading-relaxed">
                    🌟 <strong>AI Coaching Tip:</strong> Recruiters rate quantified results (Result block) very highly. Keep your metrics (e.g., 94% accuracy, 180ms latency) prominently at the top of your discussion thread.
                  </div>

                </div>
              ) : (
                <div className="text-center py-12 text-white/40 space-y-2">
                  <Star className="w-8 h-8 text-white/15 mx-auto" />
                  <p className="text-xs">Select or construct a STAR behavioral scenario story mapped to your project breakthroughs.</p>
                </div>
              )}

            </div>

          </div>
        )}

        {/* --- MODULE 6: SKILL EVOLUTION --- */}
        {activeTab === "skills" && (
          <div className="p-6 rounded-3xl bg-white/10 border border-white/10 shadow-lg space-y-6">
            
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-display font-bold text-white">Visual Skill Timeline & Evolution</h3>
                <p className="text-[10px] text-white/40">Track level adjustments, validation maps, and industry benchmarks</p>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                Industry Readiness: {finalReadinessScores.placement}%
              </span>
            </div>

            {/* Horizontal Timeline Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              {[
                { stage: "Stage 1: Python Core", status: "Expert Profile", desc: "Expert-level loops, NumPy matrix grids, binarization algorithms.", progress: 90, active: true },
                { stage: "Stage 2: PyTorch DL", status: "Intermediate", desc: "Deep layer forward hooks, Tensor slices, optimizer loops.", progress: 72, active: true },
                { stage: "Stage 3: Edge Inference", status: "Active Milestone", desc: "TFLite integer quantization, mobile GPU compiling.", progress: 68, active: true },
                { stage: "Stage 4: LLM Finetuning", status: "Upcoming", desc: "BharatGen adapter scripts, LoRA parameters, tokenizers.", progress: 15, active: false }
              ].map((lvl, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border transition duration-200 ${
                  lvl.active ? "bg-[#342D5A]/40 border-pink-500/20" : "bg-white/5 border-white/5 opacity-50"
                }`}>
                  <span className="text-[9px] font-mono text-pink-300 font-bold block mb-1 uppercase">{lvl.stage}</span>
                  <h4 className="text-xs font-bold text-white leading-snug">{lvl.status}</h4>
                  
                  <div className="my-3">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500" style={{ width: `${lvl.progress}%` }} />
                    </div>
                    <span className="text-[9px] font-mono text-white/40 block text-right mt-1">{lvl.progress}% Mastered</span>
                  </div>

                  <p className="text-[10px] text-white/60 leading-relaxed text-justify">{lvl.desc}</p>
                </div>
              ))}
            </div>

            {/* Mapped Achievements linkage list */}
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3">
              <span className="text-[10px] font-mono text-white/50 uppercase">ACTIVE SKILL LINKS TO VERIFIED ACHIEVEMENTS</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {achievements.map(ach => (
                  <div key={ach.id} className="p-3 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-between text-[11px]">
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <span className="text-white font-medium block truncate">{ach.title}</span>
                      <span className="text-pink-300 text-[9px] font-mono uppercase block">{ach.type}</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/40 text-right shrink-0">✓ Mapped</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* --- MODULE 8: CREDENTIALS VAULT --- */}
        {activeTab === "vault" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left side File Drag Drop Upload */}
            <div className="lg:col-span-5 p-5 rounded-3xl bg-white/10 border border-white/10 shadow-lg space-y-5">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-display font-bold text-white">Upload New Credential</h3>
                <p className="text-[10px] text-white/40">Securely archive certificates, awards, and letters</p>
              </div>

              {/* Tag selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/50 uppercase block">Credential Custom Tag</label>
                <div className="flex flex-wrap gap-1">
                  {["AI", "Academics", "Hackathon", "Scholarship", "Winner Badge", "Transcript"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setVaultFileTag(t)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold cursor-pointer ${
                        vaultFileTag === t ? "bg-pink-500 text-white" : "bg-white/5 text-white/60 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Input Panel */}
              <div className="h-40 rounded-2xl border border-dashed border-white/20 hover:border-pink-500/40 bg-white/5 transition flex flex-col items-center justify-center p-4 text-center space-y-2 relative">
                <input
                  type="file"
                  onChange={handleVaultUpload}
                  disabled={isUploadingVault}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="application/pdf,image/*"
                />
                
                {isUploadingVault ? (
                  <div className="space-y-2">
                    <RefreshCw className="w-6 h-6 text-pink-300 animate-spin mx-auto" />
                    <span className="text-xs font-semibold text-white">Syncing with Achievement Vault bucket...</span>
                  </div>
                ) : (
                  <>
                    <FileUp className="w-7 h-7 text-white/40" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Drag & Drop or Click to Upload</span>
                      <span className="text-[10px] text-white/40 block">Accepts PDF or images up to 10MB</span>
                    </div>
                  </>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex gap-2 text-[10.5px] text-emerald-200 leading-normal">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Documents are stored in Firestore-mapped states. Fully indexed for offline retrieval and auto-resume validation.</span>
              </div>
            </div>

            {/* Right side File listings search */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white/10 border border-white/10 shadow-lg space-y-4">
              
              {/* Search vault bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search vault documents by name, type, or tag..."
                  value={vaultSearch}
                  onChange={(e) => setVaultSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 outline-none"
                />
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {filteredVaultItems.length > 0 ? (
                  filteredVaultItems.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/5 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-[#342D5A] border border-pink-500/20 text-pink-300 rounded-xl">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <strong className="text-xs text-white block truncate">{item.name}</strong>
                          <span className="text-[9px] text-white/40 block font-mono">{item.size} • {item.type} • {item.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="text-[8px] font-mono bg-white/5 px-1.5 py-0.5 rounded text-white/60">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-white/40 text-center py-12">No files match search query.</p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* --- MODULE 9: PROFESSIONAL GROWTH TIMELINE --- */}
        {activeTab === "timeline" && (
          <div className="p-6 rounded-3xl bg-white/10 border border-white/10 shadow-lg space-y-6">
            <div className="border-b border-white/5 pb-2">
              <h3 className="text-sm font-display font-bold text-white">Continuous Undergrad Progression Timeline</h3>
              <p className="text-[10px] text-white/40">Each verified achievement opens deep STAR scenario and showcase linkages</p>
            </div>

            {/* Vertical timeline tree */}
            <div className="relative pl-6 space-y-6 border-l border-white/15 ml-2 pt-2">
              
              {achievements.map((ach) => (
                <div key={ach.id} className="relative group">
                  
                  {/* Floating timeline bullet icon */}
                  <div className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-pink-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                    ★
                  </div>

                  {/* Card box */}
                  <div className="p-4 rounded-2xl bg-white/5 hover:bg-white/8 border border-white/5 transition duration-200 space-y-2">
                    <div className="flex justify-between items-baseline text-xs">
                      <div>
                        <span className="text-[9px] font-mono text-pink-300 uppercase block font-bold">{ach.date}</span>
                        <h4 className="font-bold text-white leading-snug">{ach.title}</h4>
                      </div>
                      <span className="text-[9px] font-mono uppercase bg-pink-500/20 text-pink-300 px-1.5 rounded">
                        {ach.type}
                      </span>
                    </div>

                    <p className="text-[11px] text-white/70 leading-relaxed text-justify">
                      {ach.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {ach.skills.map((s, idx) => (
                        <span key={idx} className="text-[8px] font-mono bg-white/5 px-1.5 rounded text-white/60">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- MODULE 10: CAREER COACH AI --- */}
        {activeTab === "coach" && (
          <div className="p-6 rounded-3xl bg-white/10 border border-white/10 shadow-lg space-y-6">
            
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono uppercase bg-pink-500/20 text-pink-300 px-1.5 rounded font-bold">GEMINI AI INTEGRATION</span>
                <h3 className="text-base font-display font-black text-white">AI Coach Diagnostic Studio</h3>
              </div>
              <button
                disabled={isCallingCoach}
                onClick={fetchCoachAnalysis}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-40 transition"
              >
                {isCallingCoach ? "Synthesizing Analysis..." : "Query AI Coach Diagnostics"}
              </button>
            </div>

            {isCallingCoach ? (
              <div className="py-16 text-center space-y-4">
                <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-pink-500/20 animate-ping" />
                  <RefreshCw className="w-6 h-6 text-pink-300 animate-spin" />
                </div>
                <p className="text-xs text-white/60">
                  Gemini is analyzing your portfolio benchmarks, project descriptions, and active growth timeline...
                </p>
              </div>
            ) : coachResponse ? (
              <div className="space-y-6">
                
                {/* Main Coach Commentary block */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-pink-500/10 to-indigo-500/10 border border-white/15 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-15">
                    <Sparkles className="w-16 h-16 text-pink-300 animate-pulse" />
                  </div>
                  <div className="flex gap-2 text-pink-300 font-mono text-[10px] font-bold uppercase mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Elder Sibling Diagnostic Summary</span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed text-justify italic font-medium font-sans">
                    "{coachResponse.coachAnalysis}"
                  </p>
                </div>

                {/* Strengths vs Gaps blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                      ✓ Strengths Identified
                    </h4>
                    <ul className="space-y-2 text-xs text-white/70">
                      {coachResponse.strengths.map((item: string, idx: number) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-emerald-400 shrink-0 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                      ! Development Opportunities
                    </h4>
                    <ul className="space-y-2 text-xs text-white/70">
                      {coachResponse.gaps.map((item: string, idx: number) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-amber-400 shrink-0 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended tactical actions */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-mono text-white/40 uppercase block">RECOMMENDED TACTICAL ACTIONS FOR THIS SEMESTER</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {coachResponse.recommendations.map((rec: any, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-950/60 border border-white/15 rounded-2xl hover:border-pink-500/30 transition flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-[8px] font-mono bg-pink-500/20 text-pink-300 px-1.5 py-0.2 rounded font-bold uppercase shrink-0">
                              ACTION {idx + 1}
                            </span>
                            <span className="text-[9px] font-mono text-emerald-300 text-right shrink-0">
                              {rec.impact}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white leading-tight">{rec.title}</h4>
                          <p className="text-[10.5px] text-white/60 leading-normal text-justify">
                            {rec.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-white/40">
                Click above to generate your customized elder-sibling AI Career diagnostics list.
              </div>
            )}

          </div>
        )}

      </div>

      {/* --- ADD ACHIEVEMENT MODAL --- */}
      <AnimatePresence>
        {showAddAchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl"
            >
              <div className="p-5 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-sm font-display font-bold text-white">Log Verified Undergraduate Achievement</h3>
                <button
                  onClick={() => setShowAddAchModal(false)}
                  className="text-white/40 hover:text-white cursor-pointer text-xs uppercase font-bold"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleAddAchievement} className="p-5 space-y-4 max-h-[460px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/50 uppercase">Type</label>
                    <select
                      value={newAchType}
                      onChange={(e) => setNewAchType(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white"
                    >
                      <option value="project">Project</option>
                      <option value="internship">Internship</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="scholarship">Scholarship</option>
                      <option value="research">Research</option>
                      <option value="certificate">Certification</option>
                      <option value="skill">Skill validation</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/50 uppercase">Date/Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. July 2026, May - July"
                      value={newAchDate}
                      onChange={(e) => setNewAchDate(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 uppercase">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IndicOCR-Lite Developer"
                    value={newAchTitle}
                    onChange={(e) => setNewAchTitle(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 uppercase">Subtitle / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. IIT Delhi, Wadhwani AI, DeepLearning.AI"
                    value={newAchSubtitle}
                    onChange={(e) => setNewAchSubtitle(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 uppercase">Core Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide a clear outline. Be as specific as possible about your benchmarks or impact..."
                    value={newAchDesc}
                    onChange={(e) => setNewAchDesc(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 uppercase">Associated Skills (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Python, PyTorch, Model Compression"
                    value={newAchSkills}
                    onChange={(e) => setNewAchSkills(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAchModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/8 text-white font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs cursor-pointer"
                  >
                    Log verified landmark
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
