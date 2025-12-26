import React from 'react';
import { Task } from '@/lib/api';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, User, GripVertical, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, isDragging }) => {
  const getProgressColor = () => {
    if (task.status === 'COMPLETED') return 'bg-completed';
    if (task.status === 'IN_PROGRESS') return 'bg-inprogress';
    return 'bg-todo';
  };

  const getStatusGlow = () => {
    if (task.status === 'COMPLETED') return 'glow-completed';
    if (task.status === 'IN_PROGRESS') return 'glow-inprogress';
    return 'glow-todo';
  };

  return (
    <div
      className={cn(
        'task-card group animate-fade-in',
        isDragging && 'opacity-50 scale-105',
        getStatusGlow()
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          <h3 className="font-semibold text-foreground truncate">{task.title}</h3>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
            >
              <Edit className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task)}
              className="p-1.5 rounded-lg hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
        {task.description}
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">پیشرفت</span>
          <span className="font-medium text-foreground">{task.progress}%</span>
        </div>
        <Progress value={task.progress} className="h-2" indicatorClassName={getProgressColor()} />
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="w-3.5 h-3.5" />
          <span>{task.creator_name}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true, locale: faIR })}
          </span>
        </div>
      </div>

      {task.assigned_to.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {task.assigned_to.slice(0, 3).map((user) => (
            <Badge key={user} variant="secondary" className="text-xs px-2 py-0.5">
              {user}
            </Badge>
          ))}
          {task.assigned_to.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              +{task.assigned_to.length - 3}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
