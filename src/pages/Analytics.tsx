import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PriorityBadge } from '@/components/ui/priority-badge';
import ProgressRing from '@/components/ProgressRing';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  Flame,
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const Analytics = () => {
  const { subjects, analytics, tasks } = useData();

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  const overallProgress = analytics.totalTasks > 0
    ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100)
    : 0;

  // Chart data
  const subjectChartData = analytics.completionPerSubject.map(item => ({
    name: item.subjectName.length > 10 
      ? item.subjectName.substring(0, 10) + '...' 
      : item.subjectName,
    completed: item.completed,
    remaining: item.total - item.completed,
    percentage: item.percentage,
  }));

  const pieData = [
    { name: 'Completed', value: analytics.completedTasks, color: 'hsl(142, 76%, 45%)' },
    { name: 'Remaining', value: analytics.totalTasks - analytics.completedTasks, color: 'hsl(222, 30%, 25%)' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your study progress and identify areas for improvement
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-heading font-bold">{analytics.totalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-low/10">
                <CheckCircle2 className="h-6 w-6 text-low" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-heading font-bold">{analytics.completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-urgent/10">
                <Clock className="h-6 w-6 text-urgent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-heading font-bold">
                  {analytics.totalTasks - analytics.completedTasks}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-medium/10">
                <Flame className="h-6 w-6 text-medium" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Study Streak</p>
                <p className="text-2xl font-heading font-bold">{analytics.streakDays} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Progress */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-primary" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ProgressRing
              progress={overallProgress}
              size={160}
              strokeWidth={12}
              color={overallProgress >= 70 ? 'low' : overallProgress >= 40 ? 'medium' : 'urgent'}
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {analytics.completedTasks} of {analytics.totalTasks} tasks done
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Task Distribution Pie Chart */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-5 w-5 text-primary" />
              Task Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 9%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Progress Chart */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-5 w-5 text-primary" />
            Progress by Subject
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis type="number" stroke="hsl(215, 20%, 55%)" />
                <YAxis dataKey="name" type="category" width={100} stroke="hsl(215, 20%, 55%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 9%)',
                    border: '1px solid hsl(222, 30%, 18%)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="completed" stackId="a" fill="hsl(142, 76%, 45%)" name="Completed" radius={[0, 0, 0, 0]} />
                <Bar dataKey="remaining" stackId="a" fill="hsl(222, 30%, 25%)" name="Remaining" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Subject Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion by Subject */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Completion by Subject</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.completionPerSubject.map((item) => (
              <div key={item.subjectId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.subjectName}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.completed}/{item.total} ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500 rounded-full",
                      item.percentage >= 70 ? "bg-low" : item.percentage >= 40 ? "bg-medium" : "bg-urgent"
                    )}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* At Risk Subjects */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-urgent" />
              At Risk Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.atRiskSubjects.length > 0 ? (
              <div className="space-y-4">
                {analytics.atRiskSubjects.map((subject) => (
                  <div
                    key={subject.subjectId}
                    className="p-4 rounded-lg bg-urgent/5 border border-urgent/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{subject.subjectName}</h4>
                      <PriorityBadge priority="high" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Exam Date</p>
                        <p className="font-medium">{format(parseISO(subject.examDate), 'MMM d, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Days Left</p>
                        <p className="font-medium text-urgent">{subject.daysLeft} days</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Completion</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-urgent"
                              style={{ width: `${subject.completionPercentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{subject.completionPercentage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-low mx-auto mb-3" />
                <p className="font-medium text-low">All subjects on track!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Great job keeping up with your study plan
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
