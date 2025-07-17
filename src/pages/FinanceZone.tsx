import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  DollarSign, 
  Target, 
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  CreditCard,
  BarChart3,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function FinanceZone() {
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  
  const { 
    expenses, 
    financialGoals, 
    addExpense, 
    addFinancialGoal, 
    updateFinancialGoal,
    getMonthlyExpensesByCategory
  } = useAppStore();
  const { toast } = useToast();

  const [newExpense, setNewExpense] = useState({
    amount: 0,
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: '',
    category: ''
  });

  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.category || !newExpense.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all expense details",
        variant: "destructive"
      });
      return;
    }

    addExpense(newExpense);
    toast({
      title: "Expense logged! 💰",
      description: `₹${newExpense.amount} spent on ${newExpense.category}`,
    });

    setNewExpense({
      amount: 0,
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsExpenseDialogOpen(false);
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) {
      toast({
        title: "Missing information",
        description: "Please fill in goal title, amount, and deadline",
        variant: "destructive"
      });
      return;
    }

    addFinancialGoal(newGoal);
    toast({
      title: "Financial goal set! 🎯",
      description: `Goal "${newGoal.title}" created`,
    });

    setNewGoal({
      title: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: '',
      category: ''
    });
    setIsGoalDialogOpen(false);
  };

  const expenseCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Groceries',
    'Subscriptions',
    'Investment',
    'Other'
  ];

  const goalCategories = [
    'Emergency Fund',
    'Vacation',
    'Electronics',
    'Education',
    'Investment',
    'Home',
    'Vehicle',
    'Other'
  ];

  const monthlyExpenses = getMonthlyExpensesByCategory();
  const totalMonthlyExpenses = Object.values(monthlyExpenses).reduce((sum, amount) => sum + amount, 0);

  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && 
           expenseDate.getFullYear() === now.getFullYear();
  });

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
      'bg-teal-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
    ];
    return colors[Math.abs(category.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Finance Zone
        </h1>
        <p className="text-muted-foreground">
          Track expenses, set financial goals, and build better money habits
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">₹{totalMonthlyExpenses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{thisMonthExpenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold">{financialGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PiggyBank className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Daily</p>
                <p className="text-2xl font-bold">
                  ₹{Math.round(totalMonthlyExpenses / new Date().getDate())}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expenses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="expenses">Expense Tracker</TabsTrigger>
          <TabsTrigger value="goals">Financial Goals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Expense Tracker Tab */}
        <TabsContent value="expenses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Expense Tracker</h2>
            <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>
                    Track your spending to better understand your financial habits
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newExpense.amount || ''}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newExpense.category} onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Lunch at restaurant, Uber ride, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="expense-date">Date</Label>
                    <Input
                      id="expense-date"
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddExpense}>Add Expense</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {thisMonthExpenses.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No expenses tracked yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your expenses to get insights into your spending habits
                </p>
                <Button onClick={() => setIsExpenseDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Expense
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {thisMonthExpenses.slice(-10).reverse().map((expense) => (
                <Card key={expense.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded ${getCategoryColor(expense.category)}`}>
                          <DollarSign className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {expense.category} • {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">₹{expense.amount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Monthly Breakdown */}
          {Object.keys(monthlyExpenses).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>This Month's Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(monthlyExpenses)
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded ${getCategoryColor(category)}`}></div>
                        <span className="text-sm">{category}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{amount}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((amount / totalMonthlyExpenses) * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Financial Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Financial Goals</h2>
            <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Financial Goal</DialogTitle>
                  <DialogDescription>
                    Set a savings target and track your progress
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goal-title">Goal Title</Label>
                    <Input
                      id="goal-title"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Emergency Fund, Vacation, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="target-amount">Target Amount (₹)</Label>
                      <Input
                        id="target-amount"
                        type="number"
                        value={newGoal.targetAmount || ''}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: parseFloat(e.target.value) || 0 }))}
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="current-amount">Current Amount (₹)</Label>
                      <Input
                        id="current-amount"
                        type="number"
                        value={newGoal.currentAmount || ''}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: parseFloat(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="goal-category">Category</Label>
                      <Select value={newGoal.category} onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {goalCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddGoal}>Create Goal</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {financialGoals.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No financial goals set</h3>
                <p className="text-muted-foreground mb-4">
                  Set financial goals to stay motivated and track your progress
                </p>
                <Button onClick={() => setIsGoalDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Set Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {financialGoals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                const remaining = goal.targetAmount - goal.currentAmount;
                const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <Card key={goal.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <Badge variant={progress >= 100 ? 'default' : 'secondary'}>
                          {goal.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-sm mt-1 text-muted-foreground">
                          <span>₹{goal.currentAmount}</span>
                          <span>₹{goal.targetAmount}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Remaining</p>
                          <p className="font-medium">₹{remaining}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Days left</p>
                          <p className={`font-medium ${daysLeft < 30 ? 'text-red-500' : ''}`}>
                            {daysLeft > 0 ? daysLeft : 'Overdue'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Add amount"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const amount = parseFloat((e.target as HTMLInputElement).value);
                              if (amount > 0) {
                                updateFinancialGoal(goal.id, goal.currentAmount + amount);
                                (e.target as HTMLInputElement).value = '';
                                toast({
                                  title: "Progress updated! 🎉",
                                  description: `Added ₹${amount} to ${goal.title}`,
                                });
                              }
                            }
                          }}
                        />
                        <Button size="sm" variant="outline">
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Financial Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Financial Insights</h3>
                <p className="text-muted-foreground mb-6">
                  Detailed analytics and insights about your spending patterns
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h4 className="font-semibold mb-1">Spending Trends</h4>
                    <p className="text-sm text-muted-foreground">Track how your spending changes over time</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h4 className="font-semibold mb-1">Budget Analysis</h4>
                    <p className="text-sm text-muted-foreground">Compare actual vs planned expenses</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <h4 className="font-semibold mb-1">Smart Alerts</h4>
                    <p className="text-sm text-muted-foreground">Get notified about unusual spending</p>
                  </Card>
                </div>
                
                <Button size="lg" variant="outline">
                  View Detailed Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}