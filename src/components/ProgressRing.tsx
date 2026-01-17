import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'urgent' | 'medium' | 'low';
}

const colorMap = {
  primary: 'stroke-primary',
  urgent: 'stroke-urgent',
  medium: 'stroke-medium',
  low: 'stroke-low',
};

const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  showPercentage = true,
  color = 'primary',
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(colorMap[color], "transition-all duration-700 ease-out")}
          style={{
            filter: `drop-shadow(0 0 6px hsl(var(--${color})))`,
          }}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-heading font-bold text-foreground">
            {Math.round(progress)}%
          </span>
          <span className="text-xs text-muted-foreground">complete</span>
        </div>
      )}
    </div>
  );
};

export default ProgressRing;
