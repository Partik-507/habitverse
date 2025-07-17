import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useHabitStore } from '@/stores/habitStore';
import { Target, Plus, Calendar, TrendingUp, CheckCircle, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Goals() {
  const { goals, addGoal, updateGoalProgress, deleteGoal } = useHabitStore();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetCount: '',
    currentProgress: '',
    dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.targetCount || !formData.dueDate) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addGoal({
      title: formData.title,
      description: formData.description,
      targetCount: parseInt(formData.targetCount),
      currentProgress: parseInt(formData.currentProgress) || 0,
      dueDate: formData.dueDate,
    });

    toast({
      title: "Goal created!",
      description: `"${formData.title}" has been added to your goals`,
    });

    setFormData({ title: '', description: '', targetCount: '', currentProgress: '', dueDate: '' });
    setDialogOpen(false);
  };

  const handleProgressUpdate = (goalId: string, newProgress: number) => {
    updateGoalProgress(goalId, newProgress);
    setEditingGoal(null);
    toast({
      title: "Progress updated!",
      description: "Goal progress has been updated",
    });
  };

  const handleDelete = (goalId: string, title: string) => {
    deleteGoal(goalId);
    toast({
      title: "Goal deleted",
      description: `"${title}" has been removed`,
    });
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'bg-habit-success';
    if (percentage >= 75) return 'bg-habit-primary';
    if (percentage >= 50) return 'bg-habit-warning';
    return 'bg-muted-foreground';
  };

  const GoalCard = ({ goal }: { goal: any }) => {
    const progressPercentage = Math.min((goal.currentProgress / goal.targetCount) * 100, 100);
    const daysRemaining = getDaysRemaining(goal.dueDate);
    const isCompleted = goal.status === 'completed';
    const isOverdue = daysRemaining < 0 && !isCompleted;

    return (
      <Card className={`
        bg-gradient-card shadow-habit-md border-0 transition-all duration-300 hover:shadow-habit-lg
        ${isCompleted ? 'ring-2 ring-habit-success/20' : ''}
        ${isOverdue ? 'ring-2 ring-habit-error/20' : ''}
      `}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className={`text-lg ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {goal.title}
              </CardTitle>
              {goal.description && (
                <CardDescription className="mt-1">{goal.description}</CardDescription>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {isCompleted && <CheckCircle className="h-5 w-5 text-habit-success" />}
              <Badge variant={isCompleted ? "default" : isOverdue ? "destructive" : "secondary"}>
                {isCompleted ? 'Completed' : isOverdue ? 'Overdue' : `${daysRemaining} days left`}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                {goal.currentProgress}/{goal.targetCount}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground text-right">
              {Math.round(progressPercentage)}% complete
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-2">
              {!isCompleted && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingGoal(goal.id)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Update
                </Button>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDelete(goal.id, goal.title)}
              className="text-habit-error hover:text-habit-error hover:bg-habit-error/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>

        {/* Progress Update Dialog */}
        {editingGoal === goal.id && (
          <Dialog open={true} onOpenChange={() => setEditingGoal(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Progress</DialogTitle>
                <DialogDescription>
                  Update your progress for "{goal.title}"
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const newProgress = parseInt(formData.get('progress') as string);
                handleProgressUpdate(goal.id, newProgress);
              }}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="progress">Current Progress</Label>
                    <Input
                      id="progress"
                      name="progress"
                      type="number"
                      min="0"
                      max={goal.targetCount}
                      defaultValue={goal.currentProgress}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setEditingGoal(null)}>
                      Cancel
                    </Button>
                    <Button type="submit">Update Progress</Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </Card>
    );
  };

  const inProgressGoals = goals.filter(g => g.status === 'in-progress');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Goals</h1>
          <p className="text-muted-foreground">Set and track your long-term objectives</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Set a new goal to track your progress towards
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Read 12 books"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description of your goal..."
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetCount">Target Count *</Label>
                  <Input
                    id="targetCount"
                    type="number"
                    min="1"
                    value={formData.targetCount}
                    onChange={(e) => setFormData({ ...formData, targetCount: e.target.value })}
                    placeholder="12"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currentProgress">Current Progress</Label>
                  <Input
                    id="currentProgress"
                    type="number"
                    min="0"
                    value={formData.currentProgress}
                    onChange={(e) => setFormData({ ...formData, currentProgress: e.target.value })}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Goal</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <Target className="h-8 w-8 text-habit-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{goals.length}</div>
            <div className="text-sm text-muted-foreground">Total Goals</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 text-habit-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{completedGoals.length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 text-habit-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Lists */}
      {inProgressGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center">
            <Target className="h-5 w-5 text-habit-primary mr-2" />
            In Progress ({inProgressGoals.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {inProgressGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center">
            <CheckCircle className="h-5 w-5 text-habit-success mr-2" />
            Completed ({completedGoals.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <Card className="bg-gradient-hero border-0 shadow-habit-md">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Goals Yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Set your first goal and start tracking your progress towards achieving something meaningful.
            </p>
            <Button onClick={() => setDialogOpen(true)} className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}