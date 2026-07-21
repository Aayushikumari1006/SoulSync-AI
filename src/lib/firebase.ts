import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously, 
  onAuthStateChanged,
  User,
  Auth
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  enableIndexedDbPersistence,
  Firestore,
  writeBatch,
  onSnapshot,
  orderBy,
  limit
} from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { StudentProfile, GrowthMission, Opportunity, StudentDream } from "../types";

// Firebase Config
const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: metaEnv.VITE_FIREBASE_APP_ID || ""
};

// Check if Firebase is fully configured
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.authDomain
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Enable local/offline persistence for robust offline support
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.warn('Firebase persistence failed-precondition: Multiple tabs open.');
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the features required to enable persistence
        console.warn('Firebase persistence unimplemented in this browser.');
      }
    });
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
} else {
  console.info("Firebase keys not set. Running in Local Storage Mock mode.");
}

// Helper to check if Firebase is fully initialized and operational
export const isLiveFirebase = (): boolean => {
  return isFirebaseConfigured && app !== null && auth !== null && db !== null;
};

// ==========================================
// 1. AUTHENTICATION SERVICES WITH FALLBACKS
// ==========================================

export interface UserSession {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
  isDemo: boolean;
}

// Listen to auth changes
export const subscribeToAuthChanges = (callback: (user: UserSession | null) => void) => {
  if (isLiveFirebase() && auth) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          isAnonymous: user.isAnonymous,
          isDemo: false
        });
      } else {
        // Try to load any persistent local demo sessions
        const savedDemo = localStorage.getItem("soulsync_demo_user");
        if (savedDemo) {
          callback(JSON.parse(savedDemo));
        } else {
          callback(null);
        }
      }
    });
  } else {
    // Local / Demo mode polling or observer simulation
    const savedDemo = localStorage.getItem("soulsync_demo_user");
    if (savedDemo) {
      callback(JSON.parse(savedDemo));
    } else {
      callback(null);
    }
    // Return unsubscribe empty trigger
    return () => {};
  }
};

// Sign Up with Email and Password
export const signUpWithEmail = async (email: string, password: string, displayName: string): Promise<UserSession> => {
  if (isLiveFirebase() && auth) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    // Create base profile in Firestore
    if (db && credential.user) {
      const userRef = doc(db, "users", credential.user.uid);
      await setDoc(userRef, {
        userId: credential.user.uid,
        email: email,
        name: displayName,
        createdAt: new Date(),
        isOnboardingCompleted: false
      }, { merge: true });
    }
    return {
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: displayName,
      isAnonymous: false,
      isDemo: false
    };
  } else {
    // Local session mockup
    const uid = "demo_uid_" + Math.random().toString(36).substr(2, 9);
    const session: UserSession = {
      uid,
      email,
      displayName,
      isAnonymous: false,
      isDemo: true
    };
    localStorage.setItem("soulsync_demo_user", JSON.stringify(session));
    return session;
  }
};

// Login with Email and Password
export const loginWithEmail = async (email: string, password: string): Promise<UserSession> => {
  if (isLiveFirebase() && auth) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: credential.user.displayName,
      isAnonymous: false,
      isDemo: false
    };
  } else {
    // Fallback: check stored local profiles
    const session: UserSession = {
      uid: "demo_user_ayush",
      email: email,
      displayName: "Ayush",
      isAnonymous: false,
      isDemo: true
    };
    localStorage.setItem("soulsync_demo_user", JSON.stringify(session));
    return session;
  }
};

// Google Single Sign-on Popup login
export const loginWithGoogle = async (): Promise<UserSession> => {
  if (isLiveFirebase() && auth) {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    if (db && credential.user) {
      const userRef = doc(db, "users", credential.user.uid);
      await setDoc(userRef, {
        userId: credential.user.uid,
        email: credential.user.email,
        name: credential.user.displayName || "Google Student",
        updatedAt: new Date()
      }, { merge: true });
    }
    return {
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: credential.user.displayName,
      isAnonymous: false,
      isDemo: false
    };
  } else {
    const session: UserSession = {
      uid: "google_demo_ayush",
      email: "ayush@iitd.ac.in",
      displayName: "Ayush",
      isAnonymous: false,
      isDemo: true
    };
    localStorage.setItem("soulsync_demo_user", JSON.stringify(session));
    return session;
  }
};

// Anonymous / Guest Login
export const loginAnonymouslyService = async (): Promise<UserSession> => {
  if (isLiveFirebase() && auth) {
    const credential = await signInAnonymously(auth);
    return {
      uid: credential.user.uid,
      email: null,
      displayName: "Guest Explorer",
      isAnonymous: true,
      isDemo: false
    };
  } else {
    const session: UserSession = {
      uid: "guest_anonymous",
      email: null,
      displayName: "Guest Explorer",
      isAnonymous: true,
      isDemo: true
    };
    localStorage.setItem("soulsync_demo_user", JSON.stringify(session));
    return session;
  }
};

// Logout session
export const logoutUser = async (): Promise<void> => {
  if (isLiveFirebase() && auth) {
    await signOut(auth);
  }
  localStorage.removeItem("soulsync_demo_user");
};

// Send password reset / verification link
export const resetUserPassword = async (email: string): Promise<void> => {
  if (isLiveFirebase() && auth) {
    await sendPasswordResetEmail(auth, email);
  } else {
    console.info(`Demo: Password reset email request dispatched for: ${email}`);
  }
};

// ==========================================
// 2. FIRESTORE DATABASE SYNCHRONIZATION
// ==========================================

// Save user student profile
export const saveUserProfile = async (userId: string, profile: StudentProfile): Promise<void> => {
  if (isLiveFirebase() && db) {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      ...profile,
      updatedAt: new Date()
    }, { merge: true });

    // Staggered writing of dreams subcollection to scale well
    if (profile.dreams) {
      const dreamsBatch = writeBatch(db);
      profile.dreams.forEach((dream) => {
        const dRef = doc(db, "users", userId, "dreams", dream.id);
        dreamsBatch.set(dRef, dream);
      });
      await dreamsBatch.commit();
    }
  } else {
    localStorage.setItem(`soulsync_profile_${userId}`, JSON.stringify(profile));
  }
};

// Fetch user profile
export const fetchUserProfile = async (userId: string): Promise<StudentProfile | null> => {
  if (isLiveFirebase() && db) {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const baseProfile = docSnap.data() as StudentProfile;
      
      // Load dreams subcollection
      const dreamsSnap = await getDocs(collection(db, "users", userId, "dreams"));
      const dreamsList: StudentDream[] = [];
      dreamsSnap.forEach((doc) => {
        dreamsList.push(doc.data() as StudentDream);
      });

      return {
        ...baseProfile,
        dreams: dreamsList.length > 0 ? dreamsList : baseProfile.dreams
      };
    }
    return null;
  } else {
    const local = localStorage.getItem(`soulsync_profile_${userId}`);
    return local ? JSON.parse(local) : null;
  }
};

// Fetch Growth Missions with subcollection query
export const fetchGrowthMissions = async (userId: string): Promise<GrowthMission[]> => {
  if (isLiveFirebase() && db) {
    const misSnap = await getDocs(collection(db, "users", userId, "growthMissions"));
    const list: GrowthMission[] = [];
    misSnap.forEach((doc) => {
      list.push(doc.data() as GrowthMission);
    });
    return list;
  } else {
    const local = localStorage.getItem(`soulsync_missions_${userId}`);
    return local ? JSON.parse(local) : [];
  }
};

// Save single/multiple Growth Missions
export const saveGrowthMissions = async (userId: string, missions: GrowthMission[]): Promise<void> => {
  if (isLiveFirebase() && db) {
    const batch = writeBatch(db);
    missions.forEach((m) => {
      const mRef = doc(db, "users", userId, "growthMissions", m.id);
      batch.set(mRef, { ...m, updatedAt: new Date() });
    });
    await batch.commit();
  } else {
    localStorage.setItem(`soulsync_missions_${userId}`, JSON.stringify(missions));
  }
};

// Delete/update a single growth mission
export const updateGrowthMissionStatus = async (userId: string, missionId: string, completed: boolean): Promise<void> => {
  if (isLiveFirebase() && db) {
    const mRef = doc(db, "users", userId, "growthMissions", missionId);
    await updateDoc(mRef, { completed, updatedAt: new Date() });
  } else {
    const local = localStorage.getItem(`soulsync_missions_${userId}`);
    if (local) {
      const list: GrowthMission[] = JSON.parse(local);
      const updated = list.map((m) => m.id === missionId ? { ...m, completed } : m);
      localStorage.setItem(`soulsync_missions_${userId}`, JSON.stringify(updated));
    }
  }
};

// Fetch global and user specific opportunities list
export const fetchOpportunitiesList = async (): Promise<Opportunity[]> => {
  if (isLiveFirebase() && db) {
    try {
      const opSnap = await getDocs(collection(db, "opportunities"));
      const list: Opportunity[] = [];
      opSnap.forEach((doc) => {
        list.push(doc.data() as Opportunity);
      });
      return list;
    } catch (e) {
      console.warn("Failed fetching from global opportunities collection, loading default list", e);
    }
  }
  return [];
};

// Save a memory entry inside user SoulPrint subcollection
export const saveSoulPrintEntry = async (userId: string, entry: { id: string, text: string, category: string }): Promise<void> => {
  if (isLiveFirebase() && db) {
    const spRef = doc(db, "users", userId, "soulPrint", entry.id);
    await setDoc(spRef, {
      ...entry,
      createdAt: new Date()
    });
  } else {
    const key = `soulsync_soulprint_${userId}`;
    const existing = localStorage.getItem(key);
    const list = existing ? JSON.parse(existing) : [];
    list.push(entry);
    localStorage.setItem(key, JSON.stringify(list));
  }
};

// Fetch memories
export const fetchSoulPrintEntries = async (userId: string): Promise<any[]> => {
  if (isLiveFirebase() && db) {
    const spSnap = await getDocs(collection(db, "users", userId, "soulPrint"));
    const list: any[] = [];
    spSnap.forEach((doc) => {
      list.push(doc.data());
    });
    return list;
  } else {
    const key = `soulsync_soulprint_${userId}`;
    const existing = localStorage.getItem(key);
    return existing ? JSON.parse(existing) : [];
  }
};

// Save weekly reflections log
export const saveWeeklyReflection = async (userId: string, reflection: { id: string, question: string, answer: string, tags: string[] }): Promise<void> => {
  if (isLiveFirebase() && db) {
    const rRef = doc(db, "users", userId, "weeklyReflections", reflection.id);
    await setDoc(rRef, {
      ...reflection,
      createdAt: new Date()
    });
  } else {
    const key = `soulsync_reflections_${userId}`;
    const existing = localStorage.getItem(key);
    const list = existing ? JSON.parse(existing) : [];
    list.push(reflection);
    localStorage.setItem(key, JSON.stringify(list));
  }
};

// Save future letters
export const saveFutureLetter = async (userId: string, letter: { id: string, targetDuration: string, content: string }): Promise<void> => {
  if (isLiveFirebase() && db) {
    const fRef = doc(db, "users", userId, "futureLetters", letter.id);
    await setDoc(fRef, {
      ...letter,
      createdAt: new Date()
    });
  } else {
    const key = `soulsync_letters_${userId}`;
    const existing = localStorage.getItem(key);
    const list = existing ? JSON.parse(existing) : [];
    list.push(letter);
    localStorage.setItem(key, JSON.stringify(list));
  }
};

// Save Chat Mentor History logs
export const saveChatMessageService = async (userId: string, message: { id: string, sender: string, text: string, timestamp: Date }): Promise<void> => {
  if (isLiveFirebase() && db) {
    const mRef = doc(db, "users", userId, "mentorHistory", message.id);
    await setDoc(mRef, {
      ...message,
      timestamp: new Date()
    });
  } else {
    const key = `soulsync_chat_${userId}`;
    const existing = localStorage.getItem(key);
    const list = existing ? JSON.parse(existing) : [];
    list.push(message);
    localStorage.setItem(key, JSON.stringify(list));
  }
};

// Fetch Chat logs
export const fetchChatMessageHistory = async (userId: string): Promise<any[]> => {
  if (isLiveFirebase() && db) {
    const mSnap = await getDocs(query(collection(db, "users", userId, "mentorHistory"), orderBy("timestamp", "asc")));
    const list: any[] = [];
    mSnap.forEach((doc) => {
      const data = doc.data();
      list.push({
        ...data,
        timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
      });
    });
    return list;
  } else {
    const key = `soulsync_chat_${userId}`;
    const existing = localStorage.getItem(key);
    return existing ? JSON.parse(existing) : [];
  }
};

// Save forest items to Firebase
export const saveForestItems = async (userId: string, items: any[]): Promise<void> => {
  if (isLiveFirebase() && db) {
    const batch = writeBatch(db);
    items.forEach((item) => {
      const itemRef = doc(db, "users", userId, "forest", item.id);
      batch.set(itemRef, item);
    });
    await batch.commit();
  } else {
    localStorage.setItem(`soulsync_forest_${userId}`, JSON.stringify(items));
  }
};

// Fetch forest items from Firebase
export const fetchForestItems = async (userId: string): Promise<any[]> => {
  if (isLiveFirebase() && db) {
    const snap = await getDocs(collection(db, "users", userId, "forest"));
    const list: any[] = [];
    snap.forEach((doc) => {
      list.push(doc.data());
    });
    return list;
  } else {
    const saved = localStorage.getItem(`soulsync_forest_${userId}`);
    return saved ? JSON.parse(saved) : [];
  }
};

// Save user opportunity interactions
export const saveUserOpportunityStates = async (userId: string, data: { savedIds: string[], trackedIds: string[], appliedStatuses: Record<string, string> }): Promise<void> => {
  if (isLiveFirebase() && db) {
    const docRef = doc(db, "users", userId, "opportunities", "interactions");
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
  } else {
    localStorage.setItem(`soulsync_opps_${userId}`, JSON.stringify(data));
  }
};

// Fetch user opportunity interactions
export const fetchUserOpportunityStates = async (userId: string): Promise<{ savedIds: string[], trackedIds: string[], appliedStatuses: Record<string, string> } | null> => {
  if (isLiveFirebase() && db) {
    const docRef = doc(db, "users", userId, "opportunities", "interactions");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as any;
    }
    return null;
  } else {
    const saved = localStorage.getItem(`soulsync_opps_${userId}`);
    return saved ? JSON.parse(saved) : null;
  }
};


