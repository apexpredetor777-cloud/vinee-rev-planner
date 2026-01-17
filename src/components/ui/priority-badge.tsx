import { cn } from '@/lib/utils';
import { Priority } from '@/types/api';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const priorityConfig = {
  high: {
    bg: 'bg-urgent/10',
    text: 'text-urgent',
    label: 'High Priority',
  },
  medium: {
    bg: 'bg-medium/10',
    text: 'text-medium',
    label: 'Medium',
  },
  low: {
    bg: 'bg-low/10',
    text: 'text-low',
    label: 'On Track',
  },
};

export const PriorityBadge = ({ priority, className }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      {config.label}
    </span>
  );
};
