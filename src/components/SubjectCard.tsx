import { Subject } from "@/types/study";
import { cn } from "@/lib/utils";
import { Calendar, BookOpen } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface SubjectCardProps {
  subject: Subject;
  className?: string;
}

const SubjectCard = ({ subject, className }: SubjectCardProps) => {
  const progress = Math.round((subject.completedTopics / subject.totalTopics) * 100);
  const daysUntilExam = differenceInDays(subject.examDate, new Date());
  
  const getUrgencyClass = () => {
    if (daysUntilExam <= 7) return 'border-urgent/50 shadow-[0_0_20px_-5px_hsl(var(--urgent)/0.3)]';
    if (daysUntilExam <= 14) return 'border-medium/50';
    return 'border-border';
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-glow",
        getUrgencyClass(),
        className
      )}
    >
      {/* Color accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-1 transition-all duration-300 group-hover:w-1.5"
        style={{ backgroundColor: subject.color }}
      />
      
      <div className="pl-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {subject.name}
            </h3>
            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(subject.examDate, 'MMM d')}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {subject.completedTopics}/{subject.totalTopics} topics
              </span>
            </div>
          </div>
          
          {/* Mini progress ring */}
          <div className="relative h-12 w-12">
            <svg className="h-12 w-12 -rotate-90 transform">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-secondary"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (progress / 100) * 125.6}
                className="text-primary transition-all duration-500"
                style={{ stroke: subject.color }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
              {progress}%
            </span>
          </div>
        </div>

        {/* Days remaining badge */}
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              daysUntilExam <= 7
                ? "bg-urgent/10 text-urgent"
                : daysUntilExam <= 14
                ? "bg-medium/10 text-medium"
                : "bg-low/10 text-low"
            )}
          >
            {daysUntilExam <= 0 ? 'Exam today!' : `${daysUntilExam} days left`}
          </span>
          <span className="text-xs text-muted-foreground capitalize">
            {subject.difficulty} difficulty
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
