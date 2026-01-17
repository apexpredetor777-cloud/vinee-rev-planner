// API Service Layer
// Replace BASE_URL with your Express backend URL
// All functions are ready to connect to your MERN backend

import { User, AuthResponse, Subject, StudyTask, PlanGenerateInput, AnalyticsSummary } from '@/types/api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getToken = (): string | null => localStorage.getItem('token');

// Helper for API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

// ============ AUTH API ============
export const authApi = {
  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getCurrentUser: async (): Promise<User> => {
    return apiRequest<User>('/auth/me');
  },
};

// ============ SUBJECTS API ============
export const subjectsApi = {
  getAll: async (): Promise<Subject[]> => {
    return apiRequest<Subject[]>('/subjects');
  },

  create: async (subject: Omit<Subject, 'id' | 'userId' | 'createdAt'>): Promise<Subject> => {
    return apiRequest<Subject>('/subjects', {
      method: 'POST',
      body: JSON.stringify(subject),
    });
  },

  update: async (id: string, subject: Partial<Subject>): Promise<Subject> => {
    return apiRequest<Subject>(`/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subject),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/subjects/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ TASKS API ============
export const tasksApi = {
  getAll: async (filters?: { date?: string; subjectId?: string }): Promise<StudyTask[]> => {
    const params = new URLSearchParams();
    if (filters?.date) params.append('date', filters.date);
    if (filters?.subjectId) params.append('subjectId', filters.subjectId);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<StudyTask[]>(`/tasks${query}`);
  },

  getToday: async (): Promise<StudyTask[]> => {
    return apiRequest<StudyTask[]>('/tasks/today');
  },

  updateStatus: async (id: string, status: 'pending' | 'completed'): Promise<StudyTask> => {
    return apiRequest<StudyTask>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  generatePlan: async (input: PlanGenerateInput): Promise<StudyTask[]> => {
    return apiRequest<StudyTask[]>('/plan/generate', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
};

// ============ ANALYTICS API ============
export const analyticsApi = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    return apiRequest<AnalyticsSummary>('/analytics/summary');
  },
};
