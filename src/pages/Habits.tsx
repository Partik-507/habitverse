import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useHabitStore } from '@/stores/habitStore';
import { RotateCcw, Plus, Filter, Edit, Trash2, MoreHorizontal, Flame, CheckCircle, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Habits() {
  const { habits, completeHabit, deleteHabit } = useHabitStore();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly'>('all');

  const today = new Date().toISOString().split('T')[0];
  
  const filteredHabits = habits.filter(habit => {
    if (filter === 'all') return true;
    // For now, treating all habits as daily since we don't have frequency in the store
    return filter === 'daily';
  });

  const handleComplete = (id: string, name: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit?.completedDates.includes(today)) {
      toast({
        title: "Already completed",
        description: `"${name}" is already completed for today`,
        variant: "destructive",
      });
      return;
    }
    completeHabit(id);
    toast({
      title: "Habit completed! 🔥",
      description: `Great job completing "${name}"`,
    });
  };

  const handleDelete = (id: string, name: string) => {
    deleteHabit(id);
    toast({
      title: "Habit deleted",
      description: `"${name}" has been removed`,
    });
  };

  const getStreakDays = (habit: any) => {
    if (habit.completedDates.length === 0) return 0;
    
    const dates = habit.completedDates.sort().reverse();
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (date.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getWeeklyProgress = (habit: any) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyCompletions = habit.completedDates.filter((date: string) => 
      new Date(date) >= oneWeekAgo
    ).length;
    
    return Math.min((weeklyCompletions / 7) * 100, 100);
  };

  const HabitCard = ({ habit }: { habit: any }) => {
    const isCompletedToday = habit.completedDates.includes(today);
    const streakDays = getStreakDays(habit);
    const weeklyProgress = getWeeklyProgress(habit);

    return (
      <Card className="bg-gradient-card shadow-habit-md border-0 hover:shadow-habit-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: habit.color }}
              />
              <div>
                <h3 className="font-semibold text-foreground">{habit.name}</h3>
                {habit.description && (
                  <p className="text-sm text-muted-foreground">{habit.description}</p>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDelete(habit.id, habit.name)}
                  className="text-habit-error focus:text-habit-error"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Progress Ring */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Weekly Progress</span>
              <span className="text-sm font-medium text-foreground">{Math.round(weeklyProgress)}%</span>
            </div>
            <Progress value={weeklyProgress} className="h-2" />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Flame className="h-4 w-4 text-habit-warning" />
                <span className="font-medium text-foreground">{streakDays}</span>
                <span className="text-sm text-muted-foreground">day streak</span>
              </div>
              
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Daily
              </Badge>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => handleComplete(habit.id, habit.name)}
            disabled={isCompletedToday}
            variant={isCompletedToday ? "outline" : "default"}
            className={`w-full ${
              isCompletedToday 
                ? "opacity-60" 
                : "bg-gradient-primary hover:opacity-90"
            }`}
          >
            {isCompletedToday ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Completed Today
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Done
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const todayCompleted = habits.filter(h => h.completedDates.includes(today)).length;
  const totalHabits = habits.length;
  const completionPercentage = totalHabits > 0 ? (todayCompleted / totalHabits) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Habits 🔁</h1>
          <p className="text-muted-foreground">Build consistency one day at a time</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {filter === 'all' ? 'All' : filter === 'daily' ? 'Daily' : 'Weekly'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilter('all')}>
              All Habits
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('daily')}>
              Daily Habits
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('weekly')}>
              Weekly Habits
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Today's Progress */}
      <Card className="bg-gradient-card shadow-habit-md border-0">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <RotateCcw className="h-5 w-5 text-habit-primary mr-2" />
            Today's Progress
          </CardTitle>
          <CardDescription>Your habit completion for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-sm font-medium text-foreground">
                  {todayCompleted}/{totalHabits} habits
                </span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">
                {Math.round(completionPercentage)}%
              </div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <RotateCcw className="h-8 w-8 text-habit-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{totalHabits}</div>
            <div className="text-sm text-muted-foreground">Active Habits</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <Flame className="h-8 w-8 text-habit-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {habits.length > 0 ? Math.max(...habits.map(h => getStreakDays(h))) : 0}
            </div>
            <div className="text-sm text-muted-foreground">Longest Streak</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 text-habit-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{todayCompleted}</div>
            <div className="text-sm text-muted-foreground">Done Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Habits Grid */}
      {filteredHabits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHabits.map(habit => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="bg-gradient-hero border-0 shadow-habit-md">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="text-6xl mb-4">🔁</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Habits Yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start building positive habits today. Use the "+ Add" button in the top bar to create your first habit.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Motivational Section */}
      {habits.length > 0 && (
        <Card className="bg-gradient-hero border-0 shadow-habit-md">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl mb-4">💪</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Keep Building Momentum!
            </h3>
            <p className="text-muted-foreground mb-4">
              {completionPercentage === 100 
                ? "Amazing! You've completed all your habits for today!"
                : `You're ${Math.round(completionPercentage)}% done with today's habits. Keep going!`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}