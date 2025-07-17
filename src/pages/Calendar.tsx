import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useHabitStore } from '@/stores/habitStore';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle, RotateCcw, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Calendar() {
  const { habits, tasks } = useHabitStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(year, month + (direction === 'next' ? 1 : -1), 1));
  };

  const getDateString = (day: number) => {
    return new Date(year, month, day).toISOString().split('T')[0];
  };

  const getDateActivities = (dateString: string) => {
    const completedHabits = habits.filter(habit => 
      habit.completedDates.includes(dateString)
    );
    
    const completedTasks = tasks.filter(task => 
      task.completed && task.completedAt && 
      task.completedAt.split('T')[0] === dateString
    );

    const dueTasks = tasks.filter(task => 
      !task.completed && task.dueDate === dateString
    );

    return { completedHabits, completedTasks, dueTasks };
  };

  const getDayIndicators = (day: number) => {
    const dateString = getDateString(day);
    const { completedHabits, completedTasks, dueTasks } = getDateActivities(dateString);
    
    const indicators = [];
    
    if (completedHabits.length > 0) {
      indicators.push(
        <div key="habits" className="w-2 h-2 bg-habit-primary rounded-full" />
      );
    }
    
    if (completedTasks.length > 0) {
      indicators.push(
        <div key="tasks" className="w-2 h-2 bg-habit-success rounded-full" />
      );
    }
    
    if (dueTasks.length > 0) {
      indicators.push(
        <div key="due" className="w-2 h-2 bg-habit-warning rounded-full" />
      );
    }

    return indicators;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return year === today.getFullYear() && 
           month === today.getMonth() && 
           day === today.getDate();
  };

  const handleDayClick = (day: number) => {
    setSelectedDate(getDateString(day));
  };

  const selectedDateActivities = selectedDate ? getDateActivities(selectedDate) : null;

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(
      <div key={`empty-${i}`} className="h-12 lg:h-16" />
    );
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const indicators = getDayIndicators(day);
    const today = isToday(day);
    
    calendarDays.push(
      <button
        key={day}
        onClick={() => handleDayClick(day)}
        className={`
          h-12 lg:h-16 p-1 rounded-lg border transition-all duration-200 hover:shadow-habit-md
          ${today 
            ? 'bg-gradient-primary text-white border-transparent shadow-habit-glow' 
            : 'bg-card hover:bg-secondary/50 border-border'
          }
        `}
      >
        <div className="flex flex-col h-full">
          <span className={`text-sm font-medium ${today ? 'text-white' : 'text-foreground'}`}>
            {day}
          </span>
          <div className="flex justify-center space-x-1 mt-1">
            {indicators.slice(0, 3)}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar 📅</h1>
          <p className="text-muted-foreground">Track your habits and tasks over time</p>
        </div>
      </div>

      {/* Legend */}
      <Card className="bg-gradient-card shadow-habit-md border-0">
        <CardContent className="p-4">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-habit-primary rounded-full" />
              <span className="text-muted-foreground">Completed Habits</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-habit-success rounded-full" />
              <span className="text-muted-foreground">Completed Tasks</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-habit-warning rounded-full" />
              <span className="text-muted-foreground">Due Tasks</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card className="bg-gradient-card shadow-habit-md border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-foreground">
              {monthNames[month]} {year}
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <RotateCcw className="h-8 w-8 text-habit-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {habits.reduce((total, habit) => 
                total + habit.completedDates.filter(date => 
                  new Date(date).getMonth() === month && 
                  new Date(date).getFullYear() === year
                ).length, 0
              )}
            </div>
            <div className="text-sm text-muted-foreground">Habits This Month</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 text-habit-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {tasks.filter(task => 
                task.completed && task.completedAt && 
                new Date(task.completedAt).getMonth() === month && 
                new Date(task.completedAt).getFullYear() === year
              ).length}
            </div>
            <div className="text-sm text-muted-foreground">Tasks This Month</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <CalendarIcon className="h-8 w-8 text-habit-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {new Set([
                ...habits.flatMap(h => h.completedDates.filter(date => 
                  new Date(date).getMonth() === month && 
                  new Date(date).getFullYear() === year
                )),
                ...tasks.filter(task => 
                  task.completed && task.completedAt && 
                  new Date(task.completedAt).getMonth() === month && 
                  new Date(task.completedAt).getFullYear() === year
                ).map(task => task.completedAt!.split('T')[0])
              ]).size}
            </div>
            <div className="text-sm text-muted-foreground">Active Days</div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Modal */}
      {selectedDate && selectedDateActivities && (
        <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </DialogTitle>
              <DialogDescription>
                Activities for this day
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Completed Habits */}
              {selectedDateActivities.completedHabits.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center">
                    <RotateCcw className="h-4 w-4 text-habit-primary mr-2" />
                    Completed Habits ({selectedDateActivities.completedHabits.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedDateActivities.completedHabits.map(habit => (
                      <div key={habit.id} className="flex items-center space-x-2 p-2 bg-gradient-hero rounded-lg">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: habit.color }}
                        />
                        <span className="text-sm text-foreground">{habit.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Tasks */}
              {selectedDateActivities.completedTasks.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 text-habit-success mr-2" />
                    Completed Tasks ({selectedDateActivities.completedTasks.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedDateActivities.completedTasks.map(task => (
                      <div key={task.id} className="flex items-center space-x-2 p-2 bg-gradient-hero rounded-lg">
                        <CheckCircle className="h-3 w-3 text-habit-success" />
                        <span className="text-sm text-foreground">{task.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Due Tasks */}
              {selectedDateActivities.dueTasks.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center">
                    <Clock className="h-4 w-4 text-habit-warning mr-2" />
                    Due Tasks ({selectedDateActivities.dueTasks.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedDateActivities.dueTasks.map(task => (
                      <div key={task.id} className="flex items-center space-x-2 p-2 bg-gradient-hero rounded-lg">
                        <Clock className="h-3 w-3 text-habit-warning" />
                        <span className="text-sm text-foreground">{task.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {selectedDateActivities.completedHabits.length === 0 && 
               selectedDateActivities.completedTasks.length === 0 && 
               selectedDateActivities.dueTasks.length === 0 && (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">📅</div>
                  <p className="text-muted-foreground">No activities on this day</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}