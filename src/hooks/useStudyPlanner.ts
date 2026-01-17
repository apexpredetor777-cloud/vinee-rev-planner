import { useState, useCallback } from 'react';
import { Subject, Task, Priority } from '@/types/study';
import { addDays, differenceInDays, isToday, startOfDay } from 'date-fns';

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialSubjects: Subject[] = [
  {
    id: '1',
    name: 'Mathematics',
    examDate: addDays(new Date(), 8),
    difficulty: 'hard',
    color: '#818cf8',
    totalTopics: 12,
    completedTopics: 5,
  },
  {
    id: '2',
    name: 'Physics',
    examDate: addDays(new Date(), 12),
    difficulty: 'medium',
    color: '#34d399',
    totalTopics: 10,
    completedTopics: 3,
  },
  {
    id: '3',
    name: 'Chemistry',
    examDate: addDays(new Date(), 18),
    difficulty: 'medium',
    color: '#f472b6',
    totalTopics: 8,
    completedTopics: 6,
  },
  {
    id: '4',
    name: 'History',
    examDate: addDays(new Date(), 25),
    difficulty: 'easy',
    color: '#fbbf24',
    totalTopics: 15,
    completedTopics: 10,
  },
];

const generateTasksForSubjects = (subjects: Subject[]): Task[] => {
  const tasks: Task[] = [];
  const today = startOfDay(new Date());

  subjects.forEach((subject) => {
    const daysUntilExam = differenceInDays(subject.examDate, today);
    const remainingTopics = subject.totalTopics - subject.completedTopics;
    
    // Determine priority based on days until exam and difficulty
    let priority: Priority = 'low';
    if (daysUntilExam <= 7) priority = 'urgent';
    else if (daysUntilExam <= 14) priority = 'medium';

    // Adjust for difficulty
    if (subject.difficulty === 'hard' && priority !== 'urgent') {
      priority = priority === 'low' ? 'medium' : 'urgent';
    }

    // Generate tasks for today
    const topicsPerDay = Math.max(1, Math.ceil(remainingTopics / Math.max(1, daysUntilExam)));
    
    for (let i = 0; i < Math.min(topicsPerDay, 2); i++) {
      tasks.push({
        id: generateId(),
        subjectId: subject.id,
        subjectName: subject.name,
        subjectColor: subject.color,
        title: `${subject.name} - Topic ${subject.completedTopics + i + 1}`,
        duration: subject.difficulty === 'hard' ? 45 : subject.difficulty === 'medium' ? 30 : 20,
        priority,
        completed: false,
        scheduledDate: today,
      });
    }
  });

  // Sort by priority
  const priorityOrder: Record<Priority, number> = { urgent: 0, medium: 1, low: 2 };
  return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
};

export const useStudyPlanner = () => {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [tasks, setTasks] = useState<Task[]>(() => generateTasksForSubjects(initialSubjects));

  const addSubject = useCallback((subjectData: Omit<Subject, 'id' | 'completedTopics'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: generateId(),
      completedTopics: 0,
    };
    
    setSubjects((prev) => {
      const updated = [...prev, newSubject];
      // Regenerate tasks with new subject
      setTasks(generateTasksForSubjects(updated));
      return updated;
    });
  }, []);

  const toggleTaskComplete = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const todaysTasks = tasks.filter((task) => isToday(task.scheduledDate));
  const completedToday = todaysTasks.filter((task) => task.completed).length;
  const totalMinutesToday = todaysTasks.reduce((acc, task) => acc + task.duration, 0);
  const completedMinutesToday = todaysTasks
    .filter((task) => task.completed)
    .reduce((acc, task) => acc + task.duration, 0);

  const overallProgress = subjects.length > 0
    ? Math.round(
        (subjects.reduce((acc, s) => acc + s.completedTopics, 0) /
          subjects.reduce((acc, s) => acc + s.totalTopics, 0)) *
          100
      )
    : 0;

  return {
    subjects,
    tasks: todaysTasks,
    addSubject,
    toggleTaskComplete,
    completedToday,
    totalTasksToday: todaysTasks.length,
    totalMinutesToday,
    completedMinutesToday,
    overallProgress,
  };
};
