import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useHabitStore } from '@/stores/habitStore';
import { Settings as SettingsIcon, Moon, Sun, Volume2, VolumeX, Sparkles, User, Trash2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { settings, updateSettings, resetAllData } = useHabitStore();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setIsDirty(false);
    toast({
      title: "Settings saved!",
      description: "Your preferences have been updated",
    });
  };

  const handleReset = () => {
    resetAllData();
    toast({
      title: "Data reset complete",
      description: "All your data has been cleared. You can start fresh!",
    });
  };

  const SettingCard = ({ title, description, children }: { 
    title: string; 
    description: string; 
    children: React.ReactNode; 
  }) => (
    <Card className="bg-gradient-card shadow-habit-md border-0">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Customize your HabitVerse experience</p>
        </div>
        {isDirty && (
          <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      {/* Personal Settings */}
      <SettingCard
        title="Personal Information"
        description="Customize how HabitVerse addresses you"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <User className="h-5 w-5 text-habit-primary" />
            <div className="flex-1">
              <Label htmlFor="username">Display Name</Label>
              <Input
                id="username"
                value={localSettings.userName}
                onChange={(e) => handleSettingChange('userName', e.target.value)}
                placeholder="Enter your name"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This name will appear in greetings and notifications
              </p>
            </div>
          </div>
        </div>
      </SettingCard>

      {/* Appearance Settings */}
      <SettingCard
        title="Appearance"
        description="Customize the look and feel of your app"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {localSettings.darkMode ? (
                <Moon className="h-5 w-5 text-habit-primary" />
              ) : (
                <Sun className="h-5 w-5 text-habit-primary" />
              )}
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
            </div>
            <Switch
              checked={localSettings.darkMode}
              onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
            />
          </div>
        </div>
      </SettingCard>

      {/* Audio Settings */}
      <SettingCard
        title="Audio & Notifications"
        description="Control sounds and notification preferences"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {localSettings.soundEffects ? (
                <Volume2 className="h-5 w-5 text-habit-primary" />
              ) : (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium text-foreground">Sound Effects</p>
                <p className="text-sm text-muted-foreground">
                  Play sounds for interactions and achievements
                </p>
              </div>
            </div>
            <Switch
              checked={localSettings.soundEffects}
              onCheckedChange={(checked) => handleSettingChange('soundEffects', checked)}
            />
          </div>
        </div>
      </SettingCard>

      {/* AI Features */}
      <SettingCard
        title="AI Features"
        description="Enable intelligent suggestions and insights"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-5 w-5 text-habit-primary" />
              <div>
                <p className="font-medium text-foreground">AI Suggestions</p>
                <p className="text-sm text-muted-foreground">
                  Get personalized habit and task recommendations
                </p>
              </div>
            </div>
            <Switch
              checked={localSettings.aiSuggestions}
              onCheckedChange={(checked) => handleSettingChange('aiSuggestions', checked)}
            />
          </div>
        </div>
      </SettingCard>

      {/* Data Management */}
      <SettingCard
        title="Data Management"
        description="Manage your data and privacy settings"
      >
        <div className="space-y-4">
          <div className="p-4 bg-gradient-hero rounded-lg">
            <div className="flex items-start space-x-3">
              <SettingsIcon className="h-5 w-5 text-habit-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">Local Storage</p>
                <p className="text-xs text-muted-foreground mt-1">
                  All your data is stored locally on your device. No data is sent to external servers.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your habits, 
                    tasks, goals, achievements, and reset your settings to default values.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
                    Yes, reset everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SettingCard>

      {/* App Information */}
      <SettingCard
        title="About HabitVerse"
        description="App version and information"
      >
        <div className="space-y-3">
          <div className="text-center p-6 bg-gradient-hero rounded-lg">
            <div className="text-3xl mb-2">🌟</div>
            <h3 className="font-semibold text-foreground mb-1">HabitVerse v1.0</h3>
            <p className="text-sm text-muted-foreground">
              Build better habits, one day at a time
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <p className="text-lg font-bold text-habit-primary">∞</p>
              <p className="text-xs text-muted-foreground">Unlimited Habits</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-habit-success">100%</p>
              <p className="text-xs text-muted-foreground">Privacy Focused</p>
            </div>
          </div>
        </div>
      </SettingCard>

      {/* Save Changes Footer */}
      {isDirty && (
        <Card className="bg-habit-warning/10 border-habit-warning/20 shadow-habit-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-habit-warning rounded-full animate-pulse"></div>
                <p className="text-sm text-foreground font-medium">
                  You have unsaved changes
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setLocalSettings(settings);
                    setIsDirty(false);
                  }}
                >
                  Discard
                </Button>
                <Button size="sm" onClick={handleSave} className="bg-gradient-primary hover:opacity-90">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}