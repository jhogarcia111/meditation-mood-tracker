export interface User {
  id: string;
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
  country?: string;
  language: 'ES' | 'EN';
  createdAt: Date;
}

export interface Feeling {
  id: string;
  nameEs: string;
  nameEn: string;
  category: 'GOOD' | 'BAD';
  isActive: boolean;
}

export interface DailyRecord {
  id: string;
  userId: string;
  date: Date;
  meditationType?: string;
  meditationNotes?: string;
  feelingRatings: FeelingRating[];
}

export interface FeelingRating {
  id: string;
  dailyRecordId: string;
  feelingId: string;
  beforeRating: number;
  afterRating: number;
  feeling: Feeling;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  userId: string;
  password: string;
}

export interface RegisterData {
  userId: string;
  email: string;
  password: string;
  country?: string;
  language?: 'ES' | 'EN';
}

export interface FeelingFormData {
  date: string;
  meditationType?: string;
  meditationNotes?: string;
  feelings: {
    feelingId: string;
    beforeRating: number;
    afterRating: number;
  }[];
}

export interface Meditation {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  duration: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: MeditationTag[];
}

export interface MeditationTag {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  meditations?: Meditation[];
}

export interface CreateMeditationRequest {
  title: string;
  description: string;
  youtubeUrl: string;
  duration: number;
  tagIds: string[];
}

export interface UpdateMeditationRequest {
  title?: string;
  description?: string;
  youtubeUrl?: string;
  duration?: number;
  isActive?: boolean;
  tagIds?: string[];
}

export interface CreateMeditationTagRequest {
  name: string;
  description?: string;
}

export interface UpdateMeditationTagRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}
