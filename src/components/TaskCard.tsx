import { Task } from "@/types/study";
import { cn } from "@/lib/utils";
import { Check, Clock } from "lucide-react";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  className?: string;
  animationDelay?: number;
}

const priorityConfig = {
  urgent: {
    bg: 'bg-urgent/10',
    border: 'border-urgent/30',
    text: 'text-urgent',
    dot: 'bg-urgent',
    glow: 'shadow-[0_0_15px_-3px_hsl(var(--urgent)/0.5)]',
  },
  medium: {
    bg: 'bg-medium/10',
    border: 'border-medium/30',
    text: 'text-medium',
    dot: 'bg-medium',
    glow: '',
  },
  low: {
    bg: 'bg-low/10',
    border: 'border-low/30',
    text: 'text-low',
    dot: 'bg-low',
    glow: '',
  },
};

const TaskCard = ({ task, onToggleComplete, className, animationDelay = 0 }: TaskCardProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const config = priorityConfig[task.priority];

  const handleToggle = () => {
    setIsChecking(true);
    setTimeout(() => {
      onToggleComplete(task.id);
      setIsChecking(false);
    }, 300);
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 rounded-xl border bg-card p-4 transition-all duration-300",
        task.completed 
          ? "border-border opacity-60" 
          : cn(config.border, config.glow, "hover:border-primary/50"),
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={cn(
          "relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
          task.completed
            ? "border-low bg-low"
            : cn("border-muted-foreground/30 hover:border-primary", config.border)
        )}
      >
        {(task.completed || isChecking) && (
          <Check 
            className={cn(
              "h-3.5 w-3.5 text-background",
              isChecking && "animate-check-bounce"
            )} 
          />
        )}
      </button>

      {/* Task content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: task.subjectColor }}
          />
          <span className="text-xs text-muted-foreground truncate">
            {task.subjectName}
          </span>
        </div>
        <p
          className={cn(
            "mt-1 font-medium transition-all",
            task.completed && "text-muted-foreground line-through"
          )}
        >
          {task.title}
        </p>
      </div>

      {/* Duration & Priority */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {task.duration}m
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
            config.bg,
            config.text
          )}
        >
          {task.priority}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
