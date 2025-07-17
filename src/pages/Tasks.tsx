import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useHabitStore } from '@/stores/habitStore';
import { CheckSquare, Plus, Search, Edit, Trash2, MoreHorizontal, Clock, AlertCircle, Calendar, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Tasks() {
  const { tasks, completeTask, deleteTask } = useHabitStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const today = new Date().toISOString().split('T')[0];
  
  const categorizedTasks = {
    overdue: filteredTasks.filter(task => 
      !task.completed && task.dueDate && task.dueDate < today
    ),
    today: filteredTasks.filter(task => 
      !task.completed && task.dueDate === today
    ),
    upcoming: filteredTasks.filter(task => 
      !task.completed && (!task.dueDate || task.dueDate > today)
    ),
    completed: filteredTasks.filter(task => task.completed)
  };

  const handleComplete = (id: string, title: string) => {
    completeTask(id);
    toast({
      title: "Task completed! ✅",
      description: `"${title}" has been marked as done`,
    });
  };

  const handleDelete = (id: string, title: string) => {
    deleteTask(id);
    toast({
      title: "Task deleted",
      description: `"${title}" has been removed`,
    });
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'text-habit-error border-habit-error bg-habit-error/10';
      case 'medium': return 'text-habit-warning border-habit-warning bg-habit-warning/10';
      case 'low': return 'text-habit-success border-habit-success bg-habit-success/10';
      default: return 'text-muted-foreground border-muted-foreground bg-muted/10';
    }
  };

  const TaskCard = ({ task }: { task: any }) => (
    <Card className="bg-gradient-card shadow-habit-md border-0 hover:shadow-habit-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleComplete(task.id, task.title)}
                className="p-1 h-6 w-6"
              >
                {task.completed ? (
                  <CheckCircle className="h-4 w-4 text-habit-success" />
                ) : (
                  <div className="h-4 w-4 border-2 border-muted-foreground rounded-sm" />
                )}
              </Button>
              <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {task.title}
              </h3>
            </div>
            
            {task.description && (
              <p className="text-sm text-muted-foreground mb-3 ml-9">
                {task.description}
              </p>
            )}

            <div className="flex items-center space-x-2 ml-9">
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority} priority
              </Badge>
              
              {task.dueDate && (
                <Badge variant="outline" className="text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </Badge>
              )}
              
              {task.completed && task.completedAt && (
                <Badge variant="outline" className="text-habit-success border-habit-success bg-habit-success/10">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Done
                </Badge>
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
                onClick={() => handleDelete(task.id, task.title)}
                className="text-habit-error focus:text-habit-error"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );

  const TaskSection = ({ title, tasks, icon: Icon, color }: any) => (
    tasks.length > 0 && (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <Icon className={`h-5 w-5 mr-2 ${color}`} />
          {title} ({tasks.length})
        </h2>
        <div className="space-y-3">
          {tasks.map((task: any) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Tasks ✅</h1>
          <p className="text-muted-foreground">Organize and track your to-dos</p>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-gradient-card shadow-habit-md border-0">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-8 w-8 text-habit-error mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{categorizedTasks.overdue.length}</div>
            <div className="text-sm text-muted-foreground">Overdue</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 text-habit-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{categorizedTasks.today.length}</div>
            <div className="text-sm text-muted-foreground">Due Today</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <Calendar className="h-8 w-8 text-habit-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{categorizedTasks.upcoming.length}</div>
            <div className="text-sm text-muted-foreground">Upcoming</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <CheckSquare className="h-8 w-8 text-habit-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{categorizedTasks.completed.length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Task Sections */}
      <div className="space-y-8">
        <TaskSection 
          title="Overdue"
          tasks={categorizedTasks.overdue}
          icon={AlertCircle}
          color="text-habit-error"
        />
        
        <TaskSection 
          title="Due Today"
          tasks={categorizedTasks.today}
          icon={Clock}
          color="text-habit-warning"
        />
        
        <TaskSection 
          title="Upcoming"
          tasks={categorizedTasks.upcoming}
          icon={Calendar}
          color="text-habit-primary"
        />
        
        <TaskSection 
          title="Completed"
          tasks={categorizedTasks.completed}
          icon={CheckSquare}
          color="text-habit-success"
        />
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <Card className="bg-gradient-hero border-0 shadow-habit-md">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Tasks Yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start by creating your first task. Use the "+ Add" button in the top bar to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}