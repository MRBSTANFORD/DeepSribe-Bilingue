
export interface ProcessedTopic {
  title: string;
  description: string;
  enrichedContent?: string;
  sources?: { title: string; uri: string }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp?: number;
}

export interface DocumentData {
  id: string;
  createdAt: number;
  summary: string;
  topics: ProcessedTopic[];
  transcription: string;
  language?: string;
  chatHistory?: ChatMessage[];
}

export enum AppLanguage {
  EN = 'EN',
  PT = 'PT'
}

export interface AppSettings {
  transcriptionSystemInstruction: string;
  enrichmentPromptTemplate: string;
  liveSystemInstruction: string;
  showAdminTools?: boolean;
  googleAnalyticsId?: string;
  logoStyle?: 'minimal' | 'abstract' | 'classic' | 'brain' | 'cosmic' | 'nexus' | 'waveform' | 'eye';
  bannerStyle?: 'midnight' | 'sunrise' | 'forest' | 'ocean' | 'nebula' | 'obsidian' | 'royal' | 'polar' | 'classic' | 'mint' | 'sky' | 'lavender' | 'blush' | 'ivory';
  appLanguage?: AppLanguage;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  GENERATOR = 'GENERATOR',
  HISTORY = 'HISTORY',
  LIVE = 'LIVE',
  MARKETING = 'MARKETING',
  SETTINGS = 'SETTINGS',
  VIEWER = 'VIEWER', 
  HELP = 'HELP',
  LEGAL = 'LEGAL'
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}
