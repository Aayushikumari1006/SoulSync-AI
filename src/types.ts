export type AtmosphereType = "rain" | "morning" | "sunset" | "night" | "forest" | "lake" | "snow" | "spring";

export interface StudentDream {
  id: string;
  type: "Primary" | "Secondary" | "Future" | "Custom";
  title: string;
  motivation: string;
  targetYear: string;
  confidence: number; // percentage
  priority: "High" | "Medium" | "Low";
  status: "Active" | "Archived" | "Completed";
  evolvedFrom?: string;
  dateAdded: string;
}

export interface SkillDetail {
  name: string;
  level: "Beginner" | "Intermediate" | "Expert";
  progress: number; // percentage
  confidence: number; // percentage
}

export interface StudentAchievement {
  id: string;
  type: "project" | "certificate" | "hackathon" | "internship" | "research" | "scholarship" | "skill";
  title: string;
  subtitle?: string; // e.g. provider, organization, or platform
  date: string;
  description: string;
  skills: string[];
  url?: string;
  details?: {
    // Project Showcase
    summary?: string;
    problem?: string;
    approach?: string;
    architectureDiagram?: string;
    keyLearnings?: string;
    futureImprovements?: string;
    impact?: string;
    // Interview Story (STAR)
    starStory?: {
      situation: string;
      task: string;
      action: string;
      result: string;
    };
    // LinkedIn Assistant
    linkedinPost?: string;
    headline?: string;
    aboutSummary?: string;
  };
}

export interface StudentProfile {
  name: string;
  degree: string;
  branch: string;
  semester: string;
  college: string;
  careerGoal: string;
  skills: string[];
  interests: string[];
  favouriteSubjects: string[];
  learningStyle: string; // Visual, Auditory, Reading, Kinesthetic
  weeklyAvailability: number; // in hours
  preferredLanguage: string;
  dreamCompany: string;
  projects: { id: string; name: string; description: string; tech: string[] }[];
  isOnboardingCompleted: boolean;
  // Extended fields
  graduationYear?: string;
  city?: string;
  dreams?: StudentDream[];
  skillDetails?: SkillDetail[];
  achievements?: StudentAchievement[];
  preferredLearningMethod?: string; // Videos, Interactive Practice, Reading, Projects, Documentation
  preferredSessionLength?: string; // 30 min, 45 min, 60 min, 90 min
  preferredStudyTime?: string; // Morning, Afternoon, Evening, Night
  weeklyAvailabilityGrid?: boolean[][]; // 7 days (Mon-Sun) x 4 slots (Morning, Afternoon, Evening, Night)
  rememberSettings?: {
    learningPreferences: boolean;
    goals: boolean;
    skills: boolean;
    mentorConversations: boolean;
    completedMissions: boolean;
    askPermission: boolean;
  };
  memories?: { id: string; text: string; category: string }[];
}

export interface GrowthMission {
  id: string;
  title: string;
  deadline: string;
  estimatedTime: string;
  dreamImpact: string;
  completed: boolean;
  category: "Career" | "Academics" | "Skill" | "Wellbeing";
}

export interface Opportunity {
  id: string;
  type: "Scholarship" | "Internship" | "Hackathon";
  title: string;
  provider: string;
  description: string;
  stipendOrValue: string;
  deadline: string;
  closingSoon: boolean;
  tags: string[];
  applyUrl: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "companion";
  text: string;
  timestamp: Date;
}

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  staticBackground: boolean;
  muteSounds: boolean;
  soundVolume?: number; // 0 to 100, defaults to 50
  lowPerformanceMode?: boolean; // performance toggle
}
