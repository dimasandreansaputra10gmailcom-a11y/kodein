import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { synth } from '../lib/synth';

export interface UserProfile {
  id: string;
  username: string;
  fullName?: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  lives: number;
  joinDate: string;
  completedChallenges: number;
  badges: string[];
  isAdmin?: boolean;
  unlockedStages?: Record<string, number>;
  tier?: string;
  institution?: string;
  loginPin?: string;
  lastFullNameUpdate?: any;
  lastUsernameUpdate?: any;
  weeklyXpActivity?: { date: string, xp: number }[];
  lastActiveDate?: string;
  lastLogicQuestDate?: string;
  lastPatternQuizDate?: string;
  lastCommunityMessageDate?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (userData: Partial<UserProfile>) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  addXp: (amount: number) => void;
  consumeLife: () => void;
  unlockStage: (levelId: string, stageId: number) => void;
}

// Helper to get current Date string in WIB
const getWIBDateString = () => {
  return new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"})).toISOString().split('T')[0];
};

// Helper to reliably update firebase user doc if logged in
const syncUserToFirebase = async (userId: string, data: any) => {
  if (!userId) return;
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to sync to Firebase:", error);
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ 
        user: { 
          id: userData.id || Math.random().toString(36).substring(7),
          username: userData.username || 'Kamu (Explorer)',
          fullName: userData.fullName || '',
          email: userData.email || '',
          avatar: userData.avatar || '🤖',
          level: userData.level || 1,
          xp: userData.xp || 8750,
          streak: userData.streak || 1,
          joinDate: userData.joinDate || new Date().toISOString().split('T')[0],
          completedChallenges: userData.completedChallenges || 0,
          badges: userData.badges || ['Beta Tester'],
          unlockedStages: userData.unlockedStages || { sd: 1, smp: 1, sma: 1, pt: 1 },
          tier: userData.tier || 'SMP',
          institution: userData.institution || 'Sekolah Umum',
          weeklyXpActivity: userData.weeklyXpActivity || [],
          lastActiveDate: userData.lastActiveDate || getWIBDateString(),
          ...userData 
        } as UserProfile, 
        isAuthenticated: true 
      }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) => set((state) => {
        if (!state.user) return state;
        const updatedUser = { ...state.user, ...data };
        syncUserToFirebase(state.user.id, data);
        return { user: updatedUser };
      }),
      addXp: (amount) => set((state) => {
        if (!state.user) return state;
        const newXp = state.user.xp + amount;
        // Simple level calculation based on XP
        const newLevel = Math.floor(newXp / 1000) + 1;
        const newCompleted = (state.user.completedChallenges || 0) + 1;
        
        const today = getWIBDateString();
        let currentActivity = state.user.weeklyXpActivity || [];
        
        const todayIndex = currentActivity.findIndex(a => a.date === today);
        if (todayIndex >= 0) {
          currentActivity[todayIndex] = { ...currentActivity[todayIndex], xp: currentActivity[todayIndex].xp + amount };
        } else {
          currentActivity.push({ date: today, xp: amount });
        }
        
        // Keep only last 7 days of activity
        currentActivity = currentActivity.slice(-7);
        
        const isLeveledUp = newLevel > state.user.level;
        if (isLeveledUp) {
          synth.playLevelUp();
        }
        
        syncUserToFirebase(state.user.id, { 
          xp: newXp, 
          level: isLeveledUp ? newLevel : state.user.level,
          completedChallenges: newCompleted,
          weeklyXpActivity: currentActivity,
          lastActiveDate: today
        });
        
        return {
          user: {
            ...state.user,
            xp: newXp,
            level: isLeveledUp ? newLevel : state.user.level,
            completedChallenges: newCompleted,
            weeklyXpActivity: currentActivity,
            lastActiveDate: today
          }
        };
      }),
      consumeLife: () => set((state) => {
        if (!state.user || typeof state.user.lives !== 'number' || state.user.lives <= 0) return state;
        const newLives = state.user.lives - 1;
        syncUserToFirebase(state.user.id, { lives: newLives });
        return {
          user: {
            ...state.user,
            lives: newLives
          }
        };
      }),
      unlockStage: (levelId, stageId) => set((state) => {
        if (!state.user) return state;
        const currentStages = state.user.unlockedStages || { sd: 1, smp: 1, sma: 1, pt: 1 };
        const currentMaxStage = currentStages[levelId] || 1;
        
        if (stageId > currentMaxStage) {
          const newUnlockedStages = {
            ...currentStages,
            [levelId]: stageId
          };
          syncUserToFirebase(state.user.id, { unlockedStages: newUnlockedStages });
          return {
            user: {
              ...state.user,
              unlockedStages: newUnlockedStages
            }
          };
        }
        return state;
      })
    }),
    {
      name: 'kodein-auth-storage',
    }
  )
);
