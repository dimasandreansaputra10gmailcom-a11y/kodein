export type EducationLevel = 'SD' | 'SMP' | 'SMA' | 'SMK' | 'Kuliah' | 'Other';

export interface User {
  name: string;
  email: string;
  school: string;
  level: EducationLevel;
  avatar: string;
  buddy: string;
  xp: number;
  lives: number;
}

export interface QuestNode {
  id: string;
  label: string;
  status: 'completed' | 'active' | 'locked';
  type: 'logic' | 'syntax' | 'pattern';
}

export interface Message {
  id: string;
  sender: 'buddy' | 'user';
  text: string;
  type?: 'text' | 'code' | 'quiz' | 'tip';
  options?: string[];
}
