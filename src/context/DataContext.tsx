import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Subject, StudyTask, AnalyticsSummary, PlanGenerateInput } from '@/types/api';
import { mockSubjects, mockTasks, mockAnalytics } from '@/services/mockData';
import { useAuth } from './AuthContext';
import { format, addDays, differenceInDays, parseISO } from 'date-fns';

interface DataContextType {
  subjects: Subject[];
  tasks: StudyTask[];
  analytics: AnalyticsSummary | null;
  isLoading: boolean;
  addSubject: (subject: Omit<Subject, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateSubject: (id: string, subject: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  generatePlan: (input: PlanGenerateInput) => Promise<void>;
  getTodaysTasks: () => StudyTask[];
  getTasksForDate: (date: string) => StudyTask[];
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 9);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateAnalytics = useCallback((subjectsList: Subject[], tasksList: StudyTask[]): AnalyticsSummary => {
    const totalTasks = tasksList.length;
    const completedTasks = tasksList.filter(t => t.status === 'completed').length;
    
    const completionPerSubject = subjectsList.map(subject => {
      const subjectTasks = tasksList.filter(t => t.subjectId === subject.id);
      const completed = subjectTasks.filter(t => t.status === 'completed').length;
      return {
        subjectId: subject.id,
        subjectName: subject.name,
        total: subjectTasks.length,
        completed,
        percentage: subjectTasks.length > 0 ? Math.round((completed / subjectTasks.length) * 100) : 0,
      };
    });

    const atRiskSubjects = subjectsList
      .map(subject => {
        const completion = completionPerSubject.find(c => c.subjectId === subject.id);
        const daysLeft = differenceInDays(parseISO(subject.examDate), new Date());
        return {
          subjectId: subject.id,
          subjectName: subject.name,
          examDate: subject.examDate,
          daysLeft,
          completionPercentage: completion?.percentage || 0,
        };
      })
      .filter(s => s.daysLeft <= 14 && s.completionPercentage < 50)
      .sort((a, b) => a.daysLeft - b.daysLeft);

    return {
      totalTasks,
      completedTasks,
      completionPerSubject,
      atRiskSubjects,
      streakDays: 3, // Mock streak
    };
  }, []);

  const refreshData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    // For real API:
    // const [subjectsData, tasksData, analyticsData] = await Promise.all([
    //   subjectsApi.getAll(),
    //   tasksApi.getAll(),
    //   analyticsApi.getSummary(),
    // ]);
    
    // Using mock data for demo
    await new Promise(resolve => setTimeout(resolve, 300));
    setSubjects(mockSubjects);
    setTasks(mockTasks);
    setAnalytics(calculateAnalytics(mockSubjects, mockTasks));
    setIsLoading(false);
  }, [isAuthenticated, calculateAnalytics]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addSubject = async (subjectData: Omit<Subject, 'id' | 'userId' | 'createdAt'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: generateId(),
      userId: 'user1',
      createdAt: new Date().toISOString(),
    };
    
    setSubjects(prev => [...prev, newSubject]);
    setAnalytics(prev => prev ? calculateAnalytics([...subjects, newSubject], tasks) : null);
  };

  const updateSubject = async (id: string, subjectData: Partial<Subject>) => {
    setSubjects(prev => 
      prev.map(s => s.id === id ? { ...s, ...subjectData } : s)
    );
  };

  const deleteSubject = async (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    setTasks(prev => prev.filter(t => t.subjectId !== id));
  };

  const toggleTaskStatus = async (id: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
          : t
      )
    );
  };

  const generatePlan = async (input: PlanGenerateInput) => {
    const { availableHoursPerDay, startDate } = input;
    const newTasks: StudyTask[] = [];
    const start = parseISO(startDate);

    // Sort subjects by priority (closer exam + higher difficulty = higher priority)
    const sortedSubjects = [...subjects].sort((a, b) => {
      const daysA = differenceInDays(parseISO(a.examDate), start);
      const daysB = differenceInDays(parseISO(b.examDate), start);
      const difficultyWeight = { hard: 3, medium: 2, easy: 1 };
      const weightA = (difficultyWeight[a.difficulty] * 2) + (30 - daysA) + (a.weakAreas.length * 2);
      const weightB = (difficultyWeight[b.difficulty] * 2) + (30 - daysB) + (b.weakAreas.length * 2);
      return weightB - weightA;
    });

    // Generate tasks for each day until the last exam
    const lastExamDate = subjects.reduce((latest, s) => {
      const examDate = parseISO(s.examDate);
      return examDate > latest ? examDate : latest;
    }, start);

    const totalDays = differenceInDays(lastExamDate, start) + 1;
    
    for (let day = 0; day < totalDays; day++) {
      const currentDate = addDays(start, day);
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      let remainingHours = availableHoursPerDay;

      for (const subject of sortedSubjects) {
        const examDate = parseISO(subject.examDate);
        if (currentDate > examDate) continue;

        const daysUntilExam = differenceInDays(examDate, currentDate);
        const difficultyHours = { hard: 2, medium: 1.5, easy: 1 };
        const baseHours = difficultyHours[subject.difficulty];
        
        // Allocate more time as exam approaches
        const urgencyMultiplier = daysUntilExam <= 3 ? 1.5 : daysUntilExam <= 7 ? 1.2 : 1;
        const plannedHours = Math.min(
          Math.round(baseHours * urgencyMultiplier * 10) / 10,
          remainingHours
        );

        if (plannedHours > 0 && remainingHours > 0) {
          newTasks.push({
            id: generateId(),
            userId: 'user1',
            subjectId: subject.id,
            date: dateStr,
            plannedHours,
            status: 'pending',
            createdAt: new Date().toISOString(),
          });
          remainingHours -= plannedHours;
        }
      }
    }

    setTasks(newTasks);
    setAnalytics(calculateAnalytics(subjects, newTasks));
  };

  const getTodaysTasks = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return tasks.filter(t => t.date === today);
  };

  const getTasksForDate = (date: string) => {
    return tasks.filter(t => t.date === date);
  };

  return (
    <DataContext.Provider
      value={{
        subjects,
        tasks,
        analytics,
        isLoading,
        addSubject,
        updateSubject,
        deleteSubject,
        toggleTaskStatus,
        generatePlan,
        getTodaysTasks,
        getTasksForDate,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
