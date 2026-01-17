import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  CalendarDays,
  Clock,
  Play,
  Loader2,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { format, parseISO, addDays, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getPriority } from '@/types/api';

const Planner = () => {
  const { subjects, tasks, generatePlan, getTasksForDate, toggleTaskStatus } = useData();
  const [availableHours, setAvailableHours] = useState('4');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleGeneratePlan = async () => {
    if (subjects.length === 0) {
      toast.error('Please add subjects first');
      return;
    }

    if (!availableHours || parseFloat(availableHours) <= 0) {
      toast.error('Please enter valid study hours');
      return;
    }

    setIsGenerating(true);
    try {
      await generatePlan({
        availableHoursPerDay: parseFloat(availableHours),
        startDate,
      });
      toast.success('Study plan generated successfully!');
    } catch (error) {
      toast.error('Failed to generate plan');
    } finally {
      setIsGenerating(false);
    }
  };

  // Get unique dates from tasks
  const taskDates = [...new Set(tasks.map(t => t.date))].sort();
  
  // Generate calendar week view
  const getWeekDates = () => {
    const dates = [];
    const start = startOfDay(selectedDate);
    for (let i = -3; i <= 3; i++) {
      dates.push(addDays(start, i));
    }
    return dates;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const selectedDateTasks = getTasksForDate(format(selectedDate, 'yyyy-MM-dd'));
  const totalPlannedHours = selectedDateTasks.reduce((sum, t) => sum + t.plannedHours, 0);
  const completedHours = selectedDateTasks
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.plannedHours, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Study Planner
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate and manage your personalized study schedule
        </p>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generator">Generate Plan</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="today">Today's Focus</TabsTrigger>
        </TabsList>

        {/* Plan Generator Tab */}
        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Generate Study Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hours" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Available Study Hours per Day
                  </Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0.5"
                    max="12"
                    step="0.5"
                    value={availableHours}
                    onChange={(e) => setAvailableHours(e.target.value)}
                    placeholder="e.g., 4"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 3-6 hours for optimal retention
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
              </div>

              {subjects.length === 0 ? (
                <div className="bg-secondary/50 rounded-lg p-4 text-center">
                  <p className="text-muted-foreground">
                    No subjects added yet. Please add subjects first to generate a study plan.
                  </p>
                </div>
              ) : (
                <div className="bg-secondary/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Subjects included ({subjects.length}):</h4>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => (
                      <Badge key={subject.id} variant="secondary">
                        {subject.name} • {format(parseISO(subject.examDate), 'MMM d')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleGeneratePlan}
                disabled={isGenerating || subjects.length === 0}
                className="w-full sm:w-auto gradient-primary text-primary-foreground"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Generate Study Plan
                  </>
                )}
              </Button>

              <div className="text-sm text-muted-foreground bg-primary/5 p-4 rounded-lg">
                <strong className="text-foreground">How it works:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Subjects closer to exam dates get more study time</li>
                  <li>Harder subjects are prioritized with additional hours</li>
                  <li>Weak areas marked on subjects receive extra focus</li>
                  <li>Your available hours are distributed optimally across subjects</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar View Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Weekly Schedule</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Week Navigation */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {getWeekDates().map((date) => {
                  const dateTasks = getTasksForDate(format(date, 'yyyy-MM-dd'));
                  const hasTask = dateTasks.length > 0;
                  const allCompleted = dateTasks.length > 0 && dateTasks.every(t => t.status === 'completed');
                  
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "flex flex-col items-center p-2 rounded-lg transition-all",
                        isSameDay(date, selectedDate)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary",
                        isToday(date) && !isSameDay(date, selectedDate) && "ring-2 ring-primary/50"
                      )}
                    >
                      <span className="text-xs uppercase">
                        {format(date, 'EEE')}
                      </span>
                      <span className="text-lg font-semibold">
                        {format(date, 'd')}
                      </span>
                      {hasTask && (
                        <span className={cn(
                          "w-2 h-2 rounded-full mt-1",
                          allCompleted ? "bg-low" : "bg-primary"
                        )} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Date Tasks */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-semibold">
                    {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMMM d')}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {completedHours}h / {totalPlannedHours}h completed
                  </span>
                </div>

                {selectedDateTasks.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateTasks.map((task) => {
                      const subject = subjects.find(s => s.id === task.subjectId);
                      const priority = subject ? getPriority(subject.examDate, 50) : 'medium';
                      
                      return (
                        <div
                          key={task.id}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-lg border transition-all",
                            task.status === 'completed'
                              ? "bg-secondary/50 border-border opacity-70"
                              : "bg-card border-border hover:border-primary/50"
                          )}
                        >
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                            className="flex-shrink-0"
                          >
                            {task.status === 'completed' ? (
                              <CheckCircle2 className="h-6 w-6 text-low" />
                            ) : (
                              <Circle className="h-6 w-6 text-muted-foreground hover:text-primary" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "font-medium",
                              task.status === 'completed' && "line-through text-muted-foreground"
                            )}>
                              {subject?.name || 'Unknown Subject'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {task.plannedHours} hour{task.plannedHours !== 1 ? 's' : ''} of study
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              priority === 'high' && "border-urgent text-urgent",
                              priority === 'medium' && "border-medium text-medium",
                              priority === 'low' && "border-low text-low"
                            )}
                          >
                            {priority}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No tasks scheduled for this day</p>
                    {isBefore(selectedDate, new Date()) && (
                      <p className="text-sm mt-1">This date has passed</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Today's Focus Tab */}
        <TabsContent value="today" className="space-y-6">
          <TodayView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Separate Today View Component
const TodayView = () => {
  const { subjects, getTodaysTasks, toggleTaskStatus } = useData();
  const todaysTasks = getTodaysTasks();
  
  const totalHours = todaysTasks.reduce((sum, t) => sum + t.plannedHours, 0);
  const completedHours = todaysTasks
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.plannedHours, 0);
  const progress = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Today's Focus
          </CardTitle>
          <div className="text-right">
            <span className="text-2xl font-bold text-foreground">{progress}%</span>
            <p className="text-sm text-muted-foreground">
              {completedHours}h / {totalHours}h completed
            </p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        {todaysTasks.length > 0 ? (
          <div className="space-y-4">
            {todaysTasks.map((task, index) => {
              const subject = subjects.find(s => s.id === task.subjectId);
              const priority = subject ? getPriority(subject.examDate, 50) : 'medium';
              
              return (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 transition-all animate-slide-up",
                    task.status === 'completed'
                      ? "bg-low/5 border-low/30"
                      : "bg-card border-border hover:border-primary/50"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="flex-shrink-0 group"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="h-8 w-8 text-low" />
                    ) : (
                      <Circle className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={cn(
                      "font-heading font-semibold text-lg",
                      task.status === 'completed' && "line-through text-muted-foreground"
                    )}>
                      {subject?.name || 'Unknown Subject'}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {task.plannedHours} hour{task.plannedHours !== 1 ? 's' : ''}
                      </span>
                      {subject?.weakAreas && subject.weakAreas.length > 0 && (
                        <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                          Focus: {subject.weakAreas[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Badge
                    className={cn(
                      "text-xs px-3 py-1",
                      priority === 'high' && "bg-urgent/10 text-urgent border-urgent/30",
                      priority === 'medium' && "bg-medium/10 text-medium border-medium/30",
                      priority === 'low' && "bg-low/10 text-low border-low/30"
                    )}
                    variant="outline"
                  >
                    {priority === 'high' ? 'Urgent' : priority === 'medium' ? 'Medium' : 'On Track'}
                  </Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle2 className="h-16 w-16 text-low mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground">
              No tasks scheduled for today. Generate a new plan or enjoy your break!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Planner;
