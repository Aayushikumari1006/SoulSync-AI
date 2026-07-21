import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, StudentProfile, GrowthMission } from "../types";
import { PremiumLoader } from "./PremiumLoader";
import {
  Sparkles,
  Send,
  X,
  Bot,
  CornerDownRight,
  MessageSquareHeart,
  Heart,
  CheckCircle2,
  Star,
  ListTodo,
  Smile,
  BookOpen,
  Brain,
  Compass,
  Clock,
  ShieldAlert,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Check,
  Zap,
  TrendingUp,
  Award
} from "lucide-react";
import { saveChatMessageService, fetchChatMessageHistory, saveUserProfile } from "../lib/firebase";

interface AIMentorPanelProps {
  profile: StudentProfile;
  isLiveMode: boolean;
  selectedMood: string | null;
  missions: GrowthMission[];
  currentUser?: any;
}

// ----------------------------------------------------------------------
// COMPANION RESPONSE FORMATTING ENGINE
// ----------------------------------------------------------------------

const parseCompanionMessage = (text: string) => {
  const keywords = ["understanding", "reasoning", "options", "recommendation", "next actions", "encouragement"];
  const lowerText = text.toLowerCase();
  const foundKeywords = keywords.filter(kw => lowerText.includes(kw));

  if (foundKeywords.length < 3) {
    return { isStructured: false, text };
  }

  const lines = text.split("\n");
  const sections: { [key: string]: string[] } = {
    general: []
  };
  let currentSection = "general";

  lines.forEach(line => {
    const trimmed = line.trim();
    
    if (/^(###|\*\*|1\.)\s*understanding/i.test(trimmed)) {
      currentSection = "understanding";
      sections[currentSection] = [];
    } else if (/^(###|\*\*|2\.)\s*reasoning/i.test(trimmed)) {
      currentSection = "reasoning";
      sections[currentSection] = [];
    } else if (/^(###|\*\*|3\.)\s*options/i.test(trimmed)) {
      currentSection = "options";
      sections[currentSection] = [];
    } else if (/^(###|\*\*|4\.)\s*recommendation/i.test(trimmed)) {
      currentSection = "recommendation";
      sections[currentSection] = [];
    } else if (/^(###|\*\*|5\.)\s*(next actions|action steps)/i.test(trimmed)) {
      currentSection = "nextActions";
      sections[currentSection] = [];
    } else if (/^(###|\*\*|6\.)\s*encouragement/i.test(trimmed)) {
      currentSection = "encouragement";
      sections[currentSection] = [];
    } else {
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
      sections[currentSection].push(line);
    }
  });

  const getJoined = (key: string) => {
    return sections[key] ? sections[key].join("\n").trim() : undefined;
  };

  if (Object.keys(sections).length <= 2 && sections.general?.length > 0) {
    return { isStructured: false, text };
  }

  let actionsList: string[] = [];
  const rawActions = getJoined("nextActions");
  if (rawActions) {
    actionsList = rawActions
      .split("\n")
      .map(line => line.replace(/^[-*•\d\.\s]+/, "").trim())
      .filter(line => line.length > 0);
  }

  return {
    isStructured: true,
    understanding: getJoined("understanding"),
    reasoning: getJoined("reasoning"),
    options: getJoined("options"),
    recommendation: getJoined("recommendation"),
    nextActions: actionsList.slice(0, 3),
    encouragement: getJoined("encouragement"),
    general: getJoined("general"),
  };
};

const renderUnstructuredText = (text: string) => {
  const lines = text.split("\n");
  return (
    <div className="space-y-2 text-[11px] leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("•")) {
          const content = trimmed.replace(/^[-*•\s]+/, "");
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1 py-0.5">
              <span className="text-pink-400 shrink-0 font-bold">•</span>
              <span className="text-white/95">{content}</span>
            </div>
          );
        }

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        return (
          <p key={idx} className="text-white/95">
            {line}
          </p>
        );
      })}
    </div>
  );
};

// ----------------------------------------------------------------------
// HELPER FOR INLINE BOLD & TEXT FORMATTING
// ----------------------------------------------------------------------
const renderInlineFormatting = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-pink-300">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

// ----------------------------------------------------------------------
// UPGRADED COMPANION MESSAGE RENDERING ENGINE
// ----------------------------------------------------------------------

interface FormattedCompanionMessageProps {
  text: string;
}

const FormattedCompanionMessage: React.FC<FormattedCompanionMessageProps> = ({ text }) => {
  const [pipelineOpen, setPipelineOpen] = useState(false);

  if (text.startsWith("Welcome to SoulSync AI")) {
    return (
      <div className="space-y-2 text-[11px] leading-relaxed">
        <p className="font-semibold text-pink-300">Welcome to SoulSync AI 🌱</p>
        <p className="text-white/95">Let's grow together. I'll learn about you gradually so I can personalize every step of your journey. How can I help you find calm or guide your goals today?</p>
      </div>
    );
  }

  // Try to parse as the upgraded structured JSON response
  let upgradedResponse: any = null;
  try {
    if (text.trim().startsWith("{") && text.trim().endsWith("}")) {
      upgradedResponse = JSON.parse(text);
    }
  } catch (e) {
    // Graceful fallback to legacy parsing
  }

  if (upgradedResponse) {
    const { reasoningPipeline, emotionalListeningMode, text: mainText, decisionStudio } = upgradedResponse;

    return (
      <div className="space-y-3.5 w-full">
        {/* Cognitive Trace Timeline Toggle */}
        {reasoningPipeline && (
          <div className="border border-white/5 bg-black/20 rounded-xl overflow-hidden transition-all duration-200">
            <button
              onClick={() => setPipelineOpen(!pipelineOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-[9px] font-mono font-medium text-indigo-300/80 hover:text-indigo-200 hover:bg-white/5 transition duration-150"
              id="cognitive-trace-toggle-btn"
            >
              <div className="flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="uppercase tracking-wider">SoulSync Cognitive Alignment</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-white/40 text-[8px] uppercase">{pipelineOpen ? "Collapse" : "Trace"}</span>
                {pipelineOpen ? (
                  <ChevronUp className="w-3 h-3 text-indigo-400" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-indigo-400" />
                )}
              </div>
            </button>

            {pipelineOpen && (
              <div className="px-3 pb-3 pt-2 border-t border-white/5 bg-black/30 text-[9.5px] leading-relaxed text-white/70 space-y-2.5">
                <p className="text-[8.5px] font-mono text-white/40 border-b border-white/5 pb-1 uppercase tracking-wide">
                  Active Reasoning Pipeline:
                </p>
                <div className="relative border-l border-indigo-500/15 ml-2.5 pl-4 space-y-3 text-[10px]">
                  {/* Step 1: Core Concern */}
                  <div className="relative before:absolute before:left-[-21px] before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-indigo-400 before:border before:border-indigo-600">
                    <span className="font-mono text-[8.5px] text-indigo-300 uppercase tracking-wider block font-bold">[1. Core Concern]</span>
                    <span className="text-white/80">{reasoningPipeline.step1_userQuestion}</span>
                  </div>
                  {/* Step 2: Hidden Emotion */}
                  <div className="relative before:absolute before:left-[-21px] before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-pink-400 before:border before:border-pink-600">
                    <span className="font-mono text-[8.5px] text-pink-300 uppercase tracking-wider block font-bold">[2. Detected Emotion]</span>
                    <span className="text-white/80">{reasoningPipeline.step2_hiddenEmotion}</span>
                  </div>
                  {/* Step 3: SoulPrint Insights */}
                  <div className="relative before:absolute before:left-[-21px] before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-teal-400 before:border before:border-teal-600">
                    <span className="font-mono text-[8.5px] text-teal-300 uppercase tracking-wider block font-bold">[3. SoulPrint Reference]</span>
                    <span className="text-white/80">{reasoningPipeline.step3_profileInsights}</span>
                  </div>
                  {/* Step 4: DreamPath Alignment */}
                  <div className="relative before:absolute before:left-[-21px] before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-amber-400 before:border before:border-amber-600">
                    <span className="font-mono text-[8.5px] text-amber-300 uppercase tracking-wider block font-bold">[4. DreamPath Goal]</span>
                    <span className="text-white/80">{reasoningPipeline.step4_dreampathInsights}</span>
                  </div>
                  {/* Step 5: Tasks/Missions */}
                  <div className="relative before:absolute before:left-[-21px] before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-emerald-400 before:border before:border-emerald-600">
                    <span className="font-mono text-[8.5px] text-emerald-300 uppercase tracking-wider block font-bold">[5. Task Context]</span>
                    <span className="text-white/80">{reasoningPipeline.step5_taskInsights}</span>
                  </div>
                  {/* Step 6: Memory Integration */}
                  <div className="relative before:absolute before:left-[-21px] before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-purple-400 before:border before:border-purple-600">
                    <span className="font-mono text-[8.5px] text-purple-300 uppercase tracking-wider block font-bold">[6. Conversational Memory]</span>
                    <span className="text-white/80">{reasoningPipeline.step6_conversationalState}</span>
                  </div>
                  {/* Step 7: Mood Patterns */}
                  <div className="relative before:absolute before:left-[-21px] before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-blue-400 before:border before:border-blue-600">
                    <span className="font-mono text-[8.5px] text-blue-300 uppercase tracking-wider block font-bold">[7. Mood Context]</span>
                    <span className="text-white/80">{reasoningPipeline.step7_emotionalState}</span>
                  </div>
                  {/* Step 8: Sibling Synthesis */}
                  <div className="relative before:absolute before:left-[-21px] before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-rose-400 before:border before:border-rose-600">
                    <span className="font-mono text-[8.5px] text-rose-300 uppercase tracking-wider block font-bold">[8. Sibling Synthesis]</span>
                    <span className="text-white/80">{reasoningPipeline.step8_synthesis}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Listening Mode Banner */}
        {emotionalListeningMode && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-pink-500/25 bg-pink-500/5 animate-pulse">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
            <span className="text-[9.5px] font-mono font-semibold uppercase tracking-wider text-pink-300">
              Active Listening Mode: High Empathy Response
            </span>
          </div>
        )}

        {/* Warm Elder Sibling Conversation Text */}
        <div className="text-[11px] leading-relaxed text-white/95 whitespace-pre-wrap font-sans space-y-2">
          {mainText ? (
            mainText.split("\n\n").map((para: string, idx: number) => {
              if (para.trim().startsWith("-") || para.trim().startsWith("*") || para.trim().startsWith("•")) {
                const bulletLines = para.split("\n").map(l => l.replace(/^[-*•\s]+/, "").trim());
                return (
                  <div key={idx} className="space-y-1.5 py-1">
                    {bulletLines.map((bl, bidx) => (
                      <div key={bidx} className="flex items-start gap-2 pl-2">
                        <span className="text-pink-400 shrink-0 font-bold">•</span>
                        <span>{renderInlineFormatting(bl)}</span>
                      </div>
                    ))}
                  </div>
                );
              }
              return (
                <p key={idx} className="font-sans leading-relaxed">
                  {renderInlineFormatting(para)}
                </p>
              );
            })
          ) : (
            <p className="text-white/70 italic">Translating neural thoughts into local wisdom...</p>
          )}
        </div>

        {/* DECISION STUDIO (Career Decision Engine side-by-side bento card) */}
        {decisionStudio && (
          <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-3.5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-wider">
                <Compass className="w-4 h-4 text-indigo-400 animate-spin-slow shrink-0" />
                <span>Decision Studio Analysis</span>
              </div>
              {decisionStudio.confidenceScore && (
                <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-indigo-300">
                  <span>Match Confidence:</span>
                  <span className="text-pink-300">{decisionStudio.confidenceScore}%</span>
                </div>
              )}
            </div>

            {/* Comparison Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Option A Card */}
              <div className="bg-white/5 border border-indigo-500/10 rounded-xl p-3 hover:bg-white/8 transition duration-150">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-300 mb-2">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{decisionStudio.optionA}</span>
                </div>
                <div className="space-y-2 text-[10px] text-white/80">
                  {decisionStudio.optionA_details?.advantages && (
                    <div className="flex items-start gap-1.5">
                      <ThumbsUp className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-emerald-300 block">Advantages</span>
                        <p className="leading-snug">{decisionStudio.optionA_details.advantages}</p>
                      </div>
                    </div>
                  )}
                  {decisionStudio.optionA_details?.disadvantages && (
                    <div className="flex items-start gap-1.5">
                      <ThumbsDown className="w-3 h-3 text-pink-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-pink-300 block">Disadvantages</span>
                        <p className="leading-snug">{decisionStudio.optionA_details.disadvantages}</p>
                      </div>
                    </div>
                  )}
                  {decisionStudio.optionA_details?.careerImpact && (
                    <div className="flex items-start gap-1.5 pt-1 border-t border-white/5">
                      <TrendingUp className="w-3 h-3 text-indigo-300 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-indigo-300 block">DreamPath Career Impact</span>
                        <p className="leading-snug text-white/70">{decisionStudio.optionA_details.careerImpact}</p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-white/5 text-[9px]">
                    <div>
                      <span className="text-white/40 block">Time Commitment</span>
                      <span className="font-semibold text-white/90">{decisionStudio.optionA_details?.timeRequired || "6-8 hrs/wk"}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block">Risk Matrix</span>
                      <span className={`font-semibold ${decisionStudio.optionA_details?.risk?.toLowerCase().includes("high") ? "text-pink-400" : "text-emerald-400"}`}>
                        {decisionStudio.optionA_details?.risk || "Low Risk"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option B Card */}
              <div className="bg-white/5 border border-indigo-500/10 rounded-xl p-3 hover:bg-white/8 transition duration-150">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-pink-300 mb-2">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-pink-400" />
                  <span>{decisionStudio.optionB}</span>
                </div>
                <div className="space-y-2 text-[10px] text-white/80">
                  {decisionStudio.optionB_details?.advantages && (
                    <div className="flex items-start gap-1.5">
                      <ThumbsUp className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-emerald-300 block">Advantages</span>
                        <p className="leading-snug">{decisionStudio.optionB_details.advantages}</p>
                      </div>
                    </div>
                  )}
                  {decisionStudio.optionB_details?.disadvantages && (
                    <div className="flex items-start gap-1.5">
                      <ThumbsDown className="w-3 h-3 text-pink-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-pink-300 block">Disadvantages</span>
                        <p className="leading-snug">{decisionStudio.optionB_details.disadvantages}</p>
                      </div>
                    </div>
                  )}
                  {decisionStudio.optionB_details?.careerImpact && (
                    <div className="flex items-start gap-1.5 pt-1 border-t border-white/5">
                      <TrendingUp className="w-3 h-3 text-pink-300 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-pink-300 block">DreamPath Career Impact</span>
                        <p className="leading-snug text-white/70">{decisionStudio.optionB_details.careerImpact}</p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-white/5 text-[9px]">
                    <div>
                      <span className="text-white/40 block">Time Commitment</span>
                      <span className="font-semibold text-white/90">{decisionStudio.optionB_details?.timeRequired || "4-6 hrs/wk"}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block">Risk Matrix</span>
                      <span className={`font-semibold ${decisionStudio.optionB_details?.risk?.toLowerCase().includes("high") ? "text-pink-400" : "text-emerald-400"}`}>
                        {decisionStudio.optionB_details?.risk || "Low Risk"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation block inside Decision Studio */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>SoulSync Balanced Recommendation</span>
              </div>
              <p className="text-[10.5px] font-semibold text-emerald-300 leading-snug">
                {decisionStudio.recommendation}
              </p>
              {decisionStudio.reasoning && (
                <p className="text-[9.5px] text-white/80 leading-relaxed pt-1 border-t border-white/5">
                  {decisionStudio.reasoning}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback to legacy companion message parser
  const parsed = parseCompanionMessage(text);

  if (!parsed.isStructured) {
    return renderUnstructuredText(text);
  }

  return (
    <div className="space-y-3 w-full">
      {parsed.understanding && (
        <div className="bg-white/5 border border-pink-500/20 rounded-2xl p-3 shadow-sm hover:bg-white/8 transition duration-200">
          <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-pink-300 uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/10 shrink-0" />
            <span>Understanding</span>
          </div>
          <p className="text-[11px] text-white/90 leading-relaxed font-medium">
            {parsed.understanding}
          </p>
        </div>
      )}

      {parsed.reasoning && (
        <div className="bg-white/5 border border-indigo-400/20 rounded-2xl p-3 shadow-sm hover:bg-white/8 transition duration-200">
          <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-indigo-300 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Reasoning</span>
          </div>
          <p className="text-[11px] text-white/85 leading-relaxed">
            {parsed.reasoning}
          </p>
        </div>
      )}

      {parsed.options && (
        <div className="bg-white/5 border border-amber-400/20 rounded-2xl p-3 shadow-sm hover:bg-white/8 transition duration-200">
          <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Options</span>
          </div>
          <div className="text-[11px] text-white/85 leading-relaxed whitespace-pre-line">
            {parsed.options}
          </div>
        </div>
      )}

      {parsed.recommendation && (
        <div className="bg-white/10 border border-emerald-400/30 rounded-2xl p-3 shadow-md">
          <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <Star className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/10 shrink-0 animate-pulse" />
            <span>Recommendation</span>
          </div>
          <p className="text-[11px] text-emerald-200 font-semibold leading-relaxed">
            {parsed.recommendation}
          </p>
        </div>
      )}

      {parsed.nextActions && parsed.nextActions.length > 0 && (
        <div className="bg-white/5 border border-teal-500/20 rounded-2xl p-3 shadow-sm">
          <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-teal-300 uppercase tracking-wider mb-2">
            <ListTodo className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>Next Actions</span>
          </div>
          <div className="space-y-1.5">
            {parsed.nextActions.map((act, i) => (
              <div
                key={i}
                className="flex items-start gap-2 bg-white/5 border border-white/5 p-2 rounded-xl hover:bg-white/8 transition-colors duration-150"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-[9px] font-bold text-teal-300 font-mono">
                  {i + 1}
                </span>
                <span className="text-[10px] text-white/90 leading-tight">
                  {act}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {parsed.encouragement && (
        <div className="pt-1 text-center">
          <p className="text-[10.5px] text-pink-200/90 italic leading-relaxed">
            "{parsed.encouragement}"
          </p>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export const AIMentorPanel: React.FC<AIMentorPanelProps> = ({
  profile,
  isLiveMode,
  selectedMood,
  missions,
  currentUser
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [memoryToast, setMemoryToast] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const suggestedPrompts = [
    "Pitch my Smart India Hackathon 2026 team idea.",
    "Overwhelmed by CSE 3rd Semester assessments, any tips?",
    "Suggest a 5-minute study detox routine.",
    "How to build an off-campus resume for Google India?",
  ];

  // Load from Firebase or fall back to default welcome message
  useEffect(() => {
    let active = true;
    const loadHistory = async () => {
      if (currentUser) {
        try {
          const history = await fetchChatMessageHistory(currentUser.uid);
          if (active) {
            if (history && history.length > 0) {
              setMessages(history);
            } else {
              setMessages([
                {
                  id: "w1",
                  sender: "companion",
                  text: `Welcome to SoulSync AI 🌱\n\nLet's grow together. I'll learn about you gradually so I can personalize every step of your journey. How can I help you find calm or guide your goals today?`,
                  timestamp: new Date(),
                }
              ]);
            }
          }
        } catch (err) {
          console.error("Failed to load chat history:", err);
        }
      } else {
        setMessages([
          {
            id: "w1",
            sender: "companion",
            text: `Welcome to SoulSync AI 🌱\n\nLet's grow together. I'll learn about you gradually so I can personalize every step of your journey. How can I help you find calm or guide your goals today?`,
            timestamp: new Date(),
          }
        ]);
      }
    };
    loadHistory();
    return () => { active = false; };
  }, [currentUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    if (currentUser) {
      saveChatMessageService(currentUser.uid, {
        id: userMsg.id,
        sender: userMsg.sender,
        text: userMsg.text,
        timestamp: userMsg.timestamp
      }).catch(err => console.error("Failed to save user chat msg:", err));
    }

    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          context: profile,
          mode: isLiveMode ? "live" : "demo",
          mood: selectedMood,
          missions: missions,
          history: messages,
        }),
      });

      const data = await response.json();

      // Memory Extraction Engine Integration
      if (data.newMemories && Array.isArray(data.newMemories) && data.newMemories.length > 0) {
        if (!profile.memories) {
          profile.memories = [];
        }
        data.newMemories.forEach((memStr: string) => {
          const exists = profile.memories?.some(m => m.text.toLowerCase() === memStr.toLowerCase());
          if (!exists) {
            const newMem = {
              id: Math.random().toString(36).substr(2, 9),
              text: memStr,
              category: "Career"
            };
            profile.memories?.push(newMem);
            setMemoryToast(memStr);
            setTimeout(() => setMemoryToast(null), 5000);
          }
        });

        // Save profile
        if (currentUser) {
          saveUserProfile(currentUser.uid, profile).catch(err => console.error("Error saving profile memories:", err));
        } else {
          localStorage.setItem(`soulsync_profile_demo_user_ayush`, JSON.stringify(profile));
        }
      }

      const companionMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "companion",
        text: data.text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, companionMsg]);

      if (currentUser) {
        saveChatMessageService(currentUser.uid, {
          id: companionMsg.id,
          sender: companionMsg.sender,
          text: companionMsg.text,
          timestamp: companionMsg.timestamp
        }).catch(err => console.error("Failed to save companion reply:", err));
      }
    } catch (err) {
      console.error("Failed to query API Mentor endpoint:", err);
      const companionMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "companion",
        text: `### Understanding\nI understand why this situation feels confusing and overwhelming right now, Ayush.\n\n### Reasoning\nWhen external network layers fail or we hit database access caps, we always fall back on resilient offline nodes. In computer science, we design redundant channels to guarantee uptime.\n\n### Options\n- **Option A: Rely purely on external queries**\n  * Pros: Instantly retrieves infinite dynamic models.\n  * Cons: Prone to network dropouts and timeout latencies.\n- **Option B: Fallback to local sibling-like wisdom**\n  * Pros: Zero latency, locally available advice on balance, SIH deadlines, and midterm revision.\n  * Cons: Fixed database vocabulary.\n\n### Recommendation\nChoose Option B. Keep building your TensorFlow CNN Handwriting Engine scripts and complete your active midterm missions.\n\n### Next Actions\n- **Check Active Missions**: Take 10 minutes to review your database indexing lists.\n- **Begin a Breathing Loop**: Run a short Box Breathing session to calm your mental threads.\n- **Consult Curators**: Check your Opportunity Compass list for upcoming national deadlines.\n\n### Encouragement\nYou are highly adaptive and built to last. Let's make small, quiet progress today. 🌸`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, companionMsg]);

      if (currentUser) {
        saveChatMessageService(currentUser.uid, {
          id: companionMsg.id,
          sender: companionMsg.sender,
          text: companionMsg.text,
          timestamp: companionMsg.timestamp
        }).catch(err => console.error("Failed to save fallback companion reply:", err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        id="soul-mentor-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-700 to-emerald-600 hover:from-indigo-600 hover:to-emerald-500 text-white flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 z-50 cursor-pointer border border-white/20"
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-spin-once" />
        ) : (
          <MessageSquareHeart className="w-6 h-6 animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div
          id="soul-mentor-drawer"
          className="fixed bottom-24 right-6 w-11/12 sm:w-96 h-[480px] rounded-3xl bg-[#4D3E77]/95 backdrop-blur-xl border border-white/20 shadow-2xl z-50 flex flex-col overflow-hidden animate-scale-up text-white"
        >
          {/* Header */}
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-500 text-white flex items-center justify-center border border-white/10">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-display font-bold text-white">SoulSync Companion</h4>
                <p className="text-[9px] font-mono uppercase tracking-wider text-pink-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
                  {isLiveMode ? "Live (Gemini Enhanced)" : "Demo Companion Online"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Mood adaptation subheader */}
          {selectedMood && (
            <div className="px-4 py-1.5 bg-pink-500/10 border-b border-pink-500/15 text-[10px] text-pink-300 flex items-center justify-between animate-fade-in shrink-0">
              <span className="flex items-center gap-1.5 font-medium">
                <Smile className="w-3.5 h-3.5 text-pink-400" />
                <span>Adapting companion to {selectedMood} mood</span>
              </span>
              <span className="text-[8px] font-mono opacity-50 uppercase font-bold tracking-wide">Sync active</span>
            </div>
          )}

          {/* Memory Engine Saved Banner */}
          {memoryToast && (
            <div className="px-4 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-[10px] text-emerald-300 flex items-center gap-2 animate-fade-in shrink-0">
              <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                <Star className="w-3.5 h-3.5 fill-emerald-400" />
              </span>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-bold uppercase tracking-wider text-[8px] font-mono text-emerald-400">SoulPrint Memory Saved</p>
                <p className="truncate text-white/90 text-[10px]">{memoryToast}</p>
              </div>
            </div>
          )}

          {/* Messages Feed */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                      isUser
                        ? "bg-[#FF6B6B] text-white rounded-tr-none shadow-md border border-white/10"
                        : "bg-white/10 border border-white/10 text-white rounded-tl-none shadow-md w-full"
                    }`}
                  >
                    {isUser ? m.text : <FormattedCompanionMessage text={m.text} />}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start w-full animate-scale-up">
                <div className="w-full max-w-[95%]">
                  <PremiumLoader message="Formulating empathetic guidelines..." />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Prompt Recommendations */}
          {input.trim() === "" && !isLoading && (
            <div className="px-4 py-2 border-t border-white/10 bg-white/5 space-y-1.5 max-h-[140px] overflow-y-auto">
              <span className="text-[9px] uppercase tracking-wider text-white/50 font-mono font-bold block">
                Recommended Focus Guides
              </span>
              <div className="flex flex-col gap-1">
                {suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p)}
                    className="text-left text-[10px] px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:border-pink-300 text-white/80 truncate transition flex items-center gap-1 cursor-pointer"
                  >
                    <CornerDownRight className="w-3 h-3 text-pink-300 shrink-0" />
                    <span className="truncate">{p}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input field */}
          <div className="p-3 bg-[#4D3E77]/80 border-t border-white/10 flex gap-2">
            <input
              type="text"
              placeholder="Tell your companion what's on your mind..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-white text-[#FF6B6B] hover:bg-white/90 font-bold flex items-center justify-center transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

