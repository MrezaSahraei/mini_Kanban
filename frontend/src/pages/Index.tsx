import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ArrowLeft, CheckCircle2, Clock, ListTodo, Sparkles } from 'lucide-react';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-todo/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-inprogress/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-completed/10 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto pt-16 pb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-slide-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">مدیریت تسک‌ها به روش حرفه‌ای</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="gradient-text">کانبان بورد</span>
            <br />
            <span className="text-foreground">مدرن و هوشمند</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            تسک‌های خود را به سادگی مدیریت کنید. با قابلیت drag & drop،
            پیشرفت کارها را به صورت بصری دنبال کنید.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all group"
            >
              ورود به حساب
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/signup')}
              className="h-14 px-8 text-lg font-semibold border-border/50 hover:bg-secondary/50"
            >
              ساخت حساب جدید
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="glass-card rounded-2xl p-6 column-todo glow-todo animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="p-3 rounded-xl bg-todo/20 w-fit mb-4">
              <ListTodo className="w-6 h-6 text-todo" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-todo">انجام نشده</h3>
            <p className="text-muted-foreground text-sm">
              تسک‌های جدید را اضافه کنید و به راحتی مدیریت کنید.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 column-inprogress glow-inprogress animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="p-3 rounded-xl bg-inprogress/20 w-fit mb-4">
              <Clock className="w-6 h-6 text-inprogress" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-inprogress">در حال انجام</h3>
            <p className="text-muted-foreground text-sm">
              پیشرفت کارها را به صورت درصدی دنبال کنید.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 column-completed glow-completed animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="p-3 rounded-xl bg-completed/20 w-fit mb-4">
              <CheckCircle2 className="w-6 h-6 text-completed" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-completed">تکمیل شده</h3>
            <p className="text-muted-foreground text-sm">
              تسک‌های تکمیل شده را ببینید و موفقیت‌ها را جشن بگیرید.
            </p>
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mt-24">
          <div className="inline-flex items-center gap-3 opacity-50">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-muted-foreground">Kanban Board</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
