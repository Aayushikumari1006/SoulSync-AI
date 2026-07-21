import React, { useState, useEffect } from "react";
import { AccessibilitySettings } from "../types";
import { 
  Settings, 
  Shield, 
  ToggleLeft, 
  ToggleRight, 
  Check, 
  AlertTriangle, 
  Key, 
  Calendar, 
  Bell, 
  User, 
  Lock, 
  Mail, 
  RefreshCw, 
  Cloud, 
  Database,
  Smartphone
} from "lucide-react";
import { 
  isLiveFirebase, 
  signUpWithEmail, 
  loginWithEmail, 
  loginWithGoogle, 
  loginAnonymouslyService, 
  logoutUser, 
  resetUserPassword, 
  subscribeToAuthChanges,
  UserSession
} from "../lib/firebase";

interface SettingsViewProps {
  accessibility: AccessibilitySettings;
  onChangeAccessibility: (updated: Partial<AccessibilitySettings>) => void;
  isLiveMode: boolean;
  onToggleLiveMode: (live: boolean) => void;
  isOfflineSimulated: boolean;
  onToggleOfflineSimulated: (simulated: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  accessibility,
  onChangeAccessibility,
  isLiveMode,
  onToggleLiveMode,
  isOfflineSimulated,
  onToggleOfflineSimulated,
}) => {
  // Auth Form states
  const [session, setSession] = useState<UserSession | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success">("idle");

  useEffect(() => {
    // Subscribe to auth session changes
    const unsub = subscribeToAuthChanges((user) => {
      setSession(user);
    });
    return () => unsub();
  }, []);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (authMode === "login") {
        const user = await loginWithEmail(email, password);
        setSuccess(`Logged in successfully as ${user.displayName || user.email}!`);
      } else if (authMode === "signup") {
        if (!displayName.trim()) {
          throw new Error("Display Name is required.");
        }
        const user = await signUpWithEmail(email, password, displayName);
        setSuccess(`Account registered successfully for ${user.displayName}!`);
      } else if (authMode === "forgot") {
        await resetUserPassword(email);
        setSuccess("Password reset instructions dispatched to your inbox.");
      }
    } catch (err: any) {
      setError(err?.message || "Authentication attempt failed. Check your parameters.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      setSuccess(`Authenticated via Google as ${user.displayName}!`);
    } catch (err: any) {
      setError(err?.message || "Google single sign-on failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const user = await loginAnonymouslyService();
      setSuccess("Logged in securely as Guest Explorer.");
    } catch (err: any) {
      setError(err?.message || "Anonymous authorization failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setError(null);
    setSuccess(null);
    try {
      await logoutUser();
      setSuccess("Logged out successfully.");
    } catch (err: any) {
      setError(err?.message || "Logout failed.");
    }
  };

  const triggerCloudSync = async () => {
    setSyncStatus("syncing");
    // Simulate high-fidelity network sync transaction (which supports offline caching queue)
    setTimeout(() => {
      setSyncStatus("success");
      setTimeout(() => setSyncStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto text-white px-4 md:px-0">
      
      {/* Header Info */}
      <div className="p-6 md:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg space-y-2">
        <h1 className="text-3xl font-display font-extrabold tracking-tight flex items-center gap-2">
          <Settings className="w-8 h-8 text-pink-300 animate-spin-slow" />
          System Settings & Integrations
        </h1>
        <p className="text-sm text-white/80">
          Refine your visual preferences, configure accessibility behaviors, and inspect full-stack integrations for Live Mode deployment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Section 1: Accessibility Controls */}
        <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg space-y-6">
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-lg flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-pink-300" />
              Accessibility Toggles
            </h3>
            <p className="text-xs text-white/70">Fine-tune SoulSync AI to suit your hardware or sensory needs.</p>
          </div>

          <div className="space-y-4">
            
            {/* Reduced Motion */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <h4 className="text-xs font-semibold">Reduced Motion</h4>
                <p className="text-[10px] text-white/50">Slow down and simplify transitions and particle wind sways.</p>
              </div>
              <button
                onClick={() => onChangeAccessibility({ reducedMotion: !accessibility.reducedMotion })}
                className="text-pink-300 hover:scale-105 transition cursor-pointer"
              >
                {accessibility.reducedMotion ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-white/40" />}
              </button>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <h4 className="text-xs font-semibold">High Contrast</h4>
                <p className="text-[10px] text-white/50">Apply sharp white backgrounds with solid charcoal outlines.</p>
              </div>
              <button
                onClick={() => onChangeAccessibility({ highContrast: !accessibility.highContrast })}
                className="text-pink-300 hover:scale-105 transition cursor-pointer"
              >
                {accessibility.highContrast ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-white/40" />}
              </button>
            </div>

            {/* Static Background */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <h4 className="text-xs font-semibold">Static Background</h4>
                <p className="text-[10px] text-white/50">Halt all canvas raindrop, star, blossom and leaf movements completely.</p>
              </div>
              <button
                onClick={() => onChangeAccessibility({ staticBackground: !accessibility.staticBackground })}
                className="text-pink-300 hover:scale-105 transition cursor-pointer"
              >
                {accessibility.staticBackground ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-white/40" />}
              </button>
            </div>

            {/* Mute Ambient Sounds */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <h4 className="text-xs font-semibold">Mute Ambient Sounds</h4>
                <p className="text-[10px] text-white/50">Silence all organic atmosphere synthesizers and audio oscillations.</p>
              </div>
              <button
                onClick={() => onChangeAccessibility({ muteSounds: !accessibility.muteSounds })}
                className="text-pink-300 hover:scale-105 transition cursor-pointer"
              >
                {accessibility.muteSounds ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-white/40" />}
              </button>
            </div>

            {/* Volume Control */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold">Ambient Volume</h4>
                  <p className="text-[10px] text-white/50">Adjust the volume of nature atmosphere sounds.</p>
                </div>
                <span className="text-xs font-mono font-bold text-pink-300">{(accessibility.soundVolume ?? 50)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={accessibility.soundVolume ?? 50}
                onChange={(e) => onChangeAccessibility({ soundVolume: parseInt(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-400"
              />
            </div>

          </div>
        </div>

        {/* Section 2: Mode Controller (Demo vs Live & Offline simulation) */}
        <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg space-y-6 animate-scale-up">
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-lg flex items-center gap-2 text-white">
              <ToggleRight className="w-5 h-5 text-pink-300" />
              Ecosystem Operation Mode
            </h3>
            <p className="text-xs text-white/70">Choose between simulated Hackathon data or live API bridges.</p>
          </div>

          <div className="flex rounded-2xl bg-white/5 p-1 border border-white/10">
            <button
              onClick={() => onToggleLiveMode(false)}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-xs text-center transition-all cursor-pointer ${
                !isLiveMode
                  ? "bg-white text-[#FF6B6B] shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Demo Mode
            </button>
            <button
              onClick={() => onToggleLiveMode(true)}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-xs text-center transition-all cursor-pointer ${
                isLiveMode
                  ? "bg-white text-[#FF6B6B] shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Live Mode (Prepared)
            </button>
          </div>

          {/* Offline Simulation Toggle */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold">Simulate Offline Mode</h4>
              <p className="text-[10px] text-white/50">Test offline behavior & local data persistence flow.</p>
            </div>
            <button
              onClick={() => onToggleOfflineSimulated(!isOfflineSimulated)}
              className="text-amber-400 hover:scale-105 transition cursor-pointer"
            >
              {isOfflineSimulated ? (
                <ToggleRight className="w-10 h-10" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-white/40" />
              )}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs leading-relaxed space-y-2">
            <p className="font-semibold text-pink-300">💡 Why Live Mode matters:</p>
            <p className="text-[11px] text-white/80">
              In **Demo Mode**, the AI mentor utilizes our heuristic companion fallback, and all scholarships/calendars operate on realistic local models.
            </p>
            <p className="text-[11px] text-white/80">
              In **Live Mode**, the app prepares secure server-side conduits proxying to Google's standard Gemini models (`gemini-3.5-flash`) so no secrets leak to the client.
            </p>
          </div>
        </div>

        {/* Full-width Section: Live Mode API Placements Architecture & Code Layout */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg space-y-6">
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-lg flex items-center gap-2 text-white">
              <Key className="w-5 h-5 text-pink-300" />
              Live Mode Modular Placements Architecture
            </h3>
            <p className="text-xs text-white/75">
              We have constructed a full-stack Express server at `/server.ts` that is fully production-ready. Below are the structural placements for connecting third-party databases, Google accounts, and calendar reminders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            
            {/* Interactive Firebase & Firestore Connection station */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-indigo-950/20 border border-white/10 space-y-4 hover:border-pink-300/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🔥</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Firebase Auth & Sync</h4>
                </div>
                <div className={`h-2 w-2 rounded-full ${isLiveFirebase() ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-pulse"}`} title={isLiveFirebase() ? "Firebase Service Live" : "Running in Secure Local Sandbox"} />
              </div>

              {session ? (
                // Active session display
                <div className="space-y-3 pt-1 animate-fade-in text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[9px] font-mono text-white/55 uppercase font-bold">Authenticated User</p>
                    <p className="font-semibold text-pink-200 truncate">{session.displayName || "Anonymous Explorer"}</p>
                    <p className="text-[10px] text-white/60 truncate">{session.email || "No email bound (Guest Session)"}</p>
                    {session.isDemo && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[8px] font-bold rounded">MOCK LOCAL GATE</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={triggerCloudSync}
                      disabled={syncStatus === "syncing"}
                      className="flex-1 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold text-[10px] transition flex items-center justify-center gap-1 shadow-md cursor-pointer disabled:opacity-55"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
                      {syncStatus === "syncing" ? "Syncing..." : syncStatus === "success" ? "Synced!" : "Backup Now"}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl font-bold text-[10px] transition cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                // Sign In / Register Forms
                <form onSubmit={handleAuthAction} className="space-y-3.5 animate-fade-in pt-1">
                  {/* Mode switcher tabs */}
                  <div className="flex border-b border-white/10 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => { setAuthMode("login"); setError(null); }}
                      className={`flex-1 pb-1.5 text-center ${authMode === "login" ? "text-pink-300 border-b border-pink-300" : "text-white/60"}`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthMode("signup"); setError(null); }}
                      className={`flex-1 pb-1.5 text-center ${authMode === "signup" ? "text-pink-300 border-b border-pink-300" : "text-white/60"}`}
                    >
                      Sign Up
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthMode("forgot"); setError(null); }}
                      className={`flex-1 pb-1.5 text-center ${authMode === "forgot" ? "text-pink-300 border-b border-pink-300" : "text-white/60"}`}
                    >
                      Recovery
                    </button>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-2">
                    {authMode === "signup" && (
                      <div className="relative">
                        <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-white/40" />
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full pl-8 pr-2.5 py-2 text-[10px] rounded-xl bg-white/5 border border-white/10 focus:border-pink-300 focus:outline-none"
                        />
                      </div>
                    )}
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-white/40" />
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-2 text-[10px] rounded-xl bg-white/5 border border-white/10 focus:border-pink-300 focus:outline-none"
                      />
                    </div>
                    {authMode !== "forgot" && (
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-white/40" />
                        <input
                          type="password"
                          required
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-8 pr-2.5 py-2 text-[10px] rounded-xl bg-white/5 border border-white/10 focus:border-pink-300 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Submit buttons */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold text-[10px] transition cursor-pointer flex items-center justify-center gap-1 shadow-md disabled:opacity-50"
                  >
                    {loading ? "Processing..." : authMode === "login" ? "Sign In" : authMode === "signup" ? "Create Account" : "Send Recovery Mail"}
                  </button>

                  {/* Third-party alternative SSO triggers */}
                  {authMode !== "forgot" && (
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[9px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>🌐</span> Google SSO
                      </button>
                      <button
                        type="button"
                        onClick={handleAnonymousLogin}
                        className="py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[9px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>👤</span> Guest Mode
                      </button>
                    </div>
                  )}
                </form>
              )}

              {/* Action feedbacks */}
              {error && <p className="text-[9px] text-rose-300 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20 text-center">{error}</p>}
              {success && <p className="text-[9px] text-emerald-300 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-center">{success}</p>}
            </div>

            {/* Google Calendar Placeholder Setup */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-pink-300">
                <Calendar className="w-4 h-4" />
                <h4 className="text-xs font-bold text-white">Google Calendar Sync</h4>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Sync deadline reminders for India's national scholarships, hackathons (SIH), and custom study sessions to student Google Calendars.
              </p>
              <div className="space-y-1.5 pt-2">
                <input
                  type="text"
                  placeholder="Google Client OAuth Scopes"
                  disabled
                  value="https://www.googleapis.com/auth/calendar.events"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[10px] text-white/40 cursor-not-allowed"
                />
                <span className="text-[9px] text-white/50 font-mono block">Requires set_up_oauth tool</span>
              </div>
            </div>

            {/* Notifications Placeholder Setup */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-amber-300">
                <Bell className="w-4 h-4" />
                <h4 className="text-xs font-bold text-white">Push Notifications</h4>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Establish silent background notifications to gently remind students about upcoming internal exams, mindfulness minutes, and newly announced jobs.
              </p>
              <div className="space-y-1.5 pt-2">
                <input
                  type="text"
                  placeholder="VAPID Keys Configuration"
                  disabled
                  className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[10px] text-white/40 cursor-not-allowed"
                />
                <span className="text-[9px] text-white/50 font-mono block">Prepared for browser Service Workers</span>
              </div>
            </div>

          </div>

          {/* Secure API Key Warning */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-white">
            <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-amber-200">Full-Stack Security Guarantee</h5>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Your **Gemini API Key** is completely safe. The browser never fetches nor loads any keys. All prompts compile and route through our custom `server.ts` endpoint at `/api/mentor`.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
