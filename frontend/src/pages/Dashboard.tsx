import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Task,
  getMyTasks,
  getAssignedTasks,
  getUsers,
  createTask,
  updateTask,
  deleteTask,
  User,
  UpdateTaskData,
} from '@/lib/api';
import Header from '@/components/Header';
import KanbanColumn from '@/components/KanbanColumn';
import CreateTaskModal from '@/components/CreateTaskModal';
import EditTaskModal from '@/components/EditTaskModal';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListTodo, Clock, CheckCircle2, Loader2, User as UserIcon, Users } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'my-tasks' | 'assigned'>('my-tasks');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tasksData, usersData] = await Promise.all([
        viewMode === 'my-tasks' ? getMyTasks() : getAssignedTasks(),
        getUsers(),
      ]);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در دریافت اطلاعات',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, viewMode]);

  const handleCreateTask = async (data: { title: string; description: string; assigned_to: string[] }) => {
    try {
      await createTask(data);
      toast({
        title: 'موفق',
        description: 'تسک با موفقیت ایجاد شد.',
      });
      fetchData();
    } catch (error) {
      toast({
        title: 'خطا',
        description: error instanceof Error ? error.message : 'خطا در ایجاد تسک',
        variant: 'destructive',
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async (id: number, data: UpdateTaskData) => {
    try {
      await updateTask(id, data);
      toast({
        title: 'موفق',
        description: 'تسک با موفقیت به‌روزرسانی شد.',
      });
      fetchData();
    } catch (error) {
      toast({
        title: 'خطا',
        description: error instanceof Error ? error.message : 'خطا در به‌روزرسانی تسک',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete.id);
      toast({
        title: 'موفق',
        description: 'تسک با موفقیت حذف شد.',
      });
      setTaskToDelete(null);
      fetchData();
    } catch (error) {
      toast({
        title: 'خطا',
        description: error instanceof Error ? error.message : 'خطا در حذف تسک',
        variant: 'destructive',
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    const newProgress = newStatus === 'COMPLETED' ? 100 : newStatus === 'IN_PROGRESS' ? 50 : 0;

    try {
      await updateTask(draggedTask.id, {
        status: newStatus as Task['status'],
        progress: newProgress,
      });
      toast({
        title: 'موفق',
        description: 'وضعیت تسک تغییر کرد.',
      });
      fetchData();
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در تغییر وضعیت تسک',
        variant: 'destructive',
      });
    } finally {
      setDraggedTask(null);
    }
  };

  const todoTasks = tasks.filter((t) => t.status === 'TO_DO');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">داشبورد تسک‌ها</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {tasks.length} تسک در مجموع
            </p>
          </div>

          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="my-tasks" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <UserIcon className="w-4 h-4" />
                تسک‌های من
              </TabsTrigger>
              <TabsTrigger value="assigned" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="w-4 h-4" />
                اختصاص داده شده
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KanbanColumn
              title="انجام نشده"
              status="TO_DO"
              tasks={todoTasks}
              icon={<ListTodo className="w-5 h-5" />}
              onAddTask={() => setIsCreateModalOpen(true)}
              onEditTask={handleEditTask}
              onDeleteTask={(task) => setTaskToDelete(task)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
            <KanbanColumn
              title="در حال انجام"
              status="IN_PROGRESS"
              tasks={inProgressTasks}
              icon={<Clock className="w-5 h-5" />}
              onEditTask={handleEditTask}
              onDeleteTask={(task) => setTaskToDelete(task)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
            <KanbanColumn
              title="تکمیل شده"
              status="COMPLETED"
              tasks={completedTasks}
              icon={<CheckCircle2 className="w-5 h-5" />}
              onEditTask={handleEditTask}
              onDeleteTask={(task) => setTaskToDelete(task)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          </div>
        )}
      </main>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        users={users}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSubmit={handleUpdateTask}
      />

      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent className="glass-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>حذف تسک</AlertDialogTitle>
            <AlertDialogDescription>
              آیا مطمئن هستید که می‌خواهید "{taskToDelete?.title}" را حذف کنید؟
              این عمل قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-destructive hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
