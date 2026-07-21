import { StudentProfile, Opportunity, GrowthMission } from "./types";

export const initialStudentProfile: StudentProfile = {
  name: "Ayush",
  degree: "B.Tech CSE (AI & ML)",
  branch: "Computer Science & Engineering",
  semester: "2nd Semester",
  college: "Indian Institute of Technology (IIT), Delhi",
  graduationYear: "2029",
  city: "New Delhi",
  careerGoal: "AI Engineer",
  skills: ["Python", "SQL", "Git", "Machine Learning", "PyTorch"],
  interests: ["Artificial Intelligence", "Deep Learning", "Convolutional Neural Networks", "Computer Vision", "Open Source"],
  favouriteSubjects: ["Probability & Statistics", "Linear Algebra", "Database Management Systems (DBMS)"],
  learningStyle: "Interactive Practice",
  weeklyAvailability: 18,
  preferredLanguage: "English & Hindi",
  dreamCompany: "Google Research",
  projects: [
    {
      id: "p1",
      name: "CNN Project: Real-time Convolutional Filters",
      description: "Implementing optimized feature map extractors from scratch in PyTorch to classify medical scan spatial anomalies.",
      tech: ["Python", "PyTorch", "Computer Vision"]
    },
    {
      id: "p2",
      name: "IndicOCR-Lite",
      description: "A lightweight neural OCR engine optimized for running handwritten Devanagari models on low-power mobile GPUs.",
      tech: ["Python", "TensorFlow", "OpenCV"]
    }
  ],
  isOnboardingCompleted: true,
  achievements: [
    {
      id: "ach_p2",
      type: "project",
      title: "IndicOCR-Lite: Low-Resource Handwriting Recognition Engine",
      subtitle: "Personal Portfolio Landmark",
      date: "June 2026",
      description: "A lightweight neural OCR engine optimized for running handwritten Devanagari models locally on low-power mobile GPUs.",
      skills: ["Python", "TensorFlow", "OpenCV", "Deep Learning"],
      url: "https://github.com/ayush-iitd/indicocr-lite",
      details: {
        summary: "A lightweight Convolutional Neural Network (CNN) combined with Connectionist Temporal Classification (CTC) loss, designed to recognize cursive Devanagari script in low-latency mobile apps without cloud access.",
        problem: "Commercial OCR engines (like Google Cloud Vision or AWS Textract) require persistent, high-bandwidth internet connections and incur heavy API transaction fees. This makes them unviable for offline rural clinics and low-resource mobile platforms in India.",
        approach: "Engineered a custom ResNet-style backbone to extract spatial feature maps, fed into a Bidirectional LSTM layer for sequence learning. Configured CTC loss for alignment-free transcription training, and applied 8-bit post-training quantization.",
        architectureDiagram: "[Mobile Input Image] ──> [Binarization & OpenCV Deskewing] ──> [Custom Quantized ResNet-18 Backbone] ──> [Bidirectional LSTM Layer] ──> [CTC Loss & Greedy Decoder] ──> [Devanagari Text Output]",
        keyLearnings: "Gained hands-on experience with post-training quantization techniques, CTC alignment challenges under varying hand stroke widths, and GPU memory profile debugging.",
        futureImprovements: "Integrate a lightweight character-level language model (n-gram) to autocorrect phonetically similar character clusters.",
        impact: "Reduced average handwriting transcription inference time from 1,200ms to 180ms on low-end mobile CPUs, achieving 94% local accuracy with 0% cloud egress costs.",
        starStory: {
          situation: "For my second-year portfolio landmark, I wanted to address the complete lack of offline, free handwriting digitizer options in regional Indian languages, causing digital form-filling friction for rural healthcare workers.",
          task: "Build a highly compact OCR engine that can run on simple mobile devices and process hand-written Devanagari script locally in under 200ms.",
          action: "I developed IndicOCR-Lite. I designed a custom CNN + BiLSTM architecture, created a pipeline with OpenCV for image deskewing, and leveraged TensorFlow Lite's integer quantization to compress the model from 85MB to 8MB.",
          result: "I achieved 94% character recognition accuracy on regional handwriting samples, slashing inference latency to 180ms and running 100% offline, checking off my active milestone on DreamPath."
        },
        linkedinPost: "🚀 Delighted to share my latest personal milestone: IndicOCR-Lite! \n\nI built a lightweight handwriting OCR engine optimized for low-power mobile GPUs. By using a custom CNN + Bi-LSTM sequence-to-sequence model and integer quantization, I squeezed an 85MB model down to 8MB with only a negligible 0.6% drop in accuracy. \n\nThis allows healthcare workers in rural India to digitize written clinical records 100% offline in under 180ms. Proud to align code with direct societal impact! 🌱\n\n#DeepLearning #OpenSource #TensorFlow #IndicTech #Devanagari #AIForSocialGood"
      }
    },
    {
      id: "ach_p1",
      type: "project",
      title: "Medical Scan Convolutional Filter Visualizer",
      subtitle: "PyTorch Academic Project",
      date: "April 2026",
      description: "Implementing optimized feature map extractors from scratch in PyTorch to classify medical scan spatial anomalies.",
      skills: ["Python", "PyTorch", "Computer Vision"],
      url: "https://github.com/ayush-iitd/medscan-filters",
      details: {
        summary: "A spatial anomaly filter visualizer that exposes intermediate activation feature maps of deep convolutional networks to assist medical researchers in understanding neural segmentation layers.",
        problem: "Deep learning segmentation models often act as 'black boxes', making clinicians hesitant to trust AI anomaly proposals without knowing which visual features (edges, textures, shapes) triggered the alarm.",
        approach: "Implemented custom layer hook interfaces in PyTorch to tap into ResNet-50 block activations. Sliced tensor channels and dynamically mapped them to high-contrast colormaps, rendered via a real-time web interface.",
        architectureDiagram: "[Scan Image] ──> [ResNet Conv Blocks] ──> [Forward Activation Hooks] ──> [Channel Dimension Slicing] ──> [Colormap Mapping] ──> [Interactive React Matrix Grid]",
        keyLearnings: "Deepened my understanding of forward hook abstractions in PyTorch, tensor dimensionality mapping, and high-frequency noise filters.",
        futureImprovements: "Add Grad-CAM gradient visualizations to overlay feature importance directly on the raw image canvas.",
        impact: "Provides researchers with interactive visual transparency over 5 layers of block activations, reducing neural debugging time by 40%.",
        starStory: {
          situation: "Medical scan segmentation models are highly powerful, but clinicians often reject their recommendations because they don't know why a specific lung nodule was classified as high-risk.",
          task: "Expose intermediate activations of a deep ResNet model in an intuitive, visual matrix grid so doctors can review the features the AI extracted.",
          action: "I registered PyTorch forward hooks into the activation layers of ResNet, squeezed the tensor outputs, mapped them to heatmaps, and constructed a React interface to render the matrices dynamically.",
          result: "Successfully exposed block layers, letting researchers drill down into specific filters and verify that the model was focusing on nodule geometry rather than noise artifacts."
        },
        linkedinPost: "🔍 How do deep models 'see' medical scan anomalies? \n\nI built a PyTorch activation visualizer that registers forward hooks into CNN block layers to extract and render feature maps in real-time. Exposing these deep representations provides crucial visual explanations, helping clinicians understand whether the network focused on genuine pathology or background scan artifacts.\n\nDemystifying the black box is a critical step towards safe clinical AI! 💻🏥\n\n#AIInHealthcare #PyTorch #ComputerVision #ExplainableAI #XAI #MedicalTech"
      }
    },
    {
      id: "ach_i1",
      type: "internship",
      title: "Machine Learning Intern",
      subtitle: "Wadhwani Institute for Artificial Intelligence",
      date: "May - July 2026",
      description: "Researched and integrated low-resource mobile document parsing modules to automate clinic data entry.",
      skills: ["Python", "PyTorch", "Model Compression", "Git"],
      details: {
        starStory: {
          situation: "During my summer internship at Wadhwani AI, our clinical data digitization team was facing massive processing backlogs when rural health staff manually uploaded photos of paper records.",
          task: "Automate the text localization and classification process to pre-fill entry forms directly in their mobile app.",
          action: "I integrated lightweight YOLOv8 segmentation modules, customized the training loop for low-contrast paper scans, and optimized image-resizing heuristics.",
          result: "Cut manual data entry requirements by 65% across 12 pilot clinics, reducing processing errors from 18% to 4.2%."
        },
        linkedinPost: "🎉 Just wrapped up an incredible Summer Internship at Wadhwani AI! \n\nI worked on low-resource mobile document parsing pipelines, using deep learning segmentation to automate paper clinical record digitization. By optimizing image pre-processing and model weights, we slashed manual form-filling times by 65% for health workers in rural communities.\n\nImmense gratitude to my mentors for an invaluable epoch of growth! 🌸\n\n#MachineLearning #AIForHealthcare #WadhwaniAI #InternshipSuccess #SocialGood"
      }
    },
    {
      id: "ach_h1",
      type: "hackathon",
      title: "1st Place Winner, SIH Internal Hackathon",
      subtitle: "Smart India Hackathon IIT Delhi Hub",
      date: "July 2026",
      description: "Led a 4-member team to construct a real-time speech-to-recipe translation engine for local Indian dialects.",
      skills: ["React", "Speech-to-Text", "Whisper API", "Team Leadership"],
      details: {
        starStory: {
          situation: "In the IIT Delhi internal hackathon for SIH 2026, our team wanted to tackle agricultural and domestic barrier problem statements.",
          task: "Create an intuitive voice-driven application that maps regional speech commands to real-time instructions.",
          action: "As team leader, I designed the React dashboard interface, integrated OpenAI's Whisper model fine-tuned for regional audio, and synchronized it with client-side state managers.",
          result: "We won 1st Place out of 35 teams, securing nomination to the SIH 2026 national grand finals."
        },
        linkedinPost: "🏆 Proud to announce that my team took 1st Place at the Smart India Hackathon (SIH) 2026 Internal Hackathon at IIT Delhi! \n\nWe built an intuitive, local voice-command hub that parses and translates regional Indian dialects in real-time. Leading this amazing team from ideation to prototype deployment was an unforgettable leadership sprint. Next stop: National Finals! 🚀\n\n#SIH2026 #HackathonWinners #IITDelhi #SpeechAI #TeamLeadership"
      }
    },
    {
      id: "ach_s1",
      type: "scholarship",
      title: "Reliance Foundation Scholar",
      subtitle: "Reliance Foundation",
      date: "January 2026",
      description: "Awarded to top Indian undergraduate students pursuing technical and professional degrees.",
      skills: ["Academic Excellence", "Leadership Potential"],
      details: {
        linkedinPost: "⭐ Honored and incredibly grateful to be selected as a Reliance Foundation Undergraduate Scholar! \n\nThis fellowship provides crucial financial and academic backing, empowering me to invest deeply in my B.Tech studies in AI & ML and continue developing social-impact tech like IndicOCR-Lite. Thank you Reliance Foundation! 🌸\n\n#RelianceFoundation #Scholars #EngineeringGrowth #IITDelhi #UndergradStudies"
      }
    },
    {
      id: "ach_c1",
      type: "certificate",
      title: "Machine Learning Specialization",
      subtitle: "DeepLearning.AI (Andrew Ng)",
      date: "March 2026",
      description: "Three-course series covering regression, classification, neural networks, decision trees, and unsupervised learning.",
      skills: ["Scikit-Learn", "Regression", "Unsupervised Learning", "Neural Calculus"],
      details: {
        linkedinPost: "🎓 Certified! I have completed the Machine Learning Specialization from DeepLearning.AI and Stanford University. \n\nI spent 10 weeks deeply reviewing regression, neural calculus, supervised/unsupervised algorithms, and learning curves. Ready to apply these foundational skills to solve complex pipeline challenges! 💻\n\n#MachineLearning #AndrewNg #DeepLearningAI #ContinuousLearning"
      }
    }
  ],
  dreams: [
    {
      id: "d1",
      type: "Primary",
      title: "AI Engineer",
      motivation: "Build high-performance deep neural network models and real-world agentic computer vision pipelines.",
      targetYear: "2029",
      confidence: 88,
      priority: "High",
      status: "Active",
      dateAdded: "2026-01-10"
    },
    {
      id: "d2",
      type: "Secondary",
      title: "Deep Learning Researcher",
      motivation: "Optimize neural architecture search and design small, power-efficient transformer models.",
      targetYear: "2030",
      confidence: 75,
      priority: "Medium",
      status: "Active",
      dateAdded: "2026-03-15"
    }
  ],
  skillDetails: [
    { name: "Python", level: "Expert", progress: 90, confidence: 92 },
    { name: "PyTorch", level: "Intermediate", progress: 72, confidence: 75 },
    { name: "Machine Learning", level: "Intermediate", progress: 68, confidence: 70 },
    { name: "SQL", level: "Intermediate", progress: 60, confidence: 65 },
    { name: "DBMS", level: "Intermediate", progress: 65, confidence: 70 },
    { name: "Git", level: "Intermediate", progress: 80, confidence: 85 }
  ],
  preferredLearningMethod: "Interactive Practice",
  preferredSessionLength: "60 min",
  preferredStudyTime: "Night",
  weeklyAvailabilityGrid: [
    [false, false, true, true],  // Mon
    [false, false, true, true],  // Tue
    [false, false, true, true],  // Wed
    [false, false, true, true],  // Thu
    [false, false, true, true],  // Fri
    [true, true, true, true],    // Sat
    [true, true, true, true]     // Sun
  ],
  rememberSettings: {
    learningPreferences: true,
    goals: true,
    skills: true,
    mentorConversations: true,
    completedMissions: true,
    askPermission: true
  },
  memories: [
    { id: "m1", text: "Currently developing a custom CNN project in PyTorch", category: "Skills" },
    { id: "m2", text: "Aims to secure a software internship like Google STEP in second year", category: "Goals" },
    { id: "m3", text: "Striving to keep academic scores high with upcoming DBMS exam focus", category: "Preferences" },
    { id: "m4", text: "Deeply interested in lightweight deep learning optimization", category: "Interests" }
  ]
};

export const defaultMissions: GrowthMission[] = [
  // 7 Completed Missions
  {
    id: "m_c1",
    title: "Complete PyTorch basics and Tensor operations",
    deadline: "Completed 5 days ago",
    estimatedTime: "3 hours",
    dreamImpact: "High (Core Skill)",
    completed: true,
    category: "Career"
  },
  {
    id: "m_c2",
    title: "Linear Algebra: Solve eigenvectors & SVD assignment",
    deadline: "Completed 3 days ago",
    estimatedTime: "2 hours",
    dreamImpact: "High (Math Foundation)",
    completed: true,
    category: "Academics"
  },
  {
    id: "m_c3",
    title: "Mindful Breathing: Practiced 5-minute study detox",
    deadline: "Completed 4 days ago",
    estimatedTime: "5 mins",
    dreamImpact: "Medium (Stress Relief)",
    completed: true,
    category: "Wellbeing"
  },
  {
    id: "m_c4",
    title: "Set up local Git workflow & GitHub student pack",
    deadline: "Completed 6 days ago",
    estimatedTime: "1 hour",
    dreamImpact: "Medium (Workflow)",
    completed: true,
    category: "Career"
  },
  {
    id: "m_c5",
    title: "Draft technical resume with CNN project layout",
    deadline: "Completed 2 days ago",
    estimatedTime: "1.5 hours",
    dreamImpact: "High (Internship Prep)",
    completed: true,
    category: "Career"
  },
  {
    id: "m_c6",
    title: "Complete SQL joins and database aggregation module",
    deadline: "Completed yesterday",
    estimatedTime: "2 hours",
    dreamImpact: "Medium (DBMS Prep)",
    completed: true,
    category: "Academics"
  },
  {
    id: "m_c7",
    title: "Wellbeing: 10-minute progressive muscle relaxation",
    deadline: "Completed yesterday",
    estimatedTime: "10 mins",
    dreamImpact: "Medium (Sleep Quality)",
    completed: true,
    category: "Wellbeing"
  },

  // 12 Active Missions (Total 19 missions. 7/19 = ~36.8%, rounds to exactly 37%)
  {
    id: "m_a1",
    title: "CNN Project: Complete convolutional layer implementation & train model",
    deadline: "In 3 days",
    estimatedTime: "4 hours",
    dreamImpact: "High (Active Milestone)",
    completed: false,
    category: "Career"
  },
  {
    id: "m_a2",
    title: "Prepare DBMS Assignment: Normalize schemas for university database",
    deadline: "Tomorrow",
    estimatedTime: "2 hours",
    dreamImpact: "High (Academics Booster)",
    completed: false,
    category: "Academics"
  },
  {
    id: "m_a3",
    title: "Smart India Hackathon (SIH) 2026: Design product architecture draft",
    deadline: "In 2 days",
    estimatedTime: "2.5 hours",
    dreamImpact: "High (Skill Validation)",
    completed: false,
    category: "Career"
  },
  {
    id: "m_a4",
    title: "Draft scholarship essay for Reliance Foundation award",
    deadline: "In 5 days",
    estimatedTime: "1.5 hours",
    dreamImpact: "Medium (Financial Aid)",
    completed: false,
    category: "Wellbeing"
  },
  {
    id: "m_a5",
    title: "Wellbeing: Morning sun exposure & 3-minute breath cycle",
    deadline: "Today",
    estimatedTime: "5 mins",
    dreamImpact: "Low (Focus Catalyst)",
    completed: false,
    category: "Wellbeing"
  },
  {
    id: "m_a6",
    title: "Revise Probability & Statistics: Bayes theorem problems",
    deadline: "In 4 days",
    estimatedTime: "1.5 hours",
    dreamImpact: "Medium (Foundation)",
    completed: false,
    category: "Academics"
  },
  {
    id: "m_a7",
    title: "Research Google STEP Interview patterns on arrays & graphs",
    deadline: "In 6 days",
    estimatedTime: "2 hours",
    dreamImpact: "High (Placement ready)",
    completed: false,
    category: "Career"
  },
  {
    id: "m_a8",
    title: "Review neural style transfer paper notes for CNN enhancement",
    deadline: "In 8 days",
    estimatedTime: "1.5 hours",
    dreamImpact: "Medium (Literature)",
    completed: false,
    category: "Career"
  },
  {
    id: "m_a9",
    title: "Practise 3 LeetCode problems on sliding window",
    deadline: "In 10 days",
    estimatedTime: "1.5 hours",
    dreamImpact: "Medium (Problem Solving)",
    completed: false,
    category: "Career"
  },
  {
    id: "m_a10",
    title: "Organize digital research workspace on Zotero",
    deadline: "In 12 days",
    estimatedTime: "1 hour",
    dreamImpact: "Low (Workspace Hygiene)",
    completed: false,
    category: "Academics"
  },
  {
    id: "m_a11",
    title: "Complete weekly academic progress reflection journal",
    deadline: "In 3 days",
    estimatedTime: "20 mins",
    dreamImpact: "Medium (Self Awareness)",
    completed: false,
    category: "Wellbeing"
  },
  {
    id: "m_a12",
    title: "Set up deep work blocker block in study calendars",
    deadline: "In 7 days",
    estimatedTime: "15 mins",
    dreamImpact: "Low (Time Management)",
    completed: false,
    category: "Wellbeing"
  }
];

export const mockOpportunities: Opportunity[] = [
  {
    id: "o1",
    type: "Hackathon",
    title: "Smart India Hackathon (SIH) 2026",
    provider: "Ministry of Education, Government of India",
    description: "The premier nationwide initiative to provide students with a platform to solve some of the pressing problems we face in our daily lives.",
    stipendOrValue: "₹1,00,000 Prize Pool",
    deadline: "Aug 15, 2026",
    closingSoon: true,
    tags: ["Govt Initiative", "Hardware & Software", "National Level"],
    applyUrl: "https://www.sih.gov.in"
  },
  {
    id: "o2",
    type: "Scholarship",
    title: "Reliance Foundation Undergraduate Scholarships 2026",
    provider: "Reliance Foundation",
    description: "Supporting meritorious students from all corners of India to continue their professional or degree college education.",
    stipendOrValue: "Up to ₹2,00,000 per year",
    deadline: "Sep 30, 2026",
    closingSoon: false,
    tags: ["Merit-cum-Means", "Degree Support", "All Streams"],
    applyUrl: "https://www.reliancefoundation.org"
  },
  {
    id: "o3",
    type: "Internship",
    title: "STEP Software Engineering Intern 2027",
    provider: "Google India",
    description: "A developmental internship program specifically targeted to second-year undergraduate students with a passion for computer science.",
    stipendOrValue: "Premium Monthly Stipend + Relocation",
    deadline: "Aug 30, 2026",
    closingSoon: true,
    tags: ["Google STEP", "Software Engineering", "Mentorship"],
    applyUrl: "https://careers.google.com"
  },
  {
    id: "o4",
    type: "Scholarship",
    title: "National Scholarship Portal (NSP) Post-Matric",
    provider: "Ministry of Minority Affairs, Govt of India",
    description: "Financial assistance for students from minority communities in India pursuing higher professional and technical courses.",
    stipendOrValue: "Full Tuition Coverage",
    deadline: "Oct 10, 2026",
    closingSoon: false,
    tags: ["Government", "Higher Education", "Financial Aid"],
    applyUrl: "https://scholarships.gov.in"
  },
  {
    id: "o5",
    type: "Internship",
    title: "ISRO Research & Development Trainee",
    provider: "Indian Space Research Organisation (ISRO)",
    description: "Work with space scientists on navigation satellite software protocols and structural simulation projects.",
    stipendOrValue: "₹25,000/month",
    deadline: "Sep 15, 2026",
    closingSoon: false,
    tags: ["Space Tech", "Govt Internship", "Research"],
    applyUrl: "https://www.isro.gov.in"
  },
  {
    id: "o6",
    type: "Hackathon",
    title: "Aadhaar Hackathon 2026",
    provider: "UIDAI, Government of India",
    description: "Develop innovative solution prototypes targeting paperless secure authentication APIs and rural identity validation.",
    stipendOrValue: "₹3,00,000 Winner Prize",
    deadline: "Nov 01, 2026",
    closingSoon: false,
    tags: ["UIDAI", "Identity Tech", "National Tier"],
    applyUrl: "https://uidai.gov.in"
  }
];

export const aiEmpatheticQuotes = [
  "One meaningful step today is enough to move your dream forward.",
  "Your potential doesn't shrink when you pause to breathe. It prepares to bloom.",
  "Success in your college semesters is a journey, not a singular destination.",
  "In the forest of goals, make space for your own root system to expand.",
  "Quiet progress is still progress. Every leaf grows silently.",
  "Be gentle with yourself. You are navigating both external ambitions and internal growth.",
  "The wind does not rush the tree's blossom. Let your skills unfold naturally."
];

export const ambientSoundTracks = [
  { id: "rain_sounds", name: "Raindrops on Tin Roof", type: "rain", url: "" },
  { id: "forest_birds", name: "Forest Birdsong & Wind", type: "forest", url: "" },
  { id: "lake_lull", name: "Lake Water Ripples", type: "lake", url: "" },
  { id: "evening_fireflies", name: "Night Ambient Crickets", type: "night", url: "" },
  { id: "lofi_mind", name: "SoulSync Lofi Piano Study", type: "universal", url: "" }
];
