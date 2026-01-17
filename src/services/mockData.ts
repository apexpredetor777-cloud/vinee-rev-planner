// Mock data for demo/development
// Remove this file when connecting to real backend

import { Subject, StudyTask, AnalyticsSummary } from '@/types/api';
import { addDays, format, subDays } from 'date-fns';

const today = new Date();

export const mockSubjects: Subject[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Mathematics',
    examDate: format(addDays(today, 8), 'yyyy-MM-dd'),
    difficulty: 'hard',
    syllabusSize: 12,
    weakAreas: ['Calculus', 'Trigonometry'],
    createdAt: format(subDays(today, 30), 'yyyy-MM-dd'),
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Physics',
    examDate: format(addDays(today, 12), 'yyyy-MM-dd'),
    difficulty: 'medium',
    syllabusSize: 10,
    weakAreas: ['Thermodynamics'],
    createdAt: format(subDays(today, 25), 'yyyy-MM-dd'),
  },
  {
    id: '3',
    userId: 'user1',
    name: 'Chemistry',
    examDate: format(addDays(today, 18), 'yyyy-MM-dd'),
    difficulty: 'medium',
    syllabusSize: 8,
    weakAreas: [],
    createdAt: format(subDays(today, 20), 'yyyy-MM-dd'),
  },
  {
    id: '4',
    userId: 'user1',
    name: 'History',
    examDate: format(addDays(today, 25), 'yyyy-MM-dd'),
    difficulty: 'easy',
    syllabusSize: 15,
    weakAreas: ['Modern History'],
    createdAt: format(subDays(today, 15), 'yyyy-MM-dd'),
  },
];

export const mockTasks: StudyTask[] = [
  {
    id: 't1',
    userId: 'user1',
    subjectId: '1',
    date: format(today, 'yyyy-MM-dd'),
    plannedHours: 2,
    status: 'pending',
    createdAt: format(subDays(today, 5), 'yyyy-MM-dd'),
  },
  {
    id: 't2',
    userId: 'user1',
    subjectId: '2',
    date: format(today, 'yyyy-MM-dd'),
    plannedHours: 1.5,
    status: 'pending',
    createdAt: format(subDays(today, 5), 'yyyy-MM-dd'),
  },
  {
    id: 't3',
    userId: 'user1',
    subjectId: '3',
    date: format(today, 'yyyy-MM-dd'),
    plannedHours: 1,
    status: 'completed',
    createdAt: format(subDays(today, 5), 'yyyy-MM-dd'),
  },
  {
    id: 't4',
    userId: 'user1',
    subjectId: '4',
    date: format(today, 'yyyy-MM-dd'),
    plannedHours: 0.5,
    status: 'pending',
    createdAt: format(subDays(today, 5), 'yyyy-MM-dd'),
  },
  // Past tasks
  {
    id: 't5',
    userId: 'user1',
    subjectId: '1',
    date: format(subDays(today, 1), 'yyyy-MM-dd'),
    plannedHours: 2,
    status: 'completed',
    createdAt: format(subDays(today, 6), 'yyyy-MM-dd'),
  },
  {
    id: 't6',
    userId: 'user1',
    subjectId: '2',
    date: format(subDays(today, 1), 'yyyy-MM-dd'),
    plannedHours: 1.5,
    status: 'completed',
    createdAt: format(subDays(today, 6), 'yyyy-MM-dd'),
  },
  // Future tasks
  {
    id: 't7',
    userId: 'user1',
    subjectId: '1',
    date: format(addDays(today, 1), 'yyyy-MM-dd'),
    plannedHours: 2,
    status: 'pending',
    createdAt: format(subDays(today, 5), 'yyyy-MM-dd'),
  },
  {
    id: 't8',
    userId: 'user1',
    subjectId: '3',
    date: format(addDays(today, 1), 'yyyy-MM-dd'),
    plannedHours: 1.5,
    status: 'pending',
    createdAt: format(subDays(today, 5), 'yyyy-MM-dd'),
  },
];

export const mockAnalytics: AnalyticsSummary = {
  totalTasks: 24,
  completedTasks: 10,
  completionPerSubject: [
    { subjectId: '1', subjectName: 'Mathematics', total: 8, completed: 3, percentage: 37.5 },
    { subjectId: '2', subjectName: 'Physics', total: 6, completed: 3, percentage: 50 },
    { subjectId: '3', subjectName: 'Chemistry', total: 5, completed: 3, percentage: 60 },
    { subjectId: '4', subjectName: 'History', total: 5, completed: 1, percentage: 20 },
  ],
  atRiskSubjects: [
    {
      subjectId: '1',
      subjectName: 'Mathematics',
      examDate: format(addDays(today, 8), 'yyyy-MM-dd'),
      daysLeft: 8,
      completionPercentage: 37.5,
    },
  ],
  streakDays: 3,
};

// Motivational quotes
export const motivationalQuotes = [
  "The secret of getting ahead is getting started. – Mark Twain",
  "It does not matter how slowly you go as long as you do not stop. – Confucius",
  "Success is the sum of small efforts repeated day in and day out. – Robert Collier",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Believe you can and you're halfway there. – Theodore Roosevelt",
  "Education is the most powerful weapon you can use to change the world. – Nelson Mandela",
  "The more that you read, the more things you will know. – Dr. Seuss",
  "Your limitation—it's only your imagination.",
];

export const getRandomQuote = () => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};
