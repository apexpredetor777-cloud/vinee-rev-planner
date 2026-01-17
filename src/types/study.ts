export type Priority = 'urgent' | 'medium' | 'low';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Subject {
  id: string;
  name: string;
  examDate: Date;
  difficulty: Difficulty;
  color: string;
  totalTopics: number;
  completedTopics: number;
}

export interface Task {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  title: string;
  duration: number; // in minutes
  priority: Priority;
  completed: boolean;
  scheduledDate: Date;
}

export interface DailyProgress {
  date: Date;
  tasksCompleted: number;
  totalTasks: number;
  minutesStudied: number;
}
