import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AIPersonality = 
  | 'Friendly Tutor' 
  | 'Professional Developer' 
  | 'Fast Helper' 
  | 'Motivational Mentor' 
  | 'Cyber AI' 
  | 'Study Assistant';

export interface AIChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: number;
}

interface AIState {
  aiName: string;
  aiType: AIPersonality;
  aiAvatar: string;
  isOpen: boolean;
  history: AIChatMessage[];
  setAiConfig: (config: Partial<{ aiName: string; aiType: AIPersonality; aiAvatar: string }>) => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  addMessage: (msg: Omit<AIChatMessage, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

export const useAIStore = create<AIState>()(
  persist(
    (set) => ({
      aiName: 'BuddyBot',
      aiType: 'Friendly Tutor',
      aiAvatar: '🤖',
      isOpen: false,
      history: [{ id: 'init', sender: 'ai', text: 'Halo! Aku siap membantu. Ada yang ingin ditanyakan?', timestamp: Date.now() }],
      setAiConfig: (config) => set((state) => ({ ...state, ...config })),
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open) => set({ isOpen: open }),
      addMessage: (msg) => set((state) => ({
        history: [...state.history, { ...msg, id: Math.random().toString(36).substring(7), timestamp: Date.now() }]
      })),
      clearHistory: () => set((state) => ({ 
        history: [{ id: 'init', sender: 'ai', text: `Halo! Aku ${state.aiName}, siap membantu. Ada yang ingin ditanyakan?`, timestamp: Date.now() }] 
      }))
    }),
    {
      name: 'kodein-ai-companion-storage',
    }
  )
);
