import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Target, 
  Brain,
  Zap,
  Timer,
  CheckCircle
} from 'lucide-react';

export default function FocusMode() {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [sessionType, setSessionType] = useState<'pomodoro' | 'deep-work'>('pomodoro');
  const [currentTask, setCurrentTask] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [completedSessions, setCompletedSessions] = useState(0);
  
  const { addFocusSession, focusSessions } = useAppStore();
  const { toast } = useToast();

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      handleSessionComplete();
    }
    
    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!currentTask.trim()) {
      toast({
        title: "Please set a task",
        description: "Enter what you'll be working on during this session",
        variant: "destructive"
      });
      return;
    }
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(sessionType === 'pomodoro' ? 25 * 60 : 90 * 60);
  };

  const handleSessionComplete = () => {
    setIsActive(false);
    setCompletedSessions(prev => prev + 1);
    
    const duration = sessionType === 'pomodoro' ? 25 : 90;
    
    addFocusSession({
      task: currentTask,
      duration,
      type: sessionType,
      completedAt: new Date().toISOString(),
      notes: sessionNotes
    });

    toast({
      title: "🎉 Session Complete!",
      description: `Great job! You completed a ${duration}-minute ${sessionType} session.`,
    });

    // Reset for next session
    setCurrentTask('');
    setSessionNotes('');
    resetTimer();
  };

  const setSessionDuration = (duration: number) => {
    if (!isActive) {
      setTime(duration * 60);
    }
  };

  const todaySessions = focusSessions.filter(session => 
    session.completedAt.startsWith(new Date().toISOString().split('T')[0])
  );

  const todayFocusTime = todaySessions.reduce((sum, session) => sum + session.duration, 0);

  const progress = sessionType === 'pomodoro' 
    ? ((25 * 60 - time) / (25 * 60)) * 100
    : ((90 * 60 - time) / (90 * 60)) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Focus Mode
        </h1>
        <p className="text-muted-foreground">
          Deep work sessions and Pomodoro technique for maximum productivity
        </p>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Sessions Today</p>
                <p className="text-2xl font-bold">{todaySessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Focus Time</p>
                <p className="text-2xl font-bold">{todayFocusTime}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{completedSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timer Section */}
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Timer className="h-6 w-6" />
            <span>Focus Timer</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Session Type Selection */}
          <div className="flex justify-center space-x-2">
            <Button
              variant={sessionType === 'pomodoro' ? 'default' : 'outline'}
              onClick={() => {
                setSessionType('pomodoro');
                setSessionDuration(25);
              }}
              disabled={isActive}
            >
              Pomodoro (25m)
            </Button>
            <Button
              variant={sessionType === 'deep-work' ? 'default' : 'outline'}
              onClick={() => {
                setSessionType('deep-work');
                setSessionDuration(90);
              }}
              disabled={isActive}
            >
              Deep Work (90m)
            </Button>
          </div>

          {/* Custom Duration */}
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSessionDuration(15)}
              disabled={isActive}
            >
              15m
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSessionDuration(45)}
              disabled={isActive}
            >
              45m
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSessionDuration(60)}
              disabled={isActive}
            >
              60m
            </Button>
          </div>

          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className="text-6xl font-mono font-bold text-primary">
              {formatTime(time)}
            </div>
            <Progress value={progress} className="h-2" />
            <Badge variant="secondary" className="text-sm">
              {sessionType === 'pomodoro' ? 'Pomodoro Session' : 'Deep Work Session'}
            </Badge>
          </div>

          {/* Task Input */}
          <div className="space-y-2">
            <Label htmlFor="current-task">What are you working on?</Label>
            <Input
              id="current-task"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              placeholder="e.g., Write project proposal, Study React hooks..."
              disabled={isActive}
            />
          </div>

          {/* Session Notes */}
          <div className="space-y-2">
            <Label htmlFor="session-notes">Session Notes (optional)</Label>
            <Textarea
              id="session-notes"
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Any specific goals or notes for this session..."
              rows={2}
            />
          </div>

          {/* Timer Controls */}
          <div className="flex justify-center space-x-3">
            {!isActive ? (
              <Button onClick={startTimer} size="lg" className="px-8">
                <Play className="h-5 w-5 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={pauseTimer} size="lg" variant="secondary" className="px-8">
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </Button>
            )}
            
            <Button onClick={resetTimer} size="lg" variant="outline">
              <Square className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Recent Focus Sessions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaySessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No focus sessions today. Start your first session above! 🚀
            </p>
          ) : (
            <div className="space-y-3">
              {todaySessions.slice(-5).reverse().map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium">{session.task}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.duration}m • {session.type}
                      {session.notes && ` • ${session.notes}`}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {new Date(session.completedAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Focus Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Focus Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Pomodoro Technique</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Work for 25 minutes with full focus</li>
                <li>• Take a 5-minute break</li>
                <li>• After 4 sessions, take a 15-30 minute break</li>
                <li>• Eliminate all distractions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Deep Work Sessions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 90-minute focused work blocks</li>
                <li>• Perfect for complex, creative tasks</li>
                <li>• Align with natural energy rhythms</li>
                <li>• Take substantial breaks between sessions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}