import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, Square, RotateCcw, Timer, Lightbulb, Coffee } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Utilities() {
  const { toast } = useToast();

  // Pomodoro Timer State
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<'work' | 'break'>('work');
  const [pomodoroSessions, setPomodoroSessions] = useState(0);

  // Stopwatch State
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchActive, setStopwatchActive] = useState(false);

  // Countdown Timer State
  const [countdownTime, setCountdownTime] = useState(0);
  const [countdownInput, setCountdownInput] = useState('');
  const [countdownActive, setCountdownActive] = useState(false);

  // Daily Focus State
  const [dailyPrompt, setDailyPrompt] = useState('');
  const [focusAnswer, setFocusAnswer] = useState('');

  const pomodoroRef = useRef<NodeJS.Timeout>();
  const stopwatchRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();

  const prompts = [
    "What's the one thing you must accomplish today?",
    "What would make today feel successful?",
    "What's your biggest priority right now?",
    "What task will have the most impact on your goals?",
    "What are you most excited to work on today?",
    "What's been on your mind that you need to address?",
    "What small win can you achieve in the next hour?",
    "What would future you thank you for doing today?",
  ];

  // Load daily prompt and focus answer
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const savedPromptDate = localStorage.getItem('dailyPromptDate');
    const savedPrompt = localStorage.getItem('dailyPrompt');
    const savedAnswer = localStorage.getItem('focusAnswer');

    if (savedPromptDate === today && savedPrompt) {
      setDailyPrompt(savedPrompt);
    } else {
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setDailyPrompt(randomPrompt);
      localStorage.setItem('dailyPromptDate', today);
      localStorage.setItem('dailyPrompt', randomPrompt);
    }

    if (savedAnswer) {
      setFocusAnswer(savedAnswer);
    }
  }, []);

  // Pomodoro Timer Effect
  useEffect(() => {
    if (pomodoroActive && pomodoroTime > 0) {
      pomodoroRef.current = setTimeout(() => {
        setPomodoroTime(time => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0 && pomodoroActive) {
      setPomodoroActive(false);
      if (pomodoroMode === 'work') {
        setPomodoroSessions(prev => prev + 1);
        setPomodoroMode('break');
        setPomodoroTime(5 * 60); // 5 minute break
        toast({
          title: "Work session complete! ✅",
          description: "Time for a 5-minute break",
        });
      } else {
        setPomodoroMode('work');
        setPomodoroTime(25 * 60); // Back to 25 minutes
        toast({
          title: "Break time over! 🚀",
          description: "Ready for another work session?",
        });
      }
    }
    return () => {
      if (pomodoroRef.current) clearTimeout(pomodoroRef.current);
    };
  }, [pomodoroActive, pomodoroTime, pomodoroMode]);

  // Stopwatch Effect
  useEffect(() => {
    if (stopwatchActive) {
      stopwatchRef.current = setTimeout(() => {
        setStopwatchTime(time => time + 1);
      }, 1000);
    }
    return () => {
      if (stopwatchRef.current) clearTimeout(stopwatchRef.current);
    };
  }, [stopwatchActive, stopwatchTime]);

  // Countdown Effect
  useEffect(() => {
    if (countdownActive && countdownTime > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdownTime(time => time - 1);
      }, 1000);
    } else if (countdownTime === 0 && countdownActive) {
      setCountdownActive(false);
      toast({
        title: "Time's up! ⏰",
        description: "Your countdown timer has finished",
      });
    }
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [countdownActive, countdownTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCountdownStart = () => {
    const minutes = parseInt(countdownInput);
    if (isNaN(minutes) || minutes <= 0) {
      toast({
        title: "Invalid time",
        description: "Please enter a valid number of minutes",
        variant: "destructive",
      });
      return;
    }
    setCountdownTime(minutes * 60);
    setCountdownActive(true);
  };

  const saveFocusAnswer = () => {
    localStorage.setItem('focusAnswer', focusAnswer);
    toast({
      title: "Focus saved! 🎯",
      description: "Your daily focus has been recorded",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Utilities</h1>
        <p className="text-muted-foreground">Productivity tools to boost your focus</p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pomodoro Timer */}
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Timer className="h-5 w-5 text-habit-primary mr-2" />
              Pomodoro Timer
            </CardTitle>
            <CardDescription>
              25-minute focused work sessions with 5-minute breaks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-foreground mb-2">
                {formatTime(pomodoroTime)}
              </div>
              <Badge variant={pomodoroMode === 'work' ? 'default' : 'secondary'}>
                {pomodoroMode === 'work' ? 'Work Session' : 'Break Time'}
              </Badge>
            </div>
            
            <div className="flex justify-center space-x-2">
              <Button
                onClick={() => setPomodoroActive(!pomodoroActive)}
                disabled={pomodoroTime === 0}
                className="bg-gradient-primary hover:opacity-90"
              >
                {pomodoroActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPomodoroActive(false);
                  setPomodoroTime(pomodoroMode === 'work' ? 25 * 60 : 5 * 60);
                }}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Sessions completed: <span className="font-medium">{pomodoroSessions}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stopwatch */}
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Clock className="h-5 w-5 text-habit-success mr-2" />
              Stopwatch
            </CardTitle>
            <CardDescription>
              Track time for any activity or task
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-foreground mb-2">
                {formatTime(stopwatchTime)}
              </div>
            </div>
            
            <div className="flex justify-center space-x-2">
              <Button
                onClick={() => setStopwatchActive(!stopwatchActive)}
                className="bg-gradient-primary hover:opacity-90"
              >
                {stopwatchActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStopwatchActive(false);
                  setStopwatchTime(0);
                }}
              >
                <Square className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Countdown Timer */}
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Timer className="h-5 w-5 text-habit-warning mr-2" />
              Countdown Timer
            </CardTitle>
            <CardDescription>
              Set a custom countdown for any duration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-foreground mb-2">
                {formatTime(countdownTime)}
              </div>
            </div>

            {!countdownActive && (
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Minutes"
                  value={countdownInput}
                  onChange={(e) => setCountdownInput(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleCountdownStart} className="bg-gradient-primary hover:opacity-90">
                  Start
                </Button>
              </div>
            )}
            
            {countdownActive && (
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={() => setCountdownActive(false)}
                  variant="outline"
                >
                  <Square className="h-4 w-4 mr-1" />
                  Stop
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Focus Prompt */}
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Lightbulb className="h-5 w-5 text-habit-secondary mr-2" />
              Daily Focus
            </CardTitle>
            <CardDescription>
              Reflect on your priorities for the day
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-hero rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Today's Prompt:</p>
              <p className="text-foreground">{dailyPrompt}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="focus-answer">Your Answer</Label>
              <Textarea
                id="focus-answer"
                value={focusAnswer}
                onChange={(e) => setFocusAnswer(e.target.value)}
                placeholder="Write your thoughts here..."
                rows={3}
              />
            </div>
            
            <Button 
              onClick={saveFocusAnswer}
              disabled={!focusAnswer.trim()}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              Save Focus
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-hero border-0 shadow-habit-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <Coffee className="h-8 w-8 text-habit-primary mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Productivity Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-3 bg-card/50 rounded-lg">
                <p className="text-sm font-medium text-foreground">🍅 Pomodoro</p>
                <p className="text-xs text-muted-foreground">Work in 25-min focused sprints</p>
              </div>
              <div className="p-3 bg-card/50 rounded-lg">
                <p className="text-sm font-medium text-foreground">⏰ Time Blocking</p>
                <p className="text-xs text-muted-foreground">Dedicate specific time slots</p>
              </div>
              <div className="p-3 bg-card/50 rounded-lg">
                <p className="text-sm font-medium text-foreground">🎯 Single Tasking</p>
                <p className="text-xs text-muted-foreground">Focus on one thing at a time</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}