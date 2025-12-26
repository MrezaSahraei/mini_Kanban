import React from 'react';
import { Task } from '@/lib/api';
import TaskCard from './TaskCard';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  title: string;
  status: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED';
  tasks: Task[];
  icon: React.ReactNode;
  onAddTask?: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, status: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  tasks,
  icon,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const getColumnClass = () => {
    switch (status) {
      case 'TO_DO':
        return 'column-todo';
      case 'IN_PROGRESS':
        return 'column-inprogress';
      case 'COMPLETED':
        return 'column-completed';
      default:
        return '';
    }
  };

  const getHeaderColor = () => {
    switch (status) {
      case 'TO_DO':
        return 'text-todo';
      case 'IN_PROGRESS':
        return 'text-inprogress';
      case 'COMPLETED':
        return 'text-completed';
      default:
        return 'text-foreground';
    }
  };

  const getCountBg = () => {
    switch (status) {
      case 'TO_DO':
        return 'bg-todo/20 text-todo';
      case 'IN_PROGRESS':
        return 'bg-inprogress/20 text-inprogress';
      case 'COMPLETED':
        return 'bg-completed/20 text-completed';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div
      className={cn(
        'glass-card rounded-xl flex flex-col h-full min-h-[500px]',
        getColumnClass()
      )}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, status)}
    >
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={cn('p-2 rounded-lg bg-secondary', getHeaderColor())}>
              {icon}
            </span>
            <h2 className={cn('font-bold text-lg', getHeaderColor())}>{title}</h2>
            <span className={cn('px-2.5 py-1 rounded-full text-sm font-semibold', getCountBg())}>
              {tasks.length}
            </span>
          </div>
          {status === 'TO_DO' && onAddTask && (
            <button
              onClick={onAddTask}
              className="p-2 rounded-lg bg-todo/20 text-todo hover:bg-todo/30 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <p className="text-sm">تسکی وجود ندارد</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart?.(e, task)}
            >
              <TaskCard
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
