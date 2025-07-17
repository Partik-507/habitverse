import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Heart, 
  Brain, 
  Moon,
  Droplets,
  Clock,
  Smile,
  Frown,
  Meh,
  TrendingUp,
  Calendar,
  Zap
} from 'lucide-react';

export default function WellnessZone() {
  const [isMoodDialogOpen, setIsMoodDialogOpen] = useState(false);
  const [isSleepDialogOpen, setIsSleepDialogOpen] = useState(false);
  const [isMeditationDialogOpen, setIsMeditationDialogOpen] = useState(false);
  
  const { 
    moodEntries, 
    sleepEntries, 
    meditationEntries, 
    addMoodEntry, 
    addSleepEntry, 
    addMeditationEntry,
    getWeeklyMoodAverage
  } = useAppStore();
  const { toast } = useToast();

  const [newMoodEntry, setNewMoodEntry] = useState({
    mood: 3,
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [newSleepEntry, setNewSleepEntry] = useState({
    bedtime: '23:00',
    wakeup: '07:00',
    quality: 3,
    date: new Date().toISOString().split('T')[0]
  });

  const [newMeditationEntry, setNewMeditationEntry] = useState({
    duration: 10,
    type: 'Mindfulness',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddMood = () => {
    addMoodEntry(newMoodEntry);
    toast({
      title: "Mood logged! 😊",
      description: "Your mood has been recorded",
    });
    setNewMoodEntry({
      mood: 3,
      note: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsMoodDialogOpen(false);
  };

  const handleAddSleep = () => {
    addSleepEntry(newSleepEntry);
    toast({
      title: "Sleep logged! 😴",
      description: "Your sleep data has been recorded",
    });
    setNewSleepEntry({
      bedtime: '23:00',
      wakeup: '07:00',
      quality: 3,
      date: new Date().toISOString().split('T')[0]
    });
    setIsSleepDialogOpen(false);
  };

  const handleAddMeditation = () => {
    addMeditationEntry(newMeditationEntry);
    toast({
      title: "Meditation logged! 🧘‍♀️",
      description: `${newMeditationEntry.duration} minutes of ${newMeditationEntry.type} recorded`,
    });
    setNewMeditationEntry({
      duration: 10,
      type: 'Mindfulness',
      date: new Date().toISOString().split('T')[0]
    });
    setIsMeditationDialogOpen(false);
  };

  const getMoodEmoji = (mood: number) => {
    switch (mood) {
      case 1: return '😢';
      case 2: return '😔';
      case 3: return '😐';
      case 4: return '😊';
      case 5: return '😄';
      default: return '😐';
    }
  };

  const getMoodColor = (mood: number) => {
    switch (mood) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      case 5: return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const calculateSleepDuration = (bedtime: string, wakeup: string) => {
    const bed = new Date(`2000-01-01T${bedtime}`);
    const wake = new Date(`2000-01-02T${wakeup}`);
    const diff = wake.getTime() - bed.getTime();
    return Math.round(diff / (1000 * 60 * 60 * 10)) / 10; // Hours with 1 decimal
  };

  const todayMeditation = meditationEntries
    .filter(entry => entry.date === new Date().toISOString().split('T')[0])
    .reduce((sum, entry) => sum + entry.duration, 0);

  const weeklyMoodAvg = getWeeklyMoodAverage();
  const thisWeekSleep = sleepEntries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });
  
  const avgSleepQuality = thisWeekSleep.length > 0 
    ? thisWeekSleep.reduce((sum, entry) => sum + entry.quality, 0) / thisWeekSleep.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Wellness Zone
        </h1>
        <p className="text-muted-foreground">
          Track your mental and physical wellbeing journey
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Weekly Mood</p>
                <p className="text-2xl font-bold">
                  {weeklyMoodAvg.toFixed(1)} {getMoodEmoji(Math.round(weeklyMoodAvg))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Moon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Sleep Quality</p>
                <p className="text-2xl font-bold">{avgSleepQuality.toFixed(1)}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Today's Meditation</p>
                <p className="text-2xl font-bold">{todayMeditation}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Wellness Score</p>
                <p className="text-2xl font-bold">
                  {Math.round((weeklyMoodAvg + avgSleepQuality + (todayMeditation > 0 ? 1 : 0)) * 20)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mood" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mood">Mood Journal</TabsTrigger>
          <TabsTrigger value="sleep">Sleep Tracker</TabsTrigger>
          <TabsTrigger value="meditation">Meditation Log</TabsTrigger>
        </TabsList>

        {/* Mood Journal Tab */}
        <TabsContent value="mood" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Mood Journal</h2>
            <Dialog open={isMoodDialogOpen} onOpenChange={setIsMoodDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Mood
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Your Mood</DialogTitle>
                  <DialogDescription>
                    How are you feeling today? Rate your mood and add notes
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label>How do you feel? (1-5)</Label>
                    <div className="flex justify-center space-x-4 py-4">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant={newMoodEntry.mood === rating ? 'default' : 'outline'}
                          onClick={() => setNewMoodEntry(prev => ({ ...prev, mood: rating }))}
                          className="text-2xl h-16 w-16"
                        >
                          {getMoodEmoji(rating)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="mood-date">Date</Label>
                    <Input
                      id="mood-date"
                      type="date"
                      value={newMoodEntry.date}
                      onChange={(e) => setNewMoodEntry(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="mood-note">Notes (optional)</Label>
                    <Textarea
                      id="mood-note"
                      value={newMoodEntry.note}
                      onChange={(e) => setNewMoodEntry(prev => ({ ...prev, note: e.target.value }))}
                      placeholder="What influenced your mood today?"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsMoodDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddMood}>Log Mood</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {moodEntries.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Smile className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start tracking your mood</h3>
                <p className="text-muted-foreground mb-4">
                  Understanding your emotional patterns can improve your wellbeing
                </p>
                <Button onClick={() => setIsMoodDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Your First Mood
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moodEntries.slice(-9).reverse().map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-3xl">{getMoodEmoji(entry.mood)}</div>
                      <Badge className={`${getMoodColor(entry.mood)} text-white`}>
                        {entry.mood}/5
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                    {entry.note && (
                      <p className="text-sm">{entry.note}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Sleep Tracker Tab */}
        <TabsContent value="sleep" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sleep Tracker</h2>
            <Dialog open={isSleepDialogOpen} onOpenChange={setIsSleepDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Sleep
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Sleep Data</DialogTitle>
                  <DialogDescription>
                    Track your sleep schedule and quality
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sleep-date">Date</Label>
                    <Input
                      id="sleep-date"
                      type="date"
                      value={newSleepEntry.date}
                      onChange={(e) => setNewSleepEntry(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bedtime">Bedtime</Label>
                      <Input
                        id="bedtime"
                        type="time"
                        value={newSleepEntry.bedtime}
                        onChange={(e) => setNewSleepEntry(prev => ({ ...prev, bedtime: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="wakeup">Wake up time</Label>
                      <Input
                        id="wakeup"
                        type="time"
                        value={newSleepEntry.wakeup}
                        onChange={(e) => setNewSleepEntry(prev => ({ ...prev, wakeup: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Sleep Quality (1-5)</Label>
                    <div className="flex justify-center space-x-2 py-4">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant={newSleepEntry.quality === rating ? 'default' : 'outline'}
                          onClick={() => setNewSleepEntry(prev => ({ ...prev, quality: rating }))}
                          className="h-12 w-12"
                        >
                          {rating}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Estimated sleep duration:</p>
                    <p className="text-lg font-semibold">
                      {calculateSleepDuration(newSleepEntry.bedtime, newSleepEntry.wakeup)} hours
                    </p>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsSleepDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddSleep}>Log Sleep</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {sleepEntries.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Moon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start tracking your sleep</h3>
                <p className="text-muted-foreground mb-4">
                  Better sleep tracking leads to better sleep habits
                </p>
                <Button onClick={() => setIsSleepDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Your First Sleep
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sleepEntries.slice(-6).reverse().map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Moon className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <Badge variant="outline">
                        Quality: {entry.quality}/5
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bedtime:</span>
                        <span>{entry.bedtime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Wake up:</span>
                        <span>{entry.wakeup}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{calculateSleepDuration(entry.bedtime, entry.wakeup)}h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Meditation Log Tab */}
        <TabsContent value="meditation" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Meditation Log</h2>
            <Dialog open={isMeditationDialogOpen} onOpenChange={setIsMeditationDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Session
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Meditation Session</DialogTitle>
                  <DialogDescription>
                    Track your mindfulness and meditation practice
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="meditation-date">Date</Label>
                    <Input
                      id="meditation-date"
                      type="date"
                      value={newMeditationEntry.date}
                      onChange={(e) => setNewMeditationEntry(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={newMeditationEntry.duration}
                        onChange={(e) => setNewMeditationEntry(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="meditation-type">Type</Label>
                      <Select value={newMeditationEntry.type} onValueChange={(value) => setNewMeditationEntry(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                          <SelectItem value="Breathing">Breathing</SelectItem>
                          <SelectItem value="Body Scan">Body Scan</SelectItem>
                          <SelectItem value="Loving Kindness">Loving Kindness</SelectItem>
                          <SelectItem value="Walking">Walking Meditation</SelectItem>
                          <SelectItem value="Visualization">Visualization</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsMeditationDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddMeditation}>Log Session</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {meditationEntries.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start your meditation journey</h3>
                <p className="text-muted-foreground mb-4">
                  Even a few minutes of daily meditation can improve your wellbeing
                </p>
                <Button onClick={() => setIsMeditationDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Your First Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {meditationEntries.slice(-10).reverse().map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Brain className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="font-medium">{entry.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(entry.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {entry.duration} minutes
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Weekly Summary */}
          {meditationEntries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>This Week's Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-500">
                      {meditationEntries.filter(entry => {
                        const entryDate = new Date(entry.date);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return entryDate >= weekAgo;
                      }).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Sessions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-500">
                      {meditationEntries
                        .filter(entry => {
                          const entryDate = new Date(entry.date);
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return entryDate >= weekAgo;
                        })
                        .reduce((sum, entry) => sum + entry.duration, 0)}m
                    </p>
                    <p className="text-sm text-muted-foreground">Total Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-500">
                      {Math.round(meditationEntries
                        .filter(entry => {
                          const entryDate = new Date(entry.date);
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return entryDate >= weekAgo;
                        })
                        .reduce((sum, entry) => sum + entry.duration, 0) / 7)}m
                    </p>
                    <p className="text-sm text-muted-foreground">Daily Average</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-500">
                      {meditationEntries.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}