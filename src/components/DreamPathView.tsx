import React, { useState, useMemo } from "react";
import { StudentProfile, AtmosphereType, AccessibilitySettings } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  Trophy,
  ChevronRight,
  CheckCircle2,
  Bookmark,
  Flame,
  Calendar,
  Sparkles,
  MapPin,
  TrendingUp,
  Clock,
  Compass,
  Check,
  AlertCircle,
  HelpCircle,
  Search,
  BookOpen,
  Plus,
  Trash2,
  ChevronDown,
  Info,
  Maximize2,
  Minimize2,
  ArrowRight,
  Briefcase,
  Layers,
  Award,
  Zap,
  PlayCircle
} from "lucide-react";
import { CareerIdentityView } from "./CareerIdentityView";

interface DreamPathViewProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  activeAtmosphere: AtmosphereType;
  accessibility: AccessibilitySettings;
}

// 12 Detailed Career Roadmap Tracks
interface PathNode {
  id: string;
  title: string;
  status: "Completed" | "In_Progress" | "Future";
  why: string;
  skills: string[];
  miniProjects: string[];
  portfolioProject: string;
  certifications: string[];
  hackathons: string[];
  internships: string[];
  scholarships: string[];
  resources: string[];
  time: string;
  mistakes: string;
  tips: string;
  growthMissions: string[];
}

interface RoadmapTrack {
  id: string;
  name: string;
  category: string;
  averageSalary: string; // Indian context or general
  marketDemand: "Critical" | "High" | "Stable" | "Emerging";
  readinessFormula: string;
  nodes: PathNode[];
}

const ROADMAP_TRACKS: RoadmapTrack[] = [
  {
    id: "ai-eng",
    name: "AI Engineer",
    category: "AI & Data",
    averageSalary: "₹12L - ₹28L+",
    marketDemand: "Critical",
    readinessFormula: "0.4 * Skills + 0.3 * Projects + 0.3 * OpenSource",
    nodes: [
      {
        id: "ai-1",
        title: "Programming Foundations (Python)",
        status: "Completed",
        why: "Python is the undisputed lingua franca of machine learning, research, and production AI pipelines.",
        skills: ["Object-Oriented Python", "Memory Management", "Multi-threading", "Numpy & Vectorization"],
        miniProjects: ["Interactive CLI Password Manager", "Configurable Log Analyzer"],
        portfolioProject: "High-throughput Log Ingestion Pipeline",
        certifications: ["PCAP Certified Associate in Python Programming", "Google IT Automation with Python"],
        hackathons: ["SIH Internal Hackathons", "Kaggle Playground Comps"],
        internships: ["Local Software Engineering Internships"],
        scholarships: ["Reliance Foundation Undergraduate Scholarship"],
        resources: ["Python Docs", "Corey Schafer YouTube Series", "RealPython Tutorials"],
        time: "4 - 6 Weeks",
        mistakes: "Writing nested for-loops instead of leveraging NumPy's highly optimized vectorization functions.",
        tips: "Emphasize vector operations early. Practice profiling your code's memory allocation.",
        growthMissions: ["Refactor a loop-heavy dataset script using pure vector math."]
      },
      {
        id: "ai-2",
        title: "SQL & Relational Databases",
        status: "Completed",
        why: "Data doesn't live in CSVs. In production, models pull directly from massive, structured SQL warehouses.",
        skills: ["Complex Joins", "Query Optimization", "Database Schema Design", "Indexes & Sharding"],
        miniProjects: ["School Inventory DB Mockup", "Normalized E-Commerce DB Schema"],
        portfolioProject: "Fully Normalized Bank Ledger Database with Transactions",
        certifications: ["Google Cloud Certified Database Engineer", "Oracle SQL Certified Associate"],
        hackathons: ["HackTheBox DB Security Challenges"],
        internships: ["Backend & Database Trainee"],
        scholarships: ["L'Oreal India For Young Women in Science (if eligible)"],
        resources: ["Alex The Analyst SQL Bootcamp", "SQLZoo", "LeetCode Database Questions"],
        time: "3 - 4 Weeks",
        mistakes: "Neglecting database indexing, which leads to catastrophic performance overhead as tables scale past millions of records.",
        tips: "Understand explain plans. Learn the difference between B-Trees and Hash indexes.",
        growthMissions: ["Optimize a triple-nested query to run under 50ms using indexing."]
      },
      {
        id: "ai-3",
        title: "Machine Learning Foundations",
        status: "In_Progress",
        why: "Understanding linear algebra, optimization, and traditional statistics prevents treating AI as a magical black box.",
        skills: ["Linear Regression", "Gradient Descent Optimization", "Scikit-Learn Mastery", "Cross-Validation"],
        miniProjects: ["Housing Price Forecaster", "Iris Classification Model from Scratch"],
        portfolioProject: "End-to-End Customer Churn Predictive Modeling Engine with Web Dashboard",
        certifications: ["Stanford Machine Learning on Coursera", "DeepLearning.AI ML Specialization"],
        hackathons: ["Wadhwani AI Social Good Hackathon", "Kaggle Titanic Benchmark"],
        internships: ["AI Trainee at Tech Startups"],
        scholarships: ["Sitaram Jindal Foundation Scholarship"],
        resources: ["StatQuest by Josh Starmer", "Hands-on Machine Learning (Aurélien Géron)", "Fast.ai ML Basics"],
        time: "8 - 10 Weeks",
        mistakes: "Overfitting your model to test datasets by skipping rigorous cross-validation pipelines.",
        tips: "Implement Gradient Descent manually once using pure linear algebra to demystify neural updates.",
        growthMissions: ["Build a Logistic Regression classifier from scratch without relying on Scikit-Learn."]
      },
      {
        id: "ai-4",
        title: "Deep Learning & Neural Networks",
        status: "Future",
        why: "Deep architectures are critical for raw computer vision, natural language generation, and autonomous agent loops.",
        skills: ["PyTorch Core", "Backpropagation Calculus", "CNNs for Vision", "Recurrent Networks"],
        miniProjects: ["Handwritten Digit Classifier (MNIST)", "Custom Style Transfer Filter"],
        portfolioProject: "IndicOCR: Real-time OCR Engine Fine-tuned for Devanagari Handwritten Scripts",
        certifications: ["DeepLearning.AI Deep Learning Specialization", "NVIDIA Deep Learning Institute"],
        hackathons: ["Intel AI Global Impact Festival", "Smart India Hackathon"],
        internships: ["Research Assistant at Premier Indian Academic Labs (IITs/IISc)"],
        scholarships: ["Aditya Birla Group Scholarship"],
        resources: ["PyTorch Official Tutorials", "CS231n: Convolutional Neural Networks for Visual Recognition"],
        time: "10 - 12 Weeks",
        mistakes: "Copy-pasting deep architectures without checking dimension matching or learning rate decay structures.",
        tips: "Track your loss curves meticulously. Watch for vanishing gradients.",
        growthMissions: ["Train a convolutional neural network to 98% accuracy on MNIST in PyTorch."]
      },
      {
        id: "ai-5",
        title: "Generative AI & Agentic Pipelines",
        status: "Future",
        why: "Modern AI leverage comes from orchestrating large language models using tools, memory buffers, and multi-agent chains.",
        skills: ["RAG Architecture", "LangChain & LlamaIndex", "Vector Databases (Pinecone/Milvus)", "Fine-Tuning LoRA"],
        miniProjects: ["PDF Semantic Query Bot", "Custom Code-Assistant Agent"],
        portfolioProject: "SoulSync Companion AI: High-throughput full-stack mental guide powered by Gemini API",
        certifications: ["Google Cloud Generative AI Engineer Path", "OpenAI Developers Certificate"],
        hackathons: ["Google Gemini API Global Hackathon", "HackOut India"],
        internships: ["Generative AI Developer at Tech Incubators"],
        scholarships: ["Ayush's Academic Fellowship Funding"],
        resources: ["Andrej Karpathy's Zero to Hero series", "LangChain Official Documentation"],
        time: "6 - 8 Weeks",
        mistakes: "Exposing highly sensitive raw API keys to browser clients during prototype testing.",
        tips: "Always proxy your LLM requests through a secure Express or Python server endpoint.",
        growthMissions: ["Construct a retrieval-augmented generation pipeline with chunking and Pinecone indexes."]
      }
    ]
  },
  {
    id: "swe",
    name: "Software Engineer",
    category: "Software Development",
    averageSalary: "₹8L - ₹22L+",
    marketDemand: "High",
    readinessFormula: "0.3 * DSA + 0.3 * SystemDesign + 0.4 * ProjectQuality",
    nodes: [
      {
        id: "swe-1",
        title: "Data Structures & Algorithms",
        status: "Completed",
        why: "Mastering core algorithmic complexity is the non-negotiable benchmark for all premier tech placement cells.",
        skills: ["Asymptotic Notation", "Trees & Graphs", "Dynamic Programming", "Sorting & Searching"],
        miniProjects: ["Interactive Pathfinding Visualizer", "Huffman Coding Compression Tool"],
        portfolioProject: "High-Performance Thread-safe Memory Allocator in C++",
        certifications: ["Algorithmic Toolbox (UC San Diego)", "Data Structures Specialization"],
        hackathons: ["CodeChef Monthly Challenges", "LeetCode Weekly Contests"],
        internships: ["Competitive Coding Mentor Trainee"],
        scholarships: ["NTPC Scholarship for engineering students"],
        resources: ["Introduction to Algorithms (CLRS)", "Abdul Bari's DSA Course", "NeetCode.io"],
        time: "12 - 16 Weeks",
        mistakes: "Memorizing solutions instead of patterns. If the problem constraints change slightly, memorizers fail.",
        tips: "Always explain your dry-run complexity before diving into IDE syntax.",
        growthMissions: ["Solve 5 Graph DFS/BFS problems on Leetcode under 25 minutes each."]
      },
      {
        id: "swe-2",
        title: "System Design (LSD & HSD)",
        status: "Future",
        why: "Writing code that works is junior level. Designing services that stay resilient under 100,000 QPS is senior level.",
        skills: ["Horizontal Scaling", "Load Balancing", "Consistent Hashing", "Caching Strategies (Redis)"],
        miniProjects: ["URL Shortener Architecture", "Simple Rate Limiter Middleware"],
        portfolioProject: "Distributed Key-Value Store with Raft Consensus Replication",
        certifications: ["AWS Certified Solutions Architect", "Distributed Systems Specialization"],
        hackathons: ["System Design Case Competition"],
        internships: ["Systems Engineering Intern"],
        scholarships: ["OP Jindal Engineering Scholarship"],
        resources: ["Designing Data-Intensive Applications (Martin Kleppmann)", "ByteByteGo"],
        time: "8 - 10 Weeks",
        mistakes: "Using a relational database for unstructured time-series logs instead of optimized NoSQL databases.",
        tips: "Start with database constraints. Scale the database layer first before optimizing the application layer.",
        growthMissions: ["Draw a fully redundant architecture diagram for a Twitter clone that supports image uploads."]
      }
    ]
  },
  {
    id: "cyber",
    name: "Cybersecurity Engineer",
    category: "Security",
    averageSalary: "₹10L - ₹24L+",
    marketDemand: "Critical",
    readinessFormula: "0.5 * Networking + 0.3 * PenetrationTesting + 0.2 * Cryptography",
    nodes: [
      {
        id: "cyber-1",
        title: "Networking & Security Architecture",
        status: "Completed",
        why: "You cannot defend what you do not understand. Networking protocols govern every byte of secure communication.",
        skills: ["TCP/IP Handshakes", "DNSSEC", "Firewalls & VPNs", "Packet Analysis (Wireshark)"],
        miniProjects: ["Custom Network Packet Sniffer", "Port Scanner Script"],
        portfolioProject: "Intrusion Detection System analyzing raw PCAP packets in real-time",
        certifications: ["CompTIA Network+", "Cisco CCNA Security"],
        hackathons: ["Capture The Flag (CTF) qualifiers", "InnoSec Challenges"],
        internships: ["Network Administration Intern"],
        scholarships: ["Cyber Security Excellence Award"],
        resources: ["Professor Messer Network+ Series", "Cisco Academy Learning Labs"],
        time: "6 - 8 Weeks",
        mistakes: "Ignoring standard OSI layers, which makes debugging secure TLS handshakes impossible.",
        tips: "Perform manual packet captures during local API calls to inspect HTTP headers.",
        growthMissions: ["Identify and block a mock ARP spoofing attack on your local network."]
      }
    ]
  },
  {
    id: "ds",
    name: "Data Scientist",
    category: "AI & Data",
    averageSalary: "₹10L - ₹25L+",
    marketDemand: "High",
    readinessFormula: "0.4 * Statistics + 0.3 * DataEngineering + 0.3 * BusinessStorytelling",
    nodes: [
      {
        id: "ds-1",
        title: "Advanced Statistics & Probability",
        status: "Completed",
        why: "To make valid predictions, you must separate signal from noise using rigorous probabilistic frameworks.",
        skills: ["Bayesian Statistics", "Hypothesis Testing (A/B testing)", "ANOVA", "Regression Analysis"],
        miniProjects: ["Statistical Analysis on Clinical Data", "A/B Testing Simulator for E-commerce CTR"],
        portfolioProject: "Automated Multi-variant Experimentation Engine with Bayesian Confidence intervals",
        certifications: ["Duke University Statistics Specialization", "Kaggle Advanced Data Analysis"],
        hackathons: ["Data Science Hackathons on Analytics Vidhya"],
        internships: ["Data Analyst Assistant"],
        scholarships: ["DST INSPIRE Scholarship (Govt of India)"],
        resources: ["Khan Academy Advanced Probability", "Practical Statistics for Data Scientists"],
        time: "6 - 8 Weeks",
        mistakes: "Misinterpreting p-values, which leads to announcing false breakthroughs on noisy data.",
        tips: "Always check distribution assumptions before selecting statistical tests.",
        growthMissions: ["Construct and evaluate a double-tailed T-test on an actual marketing dataset."]
      }
    ]
  },
  {
    id: "cloud",
    name: "Cloud Engineer",
    category: "Infrastructure",
    averageSalary: "₹9L - ₹21L+",
    marketDemand: "Stable",
    readinessFormula: "0.4 * CloudProviders + 0.3 * IaC + 0.3 * Containerization",
    nodes: [
      {
        id: "cloud-1",
        title: "Cloud Infrastructure Fundamentals (AWS/GCP)",
        status: "Completed",
        why: "Enterprise systems are entirely virtualized; cloud proficiency is mandatory for high-scale deployment.",
        skills: ["IAM Configuration", "Virtual Networks (VPCs)", "Elastic Compute (EC2/GCE)", "Serverless Hosting"],
        miniProjects: ["Secure static file portfolio on AWS S3", "Auto-scaling server cluster behind ELB"],
        portfolioProject: "Multi-region Cloud Deployment Orchestrator with automatic failovers",
        certifications: ["AWS Cloud Practitioner", "Google Cloud Associate Cloud Engineer"],
        hackathons: ["AWS DevFest India Hackathons"],
        internships: ["Cloud Infrastructure Intern"],
        scholarships: ["Google Cloud University Training Grant"],
        resources: ["Adrian Cantrill's AWS Courses", "GCP official codelabs"],
        time: "6 - 8 Weeks",
        mistakes: "Setting wide-open security rules (0.0.0.0/0) which allows immediate bot-driven hacking attempts.",
        tips: "Apply the principle of least privilege in every IAM role created.",
        growthMissions: ["Configure a VPC from scratch with private subnets and a NAT gateway safely."]
      }
    ]
  },
  {
    id: "devops",
    name: "DevOps Engineer",
    category: "Infrastructure",
    averageSalary: "₹11L - ₹26L+",
    marketDemand: "Critical",
    readinessFormula: "0.3 * CICD + 0.3 * DockerK8s + 0.4 * IaCTerraform",
    nodes: [
      {
        id: "devops-1",
        title: "Automation, CI/CD & Configuration Management",
        status: "Completed",
        why: "To release software 100 times a day, manual builds must be replaced with strict automated workflows.",
        skills: ["GitHub Actions", "Docker Orchestration", "Bash Scripting", "Ansible Playbooks"],
        miniProjects: ["Automated Linter and Testing Action", "Self-building Docker Image Pipeline"],
        portfolioProject: "Production-grade CI/CD pipeline deploying authenticated apps to Cloud Run",
        certifications: ["Docker Certified Associate", "CKA: Certified Kubernetes Administrator"],
        hackathons: ["DevOps World Hack Challenges"],
        internships: ["DevOps Trainee at Mid-scale Startups"],
        scholarships: ["Linux Foundation Training Scholarship"],
        resources: ["TechWorld with Nana YouTube", "KodeKloud Labs", "GitHub Actions Docs"],
        time: "8 - 10 Weeks",
        mistakes: "Storing raw API keys, passwords, or deployment secrets inside your repository's public code files.",
        tips: "Always leverage GitHub Secrets or environment vaults like HashiCorp Vault.",
        growthMissions: ["Set up a GitHub Action that automatically builds and registers a Docker image upon git tag push."]
      }
    ]
  },
  {
    id: "blockchain",
    name: "Blockchain Developer",
    category: "Web3",
    averageSalary: "₹12L - ₹30L+",
    marketDemand: "Emerging",
    readinessFormula: "0.4 * SmartContracts + 0.3 * Cryptography + 0.3 * FrontEndIntegration",
    nodes: [
      {
        id: "bc-1",
        title: "Smart Contract Architect (Solidity)",
        status: "Completed",
        why: "Decentralized execution relies on robust, immutable smart contracts handling millions in digital assets.",
        skills: ["Solidity Syntax", "ERC-20 & ERC-721 Tokens", "Gas Optimization", "Reentrancy Protection"],
        miniProjects: ["Basic Crowdfund Smart Contract", "Simple Mintable NFT Contract"],
        portfolioProject: "Fully Audited Decentralized Loan Protocol with Liquidator Mechanics",
        certifications: ["ConsenSys Blockchain Developer Certificate", "DappUniversity Solidity Prep"],
        hackathons: ["ETHIndia Hackathon (Asia's Largest)", "Polygon DevX Tour"],
        internships: ["Web3 Developer Intern at Blockchain Venture Labs"],
        scholarships: ["Ethereum Foundation Research Grant"],
        resources: ["CryptoZombies", "Patrick Collins Solidity Course", "OpenZeppelin Documentation"],
        time: "8 - 10 Weeks",
        mistakes: "Writing code vulnerable to reentrancy attacks, leading to instantaneous draining of contract reserves.",
        tips: "Deploy your code to testnets (Sepolia) and perform rigorous audits using tools like Slither.",
        growthMissions: ["Write an ERC-20 token contract with gas-optimized gas fee distribution math."]
      }
    ]
  },
  {
    id: "uiux",
    name: "UI/UX Designer",
    category: "Design",
    averageSalary: "₹7L - ₹18L+",
    marketDemand: "High",
    readinessFormula: "0.4 * UserResearch + 0.4 * FigmaFinesse + 0.2 * Psychology",
    nodes: [
      {
        id: "ui-1",
        title: "User-Centered Design & Prototyping",
        status: "Completed",
        why: "An app that is functionally brilliant but unusable is a failure. UX matches interface flows to human intuition.",
        skills: ["Figma Design Systems", "Information Architecture", "Heuristic Evaluation", "High-fidelity Wireframes"],
        miniProjects: ["Mobile Onboarding Redevelopment", "Food Delivery App checkout redesign"],
        portfolioProject: "Serene: Complete UX Overhaul and design library for student wellbeing platform",
        certifications: ["Google UX Design Professional Certificate", "Interaction Design Foundation (IxDF)"],
        hackathons: ["Designathons on Hack2Skill", "Adobe Creative Jam"],
        internships: ["UI/UX Intern at Digital Agencies"],
        scholarships: ["Indian Design Council Talent Grant"],
        resources: ["Refactoring UI (Adam Wathan)", "NN/g (Nielsen Norman Group)", "Figma Learn Hub"],
        time: "6 - 8 Weeks",
        mistakes: "Focusing on visuals and decorative layouts before establishing clear layout hierarchy and readability.",
        tips: "Establish a robust typography and spacing token system before drawing any actual page components.",
        growthMissions: ["Complete a comprehensive usability test session with 3 peer participants on an existing UI."]
      }
    ]
  },
  {
    id: "game",
    name: "Game Developer",
    category: "Design",
    averageSalary: "₹6L - ₹18L+",
    marketDemand: "Stable",
    readinessFormula: "0.5 * GameEngine + 0.3 * LinearAlgebra + 0.2 * AssetPipelines",
    nodes: [
      {
        id: "game-1",
        title: "Game Engine Foundations (Unity/C#)",
        status: "Completed",
        why: "Unity manages physics, rendering loops, and asset integration so you can focus entirely on game mechanics.",
        skills: ["C# Scripting", "RigidBody Physics", "State Machines", "Scene Graph Optimization"],
        miniProjects: ["3D Ball-balancing puzzle", "Procedural Infinite Runner"],
        portfolioProject: "Cosmic Sentinel: Full-fledged 2.5D space shooter with procedural enemy waves",
        certifications: ["Unity Certified User: Programmer", "Coursera Game Design Specialization"],
        hackathons: ["Global Game Jam", "Ludum Dare"],
        internships: ["Intern at Mobile Game Studios"],
        scholarships: ["Epic Games MegaGrants (if eligible)"],
        resources: ["Brackeys Unity Tutorials", "Cat Like Coding", "Unity Learn Pathways"],
        time: "8 - 12 Weeks",
        mistakes: "Using too many unoptimized physics update triggers in Update() instead of FixedUpdate().",
        tips: "Never run complex memory allocations inside tight update loops to prevent frame rate drops.",
        growthMissions: ["Build a character controller system utilizing smooth mathematical velocity interpolation."]
      }
    ]
  },
  {
    id: "research",
    name: "Research Scientist",
    category: "Academic",
    averageSalary: "₹14L - ₹32L+",
    marketDemand: "Emerging",
    readinessFormula: "0.4 * AcademicPapers + 0.4 * MathematicalRigour + 0.2 * Mentorship",
    nodes: [
      {
        id: "res-1",
        title: "Academic Writing & Empirical Modeling",
        status: "Completed",
        why: "To expand human knowledge, your research findings must be reproducible, mathematically sound, and peer-reviewed.",
        skills: ["LaTeX Typesetting", "Empirical Testing", "Literature Analysis", "Experimental Control Design"],
        miniProjects: ["Annotated Bibliography on Transformer efficiency", "LaTeX Mathematical Compendium"],
        portfolioProject: "Empirical evaluation of low-bit quantization bottlenecks on edge computing modules",
        certifications: ["Stanford Writing in the Sciences", "Responsible Conduct of Research"],
        hackathons: ["Research Pitch Competitions", "NeurIPS Challenge Tracks"],
        internships: ["Summer Research Intern at IIT Bombay / IISc"],
        scholarships: ["Prime Minister's Research Fellowship (PMRF)"],
        resources: ["ArXiv", "Google Scholar", "IEEE Xplore database"],
        time: "10 - 14 Weeks",
        mistakes: "Writing anecdotal claims rather than substantiating your points using statistical significance proofs.",
        tips: "Always declare your baseline architectures clearly when compiling test comparison results.",
        growthMissions: ["Publish a 4-page exploratory research paper on ArXiv comparing model optimization frameworks."]
      }
    ]
  },
  {
    id: "founder",
    name: "Startup Founder",
    category: "Business",
    averageSalary: "Equity / High Risk",
    marketDemand: "Emerging",
    readinessFormula: "0.3 * MVPBuilding + 0.4 * Pitching + 0.3 * CustomerAcquisition",
    nodes: [
      {
        id: "founder-1",
        title: "Lean MVP Strategy & Customer Discovery",
        status: "Completed",
        why: "Startups fail because they build things people do not want. Customer discovery isolates actual pain points.",
        skills: ["Lean Canvas", "The Mom Test Interviewing", "Rapid Prototyping", "A/B Growth Testing"],
        miniProjects: ["Landing Page Signup Funnel for new utility", "Interactive Figma Interactive App Demo"],
        portfolioProject: "CampusRentals: Profitable local textbook sharing MVP operating on campus with 150 active signups",
        certifications: ["Y Combinator Startup School", "Venture Initiation Certification"],
        hackathons: ["Shark Tank India Campus Leagues", "E-Cell Pitch Competitions"],
        internships: ["Founding Engineer Intern at Series-A Startups"],
        scholarships: ["DST Startup Grant (Govt of India)", "NIDHI Prayas funding"],
        resources: ["The Lean Startup (Eric Ries)", "The Mom Test (Rob Fitzpatrick)", "YC Startup Library"],
        time: "8 - 10 Weeks",
        mistakes: "Coding a massive database and system backend before confirming that a single customer is willing to buy your service.",
        tips: "Launch in 1 week. Collect signups with simple landing pages and manual backends (Wizard of Oz style).",
        growthMissions: ["Perform raw, objective interviews with 5 real target customers without pitching your product."]
      }
    ]
  },
  {
    id: "higher",
    name: "Higher Studies",
    category: "Academic",
    averageSalary: "Academic Stipends",
    marketDemand: "Stable",
    readinessFormula: "0.5 * GPA + 0.3 * SOP_LORs + 0.2 * ResearchCreds",
    nodes: [
      {
        id: "high-1",
        title: "Academic Profiling & Standardized Preparation",
        status: "Completed",
        why: "Global research programs require top GPAs, standard evaluations, and stellar academic letters of recommendation.",
        skills: ["Academic Writing", "GPA Maintenance", "GRE/TOEFL Preparation", "SOP Drafting Frameworks"],
        miniProjects: ["Exploratory Thesis Outline", "Detailed Study Journal Tracker"],
        portfolioProject: "Academic dossier detailing published benchmarks, transcripts, and faculty testimonials",
        certifications: ["IELTS Academic 8.0+", "GRE Quantitative 168+"],
        hackathons: ["Inter-college Tech Competitions"],
        internships: ["Academic Project Assistant"],
        scholarships: ["Charpak Scholarship (France) / DAAD (Germany)"],
        resources: ["ETS GRE Practice Prep", "Magoosh Verbal Guide", "Graduate School Admissions Blogs"],
        time: "12 - 16 Weeks",
        mistakes: "Drafting a generic Statement of Purpose that mimics an online resume rather than describing an active research goal.",
        tips: "Approach advisors early. Discuss actual scientific inquiries you want to solve rather than asking generic LOR favors.",
        growthMissions: ["Draft and peer-review a 1000-word Statement of Purpose addressing machine learning limits."]
      }
    ]
  }
];

// Helper comparisons for Career Simulator
const SIMULATOR_COMPARISONS: Record<string, {
  name: string;
  skills: string[];
  projects: string[];
  industries: string[];
  growth: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Intense";
  opportunities: string[];
  scope: string;
  whyMatchesSoulPrint: string;
}> = {
  "ai-eng": {
    name: "AI Engineer",
    skills: ["Deep Learning", "PyTorch", "Generative APIs", "Vector Databases", "MLOps Pipelines"],
    projects: ["Devanagari OCR Engines", "Conversational Medical Agents", "GPU Latency Reducers"],
    industries: ["Autonomous Vehicles", "Healthcare Tech", "Fintech", "Generative Platforms"],
    growth: "Extremely Rapid (Expected 35% compound annual growth through 2030)",
    difficulty: "Intense",
    opportunities: ["Generative AI Developer", "ML Scientist", "Prompt Systems Architect"],
    scope: "Building robust, production-ready neural pipelines and agent loops on high-scale server backends.",
    whyMatchesSoulPrint: "Directly aligns with Ayush's current B.Tech CSE (AI & ML) specialization, expert Python benchmarks, and core neural project history (IndicOCR-Lite)."
  },
  "swe": {
    name: "Software Engineer",
    skills: ["Data Structures & Algorithms", "System Design", "Cloud Architecture", "RESTful Microservices"],
    projects: ["Thread-safe Memory Allocators", "Decentralized Marketplaces", "Distributed Ledgers"],
    industries: ["SaaS Enterprises", "E-Commerce", "Big Tech Platforms", "Financial Services"],
    growth: "Stable & Consistent (High volume demand across all global sectors)",
    difficulty: "Medium",
    opportunities: ["Full-Stack Engineer", "Backend Developer", "Systems Architect"],
    scope: "Building robust, horizontal, ultra-scalable web and system platforms operating securely under high QPS.",
    whyMatchesSoulPrint: "Directly leverages Ayush's expert Data Structures level and his past foundational frontend/backend structures."
  },
  "ds": {
    name: "Data Scientist",
    skills: ["Probability & Statistics", "Statistical Modeling", "Pandas & Numpy", "Business Intelligence"],
    projects: ["A/B Testing Simulators", "Predictive Churn Analyzers", "Clinical trial forecasting"],
    industries: ["Marketing Analytics", "Policy & Economics", "Healthcare Biotech", "Consulting"],
    growth: "Strong and Continuous (Highly relied on by decision engines worldwide)",
    difficulty: "Hard",
    opportunities: ["Lead Analyst", "Quantitative Scientist", "Data Strategist"],
    scope: "Synthesizing unstructured datasets to extract critical strategic business variables and trend analysis.",
    whyMatchesSoulPrint: "Synergizes with Ayush's Linear Algebra, Probability, and Statistics high academic standings."
  },
  "cyber": {
    name: "Cybersecurity Engineer",
    skills: ["Networking Protocols", "Penetration Testing", "Cryptography", "Incident Management"],
    projects: ["Network Packet Sniffers", "Intrusion Detection Engines", "Firewall Rules Architectures"],
    industries: ["Defense Agencies", "Banking Security", "Critical Infrastructure", "Enterprise Audit"],
    growth: "Highly Secure (Infinite demand due to rising geopolitical and digital vulnerability points)",
    difficulty: "Hard",
    opportunities: ["Security Architect", "Security Operations Lead (SOC)", "White-Hat Hacker"],
    scope: "Preventing, monitoring, and mitigating highly sophisticated malicious security breaches on server assets.",
    whyMatchesSoulPrint: "Supports Ayush's SQL database security interests and structured problem-solving patterns."
  }
};

export const DreamPathView: React.FC<DreamPathViewProps> = ({
  profile,
  onUpdateProfile,
  activeAtmosphere,
  accessibility,
}) => {
  // Select which track to view
  const [selectedTrackId, setSelectedTrackId] = useState<string>("ai-eng");
  const [subView, setSubView] = useState<"roadmap" | "identity">("roadmap");
  
  // Find track
  const currentTrack = useMemo(() => {
    return ROADMAP_TRACKS.find(t => t.id === selectedTrackId) || ROADMAP_TRACKS[0];
  }, [selectedTrackId]);

  // Selected node within track
  const [selectedNodeId, setSelectedNodeId] = useState<string>(currentTrack.nodes[0]?.id || "");
  
  // Dynamic Node Selection Sync on track change
  const handleTrackChange = (trackId: string) => {
    setSelectedTrackId(trackId);
    const newTrack = ROADMAP_TRACKS.find(t => t.id === trackId) || ROADMAP_TRACKS[0];
    if (newTrack.nodes.length > 0) {
      setSelectedNodeId(newTrack.nodes[0].id);
    }
  };

  const selectedNode = useMemo(() => {
    return currentTrack.nodes.find(n => n.id === selectedNodeId) || currentTrack.nodes[0];
  }, [currentTrack, selectedNodeId]);

  // Zoom / Pan flowchart state
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Career Simulator Selector
  const [simPathA, setSimPathA] = useState<string>("ai-eng");
  const [simPathB, setSimPathB] = useState<string>("swe");

  // Flowchart node collapse/expand state for sidebar nodes list
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleNodeExpand = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const handleZoom = (direction: "in" | "out" | "reset") => {
    if (direction === "in") {
      setZoomScale(prev => Math.min(prev + 0.1, 1.5));
    } else if (direction === "out") {
      setZoomScale(prev => Math.max(prev - 0.1, 0.6));
    } else {
      setZoomScale(1.0);
      setPanOffset({ x: 0, y: 0 });
    }
  };

  const handlePan = (dir: "up" | "down" | "left" | "right") => {
    const step = 40;
    setPanOffset(prev => {
      switch (dir) {
        case "up": return { ...prev, y: prev.y + step };
        case "down": return { ...prev, y: prev.y - step };
        case "left": return { ...prev, x: prev.x + step };
        case "right": return { ...prev, x: prev.x - step };
      }
    });
  };

  // Generate beautiful weekly plan based on active track
  const weeklyGrowthPlan = useMemo(() => {
    if (selectedTrackId === "ai-eng") {
      return [
        { day: "Monday", task: "Python OOP & Vectorization", time: "2 Hrs", impact: "High", deadline: "Today 11 PM" },
        { day: "Tuesday", task: "SQL Complex Join Practice", time: "1.5 Hrs", impact: "Medium", deadline: "Wed" },
        { day: "Wednesday", task: "Mini-Project: Log Ingestion", time: "3 Hrs", impact: "High", deadline: "Fri" },
        { day: "Thursday", task: "Stats Probabilities Review", time: "1 Hr", impact: "Medium", deadline: "Thu" },
        { day: "Friday", task: "GitHub Commits & Cleanup", time: "1.5 Hrs", impact: "High", deadline: "Sat" },
        { day: "Saturday", task: "Smart India Hackathon Sync", time: "4 Hrs", impact: "Critical", deadline: "Sun" },
        { day: "Sunday", task: "Soil Health Reflection Block", time: "1 Hr", impact: "Mindful", deadline: "Today" }
      ];
    } else {
      return [
        { day: "Monday", task: "Algorithmic Pattern Drills", time: "2.5 Hrs", impact: "High", deadline: "Today" },
        { day: "Tuesday", task: "Database Schema Normalization", time: "2 Hrs", impact: "Medium", deadline: "Wed" },
        { day: "Wednesday", task: "System Rate Limiter Cfg", time: "3 Hrs", impact: "Critical", deadline: "Fri" },
        { day: "Thursday", task: "Core OS Process Scheduling", time: "1.5 Hrs", impact: "Medium", deadline: "Thu" },
        { day: "Friday", task: "Clean Code Refactor Lab", time: "2 Hrs", impact: "High", deadline: "Sat" },
        { day: "Saturday", task: "Competitive Contest Mockup", time: "3.5 Hrs", impact: "High", deadline: "Sun" },
        { day: "Sunday", task: "Weekly Portfolio Update", time: "1 Hr", impact: "High", deadline: "Sun" }
      ];
    }
  }, [selectedTrackId]);

  // Overall track progress metrics (simulated dynamically using Ayush's profile)
  const trackMetrics = useMemo(() => {
    const completedCount = currentTrack.nodes.filter(n => n.status === "Completed").length;
    const totalCount = currentTrack.nodes.length;
    const percent = Math.round((completedCount / totalCount) * 100);

    return {
      overallProgress: percent,
      skillCompletion: Math.min(percent + 15, 100),
      projectCompletion: Math.min(percent + 5, 100),
      portfolioStrength: Math.round(percent * 0.9),
      internshipReadiness: Math.round(percent * 0.85),
      interviewReadiness: Math.round(percent * 0.75)
    };
  }, [currentTrack]);

  // Floating Atmosphere Particles Renderer
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
                  left: `${10 + i * 12}%`,
                  top: `-${15 + i * 2}%`
                }}
                animate={{
                  y: ["0vh", "100vh"],
                }}
                transition={{
                  duration: 2.2 + (i % 3),
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.3
                }}
              />
            ))}
          </div>
        );
      case "forest":
        return (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Flitting Butterflies on Roadmap */}
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-pink-300/30 blur-[2px]"
                style={{
                  left: `${15 + i * 20}%`,
                  top: `${30 + i * 18}%`
                }}
                animate={{
                  x: [0, 50, -30, 0],
                  y: [0, -70, -40, 0],
                  scale: [1, 1.3, 0.8, 1],
                  opacity: [0.2, 0.7, 0.3, 0.2]
                }}
                transition={{
                  duration: 7 + i * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 1.2
                }}
              />
            ))}
          </div>
        );
      case "night":
        return (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Floating Fireflies */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-yellow-200/60"
                style={{
                  left: `${5 + i * 18}%`,
                  top: `${20 + i * 14}%`
                }}
                animate={{
                  opacity: [0.2, 0.9, 0.3, 0.2],
                  scale: [0.9, 1.2, 0.9],
                  y: [0, -20, 0]
                }}
                transition={{
                  duration: 4 + (i % 2),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Sunset ambient lighting border glow
  const cardGlowClass = activeAtmosphere === "sunset"
    ? "shadow-[0_0_15px_rgba(251,113,133,0.12)] border-rose-300/20"
    : "border-white/10";

  return (
    <div className="relative space-y-8 animate-fade-in text-white z-10 w-full">
      {renderAtmosphericParticles()}

      {/* SUB-VIEW NAVIGATION */}
      <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl max-w-sm">
        <button
          onClick={() => setSubView("roadmap")}
          className={`flex-1 py-1.5 text-center text-[11px] font-bold rounded-xl transition duration-200 cursor-pointer ${
            subView === "roadmap"
              ? "bg-[#342D5A] border border-pink-500/20 text-pink-300 shadow-md"
              : "text-white/60 hover:text-white"
          }`}
        >
          Interactive Roadmaps
        </button>
        <button
          onClick={() => setSubView("identity")}
          className={`flex-1 py-1.5 text-center text-[11px] font-bold rounded-xl transition duration-200 cursor-pointer ${
            subView === "identity"
              ? "bg-[#342D5A] border border-pink-500/20 text-pink-300 shadow-md"
              : "text-white/60 hover:text-white"
          }`}
        >
          Career Identity Engine
        </button>
      </div>

      {subView === "identity" ? (
        <CareerIdentityView
          profile={profile}
          onUpdateProfile={onUpdateProfile}
          accessibility={accessibility}
          activeAtmosphere={activeAtmosphere}
        />
      ) : (
        <>
          {/* SECTION 1: DREAM DASHBOARD */}
      <div className={`p-6 md:p-8 rounded-3xl bg-white/10 backdrop-blur-md border shadow-lg relative overflow-hidden ${cardGlowClass}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          
          {/* Main Info */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🎯</span>
              <div>
                <span className="text-[10px] font-mono uppercase text-pink-300 tracking-widest block font-bold">Primary Undergrad Target</span>
                <h2 className="text-2xl font-display font-extrabold text-white">
                  {profile.careerGoal || "AI Engineer"}
                </h2>
              </div>
            </div>

            <p className="text-xs text-white/80 leading-relaxed max-w-xl">
              Currently syncing your B.Tech parameters. Your career readiness scores compile live based on expert Python validation, SQL milestones, and continuous Indian research incubator validations.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5 text-xs">
              <div className="space-y-1">
                <span className="text-white/50 font-mono block text-[10px] uppercase">Current Semester</span>
                <span className="font-bold text-white text-sm">{profile.semester || "3rd Semester"}</span>
              </div>
              <div className="space-y-1">
                <span className="text-white/50 font-mono block text-[10px] uppercase">Next Milestone</span>
                <span className="font-bold text-pink-300 text-sm">Machine Learning Foundations</span>
              </div>
              <div className="space-y-1">
                <span className="text-white/50 font-mono block text-[10px] uppercase">Time Remaining</span>
                <span className="font-bold text-white text-sm">~1.5 Years</span>
              </div>
              <div className="space-y-1">
                <span className="text-white/50 font-mono block text-[10px] uppercase">Career Confidence</span>
                <span className="font-bold text-emerald-400 text-sm">85%</span>
              </div>
            </div>
          </div>

          {/* Large Progress Ring Card */}
          <div className="md:col-span-4 flex flex-col items-center justify-center bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="relative flex items-center justify-center">
              {/* SVG circular track */}
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-white/10 fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-pink-500 fill-none transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * trackMetrics.overallProgress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-display font-extrabold text-white">{trackMetrics.overallProgress}%</span>
                <span className="text-[8px] font-mono uppercase text-white/50 block">Overall Progress</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-white/70 mt-3 text-center">
              Estimated Readiness: <strong className="text-emerald-400">{trackMetrics.internshipReadiness}%</strong>
            </span>
          </div>

        </div>
      </div>

      {/* SELECTOR FOR 12 DISTINCT ROADMAPS */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2.5">
          <Compass className="w-5 h-5 text-pink-300" />
          <div>
            <h4 className="text-xs font-bold font-display text-white">Select Specialized Career Path</h4>
            <p className="text-[10px] text-white/50">Changes the visual roadmap and AI insights below automatically</p>
          </div>
        </div>

        <select
          id="career-path-dropdown"
          value={selectedTrackId}
          onChange={(e) => handleTrackChange(e.target.value)}
          className="px-4 py-2 rounded-xl bg-[#342D5A] border border-white/10 text-white text-xs font-bold focus:outline-none focus:ring-1 focus:ring-pink-300 cursor-pointer"
        >
          {ROADMAP_TRACKS.map(t => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.category})
            </option>
          ))}
        </select>
      </div>

      {/* SECTION 2: INTERACTIVE CAREER FLOWCHART & SIDE PANEL (GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Flowchart canvas area (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase font-bold tracking-widest text-white/60">
              Interactive Flowchart: {currentTrack.name} Path
            </h3>
            
            {/* Zoom / Pan Controls */}
            <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => handlePan("left")}
                className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
                title="Pan Left"
              >
                ←
              </button>
              <button
                onClick={() => handlePan("up")}
                className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
                title="Pan Up"
              >
                ↑
              </button>
              <button
                onClick={() => handlePan("down")}
                className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
                title="Pan Down"
              >
                ↓
              </button>
              <button
                onClick={() => handlePan("right")}
                className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
                title="Pan Right"
              >
                →
              </button>
              <div className="h-4 w-[1px] bg-white/10 mx-1" />
              <button
                onClick={() => handleZoom("out")}
                className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[9px] text-pink-300 font-bold">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => handleZoom("in")}
                className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleZoom("reset")}
                className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white text-[10px] cursor-pointer"
                title="Reset Canvas"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Actual Flowchart Canvas */}
          <div className="h-[460px] rounded-3xl bg-slate-950/40 border border-white/10 relative overflow-hidden flex items-center justify-center p-4">
            
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Simulated Rain drops falling on canvas if Rain theme active */}
            {activeAtmosphere === "rain" && !accessibility.staticBackground && (
              <div className="absolute inset-0 pointer-events-none bg-sky-500/5 mix-blend-overlay z-0" />
            )}

            {/* Transformable Canvas Area */}
            <div
              className="absolute transition-transform duration-300 ease-out flex flex-col items-center space-y-8 w-full max-h-full overflow-y-auto py-8"
              style={{
                transform: `scale(${zoomScale}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: "center center",
              }}
            >
              {currentTrack.nodes.map((node, index) => {
                const isSelected = node.id === selectedNodeId;
                const isCompleted = node.status === "Completed";
                const isInProgress = node.status === "In_Progress";

                return (
                  <React.Fragment key={node.id}>
                    
                    {/* Node Card */}
                    <div
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`w-11/12 max-w-[340px] p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative group ${
                        isSelected
                          ? "bg-white/20 border-white shadow-[0_0_20px_rgba(255,107,107,0.25)] ring-1 ring-white/10 scale-105"
                          : isCompleted
                          ? "bg-white/5 hover:bg-white/10 border-emerald-500/40 text-white/90 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                          : isInProgress
                          ? "bg-white/5 hover:bg-white/10 border-amber-500/40 text-white/90 animate-pulse"
                          : "bg-white/5 hover:bg-white/10 border-white/5 text-white/40"
                      }`}
                    >
                      {/* Left indicator bar */}
                      <div className={`absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl ${
                        isCompleted ? "bg-emerald-500" : isInProgress ? "bg-amber-500" : "bg-white/10"
                      }`} />

                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-1">
                          <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            isCompleted ? "bg-emerald-500/20 text-emerald-300" : isInProgress ? "bg-amber-500/20 text-amber-300" : "bg-white/5"
                          }`}>
                            {node.status}
                          </span>
                          <h4 className="text-xs font-bold text-white tracking-tight leading-tight pt-1">
                            {node.title}
                          </h4>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-white/40 shrink-0 transition-transform ${isSelected ? "translate-x-1 text-white" : ""}`} />
                      </div>
                    </div>

                    {/* SVG Connector Line to Next Node */}
                    {index < currentTrack.nodes.length - 1 && (
                      <svg className="w-8 h-8 pointer-events-none overflow-visible -my-3">
                        <line
                          x1="50%"
                          y1="0"
                          x2="50%"
                          y2="100%"
                          className={`${
                            isCompleted
                              ? "stroke-emerald-500"
                              : "stroke-white/20"
                          } transition-all duration-300`}
                          strokeWidth="2.5"
                          strokeDasharray={isCompleted ? "0" : "4 4"}
                        />
                      </svg>
                    )}

                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* SIDE DETAIL PANEL: clicked node properties (5 cols on lg) */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg space-y-6">
            
            <div className="space-y-2 border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-md bg-white/10 text-pink-300 border border-white/10 font-bold block w-max">
                {currentTrack.name} Module Checkpoint
              </span>
              <h3 className="text-lg font-display font-bold text-white leading-tight">
                {selectedNode.title}
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-mono text-white/60">
                <Clock className="w-3.5 h-3.5" />
                <span>Est. Time: {selectedNode.time}</span>
              </div>
            </div>

            {/* Node Properties Cards Stack */}
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              
              {/* 📌 Why this matters */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <h5 className="text-[10px] font-mono uppercase text-pink-300 font-bold flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  📌 Why this matters
                </h5>
                <p className="text-[11px] text-white/80 leading-relaxed italic">
                  "{selectedNode.why}"
                </p>
              </div>

              {/* 📚 Skills gained */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
                <h5 className="text-[10px] font-mono uppercase text-emerald-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  📚 Skills Gained
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.skills.map((s, idx) => (
                    <span key={idx} className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-white">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* 💻 Mini Projects & Portfolio */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <h5 className="text-[10px] font-mono uppercase text-indigo-300 font-bold flex items-center gap-1">
                  <PlayCircle className="w-3.5 h-3.5" />
                  💻 Projects & Portfolios
                </h5>
                <div className="space-y-1.5 text-[11px] text-white/80">
                  <div className="p-1.5 rounded bg-white/5">
                    <span className="font-bold text-white block text-[10px]">Mini Projects:</span>
                    <ul className="list-disc pl-4 space-y-1 pt-1 text-[10px]">
                      {selectedNode.miniProjects.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-1.5 rounded bg-pink-500/5 border border-pink-500/10">
                    <span className="font-bold text-pink-300 block text-[10px]">🚀 Suggested Portfolio Landmark:</span>
                    <p className="text-[10px] pt-1 font-semibold text-white/90">{selectedNode.portfolioProject}</p>
                  </div>
                </div>
              </div>

              {/* OPPORTUNITY PREVIEW BADGES */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <h5 className="text-[10px] font-mono uppercase text-amber-300 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Opportunity Compass Preview Badges
                </h5>
                
                <div className="grid grid-cols-2 gap-2 text-[10px] text-white/85">
                  <div className="bg-white/5 p-1.5 rounded flex items-center gap-1.5">
                    <span className="text-xs">🏆</span>
                    <div>
                      <span className="text-[8px] text-white/40 block">Hackathons</span>
                      <span className="font-semibold">{selectedNode.hackathons[0] || "SIH 2026 Ready"}</span>
                    </div>
                  </div>
                  <div className="bg-white/5 p-1.5 rounded flex items-center gap-1.5">
                    <span className="text-xs">💼</span>
                    <div>
                      <span className="text-[8px] text-white/40 block">Internships</span>
                      <span className="font-semibold">{selectedNode.internships[0] || "IIT Research Link"}</span>
                    </div>
                  </div>
                  <div className="bg-white/5 p-1.5 rounded flex items-center gap-1.5">
                    <span className="text-xs">🎓</span>
                    <div>
                      <span className="text-[8px] text-white/40 block">Scholarships</span>
                      <span className="font-semibold text-pink-300">{selectedNode.scholarships[0] || "Reliance Fdn"}</span>
                    </div>
                  </div>
                  <div className="bg-white/5 p-1.5 rounded flex items-center gap-1.5">
                    <span className="text-xs">🏅</span>
                    <div>
                      <span className="text-[8px] text-white/40 block">Certifications</span>
                      <span className="font-semibold">{selectedNode.certifications[0] || "Google Career Cert"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 📺 Learning Resources */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
                <h5 className="text-[10px] font-mono uppercase text-sky-300 font-bold flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Learning Resources
                </h5>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.resources.map((r, idx) => (
                    <span key={idx} className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-white">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* ⚠ Common Mistakes & AI Tips */}
              <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-2 text-[11px]">
                <div className="flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-200 block text-[10px]">⚠ Common Mistake</span>
                    <p className="text-white/80 leading-relaxed text-[10px]">{selectedNode.mistakes}</p>
                  </div>
                </div>
                <div className="flex items-start gap-1.5 border-t border-white/5 pt-2">
                  <Sparkles className="w-4 h-4 text-pink-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-pink-200 block text-[10px]">💡 AI Tip</span>
                    <p className="text-white/80 leading-relaxed text-[10px]">{selectedNode.tips}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* SECTION 3: CAREER GPS */}
      <div className={`p-6 rounded-3xl bg-white/10 backdrop-blur-md border shadow-lg space-y-5 ${cardGlowClass}`}>
        <div className="flex items-center space-x-2.5 border-b border-white/10 pb-3">
          <Compass className="w-5 h-5 text-pink-300 animate-spin-slow" />
          <div>
            <h3 className="text-base font-display font-bold text-white">3️⃣ Career GPS Advisor</h3>
            <p className="text-xs text-white/60">Dynamic tracking of your academic trajectory based on Ayush's real profile stats</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
          
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex items-center gap-1.5 text-pink-300">
              <span className="text-base">📍</span>
              <h4 className="font-bold">Current Position & Strengths</h4>
            </div>
            <ul className="space-y-1.5 text-[11px] list-disc pl-4 text-white/80">
              <li>Current Academic Standing: {profile.semester || "2nd Semester"} CSE (AI & ML)</li>
              <li>Academic Strengths: Probability & Linear Algebra</li>
              <li>Validated Tech Level: Expert Python & Intermediate SQL benchmarks</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex items-center gap-1.5 text-amber-300">
              <span className="text-base">🔍</span>
              <h4 className="font-bold">Missing Skills & Weak Areas</h4>
            </div>
            <ul className="space-y-1.5 text-[11px] list-disc pl-4 text-white/80">
              <li>Deep learning & neural calculus (mismatch on PyTorch level)</li>
              <li>Github consistency on daily algorithmic repositories</li>
              <li>Big data scale queries optimizations skills</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <span className="text-base">🚀</span>
              <h4 className="font-bold">Next Best Action & Readiness</h4>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-white/90">
                Begin Machine Learning Foundations module immediately. Focus on gradient descent optimizations and Scikit-Learn pipelines.
              </p>
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-300 text-center">
                Career Readiness Index: {trackMetrics.internshipReadiness}% (Ready for Summer Research Internships)
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 4: WEEKLY GROWTH PLAN */}
      <div className={`p-6 rounded-3xl bg-white/10 backdrop-blur-md border shadow-lg space-y-5 ${cardGlowClass}`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2.5">
            <Calendar className="w-5 h-5 text-indigo-300" />
            <div>
              <h3 className="text-base font-display font-bold text-white">4️⃣ Weekly Growth Planner</h3>
              <p className="text-xs text-white/60">Recommended high-impact focus sprints customized from your SoulPrint parameters</p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-pink-500/25 px-2.5 py-1 rounded-xl font-bold text-pink-300">
            Active Sprint
          </span>
        </div>

        {/* 7 Days Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {weeklyGrowthPlan.map((p, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2.5 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-pink-300 font-bold block">{p.day}</span>
                <h4 className="text-xs font-bold text-white leading-snug pt-1">{p.task}</h4>
              </div>

              <div className="space-y-1 text-[9px] pt-2 border-t border-white/5">
                <div className="flex justify-between">
                  <span className="text-white/40">Est. Time</span>
                  <span className="font-semibold text-white">{p.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Impact</span>
                  <span className={`font-semibold ${
                    p.impact === "Critical" ? "text-pink-300" : p.impact === "High" ? "text-amber-300" : "text-emerald-300"
                  }`}>{p.impact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Deadline</span>
                  <span className="text-white/60">{p.deadline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: DREAM PROGRESS & GROWTH PREVIEWS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Animated Progress Rings Container */}
        <div className={`p-6 rounded-3xl bg-white/10 backdrop-blur-md border shadow-lg space-y-6 ${cardGlowClass}`}>
          <h3 className="text-sm font-display font-bold uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
            <TrendingUp className="w-4.5 h-4.5 text-pink-300" />
            5️⃣ Dream Progress Circular Indexes
          </h3>

          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Overall Track", val: trackMetrics.overallProgress, color: "stroke-pink-500" },
              { label: "Skill Mastery", val: trackMetrics.skillCompletion, color: "stroke-indigo-400" },
              { label: "Project Deliveries", val: trackMetrics.projectCompletion, color: "stroke-amber-400" },
              { label: "Portfolio Strength", val: trackMetrics.portfolioStrength, color: "stroke-sky-400" },
              { label: "Internship Readiness", val: trackMetrics.internshipReadiness, color: "stroke-emerald-400" },
              { label: "Interview Readiness", val: trackMetrics.interviewReadiness, color: "stroke-rose-400" }
            ].map((ring, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="relative flex items-center justify-center w-20 h-20">
                  <svg className="w-18 h-18 transform -rotate-90">
                    <circle cx="36" cy="36" r="30" className="stroke-white/10 fill-none" strokeWidth="5" />
                    <circle
                      cx="36"
                      cy="36"
                      r="30"
                      className={`${ring.color} fill-none transition-all duration-1000 ease-out`}
                      strokeWidth="5"
                      strokeDasharray={188.4}
                      strokeDashoffset={188.4 - (188.4 * ring.val) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-white">{ring.val}%</span>
                </div>
                <span className="text-[10px] text-white/60 font-mono mt-2 leading-tight block">
                  {ring.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* GROWTH MISSIONS & OPPORTUNITIES PREVIEWS */}
        <div className={`p-6 rounded-3xl bg-white/10 backdrop-blur-md border shadow-lg space-y-5 ${cardGlowClass}`}>
          <h3 className="text-sm font-display font-bold uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
            <Sparkles className="w-4.5 h-4.5 text-indigo-300" />
            Growth & Opportunities Previews
          </h3>

          {/* Suggested Mission Preview */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 to-indigo-500/10 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded font-bold">
                Today's Suggested Mission
              </span>
              <span className="text-[9px] font-mono text-emerald-300 flex items-center gap-1 font-bold">
                🌱 Bloom: +50 pts
              </span>
            </div>
            
            <h4 className="text-sm font-bold text-white">"Build an Image Classification Project"</h4>
            
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-white/60">
              <div>
                <span className="block">Deadline:</span>
                <span className="text-white font-bold">Tonight 11:59 PM</span>
              </div>
              <div>
                <span className="block">Dream Impact:</span>
                <span className="text-pink-300 font-bold">+12% AI Readiness</span>
              </div>
            </div>
            <p className="text-[11px] text-white/70 italic pt-1">
              "Fully automated pipeline processing. Prepares you for computer vision research."
            </p>
          </div>

          {/* Quick Informational note */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex gap-2.5 text-xs text-white/80 leading-relaxed">
            <Info className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" />
            <p className="text-[11px]">
              These micro activities link directly to the subsequent <strong>Bloom Forest</strong> visualizer. Complete missions to nurture your local virtual forest and claim rewards.
            </p>
          </div>
        </div>

      </div>

      {/* SECTION 6: CAREER PATHS SIMULATOR */}
      <div className={`p-6 rounded-3xl bg-white/10 backdrop-blur-md border shadow-lg space-y-6 ${cardGlowClass}`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2.5">
            <Layers className="w-5 h-5 text-pink-300 animate-pulse" />
            <div>
              <h3 className="text-base font-display font-bold text-white">6️⃣ Career Paths Simulator</h3>
              <p className="text-xs text-white/60 font-mono">Evaluate, analyze, and compare alternate undergraduate career projections</p>
            </div>
          </div>
        </div>

        {/* Path selectors for simulator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-white/50">Path A</label>
            <select
              value={simPathA}
              onChange={(e) => setSimPathA(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#342D5A] border border-white/10 text-white text-xs font-bold"
            >
              <option value="ai-eng">AI Engineer</option>
              <option value="swe">Software Engineer</option>
              <option value="ds">Data Scientist</option>
              <option value="cyber">Cybersecurity Engineer</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-white/50">Path B</label>
            <select
              value={simPathB}
              onChange={(e) => setSimPathB(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#342D5A] border border-white/10 text-white text-xs font-bold"
            >
              <option value="swe">Software Engineer</option>
              <option value="ai-eng">AI Engineer</option>
              <option value="ds">Data Scientist</option>
              <option value="cyber">Cybersecurity Engineer</option>
            </select>
          </div>
        </div>

        {/* Side-by-side comparison tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* PATH A Details */}
          {SIMULATOR_COMPARISONS[simPathA] && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h4 className="font-display font-bold text-pink-300 text-sm">
                  {SIMULATOR_COMPARISONS[simPathA].name} Details
                </h4>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-pink-500/10 text-pink-300">
                  Difficulty: {SIMULATOR_COMPARISONS[simPathA].difficulty}
                </span>
              </div>

              <div className="space-y-3 text-xs text-white/80">
                <div>
                  <span className="text-white/40 block text-[10px] font-mono">Skills Gained</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {SIMULATOR_COMPARISONS[simPathA].skills.map((s, idx) => (
                      <span key={idx} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-white/90">{s}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-white/40 block text-[10px] font-mono">Benchmark Projects</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {SIMULATOR_COMPARISONS[simPathA].projects.map((p, idx) => (
                      <span key={idx} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-white/90 italic">"{p}"</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] pt-2 border-t border-white/5">
                  <div>
                    <span className="text-white/40 block text-[9px] font-mono">Primary Industries</span>
                    <span className="font-bold text-white">{SIMULATOR_COMPARISONS[simPathA].industries.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[9px] font-mono">Market Opportunities</span>
                    <span className="font-bold text-white">{SIMULATOR_COMPARISONS[simPathA].opportunities.join(", ")}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <span className="text-pink-300 block text-[10px] font-mono font-bold">🎯 Why this matches your SoulPrint:</span>
                  <p className="text-[11px] text-white/85 leading-relaxed pt-1">
                    {SIMULATOR_COMPARISONS[simPathA].whyMatchesSoulPrint}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PATH B Details */}
          {SIMULATOR_COMPARISONS[simPathB] && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h4 className="font-display font-bold text-indigo-300 text-sm">
                  {SIMULATOR_COMPARISONS[simPathB].name} Details
                </h4>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                  Difficulty: {SIMULATOR_COMPARISONS[simPathB].difficulty}
                </span>
              </div>

              <div className="space-y-3 text-xs text-white/80">
                <div>
                  <span className="text-white/40 block text-[10px] font-mono">Skills Gained</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {SIMULATOR_COMPARISONS[simPathB].skills.map((s, idx) => (
                      <span key={idx} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-white/90">{s}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-white/40 block text-[10px] font-mono">Benchmark Projects</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {SIMULATOR_COMPARISONS[simPathB].projects.map((p, idx) => (
                      <span key={idx} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-white/90 italic">"{p}"</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] pt-2 border-t border-white/5">
                  <div>
                    <span className="text-white/40 block text-[9px] font-mono">Primary Industries</span>
                    <span className="font-bold text-white">{SIMULATOR_COMPARISONS[simPathB].industries.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[9px] font-mono">Market Opportunities</span>
                    <span className="font-bold text-white">{SIMULATOR_COMPARISONS[simPathB].opportunities.join(", ")}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 pt-2 border-t border-white/5">
                  <span className="text-indigo-300 block text-[10px] font-mono font-bold">🎯 Why this matches your SoulPrint:</span>
                  <p className="text-[11px] text-white/85 leading-relaxed pt-1">
                    {SIMULATOR_COMPARISONS[simPathB].whyMatchesSoulPrint}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      </>
      )}

    </div>
  );
};
