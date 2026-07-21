import React, { useMemo } from "react";
import { StudentProfile, GrowthMission, Opportunity } from "../types";
import { aiEmpatheticQuotes } from "../data";
import { Sparkles, ArrowRight, CheckCircle2, Clock, Award, Shield, AlertCircle, Heart, Flame } from "lucide-react";

interface HomeDashboardProps {
  profile: StudentProfile;
  missions: GrowthMission[];
  onToggleMission: (id: string) => void;
  opportunities: Opportunity[];
  activeView: string;
  onNavigate: (view: string) => void;
  forestHealth: number; // 0 to 100
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  missions,
  onToggleMission,
  opportunities,
  onNavigate,
  forestHealth,
}) => {
  // Calculate DreamPath Progress
  const completedMissionsCount = missions.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedMissionsCount / Math.max(missions.length, 1)) * 100);

  // Determine time-of-day greeting
  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return `Good Morning, ${profile.name || "Friend"} 🌅`;
    if (hours < 17) return `Good Afternoon, ${profile.name || "Friend"} ☀`;
    return `Good Evening, ${profile.name || "Friend"} 🌿`;
  }, [profile.name]);

  // Choose a random quote based on the current day/time to keep it fresh
  const dailyQuote = useMemo(() => {
    if (completedMissionsCount > 0) {
      return "Welcome back 🌿. One small step today can become tomorrow's biggest achievement. Your forest has been waiting for you.";
    }
    const day = new Date().getDate();
    return aiEmpatheticQuotes[day % aiEmpatheticQuotes.length];
  }, [completedMissionsCount]);

  // Opportunity Snapshot Counts
  const snapStats = useMemo(() => {
    const scholarships = opportunities.filter((o) => o.type === "Scholarship");
    const internships = opportunities.filter((o) => o.type === "Internship");
    const hackathons = opportunities.filter((o) => o.type === "Hackathon");

    return {
      scholarshipsCount: scholarships.length,
      scholarshipsSoon: scholarships.filter((o) => o.closingSoon).length,
      internshipsCount: internships.length,
      internshipsSoon: internships.filter((o) => o.closingSoon).length,
      hackathonsCount: hackathons.length,
      hackathonsSoon: hackathons.filter((o) => o.closingSoon).length,
    };
  }, [opportunities]);

  return (
    <div className="space-y-8 animate-fade-in text-white max-w-6xl mx-auto px-4 md:px-0">
      
      {/* SECTION 1: Greeting & Dynamic Empathetic Quote */}
      <div className="p-6 md:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg space-y-3 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight bg-gradient-to-r from-white via-[#FF9D6C] to-pink-200 bg-clip-text text-transparent">
              {greeting}
            </h1>
            <p className="text-base md:text-lg font-sans font-light italic text-white/90">
              "{dailyQuote}"
            </p>
          </div>
          {completedMissionsCount > 0 && (
            <div className="shrink-0 animate-scale-up px-3.5 py-2 bg-emerald-500/20 border border-emerald-500/35 rounded-2xl w-fit flex items-center gap-2 shadow-sm">
              <span className="text-[11px] font-bold text-emerald-200 flex items-center gap-1.5">
                <span>🌸</span> Your consistency planted another blossom.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Core Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: DreamPath Progress and Today's Focus */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTION 2: Continue DreamPath Card */}
          <div className="group relative overflow-hidden p-6 md:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:shadow-2xl">
            <div className="space-y-4 max-w-md">
              <span className="px-3 py-1 text-xs font-mono font-semibold rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
                🌱 ACTIVE PATH
              </span>
              <h2 className="text-2xl font-display font-bold tracking-tight text-white">
                {profile.careerGoal || "Establish Career Goal"}
              </h2>
              <p className="text-sm text-white/80">
                You are on track to master <span className="font-semibold text-emerald-300">{profile.branch}</span> semesters. Completing daily growth missions boosts your progress.
              </p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onNavigate("dreampath")}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-white text-[#FF6B6B] hover:bg-white/90 font-semibold text-sm shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                >
                  <span>Continue DreamPath</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Circular Progress Indicator */}
            <div className="relative flex-shrink-0 w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  className="text-white/10"
                  strokeWidth="8"
                  fill="transparent"
                  stroke="currentColor"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  className="text-emerald-400 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  stroke="currentColor"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-mono font-bold text-white">
                  {progressPercent}%
                </span>
                <span className="text-[10px] uppercase tracking-wider text-white/60 font-medium">
                  Overall
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 3: Today's Focus - Exactly 3 Growth Missions */}
          <div className="p-6 md:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-display font-semibold tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-300" />
                  Today's Focus
                </h3>
                <p className="text-xs text-white/70">
                  Carefully tailored missions that balance academics, career milestones, and mental health.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/15 text-white border border-white/10">
                {completedMissionsCount}/3 Completed
              </span>
            </div>

            <div className="space-y-4">
              {missions.slice(0, 3).every((m) => m.completed) ? (
                <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/20 text-center flex flex-col items-center justify-center space-y-4 animate-scale-up">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-300">
                    <Sparkles className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-white">All Clear! Beautifully Done 🌱</p>
                    <p className="text-xs text-white/70 max-w-sm mx-auto">
                      You've earned a peaceful evening. Maybe spend five minutes in <span className="text-pink-300 font-semibold">Me Time</span> to ground your progress.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate("guide")}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition cursor-pointer"
                  >
                    Open Gentle Guide ➔
                  </button>
                </div>
              ) : (
                missions.slice(0, 3).map((mission) => (
                  <div
                    key={mission.id}
                    onClick={() => onToggleMission(mission.id)}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      mission.completed
                        ? "bg-white/20 border-emerald-400/50 text-white/70"
                        : "bg-white/5 hover:bg-white/15 border-white/10 text-white shadow-sm hover:shadow-md"
                    }`}
                  >
                    <div className="mt-1">
                      {mission.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center hover:border-pink-300 transition-colors" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <p className={`text-sm font-semibold ${mission.completed ? "line-through text-white/50" : "text-white"}`}>
                          {mission.title}
                        </p>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                          mission.category === "Wellbeing"
                            ? "bg-pink-500/20 text-pink-200 border border-pink-500/30"
                            : mission.category === "Academics"
                            ? "bg-sky-500/20 text-sky-200 border border-sky-500/30"
                            : "bg-amber-500/20 text-amber-200 border border-amber-500/30"
                        }`}>
                          {mission.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-white/70" />
                          Est. {mission.estimatedTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-white/70" />
                          Impact: {mission.dreamImpact}
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-300" />
                          {mission.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Opportunities Snapshot & Bloom Forest Preview & Me Time */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* SECTION 4: Opportunity Snapshot */}
          <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-lg tracking-tight flex items-center gap-2 text-white">
                <Shield className="w-5 h-5 text-indigo-300" />
                Opportunities
              </h3>
              <button
                onClick={() => onNavigate("opportunity")}
                className="text-xs font-sans font-semibold text-pink-200 hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Micro snapshot cards */}
            <div className="grid grid-cols-1 gap-3">
              {/* Scholarships */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs text-white/60 uppercase font-semibold">Scholarships</h4>
                  <p className="text-xl font-mono font-bold text-white">{snapStats.scholarshipsCount} Available</p>
                </div>
                {snapStats.scholarshipsSoon > 0 && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/30 flex items-center gap-1 animate-pulse">
                    <Flame className="w-2.5 h-2.5" />
                    {snapStats.scholarshipsSoon} closing soon
                  </span>
                )}
              </div>

              {/* Internships */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs text-white/60 uppercase font-semibold">Internships</h4>
                  <p className="text-xl font-mono font-bold text-white">{snapStats.internshipsCount} Available</p>
                </div>
                {snapStats.internshipsSoon > 0 && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/30 flex items-center gap-1 animate-pulse">
                    <Flame className="w-2.5 h-2.5" />
                    {snapStats.internshipsSoon} closing soon
                  </span>
                )}
              </div>

              {/* Hackathons */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs text-white/60 uppercase font-semibold">Hackathons</h4>
                  <p className="text-xl font-mono font-bold text-white">{snapStats.hackathonsCount} Active</p>
                </div>
                {snapStats.hackathonsSoon > 0 && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/30 flex items-center gap-1 animate-pulse">
                    <Flame className="w-2.5 h-2.5" />
                    {snapStats.hackathonsSoon} closing soon
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 5: Bloom Forest Preview */}
          <div
            onClick={() => onNavigate("progress")}
            className="group p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 flex items-center justify-between"
          >
            <div className="space-y-2">
              <h3 className="font-display font-semibold text-lg tracking-tight flex items-center gap-2 text-emerald-300">
                <span>Bloom Forest</span>
              </h3>
              <p className="text-xs text-white/80">
                Completed missions foster your Soul Tree. Check health & procedurally grow flowers.
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-xs font-semibold text-emerald-200">
                  Forest Vitality: {forestHealth}%
                </span>
                <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${forestHealth}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Miniature Vector Tree representation */}
            <div className="relative w-16 h-16 flex items-center justify-center bg-white/10 rounded-full border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 40 40" className="w-12 h-12">
                <path d="M20 34 L20 18" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M20 22 C14 22 10 18 10 14 C10 10 14 6 20 12 C26 6 30 10 30 14 C30 18 26 22 20 22 Z" fill="#4ade80" fillOpacity="0.8" />
                <circle cx="15" cy="12" r="2.5" fill="#ec4899" />
                <circle cx="25" cy="11" r="2" fill="#eab308" />
                <circle cx="20" cy="16" r="2.5" fill="#3b82f6" />
              </svg>
            </div>
          </div>

          {/* SECTION 6: Me Time Card */}
          <div
            onClick={() => onNavigate("guide")}
            className="group cursor-pointer p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-pink-500/20 shadow-lg hover:shadow-2xl transition-all duration-300 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-lg tracking-tight text-pink-200 flex items-center gap-2">
                <Heart className="w-5 h-5 fill-pink-500/20 text-pink-300" />
                Me Time
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-200 border border-pink-500/30">
                5 MINS
              </span>
            </div>
            <p className="text-sm font-sans font-medium leading-relaxed text-white">
              "Take five minutes for yourself."
            </p>
            <p className="text-xs text-white/70">
              Access breathing loops, ground your focus, and quiet the noise of schedules. Open the Gentle Guide.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
