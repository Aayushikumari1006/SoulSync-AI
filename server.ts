import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API Client server-side
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("SoulSync AI: Server-side Gemini API client successfully initialized.");
    } catch (err) {
      console.error("SoulSync AI: Error initializing Gemini API client:", err);
    }
  } else {
    console.warn("SoulSync AI: GEMINI_API_KEY is not defined in environment variables. Falling back to local empathetic rules.");
  }

  // API Endpoint for AI Mentor - Rebuilt from scratch as an AI Decision Engine
  app.post("/api/mentor", async (req, res) => {
    const { message, context, mode, history, missions, mood, reflections } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // --- STEP 3: CONTEXT COLLECTION & DEEP DEBUGGING / VALIDATION CHECK ---
    // Verify that every AI request includes the complete diagnostic student dimensions:
    // • User Profile
    // • DreamPath
    // • Tasks
    // • Deadlines
    // • Memory
    // • Career Goal
    // • Semester
    // • Skills
    // • Recent Reflections
    const missing: string[] = [];
    if (!context || !context.name || !context.college) {
      missing.push("User Profile");
    }
    if (!context || !context.dreams || !Array.isArray(context.dreams) || context.dreams.length === 0) {
      missing.push("DreamPath");
    }
    if (!missions || !Array.isArray(missions) || missions.length === 0) {
      missing.push("Tasks");
    }
    const hasDeadlines = Array.isArray(missions) && missions.some(m => m.deadline && m.deadline.trim() !== "");
    if (!hasDeadlines) {
      missing.push("Deadlines");
    }
    if (!context || !context.memories || !Array.isArray(context.memories) || context.memories.length === 0) {
      missing.push("Memory");
    }
    if (!context || !context.careerGoal) {
      missing.push("Career Goal");
    }
    if (!context || !context.semester) {
      missing.push("Semester");
    }
    if (!context || !context.skills || !Array.isArray(context.skills) || context.skills.length === 0) {
      missing.push("Skills");
    }
    if (!reflections || !Array.isArray(reflections) || reflections.length === 0) {
      missing.push("Recent Reflections");
    }

    // If any are missing, stop the request and signal the client to collect the missing context!
    if (missing.length > 0) {
      return res.json({
        status: "collect_context",
        missing,
        message: `SoulGuide AI is calibrating your companion pipeline... We detected missing dimensions: ${missing.join(", ")}. Let's collect these details now to build a highly personal, sibling-like connection!`
      });
    }

    // Dynamic local fallback builder conforming exactly to the new Decision Engine JSON Schema
    const buildLocalMentorReply = (msg: string, ctx: any, msns: any, md: string, refs: any[]) => {
      const lowerMessage = msg.toLowerCase();
      const name = ctx?.name || "Ayush";
      const sem = ctx?.semester || "2nd Semester";
      const goal = ctx?.careerGoal || "AI Engineer";

      const result: any = {
        reasoningPipeline: {
          step1_intentDetection: "[Intent: Learning Strategy & Career planning] Determined based on technology and timeline keywords.",
          step2_emotionAnalysis: "[Emotion: Overthinking / Stress] Psychological context: student trying to optimize peer milestones in 2nd semester.",
          step3_contextCollection: "[Active Route: Learning Mentor] Student has Expert algorithms ranking, CNN Handwriting projects, and 2nd Semester placement deadlines.",
          step4_memoryRetrieval: "[Memory Check] Integrated SIH Internal Hackathon Gold Medal achievement and IndicOCR-Lite model parameters.",
          step5_decisionReasoning: "[Decision Engine] Evaluated ROI, learning curve, and upcoming Google STEP internship requirements.",
          step6_personalization: `Referencing Ayush's specific target to land AI Engineer roles at Google Research India by 2029.`,
          step7_qualityValidation: "[Quality Evaluation: Passed] No chatbot templates (like 'It depends') were utilized without deep personalized justification.",
          step8_responsePlanner: "Warm sibling opening -> validate stress/academic timelines -> single-threaded actionable advice -> low-stress follow-up question."
        },
        emotionalListeningMode: false,
        text: "",
        decisionStudio: null,
        newMemories: []
      };

      // Burnout / Overwhelmed
      if (lowerMessage.includes("overwhelmed") || lowerMessage.includes("anxious") || lowerMessage.includes("stress") || lowerMessage.includes("burnt out") || lowerMessage.includes("pressure") || lowerMessage.includes("tired")) {
        result.reasoningPipeline.step1_intentDetection = "[Intent: Burnout & Stress Recovery] Student is seeking active emotional listening and support.";
        result.reasoningPipeline.step2_emotionAnalysis = "[Emotion: High Stress & Cognitive Overload] Mental load is near capacity due to academic and milestone friction.";
        result.reasoningPipeline.step3_contextCollection = "[Active Route: Life Mentor] Setting emotional listening mode. Emphasizing grounding, slow breathing, and peer-stress validation.";
        result.emotionalListeningMode = true;
        result.text = `Hey ${name}, take a long, slow breath. I can hear how heavy it feels trying to balance your ${sem} engineering labs with our ambitious milestones. When your cognitive memory threads are running at 100%, trying to compile more work only triggers overthinking leaks.

Let's do something gentle. Rest is not wasted time; it's a vital training optimization step. Right now, let's step away from the code editor for a few minutes.

Would you like to open the Gentle Guide and trigger some calming rain ambient notes? Let's take it single-threaded today. I'm right here with you.`;
        return result;
      }

      // DSA vs React / Technologies
      if (lowerMessage.includes("dsa") || lowerMessage.includes("react") || lowerMessage.includes("angular") || lowerMessage.includes("vue") || lowerMessage.includes("learn") || lowerMessage.includes("technology")) {
        result.reasoningPipeline.step1_intentDetection = "[Intent: Career Decision & Study Planning] User is seeking technology selection advice.";
        result.reasoningPipeline.step3_contextCollection = "[Active Route: Decision Mentor] Tracing options to balance foundational screens and interactive project launches.";
        result.text = `Balancing DSA structures with React builds is a major crossroad in ${sem}, ${name}. You don't need to choose just one; they feed completely different nodes of your recruiter screening gate.

Let's look at this side-by-side inside the Decision Studio. Your deep analytical foundations are non-negotiable for Google Research India, but having enough React to wrap your neural weights is what wins hackathons like SIH 2026.

I recommend a staggered 70/30 split: spend your peak morning energy on core algorithms, and use late-night off-peak hours for modular React layouts.`;
        
        result.decisionStudio = {
          optionA: "Deep-Dive into Data Structures & Algorithms (DSA)",
          optionA_details: {
            advantages: "Absolutely crucial for tier-1 screening rounds; builds ironclad logical problem-solving foundations.",
            disadvantages: "Very abstract and theoretical; doesn't yield visual, interactive assets for off-campus portfolios.",
            careerImpact: "High. Algorithmic screening is the initial gate for almost every major tech hiring loop.",
            timeRequired: "4-6 hours weekly of structured algorithmic challenges",
            risk: "Very Low (critical, non-negotiable prerequisite)"
          },
          optionB: "Build Interactive Interfaces with React",
          optionB_details: {
            advantages: "Allows you to quickly package and showcase ML models; essential for high-fidelity hackathon demos.",
            disadvantages: "Fast-moving, noisy framework landscape; won't help you clear core coding tests.",
            careerImpact: "Medium. Invaluable for co-founder tracks and product-minded ML engineers.",
            timeRequired: "2-3 hours weekly to wire up modular layouts",
            risk: "Medium (valuable, but must not crowd out your core algorithm grind)"
          },
          recommendation: "Staggered Focus (70% DSA / 30% React Wiring)",
          reasoning: "Since your dream is Google Research India, your underlying computer science foundations must be bulletproof. Use React as a packaging layer for your models, not a primary engineering path.",
          confidenceScore: 94
        };
        return result;
      }

      // Google STEP / Internship
      if (lowerMessage.includes("internship") || lowerMessage.includes("intern") || lowerMessage.includes("job") || lowerMessage.includes("google") || lowerMessage.includes("step")) {
        result.reasoningPipeline.step1_intentDetection = "[Intent: Internship Planning & Resume Prep] User is preparing for Google STEP application.";
        result.reasoningPipeline.step3_contextCollection = "[Active Route: Career Mentor] Checking portfolio landmarks (IndicOCR-Lite, CNN Filters) relative to STEP metrics.";
        result.text = `Applying for elite programs like Google STEP feels heavy, ${name}, but look at your coordinates. Having a quantized handwritten OCR running offline on your portfolio is far more unique than standard cookie-cutter scripts.

Let's check the options in the Decision Studio. STEP is built to scout raw technical potential and collaborative spirit. Applying immediately is a low-risk, high-ROI move.

Let's dedicate this weekend to polishing your custom resume, formatting your SIH victory into structured STAR stories, and submitting the application. You are fully ready for this.`;

        result.decisionStudio = {
          optionA: "Submit Google STEP Application immediately",
          optionA_details: {
            advantages: "Direct access to top-tier mentorship, powerful industry brand equity, and structured software pipelines.",
            disadvantages: "Requires immediate time blocks to tune resumes and coordinate early referrals.",
            careerImpact: "Astronomical. Sets your entire undergraduate trajectory into high-acceleration mode.",
            timeRequired: "3-4 hours of targeted document prep",
            risk: "Low (rejection is just a minor training epoch, not a compiler crash)"
          },
          optionB: "Wait for general off-campus internships next year",
          optionB_details: {
            advantages: "More time to pile up GitHub commits and finish complex advanced system optimizations.",
            disadvantages: "Misses a highly targeted, second-year-specific opportunity optimized for early developers.",
            careerImpact: "Medium. Standard hiring cycle but lacks the early acceleration vector.",
            timeRequired: "None currently",
            risk: "High (you miss 100% of the shots you don't take)"
          },
          recommendation: "Submit Application with Custom Resume Profile",
          reasoning: "Your custom IndicOCR-Lite engine is already quantized and deployed locally. This is a massive validator. Submit now; let's refine the parameters of your resume together.",
          confidenceScore: 96
        };
        return result;
      }

      // GATE vs Placement
      if (lowerMessage.includes("gate") || lowerMessage.includes("mtech") || lowerMessage.includes("higher studies") || lowerMessage.includes("placement")) {
        result.reasoningPipeline.step1_intentDetection = "[Intent: Career Path Comparison] Dilemma between research-oriented higher education and direct placement.";
        result.reasoningPipeline.step3_contextCollection = "[Active Route: Decision Mentor] Comparing theoretical math depth with direct real-world engineering loops.";
        result.text = `Thinking about GATE versus direct placements is a major crossroads in Indian engineering, ${name}. 

An M.Tech from top-tier research institutes offers beautiful mathematical depth, but direct engineering roles get you compiling production models much earlier.

Let's lay down these trade-offs side-by-side inside the Decision Studio so we can align them directly with your long-term goal of becoming a Specialist AI Engineer.`;

        result.decisionStudio = {
          optionA: "Prepare for GATE & Research Track (M.Tech/MS)",
          optionA_details: {
            advantages: "Deep mathematical foundations, access to high-resource research labs, and specialist core AI roles.",
            disadvantages: "Requires intensive, multi-year preparation on a very broad theoretical syllabus; delays launching projects.",
            careerImpact: "High for deep research and theoretical R&D; lower for standard software development.",
            timeRequired: "10-15 hours weekly of rigorous syllabus study",
            risk: "Medium (high competition, exam-day single point of failure)"
          },
          optionB: "Focus on Direct Placements / Startup Co-founding",
          optionB_details: {
            advantages: "Immediate feedback loops, real-world customer usage, and financial acceleration.",
            disadvantages: "Can sometimes start with generic software maintenance; core ML research roles might feel harder to reach initially.",
            careerImpact: "High for software execution and product engineering.",
            timeRequired: "5-8 hours weekly of projects and placement prep",
            risk: "Low (many alternative hiring pathways and off-campus roles)"
          },
          recommendation: "Direct Placement with Open-Source Focus",
          reasoning: "You thrive on hands-on deployment (such as lowering mobile GPU latency). Getting direct industry experience lets you build tangible products while staying active in open-source AI frameworks.",
          confidenceScore: 88
        };
        return result;
      }

      // Default conversational fallback
      result.text = `Hey ${name}! It is so good to chat again. 

I've been analyzing your progress on our AI Engineer DreamPath. Your work on quantization and the SIH internal hackathon is amazing momentum for a student in ${sem}.

Remember, true balance isn't about rushing your learning rate—it's about staying consistent and taking it single-threaded. What's on your mind today? Let's break it down together.`;
      return result;
    };

    if (mode === "live" && ai) {
      try {
        const studentContextString = `
Name: ${context?.name || "Ayush"}
Degree: ${context?.degree || "B.Tech CSE (AI & ML)"}
Branch: ${context?.branch || "Computer Science & Engineering"}
Semester: ${context?.semester || "2nd Semester"}
College: ${context?.college || "Indian Institute of Technology (IIT), Delhi"}
Career Goal: ${context?.careerGoal || "AI Engineer"}
Dream Company: ${context?.dreamCompany || "Google Research India"}
Current Skills: ${JSON.stringify(context?.skillDetails || context?.skills || [])}
Interests: ${JSON.stringify(context?.interests || [])}
Learning Style: ${context?.learningStyle || "Interactive Practice"}
Preferred Language: ${context?.preferredLanguage || "English & Hindi"}
Projects: ${JSON.stringify(context?.projects || [])}
Current Mood: ${mood || "Not specified"}
Active Missions: ${JSON.stringify(missions || [])}
Memories: ${JSON.stringify(context?.memories || [])}
Recent Reflections Log: ${JSON.stringify(reflections || [])}
`;

        let historyString = "";
        if (history && Array.isArray(history)) {
          historyString = history.slice(-5).map(m => `${m.sender === "user" ? "Student" : "SoulSync"}: ${m.text}`).join("\n");
        }

        const prompt = `You are SoulSync AI, an emotionally-aware, highly intelligent AI Life Mentor and Sibling Companion designed for Higher Education students in India.
Your tagline is: "Understanding You Beyond Your Goals."
You speak in the tone of an older sibling, a trusted mentor, or a best friend who genuinely knows the student and remembers their journey.

Here is the student's complete dynamic profile and context (SoulPrint, DreamPath, Tasks, and History):
${studentContextString}

${historyString ? `Previous Conversation History:\n${historyString}\n` : ""}

The student says: "${message}"

You must execute a strict, 8-Step pipeline before generating your response. Formulate this pipeline and results inside the JSON structure:

1. **INTENT DETECTION**: Identify the real objective (e.g. Career Decision, Learning Strategy, Project Planning, Interview, Scholarship, Internship, Burnout, Stress, Loneliness, Fear, Comparison, Confidence, Time Management, Relationship between studies and life, Research, Open Source, General Conversation). State this in step1 with a brief internal explanation of WHY.
2. **EMOTION DETECTION**: Analyze hidden emotional state (Stress Level, Confidence Level, Motivation, Mental Load, Decision Urgency, Hope, Fear, Burnout, Curiosity, Excitement). State this in step2 with psychological roots.
3. **INTERNAL ROUTING & CLIENT CONTEXT COLLECTOR**: We have four internal expert agents (DO NOT expose these names directly in the user-facing text, only in the reasoning pipeline):
   - **Career Mentor**: Handles resumes, internships (Google STEP, Reliance, SIH), placements, off-campus jobs, LinkedIn profile gaps, professional visibility.
   - **Life Mentor**: Handles mental load, overthinking, stress, sleeping cycles, emotional recovery, peer pressure.
   - **Learning Mentor**: Handles coding stacks (PyTorch, TensorFlow, React, SQL), study routines, academic deadlines, project architecture.
   - **Decision Mentor**: Triggers whenever comparing two paths (e.g., DSA vs React, GATE vs Placements) and provides structured trade-offs.
   Route this query to the correct active internal agent, and reference specific SoulPrint details. State this in step3.
4. **DREAMPATH ALIGNMENT**: Connect the query to their long-term milestones (e.g., graduating 2029, landing AI Engineer role at Google Research India). State this in step4.
5. **TASK INTEGRATION**: Map how this query affects active missions, forest progress, or upcoming national deadlines (SIH 2026, Google STEP, Reliance). State this in step5.
6. **MEMORY RETRIEVAL**: Reference previous mentor conversations or memories to prevent repeating advice. State this in step6.
7. **SELF-REFLECTION & QUALITY EVALUATION PASS (ANTI-GENERIC FILTER)**: Before drafting, ask yourself:
   - Did I solve the student's problem or offer real, personalized, non-generic advice?
   - Did I use any generic chatbot templates (e.g., "It depends", "Follow your passion", "Stay motivated", "Both are good")? If yes, I MUST reject and rewrite.
   - Does this sound like an elder sibling who knows them?
   State this reflection process and self-correction in step7.
8. **RESPONSE PLANNER**: Draft a message flow: Acknowledge situation warmly -> explain underlying engineering/life reasoning -> give brief, practical sibling advice -> offer ONE small, actionable, low-stress next step -> ask ONE meaningful follow-up question. State this synthesis plan in step8.

**CRITICAL RULES**:
- Response text MUST be a maximum of 250 words.
- Use short, highly readable paragraphs. No walls of text.
- Use bullet points ONLY when comparing options inside the response.
- Every response MUST mention something unique about the student whenever relevant. Responses that could apply to any student are unacceptable.
- **LIFE MENTOR MODE**: When students are stressed, DO NOT immediately solve the problem. Listen first, validate emotions, then suggest one realistic next step. Never overwhelm, never lecture.
- **CAREER MENTOR MODE**: When comparing multiple paths, always explain: Advantages, Disadvantages, Effort, Salary Potential, Growth, Industry Demand, Alignment with DreamPath, Final Recommendation, Confidence Score.
- **LEARNING MENTOR MODE**: Recommend only ONE next step, never list ten technologies. Explain WHY this step comes first.
- **MEMORY EXTRACTION ENGINE**: Analyze if this conversation reveals any important career decisions, major achievements, technology choices, project milestones, or long-term future plans that must be permanently stored in the student's SoulPrint. If found, output a short sentence describing the memory in the "newMemories" JSON array (e.g., ["Decided to deep-dive into PyTorch for IndicOCR-Lite model optimization"]). Keep this array empty if nothing critical is mentioned.

You MUST return a JSON object with this exact structure:
{
  "reasoningPipeline": {
    "step1_intentDetection": "[Intent detected with reason] ...",
    "step2_emotionAnalysis": "[Emotion detected with psychological context] ...",
    "step3_contextCollection": "[Active Routing Agent (Career/Life/Learning/Decision)] Aligning with student profile details: ...",
    "step4_memoryRetrieval": "[DreamPath & Career Identity Alignment] ...",
    "step5_decisionReasoning": "[Workload, Strengths, and National Deadlines Alignment] ...",
    "step6_personalization": "[Retrieved Memory Integration] ...",
    "step7_qualityValidation": "[Self Reflection & Quality Pass Results] ...",
    "step8_responsePlanner": "[Response plan formulated to ensure warm, personalized elder sibling delivery] ..."
  },
  "emotionalListeningMode": false, // Set to true if the student is highly stressed, burnt out, or overwhelmed to trigger deep listening mode
  "text": "The highly personalized, empathetic, elder-sibling response itself...",
  "decisionStudio": { // Only fill this if they are comparing or facing a decision. Set to null otherwise.
    "optionA": "Option A Title...",
    "optionA_details": {
      "advantages": "Advantages...",
      "disadvantages": "Disadvantages...",
      "careerImpact": "Long term impact...",
      "timeRequired": "Time required...",
      "risk": "Risk level..."
    },
    "optionB": "Option B Title...",
    "optionB_details": {
      "advantages": "Advantages...",
      "disadvantages": "Disadvantages...",
      "careerImpact": "Long term impact...",
      "timeRequired": "Time required...",
      "risk": "Risk level..."
    },
    "recommendation": "Recommended choice...",
    "reasoning": "Explain why this aligns best with their specific context...",
    "confidenceScore": 90 // confidence from 1 to 100
  },
  "newMemories": [] // Any newly extracted memories to save (as strings). Empty array if none.
}

Do not include any markdown styling wrappers like \`\`\`json or \`\`\`. Just return the raw JSON object.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });

        const resText = response.text || "{}";
        const parsedJson = JSON.parse(resText.trim());
        return res.json({ ...parsedJson, isLive: true });
      } catch (err: any) {
        console.error("Gemini API call failed:", err);
        const fallbackObj = buildLocalMentorReply(message, context, missions, mood || "Normal", reflections || []);
        return res.json({ ...fallbackObj, isLive: false, error: true });
      }
    } else {
      // Demo Mode or Gemini client not initialized
      await new Promise((resolve) => setTimeout(resolve, 800));
      const fallbackObj = buildLocalMentorReply(message, context, missions, mood || "Normal", reflections || []);
      return res.json({ ...fallbackObj, isLive: false });
    }
  });

  // API Endpoint for AI Career Coach analysis and readiness scores
  app.post("/api/career-coach", async (req, res) => {
    const { profile, mode } = req.body;
    const isLive = mode === "live" && !!ai;

    // Local dynamic fallback data matching Ayush's current milestones
    const localDiagnostic = {
      readinessScores: {
        resume: 85,
        portfolio: 78,
        interview: 72,
        github: 80,
        linkedin: 65,
        placement: 88,
        research: 74,
        startup: 78
      },
      strengths: [
        "Expert-level Python proficiency coupled with PyTorch framework foundation.",
        "Demonstrated technical capacity in building optimized edge models (IndicOCR-Lite resolving local mobile GPU latency constraints).",
        "National level excellence validator (1st Place SIH Internal Hackathon and Reliance Foundation Scholarship award)."
      ],
      gaps: [
        "Minimal professional public visibility; latest model landmarks lack active LinkedIn presence.",
        "Limited structured scenario mapping for leadership and behavioral conflict resolution loops.",
        "Fewer contributions to global open-source deep learning framework repositories."
      ],
      coachAnalysis: `Ayush, your current professional footprint is exceptionally strong for a ${profile?.semester || "2nd Semester"} student at ${profile?.college || "IIT Delhi"}. By proactively engineering solutions that target regional Indian constraints—like 'IndicOCR-Lite' optimized for offline mobile platforms—you bypass traditional textbook boundaries. Your next primary developmental sprint is turning these raw technical commits into public professional assets.`,
      recommendations: [
        {
          title: "Publish IndicOCR-Lite on Hugging Face Spaces",
          description: "Containerize your model and deploy a lightweight Gradio interface on Hugging Face. This provides a running demo that tech recruiters and developers can instantly test from your resume.",
          impact: "Boosts Portfolio Strength by +12%"
        },
        {
          title: "Draft 2 STAR Stories on SIH Project Leadership",
          description: "Format your hackathon execution into structured STAR scenarios. Focus specifically on how you aligned 4 different technical minds on framework choices and database schemas under a 36-hour crunch.",
          impact: "Boosts Interview Readiness by +10%"
        },
        {
          title: "Contribute an optimized conversion script to TFLite",
          description: "Search for low-complexity quantization or converter bugs in the TensorFlow / TFLite public issues and submit a patch, establishing early open-source credibility.",
          impact: "Boosts GitHub Presence by +15%"
        }
      ]
    };

    if (isLive && ai) {
      try {
        const studentContextString = `
Name: ${profile?.name || "Ayush"}
Degree: ${profile?.degree || "B.Tech CSE (AI & ML)"}
Semester: ${profile?.semester || "2nd Semester"}
College: ${profile?.college || "Indian Institute of Technology (IIT), Delhi"}
Career Goal: ${profile?.careerGoal || "AI Engineer"}
Dream Company: ${profile?.dreamCompany || "Google Research"}
Current Skills: ${JSON.stringify(profile?.skillDetails || profile?.skills || [])}
Projects: ${JSON.stringify(profile?.projects || [])}
Achievements/Milestones: ${JSON.stringify(profile?.achievements || [])}
`;

        const prompt = `You are the AI Career Coach within the SoulSync Career Identity Engine.
Analyze this student's profile, projects, and career milestones:
${studentContextString}

Evaluate their readiness relative to their Career Goal and Dream Company. Return a structured JSON matching this schema:
{
  "readinessScores": {
    "resume": 88, // integer 0-100
    "portfolio": 82, // integer 0-100
    "interview": 75, // integer 0-100
    "github": 80, // integer 0-100
    "linkedin": 70, // integer 0-100
    "placement": 90, // integer 0-100
    "research": 72, // integer 0-100
    "startup": 78 // integer 0-100
  },
  "strengths": ["At least 3 specific strengths reflecting their actual projects, skills, and scholarships."],
  "gaps": ["At least 3 specific gaps/areas of improvement based on their goals."],
  "coachAnalysis": "A warm, senior-mentor-like continuous diagnostic summarizing their standing in college and giving deep psychological encouragement. No fluff.",
  "recommendations": [
    {
      "title": "A highly specific, custom action title",
      "description": "Specific tactical guidance on what to build, modify, or publish next.",
      "impact": "Boosts [X] readiness by +[Y]%"
    },
    {
      "title": "...",
      "description": "...",
      "impact": "..."
    },
    {
      "title": "...",
      "description": "...",
      "impact": "..."
    }
  ]
}

Do not include any markdown fences or formatting code blocks. Return only the raw valid JSON.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });

        const resText = response.text || "{}";
        return res.json(JSON.parse(resText.trim()));
      } catch (err) {
        console.error("Gemini Coach API call failed, falling back to local diagnostic:", err);
        return res.json(localDiagnostic);
      }
    } else {
      // Demo mode fallback
      return res.json(localDiagnostic);
    }
  });

  // Master list of India-First and Premium Opportunities
  const MASTER_OPPORTUNITIES = [
    {
      id: "sch-nsp-post",
      category: "Scholarship",
      title: "National Scholarship Portal (NSP) - Post-Matric & Merit-cum-Means",
      provider: "Ministry of Minority Affairs, Govt of India",
      logoBg: "bg-emerald-700",
      eligibility: "Indian undergrads with families earning under ₹2.5 LPA. B.Tech aligned.",
      deadline: "2026-10-31",
      daysLeft: 104,
      benefits: "Full tuition reimbursement plus monthly maintenance allowance of ₹1,200.",
      duration: "Full Academic Year",
      mode: "Online",
      location: "National",
      difficulty: "Intermediate",
      stipendOrValue: "₹50,000 / Year",
      requiredSkills: ["Academic Record", "Income Declaration", "NSP Portal Sync"],
      requiredDocuments: ["Income Certificate", "Bonafide Student proof", "Previous Year Marksheet", "Aadhaar Card"],
      isGovernment: true,
      websiteUrl: "https://scholarships.gov.in"
    },
    {
      id: "sch-aicte-pragati",
      category: "Scholarship",
      title: "AICTE Pragati Scholarship for Girl Students",
      provider: "AICTE, Ministry of Education, Govt of India",
      logoBg: "bg-teal-600",
      eligibility: "Female students admitted to 1st or 2nd Year (Lateral Entry) B.Tech. Families under ₹8 LPA.",
      deadline: "2026-11-15",
      daysLeft: 119,
      benefits: "₹50,000 per annum for tuition fees, computer purchase, or hostel fees.",
      duration: "4 Years (Entire Course)",
      mode: "Online",
      location: "National",
      difficulty: "Intermediate",
      stipendOrValue: "₹50,000 / Year",
      requiredSkills: ["Academic Record", "AICTE Portal Sync", "College Bonafide"],
      requiredDocuments: ["AICTE Fee Receipt", "Parental Income Declaration", "Study Proof", "Marksheet"],
      isGovernment: true,
      websiteUrl: "https://www.aicte-india.org/schemes/students-development-schemes"
    },
    {
      id: "sch-inspire-she",
      category: "Scholarship",
      title: "DST INSPIRE Scholarship for Higher Education (SHE)",
      provider: "Department of Science & Technology, Govt of India",
      logoBg: "bg-blue-600",
      eligibility: "Students within top 1% of CBSE/State Boards pursuing B.Sc, M.Sc, or Integrated MS.",
      deadline: "2026-09-30",
      daysLeft: 73,
      benefits: "₹80,000 per year including a ₹20,000 mentorship project grant.",
      duration: "5 Years",
      mode: "Online",
      location: "National",
      difficulty: "Advanced",
      stipendOrValue: "₹80,000 / Year",
      requiredSkills: ["Basic Sciences", "Research Project Plan", "Academic Record"],
      requiredDocuments: ["INSPIRE Offer Letter", "Performance Card", "Research Proposal", "Bank Passbook"],
      isGovernment: true,
      websiteUrl: "https://online-inspire.gov.in"
    },
    {
      id: "sch-ugc-pg",
      category: "Scholarship",
      title: "UGC Post-Graduate Merit Scholarship for University Rank Holders",
      provider: "University Grants Commission, Govt of India",
      logoBg: "bg-red-700",
      eligibility: "First and Second Rank holders at Undergrad level pursuing Post Grad in India.",
      deadline: "2026-10-15",
      daysLeft: 88,
      benefits: "₹3,100 per month scholarship to pursue Post-Graduate degrees.",
      duration: "2 Years",
      mode: "Online",
      location: "National",
      difficulty: "Intense",
      stipendOrValue: "₹37,200 / Year",
      requiredSkills: ["Undergraduate Rank Certificate", "Post Grad Admission Sync"],
      requiredDocuments: ["Rank Verification Certificate", "College Joining report", "Aadhaar", "Degree Certificate"],
      isGovernment: true,
      websiteUrl: "https://www.ugc.ac.in"
    },
    {
      id: "sch-pm-yasasvi",
      category: "Scholarship",
      title: "PM-YASASVI Scholarship Scheme for OBC, EBC & DNT Students",
      provider: "Ministry of Social Justice & Empowerment, Govt of India",
      logoBg: "bg-amber-600",
      eligibility: "Indian students in top-class colleges belonging to OBC/EBC/DNT categories.",
      deadline: "2026-08-31",
      daysLeft: 43,
      benefits: "Full tuition fee coverage up to ₹2.5 Lakh per year for professional courses.",
      duration: "Full Course Duration",
      mode: "Online",
      location: "National",
      difficulty: "Intermediate",
      stipendOrValue: "₹2,50,000 max/yr",
      requiredSkills: ["Category Certificate", "Marksheet Proof", "Academic Sync"],
      requiredDocuments: ["Caste Certificate", "Income Certificate", "Bonafide letter", "Fee breakdown"],
      isGovernment: true,
      websiteUrl: "https://yet.nta.ac.in"
    },
    {
      id: "int-google-step",
      category: "Internship",
      title: "Google India STEP Internship 2026",
      provider: "Google India",
      logoBg: "bg-[#4285F4]",
      eligibility: "First or Second-year undergraduate students majoring in Computer Science or related fields.",
      deadline: "2026-08-30",
      daysLeft: 42,
      benefits: "Paid internship, direct training under Google software engineers, high return-offer potential.",
      duration: "10-12 Weeks",
      mode: "Hybrid",
      location: "Bangalore",
      difficulty: "Advanced",
      stipendOrValue: "₹85,000 / Month",
      requiredSkills: ["Python Syntax", "Complexity Analysis", "Data Structures", "Collaboration"],
      requiredDocuments: ["Resume", "Academic Transcripts", "Cover Letter"],
      isGovernment: false,
      websiteUrl: "https://careers.google.com"
    },
    {
      id: "int-ms-research",
      category: "Research",
      title: "Microsoft Research Fellow Program India",
      provider: "Microsoft Research India",
      logoBg: "bg-[#00A4EF]",
      eligibility: "Undergraduates or postgraduates finishing their degrees with strong computer science & research foundations.",
      deadline: "2026-09-15",
      daysLeft: 58,
      benefits: "Full-time salary, direct publication pipelines to top-tier conferences like CVPR, NeurIPS.",
      duration: "1-2 Years",
      mode: "Offline",
      location: "Bangalore",
      difficulty: "Intense",
      stipendOrValue: "₹1,20,000 / Month",
      requiredSkills: ["PyTorch Core", "Vector Search", "Model Fine-Tuning", "Writing Research Papers"],
      requiredDocuments: ["Academic Resume", "GitHub Portfolio", "Two Recommendation Letters", "Statement of Purpose"],
      isGovernment: false,
      websiteUrl: "https://www.microsoft.com/en-us/research/lab/microsoft-research-india/"
    },
    {
      id: "int-drdo-cair",
      category: "Research",
      title: "DRDO CAIR AI & Robotics Research Internship",
      provider: "Centre for Artificial Intelligence & Robotics (CAIR), DRDO",
      logoBg: "bg-indigo-900",
      eligibility: "B.Tech/M.Tech CSE, AI, or Robotics students with a minimum CGPA of 8.5.",
      deadline: "2026-08-15",
      daysLeft: 27,
      benefits: "Direct research in secure AI pipelines, defense technologies, and hardware-software robotics.",
      duration: "6 Months",
      mode: "Offline",
      location: "Bangalore",
      difficulty: "Intense",
      stipendOrValue: "₹15,000 / Month",
      requiredSkills: ["C++ Core", "ROS (Robot Operating System)", "Neural Networks", "Computer Vision"],
      requiredDocuments: ["NOC from College", "CGPA Sheet", "Project Portfolio", "Security Clearance form"],
      isGovernment: true,
      websiteUrl: "https://www.drdo.gov.in"
    },
    {
      id: "int-isro-vssc",
      category: "Research",
      title: "ISRO VSSC Space Science Internship",
      provider: "Vikram Sarabhai Space Centre (VSSC), ISRO",
      logoBg: "bg-orange-600",
      eligibility: "B.Tech CSE/ECE/Aerospace students with strong electronics & signal processing skills.",
      deadline: "2026-08-25",
      daysLeft: 37,
      benefits: "Work with satellite signal telemetry data and real rocket telemetry pipelines.",
      duration: "3 Months",
      mode: "Offline",
      location: "Trivandrum",
      difficulty: "Intense",
      stipendOrValue: "Technical Stipend",
      requiredSkills: ["Signal Processing", "Data Science", "Embedded C", "MATLAB"],
      requiredDocuments: ["College Sponsorship Letter", "Aadhaar Card", "Marks Card", "Police verification"],
      isGovernment: true,
      websiteUrl: "https://www.vssc.gov.in"
    },
    {
      id: "hck-sih",
      category: "Hackathon",
      title: "Smart India Hackathon (SIH) 2026",
      provider: "Ministry of Education & AICTE, Govt of India",
      logoBg: "bg-orange-500",
      eligibility: "All undergraduate college students in India. Must register through college SPOC.",
      deadline: "2026-08-15",
      daysLeft: 27,
      benefits: "National level recognition, cash prizes up to ₹1 Lakh per problem statement, and funding options.",
      duration: "3 Days (Grand Finale)",
      mode: "Hybrid",
      location: "National",
      difficulty: "Advanced",
      stipendOrValue: "₹1,00,000 Prize",
      requiredSkills: ["System Architecture", "Prototype Build", "Pitching", "Databases"],
      requiredDocuments: ["Consent letter from Principal", "SIH Portal Account", "Team profile sheet"],
      isGovernment: true,
      websiteUrl: "https://www.sih.gov.in"
    },
    {
      id: "hck-ethindia",
      category: "Hackathon",
      title: "Devfolio EthIndia 2026",
      provider: "Devfolio Community",
      logoBg: "bg-indigo-600",
      eligibility: "Open to developers and students worldwide interested in Web3 and Ethereum.",
      deadline: "2026-11-01",
      daysLeft: 105,
      benefits: "Massive global dev network, $100K+ in pool prizes, direct recruiter hiring pipelines.",
      duration: "36 Hours",
      mode: "Offline",
      location: "Bangalore",
      difficulty: "Intense",
      stipendOrValue: "₹8,00,000+ Pool",
      requiredSkills: ["Solidity", "Smart Contracts", "React Frontends", "Ethers.js"],
      requiredDocuments: ["GitHub link", "Developer Resume", "Idea Statement"],
      isGovernment: false,
      websiteUrl: "https://ethindia.co"
    },
    {
      id: "hck-h2s-agritech",
      category: "Hackathon",
      title: "Hack2Skill Agritech AI Challenge",
      provider: "Hack2Skill & Ministry of Agriculture, Govt of India",
      logoBg: "bg-emerald-600",
      eligibility: "Any tech student or developer wanting to build smart farming models.",
      deadline: "2026-09-10",
      daysLeft: 53,
      benefits: "Funding support for top 3 teams, mentorship from crop scientists.",
      duration: "4 Weeks",
      mode: "Online",
      location: "Remote",
      difficulty: "Intermediate",
      stipendOrValue: "₹2,50,000 Grants",
      requiredSkills: ["TensorFlow Core", "Image Classification", "API Deployment", "Geospatial data"],
      requiredDocuments: ["Project proposal slide deck", "Team registration form"],
      isGovernment: true,
      websiteUrl: "https://hack2skill.com"
    },
    {
      id: "cmp-unstop-ncl",
      category: "Competition",
      title: "Unstop National Coding League",
      provider: "Unstop Community",
      logoBg: "bg-blue-600",
      eligibility: "All engineering undergraduates across India.",
      deadline: "2026-08-20",
      daysLeft: 32,
      benefits: "Pre-placement interview cards (PPIs) for top 50 coders, direct corporate job match.",
      duration: "2 Weeks",
      mode: "Online",
      location: "National",
      difficulty: "Advanced",
      stipendOrValue: "PPI Cards & Cash",
      requiredSkills: ["Data Structures", "C++ or Java", "Algorithms", "Competitive Coding"],
      requiredDocuments: ["College ID Card", "Unstop account verification"],
      isGovernment: false,
      websiteUrl: "https://unstop.com"
    },
    {
      id: "hck-bharatgen-ai",
      category: "AIChallenge",
      title: "BharatGen AI Hackathon 2026",
      provider: "IIT Bombay & DST, Govt of India",
      logoBg: "bg-red-800",
      eligibility: "Developers and research students aiming to build Indic LLM adapters.",
      deadline: "2026-09-05",
      daysLeft: 48,
      benefits: "Work on official National Generative AI Infrastructure, cash rewards, cloud credits.",
      duration: "48 Hours",
      mode: "Online",
      location: "Remote",
      difficulty: "Intense",
      stipendOrValue: "₹5,00,000 Prizes",
      requiredSkills: ["HuggingFace Hub", "LoRA Fine-tuning", "Tokenizer customization", "Indic NLP"],
      requiredDocuments: ["GitHub Repo of previous model", "1-page concept paper"],
      isGovernment: true,
      websiteUrl: "https://iitb.ac.in"
    },
    {
      id: "ops-gsoc",
      category: "OpenSource",
      title: "Google Summer of Code (GSoC) India",
      provider: "Google Open Source Office",
      logoBg: "bg-orange-500",
      eligibility: "Students and beginners in open source software development.",
      deadline: "2026-04-15",
      daysLeft: 270,
      benefits: "Direct mentorship with global open source maintainers, GSoC certificate, global recognition.",
      duration: "12 Weeks",
      mode: "Online",
      location: "Remote",
      difficulty: "Advanced",
      stipendOrValue: "₹2,40,000 Stipend",
      requiredSkills: ["Git & Version Control", "Open Source Contributing", "Code Review", "Build Tools"],
      requiredDocuments: ["Project Proposal PDF", "Resume", "Prior Contributions proof"],
      isGovernment: false,
      websiteUrl: "https://summerofcode.withgoogle.com"
    },
    {
      id: "crt-nptel-dsa",
      category: "Certification",
      title: "NPTEL Data Structures & Algorithms in Python",
      provider: "IIT Madras & NASSCOM",
      logoBg: "bg-red-600",
      eligibility: "Any undergraduate in technical degree across India.",
      deadline: "2026-08-01",
      daysLeft: 13,
      benefits: "IIT Madras certified physical gold/silver certificate, credit transfer options for college SGPA.",
      duration: "12 Weeks",
      mode: "Online",
      location: "National",
      difficulty: "Advanced",
      stipendOrValue: "IIT Gold Elite Badge",
      requiredSkills: ["Python Syntax", "Complexity Analysis", "Data Structures", "Algorithms"],
      requiredDocuments: ["Swayam account", "Exam Fee receipt", "College ID"],
      isGovernment: true,
      websiteUrl: "https://nptel.ac.in"
    },
    {
      id: "crt-infosys-springboard",
      category: "Certification",
      title: "Infosys Springboard AI Foundation Course",
      provider: "Infosys & NASSCOM",
      logoBg: "bg-sky-700",
      eligibility: "Open to all B.Tech / BCA / MCA students in India.",
      deadline: "Self-Paced",
      daysLeft: 365,
      benefits: "Official NASSCOM aligned certificate, placement readiness tracking, free course access.",
      duration: "6 Weeks",
      mode: "Online",
      location: "Remote",
      difficulty: "Beginner",
      stipendOrValue: "Placement Readiness Certificate",
      requiredSkills: ["Basic Python", "Numpy & Pandas", "Supervised Learning"],
      requiredDocuments: ["Registration Profile", "Skill test passes"],
      isGovernment: false,
      websiteUrl: "https://infyspringboard.onwingspan.com"
    }
  ];

  // API Endpoint for dynamic opportunity discovery & matching
  app.post("/api/opportunities/search", async (req, res) => {
    const { query, profile, mode } = req.body;
    const isLive = mode === "live" && !!ai;

    try {
      if (isLive && ai) {
        // Query Gemini with student context and standard list to return fully personalized match calculations + explainability
        const studentContextString = `
Name: ${profile?.name || "Ayush"}
Degree: ${profile?.degree || "B.Tech CSE (AI & ML)"}
Branch: ${profile?.branch || "Computer Science & Engineering"}
Semester: ${profile?.semester || "2nd Semester"}
College: ${profile?.college || "Indian Institute of Technology (IIT), Delhi"}
Career Goal: ${profile?.careerGoal || "AI Engineer"}
Dream Company: ${profile?.dreamCompany || "Google Research India"}
Skills: ${JSON.stringify(profile?.skillDetails || profile?.skills || [])}
Interests: ${JSON.stringify(profile?.interests || [])}
`;

        const prompt = `You are the Career Intelligence Engine for SoulSync AI.
Analyze the following student profile and the natural language query: "${query || "all opportunities"}".
Student profile:
${studentContextString}

Match the student's profile against our master list of high-fidelity opportunities:
${JSON.stringify(MASTER_OPPORTUNITIES)}

Filter and rank the matches. If the student has a highly specific or custom dream that isn't fully covered, you may ALSO dynamically synthesize 1 completely custom, rare-gem opportunity (e.g., a specific AI fellowship at their dream company or a Ministry grant) tailored exactly to their skills!

Calculate the match score (0-100) rigorously based on their semester alignment, branch, match with core skills, and whether the provider is their Dream Company or matches their Career Goal.

You MUST return a JSON response containing an array of matched opportunities.
For EACH opportunity, you must populate these exact keys:
{
  "opportunities": [
    {
      "id": "...", // Keep the original ID if from the master list, or "dyn-XXX" if custom synthesized
      "category": "...", // Must be "Scholarship", "Internship", "Hackathon", "Research", "OpenSource", "Competition", "AIChallenge", or "Certification"
      "title": "...",
      "provider": "...",
      "logoBg": "...",
      "eligibility": "...",
      "deadline": "...",
      "daysLeft": 45,
      "benefits": "...",
      "duration": "...",
      "mode": "...",
      "location": "...",
      "difficulty": "...",
      "stipendOrValue": "...",
      "aiMatchScore": 92, // An integer between 1 and 100
      "whyRecommended": "...", // Elder sibling/mentor advice explaining the selection
      "requiredSkills": ["...", "..."],
      "requiredDocuments": ["...", "..."],
      "isGovernment": true/false,
      "websiteUrl": "...",
      "explainability": {
        "whyThis": "...", // Why this specific choice fits them
        "skillsGained": "...", // Skills they will strengthen
        "strengthenDreamPath": "...", // Alignment with dreamCompany or careerGoal
        "effortNeeded": "...", // Weekly hours or cognitive burden
        "expectedCareerImpact": "..." // How this alters resume shortlisting
      },
      "smartDates": {
        "applicationDeadline": "...",
        "registrationDeadline": "...",
        "interviewDate": "...",
        "resultDate": "..."
      }
    }
  ]
}

Only return valid JSON. Do not add any markdown outside the JSON block.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });

        const resText = response.text || "{}";
        const parsed = JSON.parse(resText.trim());
        return res.json(parsed);
      }
    } catch (err) {
      console.error("Gemini opportunity search error, falling back to local engine:", err);
    }

    // High-fidelity local matching fallback
    const lowerQuery = (query || "").toLowerCase();
    
    // Filter MASTER_OPPORTUNITIES based on semantic terms in query
    let filtered = MASTER_OPPORTUNITIES;
    if (lowerQuery.length > 1 && !lowerQuery.includes("all") && !lowerQuery.includes("any")) {
      filtered = MASTER_OPPORTUNITIES.filter(o => 
        o.title.toLowerCase().includes(lowerQuery) ||
        o.category.toLowerCase().includes(lowerQuery) ||
        o.provider.toLowerCase().includes(lowerQuery) ||
        o.requiredSkills.some(s => s.toLowerCase().includes(lowerQuery)) ||
        o.benefits.toLowerCase().includes(lowerQuery)
      );
    }

    // Map & compute dynamic scores with personalized explanations
    const matched = filtered.map(opp => {
      let score = 75; // Baseline
      
      // Semester match boost
      const sem = profile?.semester || "3rd Semester";
      if (opp.category === "Internship" && (sem.includes("1st") || sem.includes("2nd") || sem.includes("3rd"))) {
        if (opp.id.includes("google-step")) score += 15; // STEP is for 1st/2nd/3rd years
      }
      
      // Skills alignment boost
      const studentSkills = profile?.skills || [];
      const commonSkills = opp.requiredSkills.filter(s => 
        studentSkills.some(ss => ss.toLowerCase().includes(s.toLowerCase()))
      );
      score += commonSkills.length * 4;

      // Dream Company match boost
      const dreamComp = (profile?.dreamCompany || "").toLowerCase();
      if (dreamComp && opp.provider.toLowerCase().includes(dreamComp)) {
        score += 12;
      }

      // Cap at 98%
      score = Math.min(score, 98);

      // Structure fallback explainability
      const whyThis = `This perfectly matches your ${profile?.branch || "CSE"} profile. It requires ${opp.requiredSkills.slice(0, 2).join(" and ")}, which directly aligns with your study interests.`;
      const skillsGained = `By completing this, you will establish solid practical experience in ${opp.requiredSkills.join(", ")}.`;
      const strengthenDreamPath = `Doing this puts you on a premium path towards your career goal of becoming a ${profile?.careerGoal || "Software Engineer"}${profile?.dreamCompany ? ` at ${profile.dreamCompany}` : ""}.`;
      const effortNeeded = opp.category === "Certification" ? "Self-paced, ~6 hours/week" : "Requires active application prep and 10-12 hours/week.";
      const expectedCareerImpact = opp.isGovernment 
        ? "Adding a National Government credential boosts your local PSU and top Indian corporate resume selection rate by 45%."
        : `Having ${opp.provider} verified work on your resume places you in the top 5% of student applicants nationally.`;

      return {
        ...opp,
        aiMatchScore: score,
        whyRecommended: `🌿 Highly matched. ${whyThis}`,
        explainability: {
          whyThis,
          skillsGained,
          strengthenDreamPath,
          effortNeeded,
          expectedCareerImpact
        },
        smartDates: {
          applicationDeadline: opp.deadline,
          registrationDeadline: opp.deadline,
          interviewDate: "Approx 3 weeks after deadline",
          resultDate: "Approx 6 weeks after deadline"
        }
      };
    });

    // Sort by match score desc
    matched.sort((a, b) => b.aiMatchScore - a.aiMatchScore);

    return res.json({ opportunities: matched });
  });

  // API Endpoint for generating highly detailed AI Preparation Roadmaps
  app.post("/api/opportunities/prep", async (req, res) => {
    const { opportunityId, opportunityTitle, provider, profile, mode } = req.body;
    const isLive = mode === "live" && !!ai;

    try {
      if (isLive && ai) {
        const studentContextString = `
Name: ${profile?.name || "Ayush"}
Degree: ${profile?.degree || "B.Tech CSE (AI & ML)"}
Branch: ${profile?.branch || "Computer Science & Engineering"}
Semester: ${profile?.semester || "2nd Semester"}
Skills: ${JSON.stringify(profile?.skillDetails || profile?.skills || [])}
Career Goal: ${profile?.careerGoal || "AI Engineer"}
Dream Company: ${profile?.dreamCompany || "Google Research India"}
`;

        const prompt = `You are the AI Preparation Coach for SoulSync AI.
Generate an extremely comprehensive, personalized Preparation Roadmap for student ${profile?.name || "Ayush"} who is preparing for:
Opportunity: "${opportunityTitle || "Google STEP Internship"}"
Provider: "${provider || "Google India"}"

Here is the student's background context:
${studentContextString}

You MUST return a JSON response containing detailed stages, a weekly plan, selected study resources, practice questions, portfolio/project suggestions, and critical interview/application tips.
The structure MUST follow this exact schema:
{
  "roadmap": [
    { "stage": "Stage 1: Foundation Building", "focus": "..." },
    { "stage": "Stage 2: Core Topic Drill", "focus": "..." },
    { "stage": "Stage 3: Resume & Application Polish", "focus": "..." },
    { "stage": "Stage 4: Mock Interviews & Final Submission", "focus": "..." }
  ],
  "weeklyPlan": [
    {
      "week": "Week 1",
      "milestone": "...",
      "actions": ["Action Item 1", "Action Item 2"]
    },
    {
      "week": "Week 2",
      "milestone": "...",
      "actions": ["Action Item 1", "Action Item 2"]
    },
    {
      "week": "Week 3",
      "milestone": "...",
      "actions": ["Action Item 1", "Action Item 2"]
    },
    {
      "week": "Week 4",
      "milestone": "...",
      "actions": ["Action Item 1", "Action Item 2"]
    }
  ],
  "resources": [
    { "name": "...", "type": "Documentation / YouTube Course / Interactive Practice", "link": "..." }
  ],
  "practiceQuestions": [
    { "question": "...", "type": "Technical / Behavioral / Portfolio", "hint": "..." }
  ],
  "portfolioSuggestions": [
    "..."
  ],
  "projectSuggestions": [
    {
      "title": "...",
      "description": "...",
      "techStack": ["...", "..."]
    }
  ],
  "timeline": {
    "applicationStart": "Opened Now",
    "applicationDeadline": "August 30, 2026",
    "assessmentWindow": "September 5 - September 15, 2026",
    "interviewDates": "October 2026",
    "resultsDate": "November 2026"
  },
  "interviewTips": [
    "..."
  ]
}

Provide highly practical, specific, India-first resources (e.g. GeeksforGeeks, NPTEL, SWAYAM, Unstop Practice, standard DSA sheets). Do not output anything except the pure JSON structure.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });

        const resText = response.text || "{}";
        const parsed = JSON.parse(resText.trim());
        return res.json(parsed);
      }
    } catch (err) {
      console.error("Gemini roadmap generation error, falling back to local coach:", err);
    }

    // High-fidelity local roadmap generator fallback
    const oppId = opportunityId || "int-google-step";
    const title = opportunityTitle || "Google India STEP Internship 2026";
    const prov = provider || "Google India";

    // Build template based on category
    let roadmap: any[] = [];
    let weeklyPlan: any[] = [];
    let resources: any[] = [];
    let practiceQuestions: any[] = [];
    let portfolioSuggestions: string[] = [];
    let projectSuggestions: any[] = [];
    let timeline = {
      applicationStart: "Opened Now",
      applicationDeadline: "Within 30 Days",
      assessmentWindow: "1-2 Weeks Post Deadline",
      interviewDates: "4-6 Weeks Post Deadline",
      resultsDate: "8 Weeks Post Deadline"
    };
    let interviewTips: string[] = [];

    if (oppId.includes("sch-") || title.toLowerCase().includes("scholarship")) {
      // Scholarship Prep Template
      roadmap = [
        { stage: "Stage 1: Document Auditing", focus: "Collect verified parent income certificate, annual college bonafide certificate, fee slips, and marks cards." },
        { stage: "Stage 2: Essay & Statement Drafting", focus: "Draft 500-word SOP detailing B.Tech aspirations, financial need, and community impact." },
        { stage: "Stage 3: Institutional Endorsements", focus: "Obtain seal and signatures from your college registrar or academic office." },
        { stage: "Stage 4: Submission & Verification Sync", focus: "Submit via portal, double-check Aadhaar seeding status, and track institute nodal approval." }
      ];
      weeklyPlan = [
        { week: "Week 1", milestone: "Document Assembly", actions: ["Request Bonafide Certificate from Academic Section", "Verify Aadhaar is linked to your active bank account"] },
        { week: "Week 2", milestone: "SOP & Statement", actions: ["Write your personal hardship essay detailing why you are pursuing engineering", "Get a senior or AI Mentor to review your scholarship statement"] },
        { week: "Week 3", milestone: "Sponsorship & Seal", actions: ["Submit slips to college nodals for official PM-YASASVI/NSP verification seal", "Double-check income tax file status if parent is salaried"] },
        { week: "Week 4", milestone: "Upload & Verify", actions: ["Scan all documents in high-resolution under 200KB limits", "Submit portal application and copy the tracking ID to SoulSync Tracker"] }
      ];
      resources = [
        { name: "National Scholarship Portal Official Guide", type: "Documentation", link: "https://scholarships.gov.in" },
        { name: "How to write a winning Bonafide Scholarship Statement", type: "Video Guide", link: "https://youtube.com" }
      ];
      practiceQuestions = [
        { question: "How will this financial grant directly alter your focus on B.Tech technical projects?", type: "SOP", hint: "Explain that by having fee coverage, you can focus on building machine learning systems instead of taking freelance coding tasks." }
      ];
      portfolioSuggestions = [
        "Include active academic achievements and college CGPA (ensure it stays above 7.5 or 8.0).",
        "Add a clear summary of your B.Tech core focus (e.g. CSE AI/ML)."
      ];
      projectSuggestions = [
        { title: "Personal Engineering Project Hub", description: "Set up a clean GitHub repository displaying 3 high-quality academic project folders with solid README files.", techStack: ["Markdown", "Git", "GitHub"] }
      ];
      interviewTips = [
        "Ensure all data on NSP/AICTE match your official Aadhaar Card details EXACTLY.",
        "Bank account must have Aadhaar Seeding active (very critical for DBT transfer)."
      ];
    } else if (oppId.includes("hck-") || title.toLowerCase().includes("hackathon") || title.toLowerCase().includes("challenge")) {
      // Hackathon Prep Template
      roadmap = [
        { stage: "Stage 1: Team & Topic Selection", focus: "Form a 4-6 person multi-disciplinary team and select a high-impact problem statement." },
        { stage: "Stage 2: System Architecture design", focus: "Draft complete flowcharts, choose tech stacks, database models, and write a 1-page concept." },
        { stage: "Stage 3: Core MVP Build & Dockerization", focus: "Develop working frontend-backend APIs and dockerize the local setup." },
        { stage: "Stage 4: Video Pitch & Slide Preparation", focus: "Record a crisp 3-minute working prototype demo video and refine presentation slides." }
      ];
      weeklyPlan = [
        { week: "Week 1", milestone: "Team Formulation", actions: ["Unite 1 UI designer, 2 full-stack coders, and 1 presentation specialist", "Brainstorm problem statement solutions for Smart India Hackathon"] },
        { week: "Week 2", milestone: "System Draft & UX", actions: ["Design system architecture diagram showing Express backend API endpoints", "Draft Figma wireframes for main student-facing pages"] },
        { week: "Week 3", milestone: "MVP Dev Sprint", actions: ["Implement core React login and database storage syncing in 48 hours", "Verify API calls succeed without latency lags"] },
        { week: "Week 4", milestone: "Pitch Deck & Video", actions: ["Create a 10-slide presentation following official SIH template guidelines", "Record working system screen-capture with clear verbal explanations"] }
      ];
      resources = [
        { name: "SIH Best Presentations Repository", type: "Interactive Practice", link: "https://www.sih.gov.in" },
        { name: "Figma wireframe best practices for Hackathons", type: "Documentation", link: "https://figma.com" }
      ];
      practiceQuestions = [
        { question: "What is your backup plan if the server APIs fail during the live jury evaluation?", type: "System", hint: "Confirm you have local database fallback nodes and cached client-side mock data active to guarantee continuous presentation UX." }
      ];
      portfolioSuggestions = [
        "Add direct link to your team's hackathon project repository.",
        "Pin working demo video to your GitHub profile."
      ];
      projectSuggestions = [
        { title: "Devanagari OCR Prototype", description: "Lightweight browser-based neural network model that reads Hindi handwritten characters.", techStack: ["React", "TensorFlow.js", "Tailwind CSS"] }
      ];
      interviewTips = [
        "Focus 70% of your presentation pitch on the tangible user benefit and business viability.",
        "Never show slides only; a rough working prototype with static cached JSON is 10x better."
      ];
    } else {
      // Technical Internships / Certifications Prep Template
      roadmap = [
        { stage: "Stage 1: DSA & Logic foundations", focus: "Master arrays, hashing, sliding windows, recursion, and time complexity bounds." },
        { stage: "Stage 2: Project Deployment", focus: "Refine 2 active personal full-stack projects on your GitHub, emphasizing secure API proxies." },
        { stage: "Stage 3: Resume Review & Pitch", focus: "Construct a 1-page LaTeX format resume highlighting real metrics (e.g., 'reduced latency by 30%')." },
        { stage: "Stage 4: Mock Rounds & Behavioral", focus: "Practice whiteboarding coding questions on Google Doc environment without autocomplete." }
      ];
      weeklyPlan = [
        { week: "Week 1", milestone: "Data Structures Drill", actions: ["Solve 15 essential Array & Hashing problems on LeetCode/Unstop", "Practice complexity analysis (O(N) time, O(1) space constraints)"] },
        { week: "Week 2", milestone: "Dynamic API Project", actions: ["Add Firestore backend or lazy client syncing to your current B.Tech web app", "Write clean TypeScript interfaces to enforce absolute type-safety"] },
        { week: "Week 3", milestone: "Resume Optimization", actions: ["Quantify achievements: 'Trained model on 5,000 images achieving 94% accuracy'", "Format resume using standard single-column ATS templates"] },
        { week: "Week 4", milestone: "Mock Loops", actions: ["Schedule a mock coding interview with SoulSync Companion", "Practice talking out loud while coding on a blank notebook page"] }
      ];
      resources = [
        { name: "Blind 75 Curated DSA Sheet", type: "Interactive Practice", link: "https://leetcode.com" },
        { name: "Google Software Engineering Intern Interview Process Guide", type: "Documentation", link: "https://careers.google.com" }
      ];
      practiceQuestions = [
        { question: "Can you explain how your CNN OCR Handwriting Engine manages memory limits in the browser?", type: "Technical", hint: "Discuss using TensorFlow.js tidy blocks to clean GPU memory and prevent leak overheads." }
      ];
      portfolioSuggestions = [
        "Include 2 production-ready projects with clean, public GitHub repositories.",
        "Detail your role as the sole/lead full-stack architect."
      ];
      projectSuggestions = [
        { title: "Dynamic Career Roadmap Engine", description: "Full-stack application that analyzes profile parameters and auto-generates localized weekly plans.", techStack: ["TypeScript", "Express", "Vite", "React"] }
      ];
      interviewTips = [
        "Always communicate your reasoning clearly BEFORE starting to write any code.",
        "If you get stuck, ask clarifying questions about input boundary conditions."
      ];
    }

    return res.json({
      roadmap,
      weeklyPlan,
      resources,
      practiceQuestions,
      portfolioSuggestions,
      projectSuggestions,
      timeline,
      interviewTips
    });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", apiAvailable: !!ai });
  });

  // Serve static assets / Vite integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Vite dev server middleware integration...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    console.log(`Serving static files from production build: ${distPath}`);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SoulSync AI: Server is booting up on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Critical server boot failure:", error);
});
