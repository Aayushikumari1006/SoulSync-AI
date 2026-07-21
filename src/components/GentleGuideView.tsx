import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AtmosphereType, StudentProfile, GrowthMission, AccessibilitySettings } from "../types";
import {
  Heart,
  Play,
  Pause,
  Volume2,
  Sparkles,
  Smile,
  CloudRain,
  Flame,
  BookOpen,
  Clock,
  Calendar,
  Check,
  Send,
  Award,
  Feather,
  ArrowRight,
  Compass,
  Zap,
  Info,
  ChevronRight,
  Inbox,
  RefreshCw,
  HelpCircle,
  Activity,
  Coffee,
  Quote,
  CheckCircle2,
  AlertCircle,
  Sunrise,
  Moon,
  Trees,
  CloudSnow,
  Sparkle
} from "lucide-react";

interface GentleGuideViewProps {
  profile: StudentProfile;
  missions: GrowthMission[];
  onToggleMission: (id: string) => void;
  activeAtmosphere: AtmosphereType;
  setActiveAtmosphere: (atmo: AtmosphereType) => void;
  isLiveMode: boolean;
  accessibility: AccessibilitySettings;
  selectedMood: string | null;
  onSelectMood: (mood: string | null) => void;
}

export const GentleGuideView: React.FC<GentleGuideViewProps> = ({
  profile,
  missions,
  onToggleMission,
  activeAtmosphere,
  setActiveAtmosphere,
  isLiveMode,
  accessibility,
  selectedMood,
  onSelectMood: setSelectedMood,
}) => {
  const [activeTab, setActiveTab] = useState<"mentor" | "soulspace" | "futureyou">("mentor");

  // Web Audio Context & Synthesizer Setup
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthSourcesRef = useRef<{ [key: string]: any }>({});

  const initAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const playSoothingChord = (chordType: "calm" | "warm" | "night" | "focus" | "happy") => {
    initAudioCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Clean up older chords if any
    if (synthSourcesRef.current.chordOscs) {
      synthSourcesRef.current.chordOscs.forEach((osc: any) => {
        try { osc.stop(); } catch (e) {}
      });
    }
    synthSourcesRef.current.chordOscs = [];

    let freqs: number[] = [];
    if (chordType === "calm") freqs = [130.81, 164.81, 196.00, 246.94, 293.66]; // Cmaj9
    else if (chordType === "warm") freqs = [174.61, 220.00, 261.63, 329.63]; // Fmaj7
    else if (chordType === "night") freqs = [110.00, 130.81, 164.81, 196.00, 493.88]; // Am9
    else if (chordType === "focus") freqs = [146.83, 174.61, 220.00, 261.63]; // Dm7
    else freqs = [261.63, 329.63, 392.00, 523.25]; // G/C major chords

    const now = ctx.currentTime;
    freqs.forEach((f) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(350, now);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.015, now + 1.2);
      gainNode.gain.setValueAtTime(0.015, now + 4.5);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 7.5);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 8.0);

      synthSourcesRef.current.chordOscs.push(osc);
    });
  };

  const toggleSoundNode = (type: "rain" | "forest" | "waves" | "birds") => {
    initAudioCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (synthSourcesRef.current[type]) {
      try {
        if (Array.isArray(synthSourcesRef.current[type])) {
          synthSourcesRef.current[type].forEach((node: any) => node.stop?.());
        } else {
          synthSourcesRef.current[type].stop?.();
        }
      } catch (e) {}
      synthSourcesRef.current[type] = null;
      return false;
    }

    const now = ctx.currentTime;
    if (type === "rain") {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1000;
      filter.Q.value = 0.8;

      const gain = ctx.createGain();
      gain.gain.value = 0.025;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
      synthSourcesRef.current[type] = source;
    } else if (type === "forest" || type === "waves") {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(type === "forest" ? 75 : 60, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.015, now);

      const lfo = ctx.createOscillator();
      lfo.frequency.value = type === "forest" ? 0.15 : 0.07;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = type === "forest" ? 12 : 0.04;

      lfo.connect(lfoGain);
      if (type === "forest") {
        lfoGain.connect(osc.frequency);
      } else {
        lfoGain.connect(gain.gain);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      lfo.start(now);
      osc.start(now);

      synthSourcesRef.current[type] = [osc, lfo];
    } else if (type === "birds") {
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate;
        data[i] = Math.sin(2 * Math.PI * 1800 * t + Math.sin(2 * Math.PI * 12 * t) * 300) * Math.max(0, 1 - t) * 0.1;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const gain = ctx.createGain();
      gain.gain.value = 0.015;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
      synthSourcesRef.current[type] = source;
    }
    return true;
  };

  useEffect(() => {
    return () => {
      // Clean up sound ref on component destroy
      Object.keys(synthSourcesRef.current).forEach((key) => {
        const val = synthSourcesRef.current[key];
        if (Array.isArray(val)) {
          val.forEach((n) => { try { n.stop(); } catch (e) {} });
        } else if (val && val.stop) {
          try { val.stop(); } catch (e) {}
        }
      });
    };
  }, []);

  // Simple Markdown formatter helper to replace standard ### and lists with elegant structured design blocks
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return (
      <div className="space-y-3 font-sans text-xs md:text-sm text-white/95 leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith("### ")) {
            return (
              <h4 key={idx} className="font-display font-bold text-sm md:text-base text-pink-300 pt-3 border-b border-white/5 pb-1 uppercase tracking-wide">
                {line.replace("### ", "")}
              </h4>
            );
          }
          if (line.startsWith("## ")) {
            return (
              <h3 key={idx} className="font-display font-extrabold text-base md:text-lg text-indigo-300 pt-4">
                {line.replace("## ", "")}
              </h3>
            );
          }
          if (line.startsWith("- ") || line.startsWith("* ")) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-pink-400 shrink-0 mt-1">•</span>
                <span>{line.substring(2)}</span>
              </div>
            );
          }
          if (line.trim() === "") {
            return <div key={idx} className="h-1.5" />;
          }
          return <p key={idx} className="opacity-90">{line}</p>;
        })}
      </div>
    );
  };

  // Helper for actual/fallback AI queries
  const askAIMentor = async (prompt: string, fallbackText: string) => {
    if (isLiveMode) {
      try {
        const response = await fetch("/api/mentor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: prompt,
            context: profile,
            mode: "live",
            missions,
            mood: selectedMood,
          }),
        });
        const data = await response.json();
        return data.text || fallbackText;
      } catch (err) {
        console.error("Live AI Mentor request failed:", err);
        return fallbackText;
      }
    }
    // Simulation delay for realistic companion feel when local
    await new Promise((resolve) => setTimeout(resolve, 800));
    return fallbackText;
  };

  // ==========================================
  // TAB 1: AI LIFE MENTOR STATES & SUB-MODULES
  // ==========================================
  const [mentorTool, setMentorTool] = useState<"decision" | "planner" | "burnout" | "coach" | "friend" | null>(null);
  const [mentorLoading, setMentorLoading] = useState(false);
  const [mentorResponse, setMentorResponse] = useState<string | null>(null);

  // Card 1: Decision Studio
  const [decisionChoice, setDecisionChoice] = useState<string | null>(null);
  const [decisionStep, setDecisionStep] = useState<number>(0);
  const [decisionAnswers, setDecisionAnswers] = useState<string[]>([]);
  const decisionOptions = [
    "Learn DSA",
    "Build Projects",
    "Prepare GATE",
    "Higher Studies",
    "Internship",
    "Freelancing",
    "Open Source",
    "Competitive Programming"
  ];
  const decisionQuestions = [
    {
      q: "What is your primary academic goal this semester?",
      opts: ["Land placements quickly", "In-depth specialization & research", "Balance gpa and mental peace"]
    },
    {
      q: "How many hours per week can you strictly protect?",
      opts: ["Less than 5 hours", "10 to 15 hours", "More than 20 hours"]
    },
    {
      q: "What is your current progress in this area?",
      opts: ["Absolute Beginner", "Intermediate", "Fluent/Expert"]
    }
  ];

  const handleStartDecision = (choice: string) => {
    setDecisionChoice(choice);
    setDecisionStep(0);
    setDecisionAnswers([]);
    setMentorResponse(null);
  };

  const handleAnswerDecision = async (answer: string) => {
    const nextAnswers = [...decisionAnswers, answer];
    setDecisionAnswers(nextAnswers);
    if (decisionStep < decisionQuestions.length - 1) {
      setDecisionStep(decisionStep + 1);
    } else {
      // Completed all questions, generate advice
      setMentorLoading(true);
      const prompt = `Student Ayush wants to solve decision: "${decisionChoice}".
Answers to questions:
1. ${decisionQuestions[0].q} -> ${nextAnswers[0]}
2. ${decisionQuestions[1].q} -> ${nextAnswers[1]}
3. ${decisionQuestions[2].q} -> ${nextAnswers[2]}

Provide a highly customized comparison and roadmap.
Include strictly these exact headings in markdown:
### Comparison
### Pros
### Cons
### Career Impact
### Time Required
### Recommendation
### Reasoning
### Next 3 Steps
### DreamPath Impact
### Opportunity Impact`;

      const fallback = `### Comparison
Comparing your interest in **${decisionChoice}** against current academic priorities. At your semester, balancing labs with technical milestones is critical.

### Pros
- Direct boost to your analytical confidence.
- Solidifies core CS parameters.
- Creates excellent talking points for resumes.

### Cons
- Demands active time blocks (approx ${nextAnswers[1]}).
- Could briefly compete with mid-term labs if not carefully structured.

### Career Impact
Highly positive. Leads to expert-level readiness for roles like AI Engineer, matching your DreamPath perfectly.

### Time Required
Requires dedicated ${nextAnswers[1]} weekly for a compound return of high-quality code.

### Recommendation
Adopt a structured dual-track: dedicate your peak brain epochs to **${decisionChoice}**, while utilizing off-peak hours for standard semester submissions.

### Reasoning
Since your priority is "${nextAnswers[0]}" and your current skill standing is "${nextAnswers[2]}", a direct system demonstration is far superior to rote memorization.

### Next 3 Steps
1. Set up a dedicated local git repository and map out weekly deliverables.
2. Formulate a 1-page design specifications draft to guide execution.
3. Dedicate 1.5 hours of your Sunday quiet block to solve the initial structural bottleneck.

### DreamPath Impact
Directly feeds into your DreamPath milestone pipeline, increasing readiness scores by up to 14%.

### Opportunity Impact
Drastically improves eligibility for national hackathons and off-campus internships like Google STEP by August 30.`;

      const result = await askAIMentor(prompt, fallback);
      setMentorResponse(result);
      setMentorLoading(false);
    }
  };

  // Card 2: Study Planner AI
  const [studyHours, setStudyHours] = useState<string>("4 Hours");
  const [studyEnergy, setStudyEnergy] = useState<string>("Medium");
  const [studyUrgency, setStudyUrgency] = useState<string>("Normal");
  const [plannerChecked, setPlannerChecked] = useState<{ [key: string]: boolean }>({});

  const handleGenerateStudyPlan = async () => {
    setMentorLoading(true);
    const prompt = `Generate a fully functional personalized today's Study Plan.
Available Hours: ${studyHours}
Energy Level: ${studyEnergy}
Urgency Level: ${studyUrgency}

Provide headings for:
- Today's Study Plan
- Breaks
- Subjects (referencing Python/ML)
- Assignments
- Projects (Devanagari OCR optimization)
- Revision
- Me Time`;

    const fallback = `### Today's Study Plan (${studyHours} - Energy: ${studyEnergy})
A customized high-yield schedule engineered to prevent fatigue and maximize retention.

### Scheduled Subjects & Topics
- **Core Algorithms (Python)**: Practice tree traversal and recursion complexities (45 mins).
- **Machine Learning Mechanics**: Revise tensor convolutions for your Handwriting OCR engine (45 mins).

### Breaks
- **Detox Breaks**: 10-minute visual rest away from all glowing screens after each 50-minute work epoch.

### Projects & Assignments
- **OCR optimization**: Clean up OpenCV noise filtration functions (30 mins).
- **DBMS homework**: Review database indexing normal forms (30 mins).

### Revision
- **Active Recall**: 15 minutes reviewing yesterday's B-Tree notes.

### Me Time
- **Mind Rest**: Close the IDE at 9 PM and enjoy our Forest Walk drone.`;

    const result = await askAIMentor(prompt, fallback);
    setMentorResponse(result);
    setMentorLoading(false);
    // Reset checks
    setPlannerChecked({});
  };

  // Card 3: Burnout Recovery
  const [burnoutState, setBurnoutState] = useState<string | null>(null);
  const burnoutStates = ["Very Tired", "Stressed", "Mentally Exhausted", "Unmotivated"];

  const handleBurnoutRecovery = async (state: string) => {
    setBurnoutState(state);
    setMentorLoading(true);
    const prompt = `Create an intensive Burnout Recovery Plan for student Ayush who feels "${state}".
Provide exactly:
- Recovery Plan
- Reduced Workload
- Breathing exercise guidance
- Reflection
- Tomorrow's Restart Plan`;

    const fallback = `### Recovery Plan (${state})
Your neural CPU is overloaded, Ayush. Continuing to force code compilation right now will only write buggy scripts and increase academic stress. We are initiating a complete soft restart.

### Reduced Workload
- **Drop the grind**: Postpone all non-essential competitive programming tasks for 24 hours.
- **Micro-tasks**: If you must work, only complete a single, 10-minute documentation file.

### Breathing & Sensory Reset
- Set our environment tab to **🌧 Rain**.
- Run a 3-minute slow abdominal breathing session (Inhale 4s, Hold 4s, Exhale 6s) to clip the anxiety spikes.

### Reflection
Take a quiet minute to ask yourself: *"Am I racing against an imaginary clock? Code is a long craft, not a sprint."*

### Tomorrow's Restart Plan
- **Morning alignment**: Do not touch your phone for the first 30 minutes after waking.
- **Gentle momentum**: Start with a single clean binary search code block, then raise your learning rate gradually.`;

    const result = await askAIMentor(prompt, fallback);
    setMentorResponse(result);
    setMentorLoading(false);
  };

  // Card 4: Career Coach
  const [careerTrack, setCareerTrack] = useState<string | null>(null);
  const careerTracks = ["Placement", "Research", "Startup", "Higher Studies", "Government Jobs", "Freelancing"];

  const handleCareerCoach = async (track: string) => {
    setCareerTrack(track);
    setMentorLoading(true);
    const prompt = `Explain a Career Coach roadmap for a B.Tech CSE (AI & ML) student tracking: "${track}".
Provide exactly:
- Roadmap
- Skills required
- Projects recommended
- Expected Timeline
- Recommended Opportunities
- DreamPath Updates`;

    const fallback = `### Career Roadmap: ${track}
A detailed national roadmap mapping directly to your AI Engineer goals and interests in language models.

### Recommended Skills
- **Deep Architecture**: PyTorch optimization, TensorFlow on Edge, OpenCV.
- **System Design**: REST APIs, Database design, structured Model Serving.

### Projects to Build
- **Hyper-Local NLP OCR**: An offline handwritten Indic script interpreter (like Devanagari OCR).
- **Model Quantization Engine**: Compressing neural networks to run on micro mobile GPUs.

### Expected Timeline
- **Next 3 Months**: Solidify edge network deployment.
- **6-12 Months**: Publish a clean open-source documentation package.

### Recommended Opportunities
- Google STEP Internship (deadline August 30).
- Smart India Hackathon 2026 (₹1,00,000 prize pool).

### DreamPath Updates
We have synchronized this track with your active DreamPath pipeline, increasing your research readiness metric dynamically.`;

    const result = await askAIMentor(prompt, fallback);
    setMentorResponse(result);
    setMentorLoading(false);
  };

  // Card 5: Talk to a Friend
  const [friendMode, setFriendMode] = useState<string | null>(null);
  const friendModes = [
    { mode: "I failed today", emoji: "💔" },
    { mode: "I feel lost", emoji: "🧭" },
    { mode: "I'm scared", emoji: "😰" },
    { mode: "I procrastinated", emoji: "⏰" },
    { mode: "I don't know what to do", emoji: "🤷" }
  ];

  const handleTalkToFriend = async (mode: string) => {
    setFriendMode(mode);
    setMentorLoading(true);
    const prompt = `The student says: "${mode}".
Respond like a warm, supportive senior or elder sibling. Keep the message short (under 4-5 sentences), extremely natural, Empathetic, and personal. Never write essays.`;

    const fallback = `Hey Ayush. I hear you. We all have days where the compiler fails and our mental threads feel completely tangled. Remember that growth isn't a linear chart; it's a series of iterations, with plenty of noisy epochs. Don't beat yourself up for procrastinating or feeling lost. Just take one single deep breath, step away from the IDE, and let's restart with a clean console tomorrow. I'm right here with you.`;

    const result = await askAIMentor(prompt, fallback);
    setMentorResponse(result);
    setMentorLoading(false);
  };

  // ==========================================
  // TAB 2: SOULSPACE STATES & SUB-MODULES
  // ==========================================
  const moods = [
    { label: "😊 Happy", atmosphere: "morning" as const, chord: "happy" as const, desc: "Soft warm morning rays and light chimes." },
    { label: "😌 Peaceful", atmosphere: "lake" as const, chord: "calm" as const, desc: "Gentle lake water lap and mountain reflection." },
    { label: "😔 Sad", atmosphere: "rain" as const, chord: "night" as const, desc: "Falling rain drops and deep twilight drone." },
    { label: "😟 Anxious", atmosphere: "sunset" as const, chord: "focus" as const, desc: "Warm golden rays and relaxing frequency drone." },
    { label: "😴 Tired", atmosphere: "snow" as const, chord: "calm" as const, desc: "Crisp white snow layers and crackling fireplace wind." },
    { label: "🤯 Overwhelmed", atmosphere: "night" as const, chord: "night" as const, desc: "Cozy crickets, stars, and dark sensory garden." }
  ];

  const handleSelectMood = (moodLabel: string) => {
    const item = moods.find(m => m.label === moodLabel);
    if (item) {
      setSelectedMood(moodLabel);
      // Immediately transform Atmosphere
      setActiveAtmosphere(item.atmosphere);
      // Immediately play music chord
      playSoothingChord(item.chord);
    }
  };

  // Nature Walk selections
  const walks = [
    { name: "Forest", atmo: "forest" as const, color: "bg-emerald-950/40 border-emerald-500/20", icon: "🌲" },
    { name: "Mountains", atmo: "morning" as const, color: "bg-amber-950/40 border-amber-500/20", icon: "🏔" },
    { name: "Lake", atmo: "lake" as const, color: "bg-sky-950/40 border-sky-500/20", icon: "🏞" },
    { name: "Rain", atmo: "rain" as const, color: "bg-blue-950/40 border-blue-500/20", icon: "🌧" },
    { name: "Snow", atmo: "snow" as const, color: "bg-slate-900/40 border-slate-500/20", icon: "❄" },
    { name: "Sunset", atmo: "sunset" as const, color: "bg-rose-950/40 border-rose-500/20", icon: "🌅" },
    { name: "Night", atmo: "night" as const, color: "bg-purple-950/40 border-purple-500/20", icon: "🌙" },
    { name: "Ocean", atmo: "spring" as const, color: "bg-cyan-950/40 border-cyan-500/20", icon: "🌊" }
  ];

  const handleSelectWalk = (walkName: string, atmo: AtmosphereType) => {
    setActiveAtmosphere(atmo);
    playSoothingChord("calm");
    // Trigger sound mix automatically
    if (atmo === "rain") toggleSoundNode("rain");
    if (atmo === "forest") toggleSoundNode("forest");
    if (atmo === "spring") toggleSoundNode("waves");
  };

  // Breathing Box Logic
  const [breathingPhase, setBreathingPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [breathingTimer, setBreathingTimer] = useState<number>(4);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathingLogs, setBreathingLogs] = useState<string[]>([]);

  useEffect(() => {
    let timer: number;
    if (isBreathingActive) {
      timer = window.setInterval(() => {
        setBreathingTimer((prev) => {
          if (prev <= 1) {
            setBreathingPhase((curr) => {
              if (curr === "Inhale") {
                setBreathingLogs((l) => ["Drew in pure fresh energy 🌸", ...l].slice(0, 3));
                return "Hold";
              }
              if (curr === "Hold") {
                setBreathingLogs((l) => ["Let the quietness settle 🧘", ...l].slice(0, 3));
                return "Exhale";
              }
              setBreathingLogs((l) => ["Released academic anxiety 🍃", ...l].slice(0, 3));
              return "Inhale";
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive]);

  // Reflection Journal
  const journalQuestions = [
    "What made today meaningful?",
    "What challenged you today?",
    "What are you grateful for?"
  ];
  const [journalIdx, setJournalIdx] = useState(0);
  const [journalInput, setJournalInput] = useState("");
  const [journalTags, setJournalTags] = useState<string[]>([]);
  const [journalSummary, setJournalSummary] = useState<string | null>(null);
  const [journalLoading, setJournalLoading] = useState(false);

  const handleJournalSubmit = async () => {
    setJournalLoading(true);
    const question = journalQuestions[journalIdx];
    const tagsText = journalTags.join(", ");
    const prompt = `The student is answering their daily Reflection Journal.
Question: "${question}"
Student text: "${journalInput}"
Quick Tags selected: [${tagsText}]

Summarize their reflection and provide an encouraging, highly grounding response. Refer directly to Ayush and their semester path.`;

    const fallback = `### Reflection Saved & Quantified
Thank you for journaling tonight, Ayush.

You reflected on: *"${journalInput}"* with parameters: **${tagsText || "Quiet reflection"}**.

Your senior AI Mentor has compiled this into your SoulPrint database. Acknowledging these moments actively resets your neural fatigue and helps you transition from stressful mid-term deadlines to creative restful states. Sleep deeply tonight.`;

    const result = await askAIMentor(prompt, fallback);
    setJournalSummary(result);
    setJournalLoading(false);
  };

  const handleToggleJournalTag = (tag: string) => {
    setJournalTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Mind Reset
  const [resetDuration, setResetDuration] = useState<string | null>(null);
  const [resetResult, setResetResult] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  const handleMindReset = async (duration: string) => {
    setResetDuration(duration);
    setResetLoading(true);
    const prompt = `Generate a ${duration} Mind Reset module for student Ayush.
Current mood is: ${selectedMood || "Busy"}.
Provide customized elements:
- Tiny walk guide
- Relaxing Music choice
- Deep Reflection question
- Calming Quotes
- Guided Relaxation step`;

    const fallback = `### ${duration} Mind Reset Program
A rapid cognitive reset designed to lower your mental heart rate.

### Tiny Walk Guide
- **Balcony Breathe**: Step to the nearest window or balcony for 90 seconds. Look at the farthest tree or skyline to release your focal vision strain.

### Restorative Sound Recommendation
- **Lofi Synth Chord**: Trigger our **Cmaj9 (Calm)** chord to play a slow decaying triangle drone in the background.

### Deep Reflection Question
- *"If you couldn't fail, what single project module would you compile tomorrow?"*

### Calming Quote
- *"Nature does not hurry, yet everything is accomplished."* — Lao Tzu

### Guided Relaxation
- Unclench your jaw, drop your shoulders away from your ears, and run exactly two cycles of our Box Breathing bubble below.`;

    const result = await askAIMentor(prompt, fallback);
    setResetResult(result);
    setResetLoading(false);
  };


  // ==========================================
  // TAB 3: FUTURE YOU STATES & SUB-MODULES
  // ==========================================
  const [letterDuration, setLetterDuration] = useState<string | null>(null);
  const [letterResult, setLetterResult] = useState<string | null>(null);
  const [letterLoading, setLetterLoading] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  const handleGenerateLetter = async (duration: string) => {
    setLetterDuration(duration);
    setLetterOpen(false);
    setLetterLoading(true);

    const completedMissions = missions.filter(m => m.completed);
    const activeProjects = profile.projects.map(p => p.name).join(" & ");

    const prompt = `Generate a letter from the "Future You" in ${duration}, addressing student Ayush at ${profile.college}.
Actual progress details:
- Completed ${completedMissions.length} active milestones.
- Currently optimizing these real projects: ${activeProjects}.
- Verified Expert skills: Python, Data Structures.

Keep the letter extremely empathetic, referencing these exact metrics. Do not fabricate milestones.`;

    const fallback = `Dear Ayush,

I am writing to you from exactly ${duration} in the future. 

Right now, I remember you sitting at your desk in IIT Delhi, staring at your "${profile.projects[0]?.name || "Devanagari OCR"}" scripts, wondering if your 16 weekly hours were enough to build something that mattered. You were carrying the stress of the Smart India Hackathon registrations and wondering if Google STEP would notice your resume.

I want you to know: every single quiet late-night epoch you spent practicing Data Structures and training convolved tensors was registered. Because you didn't fabricate your statistics and took those essential micro-pauses, your skills compound beautifully. 

You built "${profile.projects[1]?.name || "IndicOCR"}" with actual working pipelines, and that direct research focus paid off. The Google STEP team saw the physical code depth behind your portfolio, not just empty acronyms.

Relax your chest. Keep iterating. The compile logs are already green on this side.

With absolute trust,
Your Future Self`;

    const result = await askAIMentor(prompt, fallback);
    setLetterResult(result);
    setLetterLoading(false);
    setLetterOpen(true);
  };

  // Future Vision Board
  const [visionBoard, setVisionBoard] = useState<string | null>(null);
  const [visionLoading, setVisionLoading] = useState(false);

  const handleGenerateFutureVision = async () => {
    setVisionLoading(true);
    const completedProjectsCount = profile.projects.length;
    const prompt = `Generate a text-based "Future Vision Board" for student Ayush.
Use only actual completed projects (${completedProjectsCount}) and existing metrics on his DreamPath.
Provide headings for:
- Dream Office environment
- Career trajectory (targeting ${profile.dreamCompany})
- Lifestyle design
- Verified Achievements
- Future Daily Routine`;

    const fallback = `### Your Future Vision Board
A reality synthesized directly from your verified engineering milestones.

### Dream Office
- **Google Research India, Bangalore**: A high-ceilinged collaboration space with local language models training on quiet server arrays, framed by lush botanical gardens. A hot cup of ginger tea rests next to your workstation.

### Career Trajectory
- **AI Research Associate**: Developing low-power localized edge-transformers for Indian dialect transcription, directly matching your core IndicOCR research milestones.

### Lifestyle Design
- **High-Symmetry Balance**: Staggered workdays prioritizing cognitive wellness. Protecting 2 hours daily for open-source mentoring of young coders from Tier-2 colleges.

### Verified Achievements
- **Completed Projects**: ${profile.projects.map(p => p.name).join(" and ")}.
- **Core Skill Rank**: Expert Python Algorithms & Edge ML quantization.

### Future Daily Routine
- **08:30 AM**: 15 minutes of quiet reflection in nature.
- **10:00 AM**: Deep architecture design.
- **04:00 PM**: Collaborative code review with global engineering leaders.`;

    const result = await askAIMentor(prompt, fallback);
    setVisionBoard(result);
    setVisionLoading(false);
  };

  // Celebrate Yourself
  const [celebrationResult, setCelebrationResult] = useState<string | null>(null);
  const [celebrationLoading, setCelebrationLoading] = useState(false);

  const handleCelebrateYourself = async () => {
    setCelebrationLoading(true);
    const completedMissions = missions.filter(m => m.completed);
    const prompt = `Generate a "Self-Celebration Certificate" for Ayush highlighting:
- Completed Projects: ${profile.projects.map(p => p.name).join(", ")}
- Verified Skills Improved
- Growth & Consistency metrics
- Forest Evolution status (3 fully grown trees)
- Horizontal Journey Timeline from 1st Sem to present`;

    const fallback = `### 🌟 Your Technical Celebration Scroll
Ayush, let's step away from the bug tracker for 2 minutes to review what you have built with actual, empirical effort.

### 🛠 Completed Project Pipelines
1. **${profile.projects[0]?.name || "Generative Optimization"}**: Latency reduction model.
2. **${profile.projects[1]?.name || "Devanagari OCR Engine"}**: OpenCV-based Indic script recognizer.

### 📈 Verified Skill Growth
- **Data Structures**: Certified "Expert" progress.
- **Python**: 95% algorithm confidence rating.
- **Machine Learning**: 68% progress and scaling.

### 🌳 Forest Evolution
- You have nurtured **3 saplings into Ancient Oak trees** in our Living Progress garden, sequestering cognitive anxiety and recording real focus hours.

### 🗺 Journey Timeline
- **Semester 1**: Learned core syntax and basic loops.
- **Semester 2**: Built your first localized TensorFlow model.
- **Semester 3 (Present)**: Leading SIH 2026 teams and preparing STEP internship resumes.`;

    const result = await askAIMentor(prompt, fallback);
    setCelebrationResult(result);
    setCelebrationLoading(false);
  };

  // Memory Album Polaroid Cards
  const milestoneCards = [
    { title: "Project Completion", desc: "Successfully compiled localized Devanagari OCR models with OpenCV noise filters.", date: "July 2026", color: "from-rose-500/10 to-pink-500/10 border-pink-500/20", tag: "IndiOCR" },
    { title: "Scholarship Milestone", desc: "Submitted Reliance Scholarship proposal targeting AI healthcare models.", date: "June 2026", color: "from-indigo-500/10 to-purple-500/10 border-purple-500/20", tag: "Scholar" },
    { title: "Internship Milestone", desc: "Polished resumes and highlights for Google STEP off-campus round.", date: "May 2026", color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20", tag: "Google STEP" },
    { title: "Hackathon Draft", desc: "Drafted SIH 2026 problem statement proposal for low-power hospital OCR.", date: "April 2026", color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20", tag: "SIH 2026" },
    { title: "Semester Victory", desc: "Entered current semester with verified Expert algorithms score.", date: "March 2026", color: "from-amber-500/10 to-orange-500/10 border-orange-500/20", tag: "Algorithms" }
  ];
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);


  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-4 md:py-8 text-white relative z-10" id="soulguide-companion">
      
      {/* 1. COMPANION GLASS HEADER */}
      <div className="p-6 md:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden" id="soulguide-header">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-400">
              <Heart className="w-5 h-5 fill-pink-400/20 animate-pulse" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-pink-300 uppercase">
              Intelligent Companion
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-white">
            SoulGuide AI
          </h1>
          <p className="text-xs md:text-sm text-white/60 max-w-xl leading-relaxed">
            Your supportive emotional & career sanctuary. Every tool triggers context-aware AI models tailored to your actual university goals, projects, and milestones.
          </p>
        </div>
        
        {/* Dynamic Context Pill Badges */}
        <div className="flex flex-wrap gap-2 items-center relative z-10 shrink-0">
          <div className="px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            <span className="text-white/80 font-mono text-[11px]">{profile.semester}</span>
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-white/80 font-mono text-[11px]">{profile.careerGoal}</span>
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center gap-1.5 text-xs text-pink-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-semibold text-[11px]">SoulPrint Sync</span>
          </div>
        </div>
      </div>

      {/* 2. THREE CORE COMPANION TABS */}
      <div className="flex p-1.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/15 max-w-lg mx-auto" id="soulguide-tabs">
        <button
          onClick={() => { setActiveTab("mentor"); }}
          className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
            activeTab === "mentor"
              ? "bg-[#FF6B6B] text-white shadow-md scale-[1.02]"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>🤝 AI Life Mentor</span>
        </button>
        <button
          onClick={() => { setActiveTab("soulspace"); }}
          className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
            activeTab === "soulspace"
              ? "bg-[#FF6B6B] text-white shadow-md scale-[1.02]"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Trees className="w-4 h-4" />
          <span>🌿 SoulSpace</span>
        </button>
        <button
          onClick={() => { setActiveTab("futureyou"); }}
          className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
            activeTab === "futureyou"
              ? "bg-[#FF6B6B] text-white shadow-md scale-[1.02]"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Feather className="w-4 h-4" />
          <span>💌 Future You</span>
        </button>
      </div>

      {/* 3. ACTIVE TAB CONTENTS */}
      <AnimatePresence mode="wait">
        
        {/* ========================================================
            TAB 1: AI LIFE MENTOR (INDEPENDENT GUIDED COMPANION)
            ======================================================== */}
        {activeTab === "mentor" && (
          <motion.div
            key="mentor-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Action cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { id: "decision" as const, title: "⚖ Decision Studio", desc: "Resolve deep study trade-offs.", color: "from-pink-500/10 to-rose-500/10 border-pink-500/20" },
                { id: "planner" as const, title: "📅 Study Planner AI", desc: "Quantified personalized schedules.", color: "from-indigo-500/10 to-violet-500/10 border-indigo-500/20" },
                { id: "burnout" as const, title: "🔥 Burnout Recovery", desc: "Complete neural soft restart plans.", color: "from-amber-500/10 to-orange-500/10 border-orange-500/20" },
                { id: "coach" as const, title: "🎯 Career Coach", desc: "Personalized national roadmaps.", color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20" },
                { id: "friend" as const, title: "🤝 Talk to a Friend", desc: "Empathetic, quick natural chats.", color: "from-cyan-500/10 to-blue-500/10 border-cyan-500/20" }
              ].map((card) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setMentorTool(card.id);
                    setMentorResponse(null);
                    setDecisionChoice(null);
                    setBurnoutState(null);
                    setCareerTrack(null);
                    setFriendMode(null);
                  }}
                  className={`p-4 rounded-2xl border text-left bg-gradient-to-tr transition-all duration-300 hover:scale-[1.03] cursor-pointer flex flex-col justify-between h-36 ${
                    mentorTool === card.id
                      ? "bg-white/15 border-white shadow-xl ring-2 ring-white/10"
                      : `${card.color} bg-white/5 hover:border-white/15`
                  }`}
                >
                  <span className="text-xs font-mono font-extrabold tracking-widest text-white/50 uppercase">
                    TOOL
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-sm md:text-base text-white">{card.title}</h3>
                    <p className="text-[11px] text-white/60 leading-tight">{card.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Dynamic Interactive Workspace based on selected mentorTool */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Workspace Sidebar Inputs */}
              <div className="lg:col-span-4 p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4 shadow-lg min-h-[300px]">
                <h3 className="font-display font-bold text-base flex items-center gap-2">
                  <Activity className="w-5 h-5 text-pink-400" />
                  <span>Guided Parameters</span>
                </h3>
                
                {/* TOOL: DECISION STUDIO */}
                {mentorTool === "decision" && (
                  <div className="space-y-4">
                    <p className="text-xs text-white/60">
                      Select a university trade-off dilemma to resolve using customized parameters.
                    </p>
                    {!decisionChoice ? (
                      <div className="grid grid-cols-1 gap-2 max-h-[320px] overflow-y-auto pr-1">
                        {decisionOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleStartDecision(opt)}
                            className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 text-xs hover:border-pink-300/30 transition cursor-pointer flex items-center justify-between"
                          >
                            <span>Should I {opt}?</span>
                            <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-xs font-extrabold text-pink-300">Decision: {decisionChoice}</span>
                          <button onClick={() => setDecisionChoice(null)} className="text-[10px] text-white/40 hover:text-white underline">Reset</button>
                        </div>
                        <div className="space-y-3">
                          <span className="text-[10px] font-mono font-bold uppercase text-indigo-300 block">
                            Question {decisionStep + 1} of {decisionQuestions.length}
                          </span>
                          <p className="text-xs font-semibold">{decisionQuestions[decisionStep].q}</p>
                          <div className="space-y-2 pt-1">
                            {decisionQuestions[decisionStep].opts.map((o) => (
                              <button
                                key={o}
                                onClick={() => handleAnswerDecision(o)}
                                className="w-full text-left p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs hover:bg-pink-500/25 text-white transition cursor-pointer"
                              >
                                {o}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL: STUDY PLANNER AI */}
                {mentorTool === "planner" && (
                  <div className="space-y-4">
                    <p className="text-xs text-white/60">
                      Structure today's hours dynamically based on current fatigue and workload limits.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-indigo-300 block mb-1">Available Hours</label>
                        <select
                          value={studyHours}
                          onChange={(e) => setStudyHours(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        >
                          <option value="2 Hours">2 Hours (Sprint)</option>
                          <option value="4 Hours">4 Hours (Balanced)</option>
                          <option value="6 Hours">6 Hours (Deep Block)</option>
                          <option value="8 Hours">8 Hours (Extreme Prep)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-indigo-300 block mb-1">Energy Level</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {["Exhausted", "Medium", "High"].map((lvl) => (
                            <button
                              key={lvl}
                              onClick={() => setStudyEnergy(lvl)}
                              className={`py-1.5 rounded-xl text-xs transition cursor-pointer border ${
                                studyEnergy === lvl ? "bg-indigo-500/20 border-indigo-500" : "bg-white/5 border-transparent"
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-indigo-300 block mb-1">Syllabus Urgency</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {["Chill", "Normal", "Extreme"].map((urg) => (
                            <button
                              key={urg}
                              onClick={() => setStudyUrgency(urg)}
                              className={`py-1.5 rounded-xl text-xs transition cursor-pointer border ${
                                studyUrgency === urg ? "bg-pink-500/20 border-pink-500" : "bg-white/5 border-transparent"
                              }`}
                            >
                              {urg}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={handleGenerateStudyPlan}
                        className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 transition font-bold text-xs cursor-pointer shadow-lg"
                      >
                        Generate Study Plan
                      </button>
                    </div>
                  </div>
                )}

                {/* TOOL: BURNOUT RECOVERY */}
                {mentorTool === "burnout" && (
                  <div className="space-y-4">
                    <p className="text-xs text-white/60">
                      When cognitive limits are reached, trigger a slow, supportive micro restart plan.
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {burnoutStates.map((st) => (
                        <button
                          key={st}
                          onClick={() => handleBurnoutRecovery(st)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${
                            burnoutState === st
                              ? "bg-amber-500/20 border-amber-500 text-white font-bold"
                              : "bg-white/5 border-white/5 hover:border-white/10"
                          }`}
                        >
                          <span>I feel {st}</span>
                          <span className="text-amber-400">🔥</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* TOOL: CAREER COACH */}
                {mentorTool === "coach" && (
                  <div className="space-y-4">
                    <p className="text-xs text-white/60">
                      Select your target post-university track to generate roadmaps synced with your skills.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {careerTracks.map((track) => (
                        <button
                          key={track}
                          onClick={() => handleCareerCoach(track)}
                          className={`p-3 rounded-xl border text-xs transition cursor-pointer text-center flex flex-col justify-center items-center gap-1 ${
                            careerTrack === track
                              ? "bg-emerald-500/20 border-emerald-500 text-white font-bold"
                              : "bg-white/5 border-white/5 hover:border-white/10"
                          }`}
                        >
                          <span className="text-lg">🎯</span>
                          <span>{track}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* TOOL: TALK TO A FRIEND */}
                {mentorTool === "friend" && (
                  <div className="space-y-4">
                    <p className="text-xs text-white/60">
                      Zero chatbot essays. Pick a direct mode below to receive a short, warm supportive message.
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {friendModes.map((fm) => (
                        <button
                          key={fm.mode}
                          onClick={() => handleTalkToFriend(fm.mode)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer flex items-center gap-2.5 ${
                            friendMode === fm.mode
                              ? "bg-cyan-500/20 border-cyan-500 text-white font-bold"
                              : "bg-white/5 border-white/5 hover:border-white/10"
                          }`}
                        >
                          <span>{fm.emoji}</span>
                          <span>{fm.mode}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!mentorTool && (
                  <div className="p-4 text-center text-white/40 text-xs">
                    Select any tool card above to activate your custom guided workspace inputs.
                  </div>
                )}
              </div>

              {/* Workspace Content Output Panel */}
              <div className="lg:col-span-8 p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg min-h-[300px]">
                {mentorLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
                      <Sparkles className="w-5 h-5 text-pink-400 absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <p className="text-xs text-white/50 animate-pulse">Running server-side SoulPrint companion models...</p>
                  </div>
                ) : mentorResponse ? (
                  <div className="space-y-4 animate-scale-up">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="text-xs font-mono tracking-wider bg-pink-500/20 px-2.5 py-0.5 rounded-full text-pink-300 font-bold uppercase">
                        AI Companion Response
                      </span>
                      <button
                        onClick={() => { setMentorResponse(null); }}
                        className="text-xs text-white/40 hover:text-white flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Clear</span>
                      </button>
                    </div>

                    {/* Styled Markdown parser display */}
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-4 max-h-[450px] overflow-y-auto">
                      {renderMarkdown(mentorResponse)}
                    </div>
                    
                    {mentorTool === "planner" && (
                      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                        <span className="text-[10px] font-mono uppercase text-indigo-300 font-bold block">Interactive Checklist</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {["Practice tree recursion", "Convolved OCR tensors check", "OpenCV noise code", "Active recall revision"].map((item) => (
                            <label key={item} className="flex items-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!plannerChecked[item]}
                                onChange={() => setPlannerChecked(prev => ({ ...prev, [item]: !prev[item] }))}
                                className="rounded text-pink-500 bg-black/20 border-white/10 focus:ring-0"
                              />
                              <span className={plannerChecked[item] ? "line-through text-white/40" : "text-white/85"}>{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 border border-white/10 flex items-center justify-center text-2xl text-white/50 shadow-inner">
                      🧭
                    </div>
                    <div className="space-y-1 max-w-sm">
                      <h4 className="font-display font-extrabold text-base">Workspace Console</h4>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Configure your target parameters in the sidebar to run custom localized companion models. No empty chat blocks.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}

        {/* ========================================================
            TAB 2: SOULSPACE (COMPLETELY REDESIGNED & TRANSFORMS)
            ======================================================== */}
        {activeTab === "soulspace" && (
          <motion.div
            key="soulspace-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Sidebar: Mood, Nature Walk Selection, Mind Reset */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Section 1: Mood Selection */}
                <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4 shadow-lg">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full font-bold">
                      Adaptive Healing
                    </span>
                    <h3 className="font-display font-bold text-base flex items-center gap-1.5">
                      <Smile className="w-5 h-5 text-pink-300" />
                      Select Your Mood
                    </h3>
                    <p className="text-xs text-white/60">
                      Selecting immediately transforms the atmosphere, ambient drone, lighting and guides.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {moods.map((m) => (
                      <button
                        key={m.label}
                        onClick={() => handleSelectMood(m.label)}
                        className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 cursor-pointer ${
                          selectedMood === m.label
                            ? "bg-pink-500 border-pink-400 text-white shadow-lg scale-[1.02]"
                            : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/10"
                        }`}
                      >
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>

                  {selectedMood && (
                    <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs space-y-1 animate-scale-up">
                      <span className="font-bold text-[9px] font-mono text-pink-300 uppercase block">Companion Insights</span>
                      <p className="text-white/80 italic">"{moods.find(m => m.label === selectedMood)?.desc}"</p>
                    </div>
                  )}
                </div>

                {/* Section 2: Nature Walk */}
                <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4 shadow-lg">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-base flex items-center gap-1.5">
                      <Trees className="w-5 h-5 text-emerald-300" />
                      Nature Walk
                    </h3>
                    <p className="text-xs text-white/60">
                      Transform your entire study station. Trigger animated weather and organic sounds.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {walks.map((w) => (
                      <button
                        key={w.name}
                        onClick={() => handleSelectWalk(w.name, w.atmo)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
                          activeAtmosphere === w.atmo
                            ? "bg-white/15 border-white text-white shadow"
                            : `${w.color} hover:bg-white/5`
                        }`}
                      >
                        <span>{w.icon}</span>
                        <span>{w.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 5: Mind Reset */}
                <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4 shadow-lg">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-base flex items-center gap-1.5">
                      <Clock className="w-5 h-5 text-indigo-300" />
                      Mind Reset
                    </h3>
                    <p className="text-xs text-white/60">
                      Select duration. We'll generate custom walk guides, quotes, and reflections based on mood.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {["5 Min", "10 Min", "15 Min"].map((dur) => (
                      <button
                        key={dur}
                        onClick={() => handleMindReset(dur)}
                        className={`py-2 rounded-xl border text-xs font-semibold transition cursor-pointer text-center ${
                          resetDuration === dur
                            ? "bg-indigo-500 border-indigo-400 text-white font-bold"
                            : "bg-white/5 border-white/5 hover:border-white/10"
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>

                  {resetLoading ? (
                    <div className="text-center py-4 text-xs text-white/50 animate-pulse">Assembling reset parameters...</div>
                  ) : resetResult ? (
                    <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-2 animate-scale-up">
                      <span className="font-bold text-[9px] font-mono text-indigo-300 uppercase block">Active Program</span>
                      <div className="max-h-[220px] overflow-y-auto pr-1">
                        {renderMarkdown(resetResult)}
                      </div>
                    </div>
                  ) : null}
                </div>

              </div>

              {/* Main Column: Immersive visual Nature Canvas, Breathing Bubble, and Reflection Journal */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Nature Walk Interactive Animated Screen */}
                <div className="p-6 rounded-3xl bg-gradient-to-b from-indigo-950/40 to-slate-900/40 border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                  {/* Subtle pan-zoom camera movement background overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 to-transparent animate-pulse opacity-40 pointer-events-none" />
                  
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkle className="w-4 h-4 text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
                      Immersive Walk Panel
                    </span>
                    <div className="flex items-center gap-1">
                      {["rain", "forest", "waves", "birds"].map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleSoundNode(s as any)}
                          className={`p-1.5 rounded-lg border text-[10px] font-mono uppercase transition cursor-pointer ${
                            synthSourcesRef.current[s] ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-white/5 border-transparent text-white/50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stunning SVG Landscape with slow camera movement (sway transform) */}
                  <div className="relative w-full h-48 bg-gradient-to-b from-slate-950 to-[#0c0d21] rounded-2xl overflow-hidden border border-white/5">
                    
                    {/* Animated Clouds or Particles based on activeAtmosphere */}
                    <svg className="absolute inset-0 w-full h-full animate-sway-gentle" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Sun or Moon based on sunset/night */}
                      {activeAtmosphere === "sunset" ? (
                        <circle cx="50" cy="50" r="16" fill="url(#sunGrad)" className="opacity-80" />
                      ) : activeAtmosphere === "night" || activeAtmosphere === "rain" ? (
                        <circle cx="80" cy="30" r="8" fill="#fef08a" fillOpacity="0.15" />
                      ) : (
                        <circle cx="20" cy="30" r="10" fill="#fef3c7" fillOpacity="0.08" />
                      )}

                      {/* Moving ocean wave simulation */}
                      {activeAtmosphere === "spring" && (
                        <g className="animate-pulse">
                          <path d="M0 70 Q 25 65, 50 70 T 100 70 L 100 100 L 0 100 Z" fill="#1e1b4b" fillOpacity="0.4" />
                          <path d="M0 75 Q 25 72, 50 75 T 100 75 L 100 100 L 0 100 Z" fill="#1e1b4b" fillOpacity="0.6" />
                        </g>
                      )}

                      {/* Mountains background silhouette */}
                      <polygon points="0,85 30,55 60,85" fill="#11132e" fillOpacity="0.5" />
                      <polygon points="40,85 70,60 100,85" fill="#0c0d24" fillOpacity="0.7" />

                      {/* Forest trees silhouette */}
                      <g className="opacity-40">
                        <polygon points="10,85 15,70 20,85" fill="#064e3b" />
                        <polygon points="17,85 22,65 27,85" fill="#022c22" />
                        <polygon points="80,85 85,68 90,85" fill="#064e3b" />
                      </g>

                      {/* Rain droplets */}
                      {activeAtmosphere === "rain" && (
                        <g stroke="#38bdf8" strokeWidth="0.5" opacity="0.6" className="animate-pulse">
                          <line x1="10" y1="10" x2="8" y2="25" />
                          <line x1="30" y1="5" x2="28" y2="20" />
                          <line x1="60" y1="15" x2="58" y2="30" />
                          <line x1="80" y1="8" x2="78" y2="23" />
                        </g>
                      )}

                      {/* Falling Snow particles */}
                      {activeAtmosphere === "snow" && (
                        <g fill="#ffffff" fillOpacity="0.8">
                          <circle cx="20" cy="15" r="1" className="animate-pulse" />
                          <circle cx="50" cy="30" r="1.5" />
                          <circle cx="75" cy="10" r="1" />
                          <circle cx="90" cy="40" r="1.2" />
                        </g>
                      )}

                      {/* Gradient Grids */}
                      <defs>
                        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#f43f5e" />
                          <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                    </svg>
                    
                    {/* Floating center instruction */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-center p-4">
                      <div className="space-y-1">
                        <span className="text-xs uppercase font-mono font-extrabold tracking-widest text-pink-300">WALKING IN NATURE</span>
                        <h4 className="font-bold text-sm text-white">Focus on the horizon. Unwind.</h4>
                        <p className="text-[10px] text-white/60">Press synthesized channels above to customize environmental drone layers.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Breathing Companion */}
                <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xs text-center md:text-left">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase font-bold">
                      Adaptive Breathing Companion
                    </span>
                    <h3 className="font-display font-bold text-lg">Regulate Cortisol Levels</h3>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Sway in sync with our automated loop. Adjusts automatically based on active academic stress parameters.
                    </p>

                    {isBreathingActive ? (
                      <p className="text-xs font-semibold text-pink-300 italic animate-pulse">
                        {breathingPhase === "Inhale" && "Draw in cool, healing air... 🌬"}
                        {breathingPhase === "Hold" && "Feel the quietness settle inside... 🧘"}
                        {breathingPhase === "Exhale" && "Release all semester workloads... 🍃"}
                      </p>
                    ) : (
                      <p className="text-xs text-white/40">Press start to synchronize heart rhythm.</p>
                    )}
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      {/* Scaled animating outer ring */}
                      <div
                        className={`absolute rounded-full border border-pink-500/20 transition-all duration-[4000ms] ease-in-out ${
                          !isBreathingActive
                            ? "w-20 h-20 opacity-30"
                            : breathingPhase === "Inhale"
                            ? "w-36 h-36 bg-pink-500/5 opacity-80"
                            : breathingPhase === "Hold"
                            ? "w-36 h-36 bg-indigo-500/10 opacity-100"
                            : "w-20 h-20 bg-pink-500/5 opacity-40"
                        }`}
                      />

                      {/* Core circle */}
                      <div
                        className={`absolute rounded-full flex flex-col items-center justify-center text-center transition-all duration-[4000ms] ease-in-out ${
                          !isBreathingActive
                            ? "w-16 h-16 bg-white/10 border border-white/25 text-white/60"
                            : breathingPhase === "Inhale"
                            ? "w-28 h-28 bg-pink-500 text-white shadow-lg"
                            : breathingPhase === "Hold"
                            ? "w-28 h-28 bg-indigo-600 text-white shadow-xl"
                            : "w-16 h-16 bg-pink-600 text-white shadow"
                        }`}
                      >
                        {!isBreathingActive ? (
                          <span className="text-xs font-semibold">Pause</span>
                        ) : (
                          <>
                            <span className="text-[10px] font-mono uppercase tracking-wider">{breathingPhase}</span>
                            <span className="text-lg font-mono font-black mt-0.5">{breathingTimer}s</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setIsBreathingActive(!isBreathingActive)}
                      className={`mt-4 px-5 py-2 rounded-xl text-xs font-bold transition shadow-md hover:scale-105 cursor-pointer ${
                        isBreathingActive ? "bg-white/10 text-white border border-white/10" : "bg-[#FF6B6B] text-white"
                      }`}
                    >
                      {isBreathingActive ? "Pause" : "Begin Breathing"}
                    </button>
                  </div>
                </div>

                {/* Section 4: Reflection Journal */}
                <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-base flex items-center gap-1.5">
                      <Feather className="w-5 h-5 text-indigo-300" />
                      Reflection Journal
                    </h3>
                    <p className="text-xs text-white/60">
                      Answer our AI prompt of the night. No blank logs. We'll automatically capture and index.
                    </p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono uppercase text-pink-300 font-bold">Prompt Question</span>
                      <button
                        onClick={() => setJournalIdx((journalIdx + 1) % journalQuestions.length)}
                        className="text-[10px] text-white/50 hover:text-white flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Shuffle</span>
                      </button>
                    </div>
                    <p className="text-xs font-semibold">"{journalQuestions[journalIdx]}"</p>

                    <textarea
                      value={journalInput}
                      onChange={(e) => setJournalInput(e.target.value)}
                      placeholder="Type your reflection here..."
                      rows={2}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-pink-300/40"
                    />

                    {/* Quick Tags select */}
                    <div className="flex flex-wrap gap-1.5">
                      {["Finished Code Task", "Met Classmate", "Slept Well", "Anxious Midterm", "Drank Hot Chai"].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleToggleJournalTag(tag)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] border transition cursor-pointer ${
                            journalTags.includes(tag)
                              ? "bg-pink-500/20 border-pink-400 text-pink-300"
                              : "bg-white/5 border-transparent text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleJournalSubmit}
                      disabled={!journalInput.trim() && journalTags.length === 0}
                      className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 font-bold text-xs cursor-pointer text-white"
                    >
                      Journal Reflection
                    </button>
                  </div>

                  {journalLoading ? (
                    <div className="text-center py-4 text-xs text-white/50 animate-pulse">Quantifying reflection node...</div>
                  ) : journalSummary ? (
                    <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs animate-scale-up">
                      {renderMarkdown(journalSummary)}
                    </div>
                  ) : null}
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* ========================================================
            TAB 3: FUTURE YOU (LETTERS, VISION, SCROLLS, ALBUMS)
            ======================================================== */}
        {activeTab === "futureyou" && (
          <motion.div
            key="futureyou-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Sidebar: Letters options, Future Vision, Celebrate */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Section 1: Future Letters list */}
                <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4 shadow-lg">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                      Chronos Vault
                    </span>
                    <h3 className="font-display font-bold text-base flex items-center gap-1.5">
                      <Inbox className="w-5 h-5 text-indigo-300" />
                      Future Letter Box
                    </h3>
                    <p className="text-xs text-white/60">
                      Receive emotional letters generated directly from completed milestones and current code files.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {["1 Month", "6 Months", "1 Year", "4 Years"].map((dur) => (
                      <button
                        key={dur}
                        onClick={() => handleGenerateLetter(dur)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition cursor-pointer flex flex-col justify-center items-center gap-1.5 ${
                          letterDuration === dur
                            ? "bg-indigo-500 border-indigo-400 text-white shadow"
                            : "bg-white/5 border-white/5 hover:border-white/10"
                        }`}
                      >
                        <span>✉</span>
                        <span>{dur} Letter</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: Future Vision */}
                <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4 shadow-lg">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-base flex items-center gap-1.5">
                      <Compass className="w-5 h-5 text-emerald-300" />
                      Future Vision Board
                    </h3>
                    <p className="text-xs text-white/60">
                      Synthesizes dream workspace, lifestyle, and career using only actual completed milestones. Never fabricated.
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateFutureVision}
                    className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 font-bold text-xs cursor-pointer text-white shadow"
                  >
                    Generate Vision Board
                  </button>

                  {visionLoading ? (
                    <div className="text-center py-4 text-xs text-white/50 animate-pulse">Running synthesis formulas...</div>
                  ) : visionBoard ? (
                    <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs animate-scale-up max-h-[300px] overflow-y-auto pr-1">
                      {renderMarkdown(visionBoard)}
                    </div>
                  ) : null}
                </div>

                {/* Section 3: Celebrate Yourself */}
                <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4 shadow-lg">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-base flex items-center gap-1.5">
                      <Award className="w-5 h-5 text-amber-300" />
                      Celebrate Yourself
                    </h3>
                    <p className="text-xs text-white/60">
                      View highlighted project lists, skill progression and check how your garden grows.
                    </p>
                  </div>

                  <button
                    onClick={handleCelebrateYourself}
                    className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 font-bold text-xs cursor-pointer text-white shadow"
                  >
                    Compile Celebration Scroll
                  </button>

                  {celebrationLoading ? (
                    <div className="text-center py-4 text-xs text-white/50 animate-pulse">Generating technical highlight logs...</div>
                  ) : celebrationResult ? (
                    <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs animate-scale-up max-h-[300px] overflow-y-auto pr-1">
                      {renderMarkdown(celebrationResult)}
                    </div>
                  ) : null}
                </div>

              </div>

              {/* Main Column: Letters display, Memory Album */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Letter envelope animation display */}
                <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg min-h-[340px] flex items-center justify-center relative overflow-hidden">
                  
                  {letterLoading ? (
                    <div className="text-center space-y-3 animate-pulse">
                      <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
                      <p className="text-xs text-white/50">Unsealing future inbox...</p>
                    </div>
                  ) : letterDuration && letterResult ? (
                    <div className="w-full space-y-4">
                      
                      {!letterOpen ? (
                        <div className="flex flex-col items-center text-center space-y-4 py-8 animate-scale-up">
                          <div className="w-24 h-16 bg-indigo-900/60 border border-indigo-400/30 rounded-xl flex items-center justify-center relative shadow-lg">
                            <div className="absolute top-0 inset-x-0 h-6 bg-indigo-950 rounded-b-xl border-b border-indigo-400/20" />
                            <Inbox className="w-6 h-6 text-white/40 mt-4" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-base">Unopened Sealed Inbox ({letterDuration})</h4>
                            <p className="text-xs text-white/50">Wax-sealed and compiled with your actual academic metrics.</p>
                          </div>
                          <button
                            onClick={() => setLetterOpen(true)}
                            className="px-5 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 font-bold text-xs transition cursor-pointer"
                          >
                            Break Seal & Read
                          </button>
                        </div>
                      ) : (
                        <div className="bg-[#FAF9F5] text-slate-800 p-6 md:p-8 rounded-2xl shadow-xl space-y-4 relative border-2 border-amber-100/60 animate-scale-up max-h-[480px] overflow-y-auto" style={{ fontFamily: "serif" }}>
                          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                            <span className="text-[10px] font-mono tracking-widest font-extrabold text-slate-500 uppercase">CHRONOS INBOX</span>
                            <span className="text-xs font-mono text-slate-400">Future self letter</span>
                          </div>
                          <p className="text-sm md:text-base leading-relaxed text-slate-700 whitespace-pre-wrap">
                            {letterResult}
                          </p>
                          <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button
                              onClick={() => setLetterOpen(false)}
                              className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-sans text-xs font-semibold cursor-pointer"
                            >
                              Seal Letter
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="text-center max-w-sm space-y-2 py-8">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-white/5 flex items-center justify-center mx-auto text-xl text-white/50">
                        ✉
                      </div>
                      <h4 className="font-bold text-sm text-white">Future inbox</h4>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Select a duration card in the sidebar to run chronological synthesis and generate beautiful supportive letters.
                      </p>
                    </div>
                  )}
                </div>

                {/* Section 4: Memory Album Polaroid Grid */}
                <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-base flex items-center gap-1.5">
                      <Smile className="w-5 h-5 text-pink-300" />
                      Memory Album
                    </h3>
                    <p className="text-xs text-white/60">
                      Explore beautiful milestone cards of completed hackathons, seminars and project modules.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {milestoneCards.map((card) => (
                      <button
                        key={card.title}
                        onClick={() => setSelectedMilestone(card)}
                        className={`p-4 rounded-xl border bg-gradient-to-tr text-left cursor-pointer transition duration-300 hover:scale-[1.03] ${card.color} flex flex-col justify-between h-36`}
                      >
                        <span className="text-[9px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded-md text-white/80 self-start">
                          {card.tag}
                        </span>
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-white text-xs md:text-sm">{card.title}</h4>
                          <p className="text-[10px] text-white/40">{card.date}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedMilestone && (
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-xs space-y-2 animate-scale-up">
                      <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                        <span className="font-bold text-[10px] font-mono text-pink-300 uppercase">{selectedMilestone.title} Reflection</span>
                        <button onClick={() => setSelectedMilestone(null)} className="text-[10px] text-white/40 hover:text-white underline">Close</button>
                      </div>
                      <p className="text-white/80 leading-relaxed italic">"{selectedMilestone.desc}"</p>
                      <span className="text-[9px] font-mono text-white/40 block text-right">Archived: {selectedMilestone.date}</span>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
