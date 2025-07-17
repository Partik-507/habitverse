import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHabitStore } from '@/stores/habitStore';
import { BarChart3, TrendingUp, Calendar, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Analytics() {
  const { 
    habits, 
    tasks, 
    getCompletionRate, 
    getLongestStreak, 
    getMostCompletedHabit, 
    getTaskStats 
  } = useHabitStore();

  // Generate last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    
    const completedHabits = habits.filter(habit => 
      habit.completedDates.includes(dateStr)
    ).length;
    
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      habits: completedHabits,
      fullDate: dateStr,
    };
  });

  // Generate last 30 days for heatmap
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split('T')[0];
    
    const completedHabits = habits.filter(habit => 
      habit.completedDates.includes(dateStr)
    ).length;
    
    return {
      date: dateStr,
      count: completedHabits,
      day: date.getDate(),
    };
  });

  const taskStats = getTaskStats();
  const completionRate = getCompletionRate();
  const longestStreak = getLongestStreak();
  const mostCompletedHabit = getMostCompletedHabit();

  const StatCard = ({ title, value, description, icon: Icon, trend }: any) => (
    <Card className="bg-gradient-card shadow-habit-md border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-habit-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
        {trend && (
          <div className="flex items-center pt-1">
            <TrendingUp className="h-3 w-3 text-habit-success mr-1" />
            <span className="text-xs text-habit-success">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Track your progress and insights</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Completion Rate"
          value={`${Math.round(completionRate)}%`}
          description="Today's habit completion"
          icon={Target}
          trend="+12% from yesterday"
        />
        <StatCard
          title="Longest Streak"
          value={`${longestStreak} days`}
          description="Your best streak so far"
          icon={Calendar}
        />
        <StatCard
          title="Tasks Completed"
          value={`${taskStats.completed}/${taskStats.total}`}
          description="Total tasks completed"
          icon={BarChart3}
        />
        <StatCard
          title="Top Habit"
          value={mostCompletedHabit}
          description="Most completed habit"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habit Completion Trend */}
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardHeader>
            <CardTitle className="text-foreground">7-Day Habit Trend</CardTitle>
            <CardDescription>Daily habit completions over the last week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Bar 
                  dataKey="habits" 
                  fill="hsl(var(--habit-primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Heatmap */}
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardHeader>
            <CardTitle className="text-foreground">Activity Heatmap</CardTitle>
            <CardDescription>Last 30 days of habit activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-1">
              {last30Days.map((day, index) => (
                <div
                  key={index}
                  className={`
                    w-6 h-6 rounded-sm border transition-all duration-200 hover:scale-110
                    ${day.count === 0 && 'bg-muted border-border'}
                    ${day.count === 1 && 'bg-habit-primary/20 border-habit-primary/30'}
                    ${day.count === 2 && 'bg-habit-primary/40 border-habit-primary/50'}
                    ${day.count === 3 && 'bg-habit-primary/60 border-habit-primary/70'}
                    ${day.count >= 4 && 'bg-habit-primary border-habit-primary'}
                  `}
                  title={`${day.date}: ${day.count} habits completed`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-sm bg-muted border border-border"></div>
                <div className="w-3 h-3 rounded-sm bg-habit-primary/20 border border-habit-primary/30"></div>
                <div className="w-3 h-3 rounded-sm bg-habit-primary/40 border border-habit-primary/50"></div>
                <div className="w-3 h-3 rounded-sm bg-habit-primary/60 border border-habit-primary/70"></div>
                <div className="w-3 h-3 rounded-sm bg-habit-primary border border-habit-primary"></div>
              </div>
              <span>More</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Section */}
      <Card className="bg-gradient-card shadow-habit-md border-0">
        <CardHeader>
          <CardTitle className="text-foreground">Key Insights</CardTitle>
          <CardDescription>AI-powered insights about your habits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-gradient-hero rounded-lg">
            <div className="w-2 h-2 bg-habit-success rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-sm text-foreground">Great consistency!</p>
              <p className="text-sm text-muted-foreground">
                You've completed habits on {Math.round((last7Days.filter(d => d.habits > 0).length / 7) * 100)}% of the last 7 days.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-gradient-hero rounded-lg">
            <div className="w-2 h-2 bg-habit-warning rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-sm text-foreground">Room for improvement</p>
              <p className="text-sm text-muted-foreground">
                Try completing at least 2 habits daily to build stronger momentum.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-gradient-hero rounded-lg">
            <div className="w-2 h-2 bg-habit-primary rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-sm text-foreground">Best performance</p>
              <p className="text-sm text-muted-foreground">
                Your best day was {last7Days.reduce((max, day) => day.habits > max.habits ? day : max).date} with {last7Days.reduce((max, day) => day.habits > max.habits ? day : max).habits} habits completed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}