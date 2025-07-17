import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useHabitStore } from '@/stores/habitStore';
import { Plus, CheckCircle, Clock, Target, Trophy, TrendingUp, Flame, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { 
    habits, 
    tasks, 
    goals, 
    settings,
    addHabit, 
    addTask, 
    completeHabit, 
    completeTask,
    getCompletionRate,
    getLongestStreak
  } = useHabitStore();
  const { toast } = useToast();
  const [habitDialogOpen, setHabitDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [habitForm, setHabitForm] = useState({ name: '', description: '', color: '#8B5CF6' });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'medium' as 'low' | 'medium' | 'high' });

  const today = new Date().toISOString().split('T')[0];
  const todayHabits = habits.filter(h => !h.completedDates.includes(today));
  const pendingTasks = tasks.filter(t => !t.completed);
  const completionRate = getCompletionRate();
  const longestStreak = getLongestStreak();

  const handleAddHabit = () => {
    if (!habitForm.name.trim()) return;
    addHabit({
      name: habitForm.name,
      description: habitForm.description,
      color: habitForm.color,
    });
    toast({
      title: "Habit created! 🎉",
      description: `"${habitForm.name}" has been added to your habits`,
    });
    setHabitForm({ name: '', description: '', color: '#8B5CF6' });
    setHabitDialogOpen(false);
  };

  const handleAddTask = () => {
    if (!taskForm.title.trim()) return;
    addTask({
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
    });
    toast({
      title: "Task created! ✅",
      description: `"${taskForm.title}" has been added to your tasks`,
    });
    setTaskForm({ title: '', description: '', priority: 'medium' });
    setTaskDialogOpen(false);
  };

  const handleCompleteHabit = (id: string, name: string) => {
    completeHabit(id);
    toast({
      title: "Habit completed! 🔥",
      description: `Great job completing "${name}"`,
    });
  };

  const handleCompleteTask = (id: string, title: string) => {
    completeTask(id);
    toast({
      title: "Task completed! ✨",
      description: `"${title}" has been marked as done`,
    });
  };

  const QuickStatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card className="bg-gradient-card shadow-habit-md border-0">
      <CardContent className="pt-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${color} mr-4`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Welcome back, {settings.userName}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to build some amazing habits today?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <QuickStatCard
          title="Today's Progress"
          value={`${Math.round(completionRate)}%`}
          icon={Target}
          color="bg-habit-primary"
        />
        <QuickStatCard
          title="Longest Streak"
          value={`${longestStreak} days`}
          icon={Flame}
          color="bg-habit-warning"
        />
        <QuickStatCard
          title="Active Goals"
          value={goals.filter(g => g.status === 'in-progress').length}
          icon={Trophy}
          color="bg-habit-success"
        />
        <QuickStatCard
          title="Pending Tasks"
          value={pendingTasks.length}
          icon={Clock}
          color="bg-habit-secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Habits */}
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Today's Habits</CardTitle>
              <CardDescription>Keep your streak alive</CardDescription>
            </div>
            <Dialog open={habitDialogOpen} onOpenChange={setHabitDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Habit</DialogTitle>
                  <DialogDescription>Start building a positive habit today</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="habit-name">Habit Name</Label>
                    <Input
                      id="habit-name"
                      value={habitForm.name}
                      onChange={(e) => setHabitForm({...habitForm, name: e.target.value})}
                      placeholder="e.g., Morning meditation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="habit-description">Description (optional)</Label>
                    <Input
                      id="habit-description"
                      value={habitForm.description}
                      onChange={(e) => setHabitForm({...habitForm, description: e.target.value})}
                      placeholder="Brief description..."
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setHabitDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddHabit}>Create Habit</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayHabits.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                🎉 All habits completed for today!
              </p>
            ) : (
              todayHabits.slice(0, 5).map(habit => (
                <div key={habit.id} className="flex items-center justify-between p-3 bg-gradient-hero rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div>
                      <p className="font-medium text-foreground">{habit.name}</p>
                      {habit.description && (
                        <p className="text-xs text-muted-foreground">{habit.description}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCompleteHabit(habit.id, habit.name)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Pending Tasks</CardTitle>
              <CardDescription>Stay productive and focused</CardDescription>
            </div>
            <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>Add something to your to-do list</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input
                      id="task-title"
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                      placeholder="e.g., Finish project report"
                    />
                  </div>
                  <div>
                    <Label htmlFor="task-description">Description (optional)</Label>
                    <Input
                      id="task-description"
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                      placeholder="Additional details..."
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddTask}>Create Task</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                ✨ No pending tasks. Great job!
              </p>
            ) : (
              pendingTasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gradient-hero rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground">{task.description}</p>
                    )}
                    <Badge 
                      variant="outline" 
                      className={`mt-1 text-xs ${
                        task.priority === 'high' ? 'border-habit-error text-habit-error' :
                        task.priority === 'medium' ? 'border-habit-warning text-habit-warning' :
                        'border-muted-foreground text-muted-foreground'
                      }`}
                    >
                      {task.priority} priority
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCompleteTask(task.id, task.title)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Motivational Section */}
      <Card className="bg-gradient-hero border-0 shadow-habit-md">
        <CardContent className="pt-6 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            You're doing amazing!
          </h3>
          <p className="text-muted-foreground mb-4">
            Every small step counts towards building the life you want. Keep going!
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" asChild>
              <a href="/analytics">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/achievements">
                <Trophy className="h-4 w-4 mr-2" />
                Check Achievements
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
