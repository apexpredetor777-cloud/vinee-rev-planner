import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import StatsCard from '@/components/StatsCard';
import ProgressRing from '@/components/ProgressRing';
import { cn } from '@/lib/utils';
import { PriorityBadge } from '@/components/ui/priority-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  CalendarDays,
  Target,
  TrendingUp,
  Flame,
  ArrowRight,
  AlertTriangle,
  Quote,
  CheckCircle2,
} from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { getRandomQuote } from '@/services/mockData';
import { getPriority } from '@/types/api';
import { useMemo } from 'react';

const Dashboard = () => {
  const { user } = useAuth();
  const { subjects, analytics, getTodaysTasks, toggleTaskStatus } = useData();

  const todaysTasks = getTodaysTasks();
  const completedToday = todaysTasks.filter(t => t.status === 'completed').length;
  const todayProgress = todaysTasks.length > 0 
    ? Math.round((completedToday / todaysTasks.length) * 100) 
    : 0;

  const nearestExam = useMemo(() => {
    if (subjects.length === 0) return null;
    return subjects.reduce((nearest, s) => {
      const daysLeft = differenceInDays(parseISO(s.examDate), new Date());
      if (daysLeft < 0) return nearest;
      if (!nearest) return { subject: s, daysLeft };
      return daysLeft < nearest.daysLeft ? { subject: s, daysLeft } : nearest;
    }, null as { subject: typeof subjects[0]; daysLeft: number } | null);
  }, [subjects]);

  const quote = useMemo(() => getRandomQuote(), []);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Good {getTimeOfDay()}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM d, yyyy')} · {todaysTasks.length - completedToday} tasks remaining
          </p>
        </div>
        <div className="flex items-center gap-6">
          <ProgressRing 
            progress={todayProgress} 
            size={100} 
            strokeWidth={8}
            color={todayProgress >= 80 ? 'low' : todayProgress >= 50 ? 'medium' : 'urgent'}
          />
        </div>
      </section>

      {/* Motivational Quote */}
      <Card className="border-border bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="flex items-center gap-4 py-4">
          <Quote className="h-8 w-8 text-primary/50 flex-shrink-0" />
          <p className="text-muted-foreground italic">{quote}</p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Tasks"
          value={`${completedToday}/${todaysTasks.length}`}
          subtitle="tasks completed"
          icon={Target}
        />
        <StatsCard
          title="Active Subjects"
          value={subjects.length}
          subtitle="in your plan"
          icon={BookOpen}
        />
        <StatsCard
          title="Days to Exam"
          value={nearestExam?.daysLeft ?? '-'}
          subtitle={nearestExam ? nearestExam.subject.name : 'No upcoming exams'}
          icon={CalendarDays}
        />
        <StatsCard
          title="Study Streak"
          value={`${analytics?.streakDays ?? 0} days`}
          subtitle="Keep it up!"
          icon={Flame}
        />
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/subjects">
          <Card className="group border-border hover:border-primary/50 hover:shadow-glow transition-all cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold">Manage Subjects</h3>
                <p className="text-sm text-muted-foreground">Add or edit your subjects</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/planner">
          <Card className="group border-border hover:border-primary/50 hover:shadow-glow transition-all cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold">Generate Plan</h3>
                <p className="text-sm text-muted-foreground">Create your study schedule</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/analytics">
          <Card className="group border-border hover:border-primary/50 hover:shadow-glow transition-all cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold">View Analytics</h3>
                <p className="text-sm text-muted-foreground">Track your progress</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Tasks */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Today's Tasks
            </h2>
            <Link to="/planner">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {todaysTasks.length > 0 ? (
              todaysTasks.slice(0, 5).map((task, index) => {
                const subject = subjects.find(s => s.id === task.subjectId);
                return (
                  <div 
                    key={task.id} 
                    className="animate-slide-up opacity-0 flex items-center gap-4 p-4 rounded-lg border bg-card border-border hover:border-primary/50 transition-all" 
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                        task.status === 'completed' ? "border-low bg-low" : "border-muted-foreground/30 hover:border-primary"
                      )}
                    >
                      {task.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-background" />}
                    </button>
                    <div className="flex-1">
                      <p className={cn("font-medium", task.status === 'completed' && "line-through text-muted-foreground")}>
                        {subject?.name} - {task.plannedHours}h study
                      </p>
                    </div>
                    <PriorityBadge priority={subject ? getPriority(subject.examDate, 50) : 'medium'} />
                  </div>
                );
              })
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <CalendarDays className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No tasks for today</p>
                  <Link to="/planner" className="mt-4">
                    <Button size="sm" className="gradient-primary text-primary-foreground">
                      Generate Study Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* At Risk Subjects */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-urgent" />
            <h2 className="font-heading text-xl font-semibold text-foreground">
              At Risk
            </h2>
          </div>
          
          <div className="space-y-3">
            {analytics?.atRiskSubjects && analytics.atRiskSubjects.length > 0 ? (
              analytics.atRiskSubjects.map((subject, index) => (
                <Card key={subject.subjectId} className="border-urgent/30 bg-urgent/5">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{subject.subjectName}</h3>
                      <PriorityBadge priority="high" />
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{subject.daysLeft} days left</span>
                      <span>{subject.completionPercentage}% done</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-urgent transition-all"
                        style={{ width: `${subject.completionPercentage}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-low/30 bg-low/5">
                <CardContent className="py-6 text-center">
                  <p className="text-low font-medium">All subjects on track! 🎉</p>
                  <p className="text-sm text-muted-foreground mt-1">Keep up the great work</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
