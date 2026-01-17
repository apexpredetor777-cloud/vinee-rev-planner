// API Types for Smart Revision Planner
// These types match the backend MongoDB models

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Subject {
  id: string;
  userId: string;
  name: string;
  examDate: string;
  difficulty: 'easy' | 'medium' | 'hard';
  syllabusSize: number;
  weakAreas: string[];
  createdAt: string;
}

export interface StudyTask {
  id: string;
  userId: string;
  subjectId: string;
  subject?: Subject;
  date: string;
  plannedHours: number;
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface PlanGenerateInput {
  availableHoursPerDay: number;
  startDate: string;
}

export interface AnalyticsSummary {
  totalTasks: number;
  completedTasks: number;
  completionPerSubject: {
    subjectId: string;
    subjectName: string;
    total: number;
    completed: number;
    percentage: number;
  }[];
  atRiskSubjects: {
    subjectId: string;
    subjectName: string;
    examDate: string;
    daysLeft: number;
    completionPercentage: number;
  }[];
  streakDays: number;
}

export type Priority = 'high' | 'medium' | 'low';

export const getPriority = (examDate: string, completionPercentage: number): Priority => {
  const daysLeft = Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysLeft <= 7 && completionPercentage < 50) return 'high';
  if (daysLeft <= 14 && completionPercentage < 70) return 'medium';
  return 'low';
};
