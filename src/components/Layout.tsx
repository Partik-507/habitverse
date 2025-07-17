import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHabitStore } from '@/stores/habitStore';
import { 
  Home, 
  CheckSquare,
  RotateCcw,
  Calendar,
  Bot,
  FileText,
  BarChart3, 
  Trophy, 
  Users, 
  Target, 
  Bell,
  Settings, 
  Wrench,
  Menu,
  X,
  Plus,
  Sun,
  Moon,
  User,
  Brain
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Habits', href: '/habits', icon: RotateCcw },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'AI Co-Pilot', href: '/ai-copilot', icon: Bot },
  { name: 'Second Brain', href: '/second-brain', icon: Brain },
  { name: 'Notes', href: '/notes', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
  { name: 'Squad', href: '/squad', icon: Users },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Utilities', href: '/utilities', icon: Wrench },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [addType, setAddType] = useState<'task' | 'habit'>('task');
  const location = useLocation();
  const { settings, updateSettings, addTask, addHabit } = useHabitStore();
  const { toast } = useToast();

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const [habitForm, setHabitForm] = useState({
    name: '',
    description: '',
    color: '#8B5CF6'
  });

  const handleAddTask = () => {
    if (!taskForm.title.trim()) return;
    addTask({
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
      dueDate: taskForm.dueDate
    });
    toast({
      title: "Task created! ✅",
      description: `"${taskForm.title}" has been added to your tasks`,
    });
    setTaskForm({ title: '', description: '', dueDate: '', priority: 'medium' });
    setQuickAddOpen(false);
  };

  const handleAddHabit = () => {
    if (!habitForm.name.trim()) return;
    addHabit({
      name: habitForm.name,
      description: habitForm.description,
      color: habitForm.color,
    });
    toast({
      title: "Habit created! 🔥",
      description: `"${habitForm.name}" has been added to your habits`,
    });
    setHabitForm({ name: '', description: '', color: '#8B5CF6' });
    setQuickAddOpen(false);
  };

  const toggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode });
    document.documentElement.classList.toggle('dark');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good Morning, ${settings.userName}! ☀️`;
    if (hour < 17) return `Good Afternoon, ${settings.userName}! 🌤️`;
    return `Good Evening, ${settings.userName}! 🌙`;
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Topbar */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl shadow-habit-sm border-b border-border">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold text-foreground">
                {getGreeting()}
              </h2>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <Dialog open={quickAddOpen} onOpenChange={setQuickAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Quick Add</DialogTitle>
                  <DialogDescription>Create a new task or habit</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Button
                      variant={addType === 'task' ? 'default' : 'outline'}
                      onClick={() => setAddType('task')}
                      className="flex-1"
                    >
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Task
                    </Button>
                    <Button
                      variant={addType === 'habit' ? 'default' : 'outline'}
                      onClick={() => setAddType('habit')}
                      className="flex-1"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Habit
                    </Button>
                  </div>

                  {addType === 'task' ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="task-title">Task Title</Label>
                        <Input
                          id="task-title"
                          value={taskForm.title}
                          onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                          placeholder="e.g., Finish project report"
                        />
                      </div>
                      <div>
                        <Label htmlFor="task-description">Description (optional)</Label>
                        <Textarea
                          id="task-description"
                          value={taskForm.description}
                          onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                          placeholder="Additional details..."
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="task-due">Due Date</Label>
                          <Input
                            id="task-due"
                            type="date"
                            value={taskForm.dueDate}
                            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="task-priority">Priority</Label>
                          <Select value={taskForm.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setTaskForm({ ...taskForm, priority: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setQuickAddOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddTask}>Create Task</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="habit-name">Habit Name</Label>
                        <Input
                          id="habit-name"
                          value={habitForm.name}
                          onChange={(e) => setHabitForm({ ...habitForm, name: e.target.value })}
                          placeholder="e.g., Morning meditation"
                        />
                      </div>
                      <div>
                        <Label htmlFor="habit-description">Description (optional)</Label>
                        <Textarea
                          id="habit-description"
                          value={habitForm.description}
                          onChange={(e) => setHabitForm({ ...habitForm, description: e.target.value })}
                          placeholder="Brief description..."
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setQuickAddOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddHabit}>Create Habit</Button>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2"
            >
              {settings.darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button variant="ghost" size="sm" className="p-2">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card/95 backdrop-blur-xl shadow-habit-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )} style={{ top: '64px' }}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 px-6 border-b border-border">
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                HabitVerse
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gradient-primary text-white shadow-habit-glow"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Build better habits, one day at a time ✨
              </p>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}