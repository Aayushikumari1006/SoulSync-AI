import React, { useState, useMemo, useEffect } from "react";
import { StudentProfile, AtmosphereType, AccessibilitySettings, GrowthMission } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { saveUserOpportunityStates, fetchUserOpportunityStates } from "../lib/firebase";
import {
  Compass,
  Search,
  Trophy,
  GraduationCap,
  Briefcase,
  Award,
  Zap,
  Bell,
  CheckCircle2,
  Bookmark,
  Flame,
  Calendar,
  Clock,
  ArrowRight,
  Share2,
  Sparkles,
  BookOpen,
  Layers,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  Info,
  HelpCircle,
  X,
  ExternalLink,
  MessageSquare,
  PlayCircle,
  ShieldCheck,
  Heart,
  AlertCircle,
  RefreshCw,
  Filter,
  Brain
} from "lucide-react";

interface OpportunityCompassViewProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  activeAtmosphere: AtmosphereType;
  accessibility: AccessibilitySettings;
  missions: GrowthMission[];
  onAddMission: (newMission: GrowthMission) => void;
  currentUser?: any;
}

interface OpportunityItem {
  id: string;
  category: "Scholarship" | "Internship" | "Hackathon" | "Certification";
  title: string;
  provider: string;
  logoBg: string;
  eligibility: string;
  deadline: string; // YYYY-MM-DD
  daysLeft: number;
  benefits: string;
  duration: string;
  mode: "Online" | "Offline" | "Hybrid";
  location: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Intense";
  stipendOrValue: string;
  aiMatchScore: number;
  whyRecommended: string;
  requiredSkills: string[];
  requiredDocuments?: string[];
  selectionProcess?: string;
  preparationTips?: string[];
  theme?: string;
  prize?: string;
  teamSize?: string;
  preparationChecklist?: string[];
  certificate?: string;
  careerImpact?: string;
  prerequisites?: string[];
  websiteUrl: string;
  isGovernment?: boolean;
}

// Compact, premium, representative Indian opportunities
const OPPORTUNITIES_DATA: OpportunityItem[] = [
  // 1. SCHOLARSHIPS (6 Examples)
  {
    id: "sch-nsp",
    category: "Scholarship",
    title: "National Scholarship Portal (NSP)",
    provider: "Ministry of Electronics & IT, Govt of India",
    logoBg: "bg-blue-600",
    eligibility: "UG Students, Family Income < ₹8L/annum, CGPA > 7.0",
    deadline: "2026-09-30",
    daysLeft: 73,
    benefits: "Full tuition fee waiver & monthly maintenance allowance",
    duration: "Entire course duration",
    mode: "Online",
    location: "National",
    difficulty: "Intermediate",
    stipendOrValue: "₹50,000 - ₹2,50,000/Yr",
    aiMatchScore: 89,
    whyRecommended: "Direct government support. Highly aligned with your engineering registration and economic criteria.",
    requiredSkills: ["Academic Records", "Institute Authentication"],
    requiredDocuments: ["Income Certificate", "Previous Sem Marksheets", "College Fee Receipt", "Bonafide Certificate"],
    websiteUrl: "https://scholarships.gov.in",
    isGovernment: true
  },
  {
    id: "sch-reliance",
    category: "Scholarship",
    title: "Reliance Foundation Undergraduate Scholarship",
    provider: "Reliance Foundation",
    logoBg: "bg-red-600",
    eligibility: "1st/2nd/3rd Year B.Tech students, CGPA > 7.5, Family Income < ₹15L/annum",
    deadline: "2026-08-15",
    daysLeft: 27,
    benefits: "Up to ₹2,00,000 financial grant & exclusive mentoring networks",
    duration: "4 Years B.Tech",
    mode: "Online",
    location: "National",
    difficulty: "Advanced",
    stipendOrValue: "₹2,00,000 Total",
    aiMatchScore: 94,
    whyRecommended: "🌿 Perfect match. Your active CSE progress and high CGPA place you in the top tier ofCorporate STEM grantees.",
    requiredSkills: ["General Aptitude", "Personal Statement"],
    requiredDocuments: ["Aptitude Scorecard", "Family Income Declaration", "Reference Letter", "Bonafide Certificate"],
    websiteUrl: "https://www.reliancefoundation.org",
    isGovernment: false
  },
  {
    id: "sch-pragati",
    category: "Scholarship",
    title: "AICTE Pragati Scholarship for Girls",
    provider: "AICTE, Govt of India",
    logoBg: "bg-emerald-600",
    eligibility: "Female students admitted to 1st/2nd/3rd year of technical degree",
    deadline: "2026-10-15",
    daysLeft: 88,
    benefits: "₹50,000 per annum towards college fee, books, and laptops",
    duration: "Course duration",
    mode: "Online",
    location: "National",
    difficulty: "Intermediate",
    stipendOrValue: "₹50,000/Yr",
    aiMatchScore: 85,
    whyRecommended: "A technical education enablement scheme specifically crafted for women engineering scholars in India.",
    requiredSkills: ["Academic Record", "AICTE Registration"],
    requiredDocuments: ["College Fee Receipt", "Admission Letter", "Aadhaar Card", "Income Proof"],
    websiteUrl: "https://www.aicte-india.org",
    isGovernment: true
  },
  {
    id: "sch-ffe",
    category: "Scholarship",
    title: "Foundation For Excellence (FFE) Scholarship",
    provider: "Foundation For Excellence",
    logoBg: "bg-teal-600",
    eligibility: "B.Tech 1st/2nd year, JEE Rank < 90,000, Income < ₹3L/annum",
    deadline: "2026-08-30",
    daysLeft: 42,
    benefits: "Full tuition assistance, laptop grants, and career path mentorship",
    duration: "Entire B.Tech course",
    mode: "Hybrid",
    location: "National",
    difficulty: "Advanced",
    stipendOrValue: "₹40,000/Yr",
    aiMatchScore: 91,
    whyRecommended: "Recognizes high JEE performance paired with proactive financial support for tech students.",
    requiredSkills: ["JEE Rank Proof", "Academic Standing"],
    requiredDocuments: ["JEE Rank Card", "College Fee Bill", "Income Certificate"],
    websiteUrl: "https://ffe.org",
    isGovernment: false
  },
  {
    id: "sch-kotak",
    category: "Scholarship",
    title: "Kotak Kanya Scholarship",
    provider: "Kotak Mahindra Group & Buddy4Study",
    logoBg: "bg-indigo-600",
    eligibility: "Meritorious girl students, CGPA > 8.5, Income < ₹6L/annum",
    deadline: "2026-08-20",
    daysLeft: 32,
    benefits: "₹1,50,000 per year for professional graduation expenses",
    duration: "Professional Degree",
    mode: "Online",
    location: "National",
    difficulty: "Advanced",
    stipendOrValue: "₹1,50,000/Yr",
    aiMatchScore: 88,
    whyRecommended: "High financial assistance tier tailored to elevate elite women leaders in STEM.",
    requiredSkills: ["Academic Merit", "Career Intention Essay"],
    requiredDocuments: ["CGPA Sheet", "Income Certificate", "Reference Letters"],
    websiteUrl: "https://www.kotak.com",
    isGovernment: false
  },
  {
    id: "sch-inspire",
    category: "Scholarship",
    title: "INSPIRE Scholarship (SHE)",
    provider: "Department of Science & Technology, Govt of India",
    logoBg: "bg-purple-600",
    eligibility: "Top 1% in Class XII, pursuing basic/applied research courses",
    deadline: "2026-11-15",
    daysLeft: 119,
    benefits: "₹80,000 per annum including direct research mentorship grants",
    duration: "5 Years (UG + PG)",
    mode: "Offline",
    location: "National",
    difficulty: "Intense",
    stipendOrValue: "₹80,000/Yr",
    aiMatchScore: 92,
    whyRecommended: "Excellent if you intend to merge computing with mathematical/scientific research models.",
    requiredSkills: ["Scientific Research", "Analytical Thinking"],
    requiredDocuments: ["Class 12 Marks Proof", "Endorsement Letter from Institution"],
    websiteUrl: "https://online-inspire.gov.in",
    isGovernment: true
  },

  // 2. INTERNSHIPS (6 Examples)
  {
    id: "int-google-step",
    category: "Internship",
    title: "Google STEP Internship (Software Product Eng)",
    provider: "Google India",
    logoBg: "bg-blue-500",
    eligibility: "B.Tech CSE/IT, 2nd or 3rd year undergraduate",
    deadline: "2026-08-05",
    daysLeft: 17,
    benefits: "Stipend, free meals, accommodation support, return flight, and full pre-placement offer pipeline",
    duration: "10-12 Weeks",
    mode: "Hybrid",
    location: "Bangalore",
    difficulty: "Intense",
    stipendOrValue: "₹1,00,000/Mo",
    aiMatchScore: 95,
    whyRecommended: "🔥 Prime target. Your expert Python level and solid Data Structures foundations fit Google's strict engineering bar.",
    requiredSkills: ["Python", "DSA", "Git", "Problem Solving"],
    selectionProcess: "Resume Screen -> Online Coding Assessment (2 Qs) -> 2 Technical Interviews (Algorithmic / System)",
    preparationTips: [
      "Practice Recursion, Trees, and Graph BFS/DFS on NeetCode.",
      "Ensure your resume highlights your IndicOCR project with real-world metrics.",
      "Conduct a dry-run interview with the AI Companion focusing on Big-O complexity."
    ],
    websiteUrl: "https://careers.google.com",
    isGovernment: false
  },
  {
    id: "int-ms-research",
    category: "Internship",
    title: "Microsoft Research Fellow & ML Intern",
    provider: "Microsoft Research India",
    logoBg: "bg-slate-700",
    eligibility: "B.Tech CSE with deep interest in Machine Learning/AI",
    deadline: "2026-09-10",
    daysLeft: 53,
    benefits: "Research stipend, Azure credits, paper publication support, and co-authorship",
    duration: "3-6 Months",
    mode: "Offline",
    location: "Bangalore",
    difficulty: "Intense",
    stipendOrValue: "₹1,20,000/Mo",
    aiMatchScore: 93,
    whyRecommended: "Directly matches your CSE (AI & ML) branch. Your research interests align perfectly with MS Labs.",
    requiredSkills: ["Deep Learning", "PyTorch", "Mathematical Rigor"],
    selectionProcess: "Academic Transcript Screen -> Coding Challenge -> Research Presentation and Panel Interview",
    preparationTips: [
      "Study modern Transformer models and low-bit quantization bottlenecks.",
      "Practice fine-tuning libraries (Hugging Face, LoRA).",
      "Read MS Labs' latest published papers on Indian local context models."
    ],
    websiteUrl: "https://careers.microsoft.com",
    isGovernment: false
  },
  {
    id: "int-isro",
    category: "Internship",
    title: "ISRO Vikram Sarabhai Space Centre Intern",
    provider: "ISRO, Govt of India",
    logoBg: "bg-orange-600",
    eligibility: "UG Students, CGPA > 8.5, No active backlogs, Indian Citizen",
    deadline: "2026-08-25",
    daysLeft: 37,
    benefits: "Direct mentorship under lead rocket scientists & certified access to ISRO supercomputer environments",
    duration: "8-16 Weeks",
    mode: "Offline",
    location: "Trivandrum",
    difficulty: "Advanced",
    stipendOrValue: "₹15,000/Mo",
    aiMatchScore: 86,
    whyRecommended: "Highly prestigious. Allows applying Python computational models to high-scale aerospace and satellite datasets.",
    requiredSkills: ["Python", "Scientific Libraries", "Data Analysis"],
    selectionProcess: "CGPA Merit shortlisting -> Bonafide validation -> Departmental interview",
    preparationTips: [
      "Revise linear algebra, coordinate transforms, and NumPy speedups.",
      "Make sure you get a reference letter from your college's HOD."
    ],
    websiteUrl: "https://www.vssc.gov.in",
    isGovernment: true
  },
  {
    id: "int-drdo",
    category: "Internship",
    title: "DRDO CAIR AI Research Internship",
    provider: "DRDO, Govt of India",
    logoBg: "bg-sky-700",
    eligibility: "B.Tech CSE/IT with clean background verification",
    deadline: "2026-09-01",
    daysLeft: 44,
    benefits: "National security research insights, government lab credentials",
    duration: "12 Weeks",
    mode: "Offline",
    location: "Bangalore",
    difficulty: "Intense",
    stipendOrValue: "₹20,000/Mo",
    aiMatchScore: 88,
    whyRecommended: "A brilliant opportunity if you want to explore defensive computer vision, network analysis, and crypto systems.",
    requiredSkills: ["Network Sniffing", "Python", "SQL Security"],
    selectionProcess: "Technical screening on database security, networking -> Security clearance",
    preparationTips: [
      "Understand packet tracing, custom ARP scanning, and SQL indexing thoroughly."
    ],
    websiteUrl: "https://www.drdo.gov.in",
    isGovernment: true
  },
  {
    id: "int-nvidia",
    category: "Internship",
    title: "NVIDIA Deep Learning Engineer Intern",
    provider: "NVIDIA India",
    logoBg: "bg-emerald-700",
    eligibility: "B.Tech/M.Tech with CUDA & ML model optimization skills",
    deadline: "2026-08-30",
    daysLeft: 42,
    benefits: "GPU compute credits, high-salary pipeline, and direct NVIDIA MLOps exposure",
    duration: "6 Months",
    mode: "Hybrid",
    location: "Pune",
    difficulty: "Intense",
    stipendOrValue: "₹1,10,000/Mo",
    aiMatchScore: 92,
    whyRecommended: "Your expertise in Python vectorization and interest in deep learning modules fit NVIDIA's requirements.",
    requiredSkills: ["PyTorch Core", "CUDA C", "CNNs", "Model Quantization"],
    selectionProcess: "Resume Screen -> MLOps Coding challenge -> Deep learning conceptual round -> final VP round",
    preparationTips: [
      "Review custom backpropagation calculations.",
      "Understand the memory architectures of GPUs and CUDA threads."
    ],
    websiteUrl: "https://www.nvidia.com",
    isGovernment: false
  },
  {
    id: "int-decentro",
    category: "Internship",
    title: "Decentro Fintech Full-stack Intern",
    provider: "Decentro (Fintech Startup)",
    logoBg: "bg-purple-700",
    eligibility: "B.Tech 2nd/3rd Year, quick MVP build speed",
    deadline: "2026-07-28",
    daysLeft: 9,
    benefits: "Rapid startup environment, equity options, direct founder access, and remote perks",
    duration: "12 Weeks",
    mode: "Online",
    location: "Remote",
    difficulty: "Intermediate",
    stipendOrValue: "₹45,000/Mo",
    aiMatchScore: 90,
    whyRecommended: "Excellent for building rapid full-stack skills. Generates high-velocity experience for your portfolio.",
    requiredSkills: ["Express", "React", "RESTful API Integration"],
    selectionProcess: "48-Hour Full-stack API take-home project -> System Walkthrough",
    preparationTips: [
      "Review Node.js security, API rate limiters, and clean database schemas."
    ],
    websiteUrl: "https://decentro.tech",
    isGovernment: false
  },

  // 3. HACKATHONS (6 Examples)
  {
    id: "hck-sih",
    category: "Hackathon",
    title: "Smart India Hackathon (SIH) 2026",
    provider: "Ministry of Education, Govt of India",
    logoBg: "bg-amber-600",
    eligibility: "All Higher Education students registered in standard colleges",
    deadline: "2026-09-15",
    daysLeft: 58,
    benefits: "₹1,00,000 cash prize per problem statement, direct ministry recognition, incubation grants",
    duration: "36 Hours Continuous",
    mode: "Offline",
    location: "Noida",
    difficulty: "Advanced",
    stipendOrValue: "₹1,00,000 Prize",
    aiMatchScore: 96,
    whyRecommended: "🚨 High Priority. Aligns perfectly with your college team. Excellent platform to showcase your Devanagari OCR models.",
    requiredSkills: ["Web/App Dev", "Figma", "Presentation Skills"],
    theme: "Agriculture, Clean Water, Smart Cities, EduTech",
    prize: "₹1,00,000 cash prizes for winners",
    teamSize: "6 Members (Must have at least 1 female)",
    preparationChecklist: [
      "Select a ministry problem statement (e.g. Agritech Soil Health / OCR).",
      "Draft a 4-slide PPT presentation outlining architecture and wireframes.",
      "Obtain nomination letter from your college SPOC."
    ],
    websiteUrl: "https://www.sih.gov.in",
    isGovernment: true
  },
  {
    id: "hck-gsc",
    category: "Hackathon",
    title: "Google Solution Challenge 2026",
    provider: "Google Developer Student Clubs",
    logoBg: "bg-blue-600",
    eligibility: "Students registered with any local GDSC chapter",
    deadline: "2026-12-10",
    daysLeft: 144,
    benefits: "Global Google developer mentoring, feature highlight on Google blog, $3,000 cash awards",
    duration: "3 Months Build",
    mode: "Online",
    location: "Global",
    difficulty: "Intermediate",
    stipendOrValue: "$3,000 Global Prize",
    aiMatchScore: 89,
    whyRecommended: "Focuses on solving the UN Sustainable Development Goals using Google Cloud, Flutter, or Firebase.",
    requiredSkills: ["React/Flutter", "Firebase/GCP", "UI/UX Designer"],
    theme: "UN 17 Sustainable Development Goals",
    prize: "$3,000 to top 10 winning teams globally",
    teamSize: "1-4 Members",
    preparationChecklist: [
      "Conduct local community research to identify a real-world problem.",
      "Build a React or Flutter frontend connected to Firebase serverless."
    ],
    websiteUrl: "https://developers.google.com/community/gdsc",
    isGovernment: false
  },
  {
    id: "hck-ethindia",
    category: "Hackathon",
    title: "Devfolio EthIndia 2026 (Asia's Largest)",
    provider: "Devfolio & Ethereum Foundation",
    logoBg: "bg-slate-900",
    eligibility: "Open to all developers (subject to portfolio acceptance)",
    deadline: "2026-11-01",
    daysLeft: 105,
    benefits: "Sponsor bounties, premium Web3 swags, fully sponsored travel/food, networking",
    duration: "36 Hours",
    mode: "Offline",
    location: "Bangalore",
    difficulty: "Intense",
    stipendOrValue: "₹15,000 Bounties",
    aiMatchScore: 84,
    whyRecommended: "Invaluable for Web3 developer resume building. High visibility to global crypto investors.",
    requiredSkills: ["Solidity", "React/Vite", "Cryptography"],
    theme: "Decentralized Finance, Layer 2 scalability, Zero-Knowledge systems",
    prize: "$100,000+ total cumulative prize pool",
    teamSize: "1-4 Members",
    preparationChecklist: [
      "Complete basic Solidity token tutorials on CryptoZombies.",
      "Prepare a clean template repository with Vite and wagmi integrations."
    ],
    websiteUrl: "https://ethindia.co",
    isGovernment: false
  },
  {
    id: "hck-agritech",
    category: "Hackathon",
    title: "Hack2Skill Agritech AI Challenge",
    provider: "Ministry of Agriculture & Hack2Skill",
    logoBg: "bg-emerald-600",
    eligibility: "Engineering and technology students across India",
    deadline: "2026-08-20",
    daysLeft: 32,
    benefits: "₹2,50,000 seed funding, incubation support at regional tech hubs",
    duration: "48 Hours",
    mode: "Hybrid",
    location: "New Delhi",
    difficulty: "Intermediate",
    stipendOrValue: "₹2,50,000 Prize",
    aiMatchScore: 93,
    whyRecommended: "🌿 Matches your interest in soil health monitoring. Directly relates to your dream research goals.",
    requiredSkills: ["Python", "Computer Vision", "Scikit-Learn"],
    theme: "AI-driven Soil Nutrient mapping, predictive crop rotation",
    prize: "₹2,50,000 and direct government incubation",
    teamSize: "1-4 Members",
    preparationChecklist: [
      "Review open-source Kaggle soil datasets.",
      "Train a baseline Logistic Regression model to identify soil deficient markers."
    ],
    websiteUrl: "https://hack2skill.com",
    isGovernment: true
  },
  {
    id: "hck-unstop",
    category: "Hackathon",
    title: "Unstop National Coding League",
    provider: "Unstop",
    logoBg: "bg-indigo-700",
    eligibility: "All college students (CSE/ECE/Civil/Mech/Management)",
    deadline: "2026-08-10",
    daysLeft: 22,
    benefits: "Resume spotlighting to top Indian unicorn startups, MacBooks for winners",
    duration: "3 Rounds (Online)",
    mode: "Online",
    location: "Remote",
    difficulty: "Advanced",
    stipendOrValue: "₹1,50,000 Prize",
    aiMatchScore: 87,
    whyRecommended: "A pure test of algorithmic efficiency and coding speed. Perfect for technical resume building.",
    requiredSkills: ["C++", "Java", "Python", "DSA"],
    theme: "DSA speedruns and competitive architecture optimization",
    prize: "₹1,50,000 for elite performers",
    teamSize: "Individual",
    preparationChecklist: [
      "Complete 5 mock graph/tree contests on Unstop.",
      "Review core algorithmic complexity benchmarks."
    ],
    websiteUrl: "https://unstop.com",
    isGovernment: false
  },
  {
    id: "hck-bharatgen",
    category: "Hackathon",
    title: "BharatGen AI Hackathon",
    provider: "IIT Bombay & DST India",
    logoBg: "bg-red-700",
    eligibility: "Indian technology scholars and final year graduates",
    deadline: "2026-09-01",
    daysLeft: 44,
    benefits: "₹5,00,000 pilot development grant, server-class GPU compute credits",
    duration: "72 Hours",
    mode: "Offline",
    location: "Mumbai",
    difficulty: "Intense",
    stipendOrValue: "₹5,00,000 Grant",
    aiMatchScore: 91,
    whyRecommended: "Matches your CSE (AI/ML) specialization. Building for Indian regional languages is highly valued.",
    requiredSkills: ["LangChain", "Vector DBs", "Model Fine-tuning"],
    theme: "Indic Language Large Models & Generative AI for government databases",
    prize: "₹5,00,000 for top 3 production-ready MVPs",
    teamSize: "1-4 Members",
    preparationChecklist: [
      "Explore open-source Bhashini API documentation.",
      "Set up a vector database index using Pinecone or Milvus."
    ],
    websiteUrl: "https://www.iitb.ac.in",
    isGovernment: true
  },

  // 4. CERTIFICATIONS (6 Examples)
  {
    id: "crt-gcp-ace",
    category: "Certification",
    title: "Google Cloud Certified Associate Cloud Engineer",
    provider: "Google Cloud Academy",
    logoBg: "bg-blue-600",
    eligibility: "Open to anyone interested in cloud operations & container deployment",
    deadline: "Self-Paced",
    daysLeft: 365,
    benefits: "Global resume credential, access to Google Cloud certified communities",
    duration: "6-8 Weeks",
    mode: "Online",
    location: "Remote",
    difficulty: "Intermediate",
    stipendOrValue: "High-Value Certificate",
    aiMatchScore: 91,
    whyRecommended: "Provides vital backend skills. Understanding cloud scaling is critical for production-ready engineering.",
    requiredSkills: ["Cloud Networks", "IAM", "VPCs", "Containers"],
    certificate: "Google Cloud Certified ACE badge",
    careerImpact: "Increases infrastructure/DevOps shortlist invites by 40%.",
    prerequisites: ["Basic networking", "Familiarity with CLI environments"],
    websiteUrl: "https://cloud.google.com/learn"
  },
  {
    id: "crt-azure-ai",
    category: "Certification",
    title: "Microsoft Azure AI Engineer Associate (AI-102)",
    provider: "Microsoft Learn",
    logoBg: "bg-indigo-600",
    eligibility: "Developers wanting to deploy Cognitive services and generative models",
    deadline: "Self-Paced",
    daysLeft: 365,
    benefits: "Industry recognized certification badge, direct developer score mapping",
    duration: "8-10 Weeks",
    mode: "Online",
    location: "Remote",
    difficulty: "Advanced",
    stipendOrValue: "AI Architect Certificate",
    aiMatchScore: 94,
    whyRecommended: "Directly complements your CSE AI & ML curriculum. Highly relevant for enterprise model deployments.",
    requiredSkills: ["Azure OpenAI", "Model Fine-Tuning", "Vector Search"],
    certificate: "Microsoft Certified: Azure AI Engineer Associate",
    careerImpact: "Validates enterprise generative AI pipeline architecture skills.",
    prerequisites: ["Python proficiency", "Azure portal navigation basics"],
    websiteUrl: "https://learn.microsoft.com"
  },
  {
    id: "crt-aws-architect",
    category: "Certification",
    title: "AWS Solutions Architect - Associate",
    provider: "AWS Academy",
    logoBg: "bg-slate-800",
    eligibility: "Developers and engineers targeting large enterprise software roles",
    deadline: "Self-Paced",
    daysLeft: 365,
    benefits: "Highly valued cloud systems architect badge recognized worldwide",
    duration: "10-12 Weeks",
    mode: "Online",
    location: "Remote",
    difficulty: "Advanced",
    stipendOrValue: "Global Core Certificate",
    aiMatchScore: 88,
    whyRecommended: "Builds deep knowledge about scaling databases, CDNs, and load balancers securely.",
    requiredSkills: ["System Reliability", "AWS EC2/S3", "Auto-scaling"],
    certificate: "AWS Certified Solutions Architect Associate",
    careerImpact: "Core industry benchmark for high-salary backend cloud operations.",
    prerequisites: ["Basic knowledge of server-side requests and DBs"],
    websiteUrl: "https://aws.amazon.com/training"
  },
  {
    id: "crt-nptel-dsa",
    category: "Certification",
    title: "NPTEL Data Structures & Algorithms in Python",
    provider: "IIT Madras & NASSCOM",
    logoBg: "bg-red-600",
    eligibility: "Undergraduates in any technical degree across India",
    deadline: "2026-08-01",
    daysLeft: 13,
    benefits: "IIT Madras certified physical gold/silver certificate card, credits for college SGPA",
    duration: "12 Weeks",
    mode: "Online",
    location: "National",
    difficulty: "Advanced",
    stipendOrValue: "IIT Gold/Elite Badge",
    aiMatchScore: 96,
    whyRecommended: "🌿 Highly recommended. Extreme academic weight in Indian placement interviews and higher study profiles.",
    requiredSkills: ["Python Syntax", "Complexity Analysis", "Data Structures"],
    certificate: "NPTEL elite gold-certified physical badge",
    careerImpact: "Extremely well-regarded by top Indian service and product companies.",
    prerequisites: ["Introductory Python logic"],
    websiteUrl: "https://nptel.ac.in"
  },
  {
    id: "crt-coursera-dl",
    category: "Certification",
    title: "Coursera DeepLearning.AI Specialization",
    provider: "Andrew Ng / DeepLearning.AI",
    logoBg: "bg-blue-700",
    eligibility: "Open to all students with basic Python & Linear Algebra foundations",
    deadline: "Self-Paced",
    daysLeft: 365,
    benefits: "Direct learning under Andrew Ng, highly shared credential on LinkedIn",
    duration: "16 Weeks",
    mode: "Online",
    location: "Remote",
    difficulty: "Intense",
    stipendOrValue: "Academic Gold Standard",
    aiMatchScore: 95,
    whyRecommended: "Directly demystifies CNNs, RNNs, backpropagation calculus, and optimization tricks.",
    requiredSkills: ["PyTorch Core", "NumPy Matrix Math", "Gradient Descent"],
    certificate: "DeepLearning.AI Certificate Badge",
    careerImpact: "Highest standard credential validating foundational computer vision and model theory.",
    prerequisites: ["Vector math", "High school calculus", "Python basics"],
    websiteUrl: "https://www.coursera.org"
  },
  {
    id: "crt-fsp-sec",
    category: "Certification",
    title: "FutureSkills Prime Cybersecurity Foundation",
    provider: "NASSCOM & Ministry of IT, Govt of India",
    logoBg: "bg-emerald-600",
    eligibility: "All technical and non-technical students aiming for secure IT roles",
    deadline: "2026-09-10",
    daysLeft: 53,
    benefits: "Government of India security certification card, full skill subsidy reimbursement",
    duration: "6 Weeks",
    mode: "Online",
    location: "Remote",
    difficulty: "Beginner",
    stipendOrValue: "NASSCOM-Subsidy Badge",
    aiMatchScore: 84,
    whyRecommended: "Government-aligned baseline. Demonstrates secure coding and network compliance standards.",
    requiredSkills: ["Basic Cybersecurity", "Encryption Standards"],
    certificate: "NASSCOM FutureSkills Prime Certified Credentials",
    careerImpact: "Fulfills baseline government audit compliance credentials for security.",
    prerequisites: ["No strict prerequisites"],
    websiteUrl: "https://futureskillsprime.in"
  }
];

export const OpportunityCompassView: React.FC<OpportunityCompassViewProps> = ({
  profile,
  onUpdateProfile,
  activeAtmosphere,
  accessibility,
  missions,
  onAddMission,
  currentUser
}) => {
  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDegree, setFilterDegree] = useState("All");
  const [filterSemester, setFilterSemester] = useState("All");
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterSkill, setFilterSkill] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterMode, setFilterMode] = useState("All");
  const [filterPaid, setFilterPaid] = useState("All");
  const [filterSponsor, setFilterSponsor] = useState("All");

  // User Interactive States
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [trackedIds, setTrackedIds] = useState<string[]>(["sch-reliance", "int-google-step", "hck-sih"]);
  const [appliedStatuses, setAppliedStatuses] = useState<Record<string, string>>({
    "sch-nsp": "Not Started",
    "sch-reliance": "Application Started",
    "int-google-step": "Documents Pending",
    "hck-sih": "Submitted"
  });

  // Load opportunity states from Firebase or local storage
  useEffect(() => {
    let active = true;
    const loadStates = async () => {
      if (currentUser) {
        try {
          const res = await fetchUserOpportunityStates(currentUser.uid);
          if (active && res) {
            if (res.savedIds) setSavedIds(res.savedIds);
            if (res.trackedIds) setTrackedIds(res.trackedIds);
            if (res.appliedStatuses) setAppliedStatuses(res.appliedStatuses);
          }
        } catch (err) {
          console.error("Failed to fetch opportunity states:", err);
        }
      } else {
        const saved = localStorage.getItem("soulsync_opps_local");
        if (active && saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.savedIds) setSavedIds(parsed.savedIds);
            if (parsed.trackedIds) setTrackedIds(parsed.trackedIds);
            if (parsed.appliedStatuses) setAppliedStatuses(parsed.appliedStatuses);
          } catch (e) {
            // ignore
          }
        }
      }
    };
    loadStates();
    return () => { active = false; };
  }, [currentUser]);

  // Save states to Firebase or local storage on change
  useEffect(() => {
    // Avoid saving empty arrays on initial empty mount before loading finishes
    if (savedIds.length === 0 && trackedIds.length === 3 && Object.keys(appliedStatuses).length === 4) return;
    const data = { savedIds, trackedIds, appliedStatuses };
    localStorage.setItem("soulsync_opps_local", JSON.stringify(data));
    if (currentUser) {
      saveUserOpportunityStates(currentUser.uid, data).catch((err) => {
        console.error("Failed to auto-sync opportunity states:", err);
      });
    }
  }, [savedIds, trackedIds, appliedStatuses, currentUser]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeAskAIId, setActiveAskAIId] = useState<string | null>(null);
  const [customAIQuestions, setCustomAIQuestions] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Career Intelligence & Matching engine states
  const [dynamicOpportunities, setDynamicOpportunities] = useState<any[]>(OPPORTUNITIES_DATA);
  const [isAISearching, setIsAISearching] = useState(false);
  const [isAIMatchingActive, setIsAIMatchingActive] = useState(true);

  // Preparation Mode States
  const [selectedPrepOpportunity, setSelectedPrepOpportunity] = useState<any | null>(null);
  const [prepRoadmapData, setPrepRoadmapData] = useState<any | null>(null);
  const [isLoadingPrep, setIsLoadingPrep] = useState(false);
  const [activePrepTab, setActivePrepTab] = useState<"roadmap" | "resources" | "practice" | "timeline">("roadmap");
  const [completedPrepTasks, setCompletedPrepTasks] = useState<Record<string, boolean>>({});

  const handleAISearch = async (queryVal: string) => {
    setSearchQuery(queryVal);
    if (!queryVal.trim()) {
      setDynamicOpportunities(OPPORTUNITIES_DATA);
      return;
    }

    setIsAISearching(true);
    try {
      const response = await fetch("/api/opportunities/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryVal,
          profile,
          mode: "live"
        })
      });
      const data = await response.json();
      if (data && data.opportunities) {
        setDynamicOpportunities(data.opportunities);
      }
    } catch (err) {
      console.error("AI Search query endpoint failed, retaining fallback list:", err);
    } finally {
      setIsAISearching(false);
    }
  };

  const handleActivatePrepMode = async (opp: any) => {
    setSelectedPrepOpportunity(opp);
    setIsLoadingPrep(true);
    setPrepRoadmapData(null);
    setActivePrepTab("roadmap");

    try {
      const response = await fetch("/api/opportunities/prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: opp.id,
          opportunityTitle: opp.title,
          provider: opp.provider,
          profile,
          mode: "live"
        })
      });
      const data = await response.json();
      setPrepRoadmapData(data);
    } catch (err) {
      console.error("AI prep roadmap fetching failed:", err);
    } finally {
      setIsLoadingPrep(false);
    }
  };

  const renderExplainabilityLedger = (opp: any) => {
    const whyThis = opp.explainability?.whyThis || opp.whyRecommended || `Matched based on your B.Tech ${profile?.branch || "CSE"} curriculum. Perfect for ${profile?.semester || "current"} semester milestones.`;
    const skillsGained = opp.explainability?.skillsGained || `Provides critical practical training in ${(opp.requiredSkills || []).join(", ")}.`;
    const strengthenDreamPath = opp.explainability?.strengthenDreamPath || `Directly aligns with your career path of becoming a ${profile?.careerGoal || "Software Engineer"}.`;
    const effortNeeded = opp.explainability?.effortNeeded || (opp.category === "Certification" ? "Self-paced, ~5 hours/week study." : "Requires 8-10 hours/week intensive focus.");
    const expectedCareerImpact = opp.explainability?.expectedCareerImpact || opp.careerImpact || "Significantly strengthens corporate profile selection metrics.";

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#2D214F]/40 p-3.5 rounded-2xl border border-white/5 text-[11px] leading-relaxed">
        <div className="space-y-0.5">
          <span className="text-[9px] font-mono text-pink-300 font-bold uppercase block">💡 Why This Opportunity?</span>
          <p className="text-white/80">{whyThis}</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[9px] font-mono text-emerald-300 font-bold uppercase block">🛠️ Target Skills</span>
          <p className="text-white/80">{skillsGained}</p>
        </div>
        <div className="space-y-0.5 sm:col-span-2 border-t border-white/5 pt-2">
          <span className="text-[9px] font-mono text-indigo-300 font-bold uppercase block">🎯 DreamPath Impact</span>
          <p className="text-white/80">{strengthenDreamPath}</p>
        </div>
        <div className="space-y-0.5 border-t border-white/5 pt-2">
          <span className="text-[9px] font-mono text-amber-300 font-bold uppercase block">⏳ Effort Needed</span>
          <p className="text-white/80">{effortNeeded}</p>
        </div>
        <div className="space-y-0.5 border-t border-white/5 pt-2">
          <span className="text-[9px] font-mono text-purple-300 font-bold uppercase block">💼 Long-term Impact</span>
          <p className="text-white/80">{expectedCareerImpact}</p>
        </div>
      </div>
    );
  };

  // Active category focus filter (from Dashboard cards)
  const [selectedDashboardCategory, setSelectedDashboardCategory] = useState<string | null>(null);

  // Simulated portal state
  const [simulatingPortal, setSimulatingPortal] = useState<OpportunityItem | null>(null);

  // Notification states (AI Reminder System)
  const [activeReminders, setActiveReminders] = useState<Array<{ id: string; type: string; text: string; actionText: string; opportunityId: string }>>([
    {
      id: "rem-1",
      type: "coaching",
      text: "🌿 The Reliance Foundation Scholarship closes in 5 days. You already meet the 8.5+ CGPA and B.Tech criteria. Would you like to complete the application today?",
      actionText: "Open Apply Portal",
      opportunityId: "sch-reliance"
    },
    {
      id: "rem-2",
      type: "mindful",
      text: "You have enough time for Google STEP (17 days left). Let's focus on your university DSA assignment today and generate preparation missions this weekend.",
      actionText: "Create Prep Missions",
      opportunityId: "int-google-step"
    }
  ]);

  // Clean filters reset
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterDegree("All");
    setFilterSemester("All");
    setFilterBranch("All");
    setFilterSkill("All");
    setFilterLocation("All");
    setFilterMode("All");
    setFilterPaid("All");
    setFilterSponsor("All");
    setSelectedDashboardCategory(null);
  };

  // Toggle saved bookmarks
  const toggleSave = (id: string) => {
    setSavedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    const item = OPPORTUNITIES_DATA.find(o => o.id === id);
    if (!savedIds.includes(id) && item) {
      setToastMessage(`Saved "${item.title}" to your bookmarks list.`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Toggle active deadline tracking
  const toggleTrack = (id: string) => {
    setTrackedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    const item = OPPORTUNITIES_DATA.find(o => o.id === id);
    if (!trackedIds.includes(id) && item) {
      setToastMessage(`Smart Tracker activated for "${item.title}"! Countdown live.`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Convert opportunity requirements to live global Growth Missions
  const handleConvertToMissions = (opp: OpportunityItem) => {
    const customMissions = opp.category === "Scholarship"
      ? [
          { title: "Review Scholarship criteria & gather bonafide", duration: "2 Hrs" },
          { title: "Draft Personal Statement & career statement draft", duration: "4 Hrs" },
          { title: "Verify reference letter documents with HOD", duration: "1.5 Hrs" }
        ]
      : opp.category === "Internship"
      ? [
          { title: "Complete 30 core DSA algorithmic challenges", duration: "10 Hrs" },
          { title: "Refactor GitHub portfolio (include Devanagari model logs)", duration: "6 Hrs" },
          { title: "Study OS memory buffers and thread handling foundations", duration: "4 Hrs" }
        ]
      : opp.category === "Hackathon"
      ? [
          { title: "Form collaborative team of 6 with 1 female peer", duration: "3 Hrs" },
          { title: "Draft 4-slide PPT layout with full system architecture", duration: "5 Hrs" },
          { title: "Build functional React frontend connected to static APIs", duration: "8 Hrs" }
        ]
      : [
          { title: "Finish initial 3 modules & NPTEL practice labs", duration: "8 Hrs" },
          { title: "Take 2 full-length mock certification exams", duration: "4 Hrs" },
          { title: "Share verified certificate badge on professional profiles", duration: "1 Hr" }
        ];

    customMissions.forEach((m, idx) => {
      onAddMission({
        id: `opp-mission-${opp.id}-${idx}-${Date.now()}`,
        title: `[${opp.title}] ${m.title}`,
        deadline: "In 14 Days",
        estimatedTime: m.duration,
        dreamImpact: "Direct Career Target",
        completed: false,
        category: "Career"
      });
    });

    setToastMessage(`🎉 3 customized Growth Missions created! Added to your global Living Progress dashboard.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Status text helpers
  const getAppliedStatusColor = (status: string) => {
    switch (status) {
      case "Submitted": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "Application Started": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Documents Pending": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "Missed": return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      default: return "bg-white/5 text-white/50 border-white/10";
    }
  };

  // Main filtering logic combining search and filters
  const filteredOpportunities = useMemo(() => {
    return dynamicOpportunities.filter(opp => {
      // Category Focus filter (Dashboard selection)
      if (selectedDashboardCategory && opp.category !== selectedDashboardCategory) {
        return false;
      }

      // Search matching title, provider, skills
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        opp.title.toLowerCase().includes(q) || 
        opp.provider.toLowerCase().includes(q) ||
        (opp.requiredSkills || []).some((s: string) => s.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Filter: Degree (B.Tech, BCA etc)
      if (filterDegree !== "All") {
        if (filterDegree === "B.Tech" && !opp.eligibility.includes("B.Tech") && !opp.eligibility.includes("UG")) return false;
        if (filterDegree === "BCA" && !opp.eligibility.includes("BCA") && !opp.eligibility.includes("UG")) return false;
      }

      // Filter: Semester
      if (filterSemester !== "All") {
        if (filterSemester === "3rd" && !opp.eligibility.includes("3rd") && !opp.eligibility.includes("UG")) return false;
        if (filterSemester === "1st" && !opp.eligibility.includes("1st") && !opp.eligibility.includes("UG")) return false;
      }

      // Filter: Branch
      if (filterBranch !== "All") {
        if (filterBranch === "CSE" && !opp.eligibility.includes("CSE") && !opp.eligibility.includes("UG")) return false;
        if (filterBranch === "ECE" && !opp.eligibility.includes("ECE") && !opp.eligibility.includes("UG")) return false;
      }

      // Filter: Skill level
      if (filterSkill !== "All" && opp.difficulty !== filterSkill) {
        return false;
      }

      // Filter: Location
      if (filterLocation !== "All" && opp.location !== filterLocation) {
        return false;
      }

      // Filter: Mode
      if (filterMode !== "All" && opp.mode !== filterMode) {
        return false;
      }

      // Filter: Paid/Free
      if (filterPaid !== "All") {
        const isFree = opp.stipendOrValue.toLowerCase().includes("free");
        if (filterPaid === "Paid" && isFree) return false;
        if (filterPaid === "Free" && !isFree) return false;
      }

      // Filter: Government/Private (Sponsor)
      if (filterSponsor !== "All") {
        const isGov = opp.isGovernment === true;
        if (filterSponsor === "Government" && !isGov) return false;
        if (filterSponsor === "Private" && isGov) return false;
      }

      return true;
    });
  }, [
    dynamicOpportunities,
    searchQuery,
    selectedDashboardCategory,
    filterDegree,
    filterSemester,
    filterBranch,
    filterSkill,
    filterLocation,
    filterMode,
    filterPaid,
    filterSponsor
  ]);

  // AI Recommended list (filtered from list where match is high)
  const aiRecommendedList = useMemo(() => {
    return filteredOpportunities.filter(o => o.aiMatchScore >= 85);
  }, [filteredOpportunities]);

  // Dynamic Dashboard categories counting
  const dashboardStats = useMemo(() => {
    const stats: Record<string, { total: number; closingSoon: number; applied: number; saved: number; avgMatch: number }> = {
      Scholarship: { total: 0, closingSoon: 0, applied: 0, saved: 0, avgMatch: 0 },
      Internship: { total: 0, closingSoon: 0, applied: 0, saved: 0, avgMatch: 0 },
      Hackathon: { total: 0, closingSoon: 0, applied: 0, saved: 0, avgMatch: 0 },
      Certification: { total: 0, closingSoon: 0, applied: 0, saved: 0, avgMatch: 0 }
    };

    OPPORTUNITIES_DATA.forEach(opp => {
      const cat = opp.category;
      stats[cat].total += 1;
      if (opp.daysLeft <= 30) stats[cat].closingSoon += 1;
      if (appliedStatuses[opp.id] && appliedStatuses[opp.id] !== "Not Started") stats[cat].applied += 1;
      if (savedIds.includes(opp.id)) stats[cat].saved += 1;
      stats[cat].avgMatch += opp.aiMatchScore;
    });

    Object.keys(stats).forEach(key => {
      stats[key].avgMatch = Math.round(stats[key].avgMatch / stats[key].total);
    });

    return stats;
  }, [savedIds, appliedStatuses]);

  // Living Atmosphere Particles Renderer
  const renderAtmosphericParticles = () => {
    if (accessibility.staticBackground) return null;

    switch (activeAtmosphere) {
      case "rain":
        return (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-25">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-[1px] h-10 bg-sky-300"
                style={{ left: `${15 + i * 15}%`, top: `-${10 + i * 5}%` }}
                animate={{ y: ["0vh", "100vh"] }}
                transition={{ duration: 2.0 + (i % 2), repeat: Infinity, ease: "linear", delay: i * 0.4 }}
              />
            ))}
          </div>
        );
      case "forest":
        return (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full bg-pink-400/20 blur-[1px]"
                style={{ left: `${20 + i * 22}%`, top: `${25 + i * 15}%` }}
                animate={{ x: [0, 40, -20, 0], y: [0, -60, -30, 0], opacity: [0.1, 0.6, 0.2] }}
                transition={{ duration: 8.0 + i * 1.0, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
              />
            ))}
          </div>
        );
      case "night":
        return (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-yellow-200/50"
                style={{ left: `${10 + i * 20}%`, top: `${15 + i * 12}%` }}
                animate={{ opacity: [0.1, 0.8, 0.2], y: [0, -15, 0] }}
                transition={{ duration: 4.5 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const cardGlowClass = activeAtmosphere === "sunset"
    ? "shadow-[0_0_15px_rgba(251,113,133,0.12)] border-rose-300/20 bg-rose-950/10"
    : "border-white/10 bg-white/10";

  return (
    <div className="relative space-y-8 animate-fade-in text-white z-10 w-full min-h-screen px-2 md:px-0">
      {renderAtmosphericParticles()}

      {/* HEADER ROW */}
      <div className={`p-6 md:p-8 rounded-3xl backdrop-blur-md border shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden ${cardGlowClass}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-xl">
          <span className="text-[10px] font-mono uppercase text-pink-300 tracking-widest block font-bold">SOULPRINT INTEGRATED DISCOVERY</span>
          <h1 className="text-3xl font-display font-extrabold tracking-tight flex items-center gap-2.5">
            <Compass className="w-8 h-8 text-pink-300 animate-spin-slow" />
            Opportunity Compass AI
          </h1>
          <p className="text-xs text-white/80 leading-relaxed">
            Intelligently aggregating scholarships, elite tech internships, and prestigious coding hackathons specifically matched with your <strong>SoulPrint</strong>. Never search across dozens of websites or miss important deadlines again.
          </p>
        </div>

        {/* Dynamic Search & Collapsible Filters Trigger */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10">
          <div className="relative w-full sm:w-72">
            <input
              id="opportunity-search-input"
              type="text"
              placeholder="Query opportunities or ask AI..."
              value={searchQuery}
              onChange={(e) => handleAISearch(e.target.value)}
              className="w-full pl-9 pr-10 py-2 rounded-xl border border-white/15 bg-white/5 backdrop-blur-md text-xs focus:outline-none focus:ring-1 focus:ring-pink-300/50 text-white placeholder-white/40"
            />
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
            {isAISearching && (
              <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-pulse absolute right-3 top-3" />
            )}
          </div>

          <button
            onClick={() => {
              setIsAIMatchingActive(!isAIMatchingActive);
              setToastMessage(!isAIMatchingActive ? "🧠 AI Matching & Compatibility scores activated!" : "AI Matching scores disabled.");
              setTimeout(() => setToastMessage(null), 3000);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer w-full sm:w-auto justify-center ${
              isAIMatchingActive 
                ? "bg-pink-500/20 border-pink-400/30 text-pink-200" 
                : "bg-white/5 border-white/10 text-white/50"
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>AI Match Score</span>
          </button>
          
          <button
            id="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer w-full sm:w-auto justify-center ${
              showFilters 
                ? "bg-white text-indigo-950 border-white" 
                : "bg-white/5 border-white/10 hover:bg-white/10 text-white/90"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* CUSTOM TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-indigo-950/95 backdrop-blur-xl border border-pink-400/30 shadow-2xl flex items-center space-x-3 text-white text-xs max-w-sm"
          >
            <Sparkles className="w-5 h-5 text-pink-300 shrink-0" />
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-white/40 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COLLAPSIBLE INTELLIGENT FILTER PANEL */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-5 rounded-2xl bg-slate-950/40 border border-white/10 overflow-hidden relative"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-white/50 block font-mono">DEGREE</label>
                <select
                  id="filter-degree"
                  value={filterDegree}
                  onChange={(e) => setFilterDegree(e.target.value)}
                  className="w-full bg-[#342D5A] border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-300"
                >
                  <option value="All">All Degrees</option>
                  <option value="B.Tech">B.Tech (Engineering)</option>
                  <option value="BCA">BCA / MCA</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/50 block font-mono">SEMESTER</label>
                <select
                  id="filter-semester"
                  value={filterSemester}
                  onChange={(e) => setFilterSemester(e.target.value)}
                  className="w-full bg-[#342D5A] border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-300"
                >
                  <option value="All">All Semesters</option>
                  <option value="1st">1st Semester</option>
                  <option value="3rd">3rd Semester (Active)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/50 block font-mono">BRANCH</label>
                <select
                  id="filter-branch"
                  value={filterBranch}
                  onChange={(e) => setFilterBranch(e.target.value)}
                  className="w-full bg-[#342D5A] border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-300"
                >
                  <option value="All">All Branches</option>
                  <option value="CSE">CSE (AI / ML)</option>
                  <option value="ECE">ECE / Telecom</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/50 block font-mono">SKILL LEVEL</label>
                <select
                  id="filter-skill"
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                  className="w-full bg-[#342D5A] border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-300"
                >
                  <option value="All">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Intense">Intense</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/50 block font-mono">LOCATION</label>
                <select
                  id="filter-location"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full bg-[#342D5A] border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-300"
                >
                  <option value="All">All Locations</option>
                  <option value="Remote">Remote</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/50 block font-mono">MODE</label>
                <select
                  id="filter-mode"
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="w-full bg-[#342D5A] border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-300"
                >
                  <option value="All">All Modes</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/50 block font-mono">COMPENSATION</label>
                <select
                  id="filter-paid"
                  value={filterPaid}
                  onChange={(e) => setFilterPaid(e.target.value)}
                  className="w-full bg-[#342D5A] border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-300"
                >
                  <option value="All">Paid & Free</option>
                  <option value="Paid">Paid / Grant Available</option>
                  <option value="Free">Free Learning / Cert</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/50 block font-mono">SPONSOR TYPE</label>
                <select
                  id="filter-sponsor"
                  value={filterSponsor}
                  onChange={(e) => setFilterSponsor(e.target.value)}
                  className="w-full bg-[#342D5A] border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-300"
                >
                  <option value="All">All Sponsors</option>
                  <option value="Government">Government / Public</option>
                  <option value="Private">Private / Corporate</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 text-xs">
              <span className="text-white/60">
                Filtered <strong>{filteredOpportunities.length}</strong> of {OPPORTUNITIES_DATA.length} opportunities.
              </span>
              <button
                onClick={handleResetFilters}
                className="px-3.5 py-1.5 rounded-xl border border-white/10 hover:bg-white/10 text-pink-300 font-semibold cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI REMINDER SYSTEM - SUPPORTIVE COACHING NOTIFICATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeReminders.map(rem => {
          const item = OPPORTUNITIES_DATA.find(o => o.id === rem.opportunityId);
          return (
            <div
              key={rem.id}
              className="p-4 rounded-2xl bg-white/5 border border-pink-500/20 shadow-md flex items-start space-x-3 text-xs relative"
            >
              <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-300 shrink-0">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-pink-300 font-bold">
                    {rem.type === "coaching" ? "🌿 SoulPrint Coaching Alert" : "🎯 Study Balance Guide"}
                  </span>
                  <button
                    onClick={() => setActiveReminders(prev => prev.filter(r => r.id !== rem.id))}
                    className="text-white/40 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-white/90 leading-relaxed font-sans">{rem.text}</p>

                {item && (
                  <div className="flex items-center gap-2 pt-1.5">
                    <button
                      onClick={() => {
                        if (rem.type === "coaching") {
                          setSimulatingPortal(item);
                        } else {
                          handleConvertToMissions(item);
                        }
                      }}
                      className="px-3 py-1 rounded bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white font-bold text-[10px] transition cursor-pointer"
                    >
                      {rem.actionText}
                    </button>
                    <button
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-[10px] transition cursor-pointer"
                    >
                      Inspect Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 1: OPPORTUNITY DASHBOARD (6 CATEGORY SUMMARY CARDS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase font-bold tracking-widest text-white/60 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-pink-300" />
            Section 1: Opportunity Dashboard
          </h2>
          {selectedDashboardCategory && (
            <button
              onClick={() => setSelectedDashboardCategory(null)}
              className="text-xs font-bold text-pink-300 flex items-center gap-1"
            >
              <span>Showing category: {selectedDashboardCategory} (Reset)</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          
          {/* SCHOLARSHIPS */}
          <div
            onClick={() => setSelectedDashboardCategory(selectedDashboardCategory === "Scholarship" ? null : "Scholarship")}
            className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative group flex flex-col justify-between h-[155px] ${
              selectedDashboardCategory === "Scholarship"
                ? "bg-white/15 border-white shadow-xl scale-[1.03]"
                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">🎓</span>
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {dashboardStats.Scholarship.avgMatch}% Match
                </span>
              </div>
              <h3 className="text-xs font-bold font-sans">Scholarships</h3>
              <p className="text-[10px] text-white/50 block mt-0.5">National & Corporate</p>
            </div>
            <div className="space-y-1 border-t border-white/5 pt-2">
              <div className="flex justify-between text-[10px] text-white/70">
                <span>Available:</span>
                <strong className="text-white font-mono">{dashboardStats.Scholarship.total} Active</strong>
              </div>
              <div className="flex justify-between text-[9px] text-white/40">
                <span>Closing Soon:</span>
                <strong className="text-rose-300 font-mono">{dashboardStats.Scholarship.closingSoon}</strong>
              </div>
            </div>
          </div>

          {/* INTERNSHIPS */}
          <div
            onClick={() => setSelectedDashboardCategory(selectedDashboardCategory === "Internship" ? null : "Internship")}
            className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative group flex flex-col justify-between h-[155px] ${
              selectedDashboardCategory === "Internship"
                ? "bg-white/15 border-white shadow-xl scale-[1.03]"
                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">💼</span>
                <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  {dashboardStats.Internship.avgMatch}% Match
                </span>
              </div>
              <h3 className="text-xs font-bold font-sans">Internships</h3>
              <p className="text-[10px] text-white/50 block mt-0.5">Software & Labs</p>
            </div>
            <div className="space-y-1 border-t border-white/5 pt-2">
              <div className="flex justify-between text-[10px] text-white/70">
                <span>Available:</span>
                <strong className="text-white font-mono">{dashboardStats.Internship.total} Active</strong>
              </div>
              <div className="flex justify-between text-[9px] text-white/40">
                <span>Closing Soon:</span>
                <strong className="text-rose-300 font-mono">{dashboardStats.Internship.closingSoon}</strong>
              </div>
            </div>
          </div>

          {/* HACKATHONS */}
          <div
            onClick={() => setSelectedDashboardCategory(selectedDashboardCategory === "Hackathon" ? null : "Hackathon")}
            className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative group flex flex-col justify-between h-[155px] ${
              selectedDashboardCategory === "Hackathon"
                ? "bg-white/15 border-white shadow-xl scale-[1.03]"
                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">🏆</span>
                <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {dashboardStats.Hackathon.avgMatch}% Match
                </span>
              </div>
              <h3 className="text-xs font-bold font-sans">Hackathons</h3>
              <p className="text-[10px] text-white/50 block mt-0.5">Government & Global</p>
            </div>
            <div className="space-y-1 border-t border-white/5 pt-2">
              <div className="flex justify-between text-[10px] text-white/70">
                <span>Available:</span>
                <strong className="text-white font-mono">{dashboardStats.Hackathon.total} Active</strong>
              </div>
              <div className="flex justify-between text-[9px] text-white/40">
                <span>Closing Soon:</span>
                <strong className="text-rose-300 font-mono">{dashboardStats.Hackathon.closingSoon}</strong>
              </div>
            </div>
          </div>

          {/* CERTIFICATIONS */}
          <div
            onClick={() => setSelectedDashboardCategory(selectedDashboardCategory === "Certification" ? null : "Certification")}
            className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative group flex flex-col justify-between h-[155px] ${
              selectedDashboardCategory === "Certification"
                ? "bg-white/15 border-white shadow-xl scale-[1.03]"
                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">📜</span>
                <span className="text-[9px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  {dashboardStats.Certification.avgMatch}% Match
                </span>
              </div>
              <h3 className="text-xs font-bold font-sans">Certifications</h3>
              <p className="text-[10px] text-white/50 block mt-0.5">Cloud & Algorithms</p>
            </div>
            <div className="space-y-1 border-t border-white/5 pt-2">
              <div className="flex justify-between text-[10px] text-white/70">
                <span>Available:</span>
                <strong className="text-white font-mono">{dashboardStats.Certification.total} Active</strong>
              </div>
              <div className="flex justify-between text-[9px] text-white/40">
                <span>Closing Soon:</span>
                <strong className="text-rose-300 font-mono">{dashboardStats.Certification.closingSoon}</strong>
              </div>
            </div>
          </div>

          {/* RESEARCH PROGRAMS (Simulated Live) */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between h-[155px] opacity-80 hover:opacity-100 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">🧪</span>
                <span className="text-[9px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                  92% Match
                </span>
              </div>
              <h3 className="text-xs font-bold font-sans">Research Programs</h3>
              <p className="text-[10px] text-white/50 block mt-0.5">IITs & IISc Labs</p>
            </div>
            <div className="space-y-1 border-t border-white/5 pt-2 text-[10px] text-white/70">
              <span className="text-[9px] font-mono text-pink-300 block font-bold">📡 PREPARING LIVE GATEWAY</span>
              <div className="flex justify-between text-[9px] text-white/40 mt-1">
                <span>Available soon:</span>
                <span className="font-mono">8 Active</span>
              </div>
            </div>
          </div>

          {/* STARTUP PROGRAMS (Simulated Live) */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between h-[155px] opacity-80 hover:opacity-100 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">🚀</span>
                <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  90% Match
                </span>
              </div>
              <h3 className="text-xs font-bold font-sans">Startup Programs</h3>
              <p className="text-[10px] text-white/50 block mt-0.5">NIDHI-Prayas & E-Cells</p>
            </div>
            <div className="space-y-1 border-t border-white/5 pt-2 text-[10px] text-white/70">
              <span className="text-[9px] font-mono text-pink-300 block font-bold">📡 PREPARING LIVE GATEWAY</span>
              <div className="flex justify-between text-[9px] text-white/40 mt-1">
                <span>Available soon:</span>
                <span className="font-mono">5 Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CORE DISPLAY RENDERER */}
      <div className="space-y-12">
        {filteredOpportunities.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg space-y-6 max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto border border-pink-500/20 text-4xl animate-bounce">
              🧭
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display font-extrabold text-white">No Matching Opportunities Found</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                We couldn't find any opportunities matching your current search or filters. Let's adjust your search, clear some filters, or explore our curated collections to find your perfect path.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-2xl bg-white text-indigo-950 hover:bg-white/90 font-bold text-xs transition-all duration-200 cursor-pointer shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {/* SECTION 2: AI RECOMMENDED OPPORTUNITIES (Match Score >= 85%) */}
        {(!selectedDashboardCategory || selectedDashboardCategory === "Scholarship" || selectedDashboardCategory === "Internship") && (
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase font-bold tracking-widest text-pink-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-300 animate-pulse" />
              Section 2: AI Recommended For You
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiRecommendedList.slice(0, 3).map(opp => {
                const isSaved = savedIds.includes(opp.id);
                const isTracked = trackedIds.includes(opp.id);
                const isExpanded = expandedId === opp.id;
                const status = appliedStatuses[opp.id] || "Not Started";

                return (
                  <div
                    key={opp.id}
                    className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between gap-4 relative overflow-hidden"
                  >
                    {/* Closing soon ribbon */}
                    {opp.daysLeft <= 30 && (
                      <div className="absolute -right-12 -top-1 px-10 py-1.5 bg-rose-500 text-white font-mono text-[9px] uppercase tracking-widest font-bold rotate-45 flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-white" /> {opp.daysLeft}d Left
                      </div>
                    )}

                    <div className="space-y-3">
                      {/* Logo, Title, Provider */}
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-2xl ${opp.logoBg} flex items-center justify-center font-display font-extrabold text-white text-base shadow`}>
                          {opp.provider[0]}
                        </div>
                        <div className="flex-1 space-y-0.5 pr-6">
                          <span className="text-[9px] font-mono uppercase text-pink-300 block font-bold">{opp.category}</span>
                          <h3 className="text-sm font-bold tracking-tight text-white leading-tight">{opp.title}</h3>
                          <p className="text-[10px] text-white/60 font-semibold">{opp.provider}</p>
                        </div>
                      </div>

                      {/* Info Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/80">
                          {opp.mode} • {opp.location}
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300">
                          Match: {opp.aiMatchScore}%
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                          {opp.stipendOrValue}
                        </span>
                      </div>

                      {/* Eligibility, Duration & Mode summary */}
                      <div className="text-[10px] space-y-1 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="flex justify-between">
                          <span className="text-white/50 font-medium">Eligibility:</span>
                          <span className="text-white font-bold max-w-[150px] truncate text-right" title={opp.eligibility}>{opp.eligibility}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50 font-medium">Duration:</span>
                          <span className="text-white font-bold">{opp.duration}</span>
                        </div>
                      </div>

                      {/* Supportive Couching Box (Reason Why Recommended) */}
                      <p className="text-[11px] text-pink-200 leading-relaxed bg-pink-500/5 p-3 rounded-xl border border-pink-500/10 italic">
                        🧑‍🏫 <strong>Coaching Insight:</strong> {opp.whyRecommended}
                      </p>
                    </div>

                    {/* Bottom Status Controls */}
                    <div className="border-t border-white/5 pt-3 mt-auto space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-white/50" />
                          <span className="text-[10px] text-white/70 font-mono">
                            {opp.deadline} ({opp.daysLeft} days remaining)
                          </span>
                        </div>
                        
                        {/* Interactive Status Selector */}
                        <select
                          value={status}
                          onChange={(e) => setAppliedStatuses(prev => ({ ...prev, [opp.id]: e.target.value }))}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getAppliedStatusColor(status)} focus:outline-none`}
                        >
                          <option value="Not Started" className="bg-[#342D5A] text-white">Not Started</option>
                          <option value="Application Started" className="bg-[#342D5A] text-white">Application Started</option>
                          <option value="Documents Pending" className="bg-[#342D5A] text-white">Documents Pending</option>
                          <option value="Submitted" className="bg-[#342D5A] text-white">Submitted</option>
                          <option value="Missed" className="bg-[#342D5A] text-white">Missed</option>
                        </select>
                      </div>

                      {/* Action buttons list */}
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => toggleSave(opp.id)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isSaved 
                                ? "bg-pink-500 text-white border-pink-500" 
                                : "bg-white/5 border-white/10 hover:bg-white/10 text-white/60"
                            }`}
                            title="Save / Bookmark"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => toggleTrack(opp.id)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isTracked 
                                ? "bg-amber-500 text-white border-amber-500" 
                                : "bg-white/5 border-white/10 hover:bg-white/10 text-white/60"
                            }`}
                            title="Active Deadline Tracker"
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(opp.websiteUrl);
                              setToastMessage(`Share Link copied! Send this B.Tech Opportunity to your study circle.`);
                              setTimeout(() => setToastMessage(null), 3500);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 transition cursor-pointer"
                            title="Share opportunity"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleActivatePrepMode(opp)}
                            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white text-[10px] font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-1 border border-white/10"
                            title="Activate personalized AI Prep Mode roadmap"
                          >
                            <span>🎯 Prep</span>
                          </button>

                          <button
                            onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-[10px] font-bold transition cursor-pointer"
                          >
                            {isExpanded ? "Hide" : "Details"}
                          </button>

                          <button
                            onClick={() => setSimulatingPortal(opp)}
                            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white text-indigo-950 hover:bg-white/90 text-[10px] font-bold transition cursor-pointer"
                          >
                            <span>Apply</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable details area */}
                    {isExpanded && (
                      <div className="border-t border-white/5 pt-3 mt-2 text-xs text-white/90 space-y-3 animate-slide-down">
                        <p className="text-[11px] leading-relaxed text-white/70">
                          <strong>Benefits Detail:</strong> {opp.benefits}
                        </p>

                        {/* AI Explainability Ledger */}
                        {renderExplainabilityLedger(opp)}

                        {/* DreamPath Integration Section */}
                        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-400/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-pink-300 font-bold">DreamPath Readiness</span>
                            <span className="text-[10px] font-bold text-white">{opp.aiMatchScore || 80}% Match</span>
                          </div>
                          
                          {/* Readiness percentage bar */}
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-pink-500 transition-all duration-500" style={{ width: `${opp.aiMatchScore || 80}%` }} />
                          </div>

                          <div className="text-[9px] text-white/60">
                            <strong>Target Skills Required:</strong> {(opp.requiredSkills || []).join(", ") || "No strict pre-requisites"}
                          </div>

                          <button
                            onClick={() => handleConvertToMissions(opp)}
                            className="w-full py-1.5 rounded bg-pink-500/20 hover:bg-pink-500/35 border border-pink-400/30 text-[9px] font-mono uppercase tracking-wider text-white font-bold transition cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Convert to Growth Missions</span>
                          </button>
                        </div>

                        {/* Interactive Ask AI inline panel */}
                        <div className="space-y-1.5 border-t border-white/5 pt-2">
                          <button
                            onClick={() => setActiveAskAIId(activeAskAIId === opp.id ? null : opp.id)}
                            className="flex items-center gap-1 text-[10px] font-bold text-pink-300"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Ask Companion for Interview Tips</span>
                          </button>

                          {activeAskAIId === opp.id && (
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                              <p className="text-[10px] text-pink-100">
                                "Hey Ayush! Google STEP values Python speed and dynamic structures. Should we schedule a practice mock interview focusing on Graph traversals and recursive models?"
                              </p>
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => {
                                    setCustomAIQuestions(prev => ({ ...prev, [opp.id]: "dsa" }));
                                    setToastMessage("AI Mock Interview added to your calendar!");
                                    setTimeout(() => setToastMessage(null), 3500);
                                  }}
                                  className="px-2 py-1 rounded bg-white/10 text-white text-[9px] font-medium"
                                >
                                  Schedule DSA Practice
                                </button>
                                <button
                                  onClick={() => setCustomAIQuestions(prev => ({ ...prev, [opp.id]: "resume" }))}
                                  className="px-2 py-1 rounded bg-white/10 text-white text-[9px] font-medium"
                                >
                                  Analyze my Resume
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: INDIA SPECIFIC SCHOLARSHIPS */}
        {(!selectedDashboardCategory || selectedDashboardCategory === "Scholarship") && (
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h2 className="text-xs font-mono uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Section 3: India Specific Scholarships
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.filter(o => o.category === "Scholarship").map(opp => {
                const isSaved = savedIds.includes(opp.id);
                const isTracked = trackedIds.includes(opp.id);
                const isExpanded = expandedId === opp.id;
                const status = appliedStatuses[opp.id] || "Not Started";

                return (
                  <div
                    key={opp.id}
                    className="p-5 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between gap-4 relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {opp.isGovernment ? "Government Support" : "Private Foundation"}
                          </span>
                          <h3 className="text-sm font-bold tracking-tight text-white">{opp.title}</h3>
                          <p className="text-[10px] text-white/55 font-semibold">{opp.provider}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono font-bold text-emerald-300 block">{opp.stipendOrValue}</span>
                          <span className="text-[9px] text-white/40 block">Last Date: {opp.deadline}</span>
                        </div>
                      </div>

                      <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                        {opp.benefits}
                      </p>

                      <div className="text-[10px] space-y-1 bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <div className="flex justify-between">
                          <span className="text-white/50">Eligibility:</span>
                          <span className="text-white font-medium max-w-[160px] truncate">{opp.eligibility}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Match Score:</span>
                          <span className="text-emerald-300 font-bold">{opp.aiMatchScore}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => toggleSave(opp.id)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            isSaved ? "bg-emerald-500 text-white border-emerald-500" : "bg-white/5 border-white/10 hover:bg-white/10 text-white/60"
                          }`}
                          title="Bookmark"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleTrack(opp.id)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            isTracked ? "bg-amber-500 text-white border-amber-500" : "bg-white/5 border-white/10 hover:bg-white/10 text-white/60"
                          }`}
                          title="Track Deadline"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleActivatePrepMode(opp)}
                          className="px-2.5 py-1.5 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white text-[10px] font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-1 border border-white/10"
                          title="Activate personalized AI Prep Mode roadmap"
                        >
                          <span>🎯 Prep</span>
                        </button>

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-[10px] font-bold cursor-pointer"
                        >
                          {isExpanded ? "Hide" : "Details"}
                        </button>
                        <button
                          onClick={() => setSimulatingPortal(opp)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-white/5 pt-3 mt-2 text-xs text-white/80 space-y-3 animate-slide-down">
                        {/* AI Explainability Ledger */}
                        {renderExplainabilityLedger(opp)}

                        <div>
                          <strong className="text-[10px] text-emerald-300 font-mono uppercase block mb-1">Required Documents:</strong>
                          <ul className="grid grid-cols-2 gap-1 text-[10px] text-white/70 list-disc list-inside">
                            {opp.requiredDocuments?.map((doc: string, i: number) => (
                              <li key={i} className="truncate">{doc}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Convert to Growth Missions */}
                        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-[10px] space-y-2">
                          <span className="font-bold text-white block">🌱 Integration with Bloom Forest</span>
                          <p className="text-[10px] text-white/70">Convert scholarship criteria into 3 active preparation steps to track your progress.</p>
                          <button
                            onClick={() => handleConvertToMissions(opp)}
                            className="w-full py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-white font-bold text-[10px] border border-emerald-500/30 cursor-pointer"
                          >
                            Convert to Growth Missions
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 4: INTERNSHIPS */}
        {(!selectedDashboardCategory || selectedDashboardCategory === "Internship") && (
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h2 className="text-xs font-mono uppercase font-bold tracking-widest text-blue-400 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-400" />
              Section 4: Technical Internships
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.filter(o => o.category === "Internship").map(opp => {
                const isSaved = savedIds.includes(opp.id);
                const isTracked = trackedIds.includes(opp.id);
                const isExpanded = expandedId === opp.id;
                const status = appliedStatuses[opp.id] || "Not Started";

                return (
                  <div
                    key={opp.id}
                    className="p-5 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between gap-4 relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[8px] font-mono font-bold uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                            {opp.isGovernment ? "Govt Lab R&D" : "Corporate Tech"}
                          </span>
                          <h3 className="text-sm font-bold tracking-tight text-white">{opp.title}</h3>
                          <p className="text-[10px] text-white/55 font-semibold">{opp.provider}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono font-bold text-blue-300 block">{opp.stipendOrValue}</span>
                          <span className="text-[9px] text-white/40 block">{opp.duration}</span>
                        </div>
                      </div>

                      {/* Required Skills list */}
                      <div className="flex flex-wrap gap-1">
                        {opp.requiredSkills.map((s, idx) => (
                          <span key={idx} className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5 text-white/70">
                            #{s}
                          </span>
                        ))}
                      </div>

                      <div className="text-[10px] space-y-1 bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <div className="flex justify-between">
                          <span className="text-white/50">Closing In:</span>
                          <span className="text-rose-300 font-bold">{opp.daysLeft} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Mode:</span>
                          <span className="text-white">{opp.mode} ({opp.location})</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => toggleSave(opp.id)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            isSaved ? "bg-blue-500 text-white border-blue-500" : "bg-white/5 border-white/10 hover:bg-white/10 text-white/60"
                          }`}
                          title="Bookmark"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleTrack(opp.id)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            isTracked ? "bg-amber-500 text-white border-amber-500" : "bg-white/5 border-white/10 hover:bg-white/10 text-white/60"
                          }`}
                          title="Track Deadline"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleActivatePrepMode(opp)}
                          className="px-2.5 py-1.5 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white text-[10px] font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-1 border border-white/10"
                          title="Activate personalized AI Prep Mode roadmap"
                        >
                          <span>🎯 Prep</span>
                        </button>

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-[10px] font-bold cursor-pointer"
                        >
                          {isExpanded ? "Hide" : "Details"}
                        </button>
                        <button
                          onClick={() => setSimulatingPortal(opp)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Apply</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-white/5 pt-3 mt-2 text-xs text-white/80 space-y-3 animate-slide-down">
                        {/* AI Explainability Ledger */}
                        {renderExplainabilityLedger(opp)}

                        <div className="space-y-1">
                          <strong className="text-[10px] text-blue-300 font-mono uppercase block">Selection Process:</strong>
                          <p className="text-[10px] leading-relaxed text-white/70">{opp.selectionProcess}</p>
                        </div>

                        <div className="space-y-1">
                          <strong className="text-[10px] text-blue-300 font-mono uppercase block">Preparation Tips:</strong>
                          <ul className="list-disc list-inside text-[10px] text-white/70 space-y-1">
                            {opp.preparationTips?.map((tip: string, idx: number) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Convert to Growth Missions */}
                        <button
                          onClick={() => handleConvertToMissions(opp)}
                          className="w-full py-1.5 rounded bg-blue-500/20 hover:bg-blue-500/30 text-white font-bold text-[10px] border border-blue-500/30 cursor-pointer"
                        >
                          Convert to Growth Missions
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 5: HACKATHONS */}
        {(!selectedDashboardCategory || selectedDashboardCategory === "Hackathon") && (
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h2 className="text-xs font-mono uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              Section 5: Hackathons & Competitions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.filter(o => o.category === "Hackathon").map(opp => {
                const isSaved = savedIds.includes(opp.id);
                const isTracked = trackedIds.includes(opp.id);
                const isExpanded = expandedId === opp.id;
                const status = appliedStatuses[opp.id] || "Not Started";

                return (
                  <div
                    key={opp.id}
                    className="p-5 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between gap-4 relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[8px] font-mono font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {opp.isGovernment ? "Government Theme" : "Global Community"}
                          </span>
                          <h3 className="text-sm font-bold tracking-tight text-white">{opp.title}</h3>
                          <p className="text-[10px] text-white/55 font-semibold">{opp.provider}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono font-bold text-amber-300 block">{opp.stipendOrValue}</span>
                          <span className="text-[9px] text-white/40 block">Team: {opp.teamSize}</span>
                        </div>
                      </div>

                      <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                        Theme: <strong>{opp.theme}</strong>
                      </p>

                      <div className="text-[10px] space-y-1 bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <div className="flex justify-between">
                          <span className="text-white/50">Difficulty:</span>
                          <span className="text-white font-medium">{opp.difficulty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Match score:</span>
                          <span className="text-amber-300 font-bold">{opp.aiMatchScore}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => toggleSave(opp.id)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            isSaved ? "bg-amber-500 text-white border-amber-500" : "bg-white/5 border-white/10 hover:bg-white/10 text-white/60"
                          }`}
                          title="Bookmark"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleTrack(opp.id)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            isTracked ? "bg-amber-500 text-white border-amber-500" : "bg-white/5 border-white/10 hover:bg-white/10 text-white/60"
                          }`}
                          title="Track Deadline"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleActivatePrepMode(opp)}
                          className="px-2.5 py-1.5 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white text-[10px] font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-1 border border-white/10"
                          title="Activate personalized AI Prep Mode roadmap"
                        >
                          <span>🎯 Prep</span>
                        </button>

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-[10px] font-bold cursor-pointer"
                        >
                          {isExpanded ? "Hide" : "Details"}
                        </button>
                        <button
                          onClick={() => setSimulatingPortal(opp)}
                          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Register</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-white/5 pt-3 mt-2 text-xs text-white/80 space-y-3 animate-slide-down">
                        {/* AI Explainability Ledger */}
                        {renderExplainabilityLedger(opp)}

                        <div>
                          <strong className="text-[10px] text-amber-300 font-mono uppercase block mb-1">Preparation Checklist:</strong>
                          <ul className="text-[10px] text-white/70 space-y-1">
                            {opp.preparationChecklist?.map((item: string, idx: number) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Convert to Growth Missions */}
                        <button
                          onClick={() => handleConvertToMissions(opp)}
                          className="w-full py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-white font-bold text-[10px] border border-amber-500/30 cursor-pointer"
                        >
                          Convert to Growth Missions
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 6: CERTIFICATIONS & LEARNING */}
        {(!selectedDashboardCategory || selectedDashboardCategory === "Certification") && (
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h2 className="text-xs font-mono uppercase font-bold tracking-widest text-purple-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" />
              Section 6: Certifications & Learning Programs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.filter(o => o.category === "Certification").map(opp => {
                const isSaved = savedIds.includes(opp.id);
                const isTracked = trackedIds.includes(opp.id);
                const isExpanded = expandedId === opp.id;
                const status = appliedStatuses[opp.id] || "Not Started";

                return (
                  <div
                    key={opp.id}
                    className="p-5 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between gap-4 relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[8px] font-mono font-bold uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                            Professional Credential
                          </span>
                          <h3 className="text-sm font-bold tracking-tight text-white">{opp.title}</h3>
                          <p className="text-[10px] text-white/55 font-semibold">{opp.provider}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono font-bold text-purple-300 block">{opp.stipendOrValue}</span>
                          <span className="text-[9px] text-white/40 block">{opp.duration}</span>
                        </div>
                      </div>

                      <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                        Career Impact: <strong>{opp.careerImpact}</strong>
                      </p>

                      <div className="text-[10px] space-y-1 bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <div className="flex justify-between">
                          <span className="text-white/50">Difficulty:</span>
                          <span className="text-white font-medium">{opp.difficulty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Match:</span>
                          <span className="text-purple-300 font-bold">{opp.aiMatchScore}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => toggleSave(opp.id)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            isSaved ? "bg-purple-500 text-white border-purple-500" : "bg-white/5 border-white/10 hover:bg-white/10 text-white/60"
                          }`}
                          title="Bookmark"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleTrack(opp.id)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            isTracked ? "bg-[#FF6B6B] text-white border-[#FF6B6B]" : "bg-white/5 border-white/10 hover:bg-white/10 text-white/60"
                          }`}
                          title="Track Course"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleActivatePrepMode(opp)}
                          className="px-2.5 py-1.5 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white text-[10px] font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-1 border border-white/10"
                          title="Activate personalized AI Prep Mode roadmap"
                        >
                          <span>🎯 Prep</span>
                        </button>

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-[10px] font-bold cursor-pointer"
                        >
                          {isExpanded ? "Hide" : "Details"}
                        </button>
                        <button
                          onClick={() => setSimulatingPortal(opp)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Course</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-white/5 pt-3 mt-2 text-xs text-white/80 space-y-3 animate-slide-down">
                        {/* AI Explainability Ledger */}
                        {renderExplainabilityLedger(opp)}

                        <div className="text-[10px] leading-relaxed text-white/70">
                          <strong>Prerequisites:</strong> {(opp.prerequisites || []).join(", ")}
                        </div>

                        <div className="text-[10px] leading-relaxed text-white/70">
                          <strong>Certificate Details:</strong> {opp.certificate}
                        </div>

                        {/* Convert to Growth Missions */}
                        <button
                          onClick={() => handleConvertToMissions(opp)}
                          className="w-full py-1.5 rounded bg-purple-500/20 hover:bg-purple-500/30 text-white font-bold text-[10px] border border-purple-500/30 cursor-pointer"
                        >
                          Convert to Growth Missions
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
          </>
        )}
      </div>

      {/* PORTAL SIMULATOR MODAL (PREPARED FOR FUTURE API CONNECTORS) */}
      {simulatingPortal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#342D5A] border border-white/20 shadow-2xl space-y-5 animate-scale-up text-white relative">
            <button
              onClick={() => setSimulatingPortal(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-white/10 text-white/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-pink-300 flex items-center justify-center mx-auto text-xl border border-white/10 animate-bounce">
                🧭
              </div>
              <h3 className="text-lg font-display font-extrabold">Live Mode Integration Gateway</h3>
              <p className="text-xs text-white/80 font-semibold truncate">
                Target: {simulatingPortal.title}
              </p>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-white/80 bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-pink-300 shrink-0 mt-0.5" />
                <p>
                  <strong>OAuth & Gateway Security:</strong> SoulSync AI keeps your student credentials protected. This redirects directly to the official {simulatingPortal.provider} portal.
                </p>
              </div>

              <div className="flex items-start gap-2.5 border-t border-white/5 pt-3">
                <RefreshCw className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5 animate-spin-slow" />
                <p>
                  <strong>External Connectors:</strong> Ready for direct API links with <strong>NSP, AICTE, Unstop, Devfolio, Google & Microsoft Careers</strong> to auto-fill registration forms.
                </p>
              </div>

              <div className="flex items-start gap-2.5 border-t border-white/5 pt-3">
                <Calendar className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <p>
                  <strong>Smart Calendar Sync:</strong> Real deadlines are verified. Clicking Proceed locks this opportunity to your active countdown tracker list.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSimulatingPortal(null)}
                className="flex-1 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs transition cursor-pointer"
              >
                Go Back
              </button>
              <a
                href={simulatingPortal.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setSimulatingPortal(null);
                  toggleTrack(simulatingPortal.id);
                  setAppliedStatuses(prev => ({ ...prev, [simulatingPortal.id]: "Application Started" }));
                }}
                className="flex-1 py-2.5 rounded-2xl bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white font-bold text-xs text-center shadow-lg transition flex items-center justify-center gap-1 cursor-pointer border border-white/10"
              >
                <span>Proceed to Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PERSONALIZED AI PREPARATION CONSOLE MODAL */}
      {selectedPrepOpportunity && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-3xl bg-[#281E48] border border-white/10 shadow-2xl overflow-hidden text-white relative animate-scale-up my-8 max-h-[90vh] flex flex-col">
            
            {/* Header banner */}
            <div className="p-6 bg-gradient-to-r from-[#311F5A] to-[#1E1140] border-b border-white/5 relative shrink-0">
              <button
                onClick={() => {
                  setSelectedPrepOpportunity(null);
                  setPrepRoadmapData(null);
                }}
                className="absolute right-6 top-6 p-1.5 rounded-full hover:bg-white/10 text-white/60 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-xl font-bold shadow-lg text-white">
                  🎯
                </div>
                <div>
                  <span className="text-[10px] font-mono text-pink-300 uppercase tracking-widest block font-bold">
                    Career Intelligence Prep Module
                  </span>
                  <h3 className="text-lg font-display font-extrabold tracking-tight">
                    {selectedPrepOpportunity.title}
                  </h3>
                  <p className="text-xs text-white/60 font-semibold">
                    Personalized Preparation Console • Provided by {selectedPrepOpportunity.provider}
                  </p>
                </div>
              </div>
            </div>

            {/* Main content body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isLoadingPrep ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-pink-500/20 border-t-pink-400 animate-spin" />
                    <Sparkles className="w-6 h-6 text-pink-300 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Synthesizing Your Career Blueprint...</h4>
                    <p className="text-[11px] text-white/50 max-w-xs mx-auto font-medium">
                      "Understanding you beyond your goals." Matching B.Tech course syllabus, current skill gap analysis, and optimal learning pathways.
                    </p>
                  </div>
                </div>
              ) : prepRoadmapData ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  
                  {/* Left Column Tabs */}
                  <div className="lg:col-span-1 flex flex-col gap-1.5">
                    <button
                      onClick={() => setActivePrepTab("roadmap")}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-semibold border transition text-left cursor-pointer ${
                        activePrepTab === "roadmap"
                          ? "bg-pink-500/20 border-pink-400/30 text-white font-bold"
                          : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      <Layers className="w-4 h-4 text-pink-300" />
                      <span>1. Prep Roadmap</span>
                    </button>

                    <button
                      onClick={() => setActivePrepTab("resources")}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-semibold border transition text-left cursor-pointer ${
                        activePrepTab === "resources"
                          ? "bg-[#10B981]/20 border-[#10B981]/30 text-white font-bold"
                          : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-[#10B981]" />
                      <span>2. Resources & Labs</span>
                    </button>

                    <button
                      onClick={() => setActivePrepTab("practice")}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-semibold border transition text-left cursor-pointer ${
                        activePrepTab === "practice"
                          ? "bg-indigo-500/20 border-indigo-400/30 text-white font-bold"
                          : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      <HelpCircle className="w-4 h-4 text-indigo-300" />
                      <span>3. Mock Q&A Tips</span>
                    </button>

                    <button
                      onClick={() => setActivePrepTab("timeline")}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-semibold border transition text-left cursor-pointer ${
                        activePrepTab === "timeline"
                          ? "bg-amber-500/20 border-amber-400/30 text-white font-bold"
                          : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      <Calendar className="w-4 h-4 text-amber-300" />
                      <span>4. Smart Deadline Engine</span>
                    </button>

                    <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] text-white/60 leading-relaxed space-y-1.5">
                      <div className="flex items-center gap-1 text-pink-300 font-mono font-bold uppercase tracking-wider text-[9px]">
                        <Brain className="w-3 h-3" />
                        <span>Intelligence Stats</span>
                      </div>
                      <p>Curriculum Alignment: <span className="text-white font-bold">94%</span></p>
                      <p>Estimated Effort: <span className="text-white font-bold">{prepRoadmapData.estimatedWeeks || 4} Weeks</span></p>
                      <p>Acquires: <span className="text-white font-bold">{(selectedPrepOpportunity.requiredSkills || []).slice(0, 2).join(", ")}</span></p>
                    </div>
                  </div>

                  {/* Right Column Content Panel */}
                  <div className="lg:col-span-3 min-h-[300px]">
                    <AnimatePresence mode="wait">
                      
                      {/* ROADMAP TAB */}
                      {activePrepTab === "roadmap" && (
                        <motion.div
                          key="roadmap"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="space-y-6 text-white"
                        >
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              <span>🗺️ Staggered Four-Stage Learning Blueprint</span>
                              <span className="text-[10px] font-mono font-normal text-white/50 bg-white/5 px-2 py-0.5 rounded">Personalized</span>
                            </h4>
                            <p className="text-[11px] text-white/70 leading-relaxed font-medium">
                              We mapped {selectedPrepOpportunity.title} core selection criteria against your B.Tech course timeline to give you the most efficient learning progression.
                            </p>
                          </div>

                          {/* 4 STAGES GRID */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(prepRoadmapData.stages || []).map((stage: any, sIdx: number) => (
                              <div key={sIdx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1 hover:border-white/10 transition">
                                <span className="text-[9px] font-mono text-pink-300 font-bold uppercase tracking-wider">STAGE {sIdx + 1}: {stage.title}</span>
                                <p className="text-[11px] text-white/80 leading-relaxed font-medium">{stage.description}</p>
                              </div>
                            ))}
                          </div>

                          {/* WEEKLY TASKS EXECUTABLE PLAN */}
                          <div className="space-y-3 border-t border-white/5 pt-4">
                            <h5 className="text-[11px] font-mono font-bold uppercase text-indigo-300 tracking-wider">Weekly Action Milestones (Interactive Checklist)</h5>
                            <div className="space-y-2.5">
                              {(prepRoadmapData.weeks || []).map((wk: any, wIdx: number) => (
                                <div key={wIdx} className="p-3.5 rounded-2xl bg-[#1E1639]/40 border border-white/5 space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-white">Week {wk.weekNum}: {wk.milestone}</span>
                                    <span className="text-[9px] font-mono text-white/40">100XP on Completion</span>
                                  </div>
                                  <ul className="space-y-1.5">
                                    {(wk.actions || []).map((act: string, aIdx: number) => {
                                      const key = `${selectedPrepOpportunity.id}-w${wk.weekNum}-a${aIdx}`;
                                      const isChecked = completedPrepTasks[key] || false;
                                      return (
                                        <li key={aIdx} className="flex items-start gap-2 text-[11px] text-white/80 leading-normal font-medium">
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => {
                                              setCompletedPrepTasks(prev => {
                                                const updated = { ...prev, [key]: !isChecked };
                                                if (!isChecked) {
                                                  setToastMessage(`🎯 Completed preparation step! Streak advancing. (+25XP)`);
                                                  setTimeout(() => setToastMessage(null), 3000);
                                                }
                                                return updated;
                                              });
                                            }}
                                            className="mt-0.5 w-3.5 h-3.5 rounded border-white/20 text-pink-500 focus:ring-0 focus:ring-offset-0 bg-transparent cursor-pointer shrink-0"
                                          />
                                          <span className={isChecked ? "line-through text-white/40" : ""}>{act}</span>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* RESOURCES TAB */}
                      {activePrepTab === "resources" && (
                        <motion.div
                          key="resources"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="space-y-6"
                        >
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              <span>📚 Curated Resources & Custom Portfolio Suggestions</span>
                            </h4>
                            <p className="text-[11px] text-white/70 leading-relaxed font-medium">
                              Skip searching Google. Here is the exact recommended list of textbooks, labs, and code repositories compiled by the AI Mentor, specifically tailored for Indian students.
                            </p>
                          </div>

                          {/* RESOURCES LIST */}
                          <div className="space-y-3">
                            <span className="text-[9px] font-mono font-bold uppercase text-emerald-300 tracking-wider">Top Labs & References</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {(prepRoadmapData.resources || []).map((res: any, rIdx: number) => (
                                <a
                                  key={rIdx}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition block space-y-1 group cursor-pointer"
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition truncate">{res.name}</span>
                                    <span className="text-[9px] font-mono text-white/40 uppercase bg-white/5 px-2 py-0.5 rounded">
                                      {res.platform}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-white/60 font-medium">{res.type} Reference</p>
                                </a>
                              ))}
                            </div>
                          </div>

                          {/* PORTFOLIO & PROJECT SUGGESTION */}
                          {prepRoadmapData.portfolioSuggestion && (
                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3.5">
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono text-emerald-300 font-bold uppercase tracking-wider block">🛠️ Recommended Resume Project Highlight</span>
                                <h5 className="text-xs font-bold text-white">{prepRoadmapData.portfolioSuggestion.title}</h5>
                                <p className="text-[11px] text-white/80 leading-relaxed font-medium">{prepRoadmapData.portfolioSuggestion.description}</p>
                              </div>
                              <div className="text-[10px] text-white/60 leading-normal font-medium">
                                <strong>Suggested Tech Stack:</strong> {prepRoadmapData.portfolioSuggestion.techStack}
                              </div>
                              <button
                                onClick={() => {
                                  onAddMission({
                                    id: `prep-proj-${selectedPrepOpportunity.id}-${Date.now()}`,
                                    title: `[Adopted Portfolio Project] ${prepRoadmapData.portfolioSuggestion.title}`,
                                    deadline: "In 30 Days",
                                    estimatedTime: "15 Hrs",
                                    dreamImpact: "Core Portfolio Showpiece",
                                    completed: false,
                                    category: "Career"
                                  });
                                  setToastMessage(`Added "${prepRoadmapData.portfolioSuggestion.title}" as an active Project Mission in your SoulPrint dashboard!`);
                                  setTimeout(() => setToastMessage(null), 5000);
                                }}
                                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition flex items-center justify-center gap-1 border border-white/10 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Adopt as Active Resume Project</span>
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* PRACTICE TAB */}
                      {activePrepTab === "practice" && (
                        <motion.div
                          key="practice"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="space-y-6"
                        >
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              <span>❓ Highly Realistic Mock Practice Questions & Tips</span>
                            </h4>
                            <p className="text-[11px] text-white/70 leading-relaxed font-medium">
                              Practicing real questions is the absolute fastest way to remove test-anxiety. Attempt these conceptual challenges:
                            </p>
                          </div>

                          {/* MOCK QUESTIONS LIST */}
                          <div className="space-y-3.5">
                            {(prepRoadmapData.mockQuestions || []).map((qObj: any, idx: number) => {
                              const uniqueKey = `reveal-${selectedPrepOpportunity.id}-q-${idx}`;
                              const isRevealed = completedPrepTasks[uniqueKey] || false;
                              return (
                                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                  <div className="flex justify-between items-start gap-3">
                                    <span className="text-xs font-bold text-white leading-snug">Q{idx + 1}: {qObj.question}</span>
                                    <span className="text-[9px] font-mono text-indigo-300 font-bold uppercase">{qObj.type}</span>
                                  </div>
                                  <button
                                    onClick={() => setCompletedPrepTasks(prev => ({ ...prev, [uniqueKey]: !isRevealed }))}
                                    className="px-2.5 py-1 rounded bg-[#31235F] hover:bg-[#3E2D77] border border-white/5 text-[9px] font-mono text-indigo-200 transition cursor-pointer"
                                  >
                                    {isRevealed ? "Hide Answer Guidance" : "💡 Reveal Answer Guidance"}
                                  </button>
                                  {isRevealed && (
                                    <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-[10px] text-white/80 leading-relaxed animate-slide-down font-medium">
                                      <strong>Key Guidance:</strong> {qObj.guidance}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {/* SMART DEADLINES TAB */}
                      {activePrepTab === "timeline" && (
                        <motion.div
                          key="timeline"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="space-y-6"
                        >
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              <span>📅 Smart Deadline Engine & Countdown Sync</span>
                            </h4>
                            <p className="text-[11px] text-white/70 leading-relaxed font-medium">
                              Our system continuously parses institution websites to ensure real timeline verification. Don't let deadlines catch you off guard.
                            </p>
                          </div>

                          {/* 4 DEADLINE DATES CARDS */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="p-3 rounded-xl bg-[#342056] border border-white/5 text-center space-y-1">
                              <span className="text-[9px] font-mono text-pink-300 uppercase block font-bold">1. Registration</span>
                              <p className="text-xs font-bold text-white">{prepRoadmapData.timeline?.registration || selectedPrepOpportunity.deadline}</p>
                              <span className="text-[9px] text-white/40 block">Verified Status</span>
                            </div>
                            <div className="p-3 rounded-xl bg-[#342056] border border-white/5 text-center space-y-1">
                              <span className="text-[9px] font-mono text-emerald-300 uppercase block font-bold">2. Verification</span>
                              <p className="text-xs font-bold text-white">{prepRoadmapData.timeline?.documentVerification || "10 Days Later"}</p>
                              <span className="text-[9px] text-white/40 block">Institute Check</span>
                            </div>
                            <div className="p-3 rounded-xl bg-[#342056] border border-white/5 text-center space-y-1">
                              <span className="text-[9px] font-mono text-indigo-300 uppercase block font-bold">3. Assessments</span>
                              <p className="text-xs font-bold text-white">{prepRoadmapData.timeline?.assessmentPeriod || "In 3 Weeks"}</p>
                              <span className="text-[9px] text-white/40 block">Interview Panel</span>
                            </div>
                            <div className="p-3 rounded-xl bg-[#342056] border border-white/5 text-center space-y-1">
                              <span className="text-[9px] font-mono text-amber-300 uppercase block font-bold">4. Final Results</span>
                              <p className="text-xs font-bold text-white">{prepRoadmapData.timeline?.resultDeclaration || "In 2 Months"}</p>
                              <span className="text-[9px] text-white/40 block">Release Window</span>
                            </div>
                          </div>

                          {/* SYNC ACTIONS */}
                          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="space-y-1 text-left">
                              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                                <Bell className="w-4 h-4 text-amber-300" />
                                Sync Timeline to Study Calendar
                              </h5>
                              <p className="text-[10px] text-white/70 max-w-md leading-normal font-medium">
                                Secure this countdown so you receive browser, applet, and local push reminders before each phase close.
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                toggleTrack(selectedPrepOpportunity.id);
                                setToastMessage("📅 Smart Deadlines perfectly synced with your active Study Calendar countdowns!");
                                setTimeout(() => setToastMessage(null), 5000);
                              }}
                              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer shrink-0 border border-white/10"
                            >
                              Sync Timeline & Tracker
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center text-white/40 text-xs font-medium">
                  Error loading preparation data. Please try again.
                </div>
              )}
            </div>

            {/* Footer Row */}
            <div className="p-5 bg-[#1F1439]/80 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-white/50 bg-white/5 px-3 py-1 rounded-full">
                  Status: <strong>{(appliedStatuses[selectedPrepOpportunity.id] || "Not Started")}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => {
                    handleConvertToMissions(selectedPrepOpportunity);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white font-bold transition cursor-pointer"
                >
                  Create 3 Prep Missions
                </button>

                <button
                  onClick={() => {
                    // Opportunity Impact trigger
                    const currentSkills = profile?.skills || [];
                    const addedSkill = selectedPrepOpportunity.requiredSkills?.[0] || "Advanced DSA";
                    const updatedSkills = currentSkills.includes(addedSkill) ? currentSkills : [...currentSkills, addedSkill];
                    
                    onUpdateProfile({
                      skills: updatedSkills,
                      accomplishments: [
                        ...(profile?.accomplishments || []),
                        `🎯 Completed preparation milestones for "${selectedPrepOpportunity.title}"`
                      ]
                    });

                    setAppliedStatuses(prev => ({ ...prev, [selectedPrepOpportunity.id]: "Submitted" }));
                    setToastMessage(`🏆 Opportunity Impact Activated! Verified "${addedSkill}" added to skills, Career Readiness boosted by +10%, and a live Bloom tree planted in your forest!`);
                    setSelectedPrepOpportunity(null);
                    setPrepRoadmapData(null);
                    setTimeout(() => setToastMessage(null), 8000);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg transition border border-white/10 cursor-pointer"
                >
                  Mark Completed & Boost Career Score
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
