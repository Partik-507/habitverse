import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useHabitStore } from '@/stores/habitStore';
import { Trophy, Lock, CheckCircle } from 'lucide-react';

export default function Achievements() {
  const { achievements } = useHabitStore();

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  const AchievementCard = ({ achievement }: { achievement: any }) => (
    <Card className={`
      relative overflow-hidden transition-all duration-300 hover:scale-105 border-0
      ${achievement.unlocked 
        ? 'bg-gradient-card shadow-habit-glow' 
        : 'bg-muted/50 shadow-habit-sm'
      }
    `}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="text-3xl">{achievement.icon}</div>
          {achievement.unlocked ? (
            <CheckCircle className="h-6 w-6 text-habit-success" />
          ) : (
            <Lock className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className={`text-lg mb-2 ${
          achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
        }`}>
          {achievement.title}
        </CardTitle>
        <CardDescription className={`text-sm ${
          achievement.unlocked ? 'text-muted-foreground' : 'text-muted-foreground/70'
        }`}>
          {achievement.description}
        </CardDescription>
        {achievement.unlocked && achievement.unlockedAt && (
          <div className="mt-3">
            <Badge variant="secondary" className="text-xs">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </Badge>
          </div>
        )}
      </CardContent>
      
      {/* Decorative elements for unlocked achievements */}
      {achievement.unlocked && (
        <>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-primary opacity-10 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-habit-secondary opacity-10 rounded-tr-full"></div>
        </>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
        <p className="text-muted-foreground">Celebrate your milestones and victories</p>
        
        {/* Progress Summary */}
        <Card className="bg-gradient-card shadow-habit-md border-0 max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-4">
              <Trophy className="h-8 w-8 text-habit-primary" />
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {unlockedCount}/{totalCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Achievements Unlocked
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-primary transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-center mt-2 text-sm text-muted-foreground">
              {Math.round(progressPercentage)}% Complete
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Categories */}
      <div className="space-y-6">
        {/* Recent Achievements */}
        {unlockedCount > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-habit-success mr-2" />
              Recently Unlocked
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements
                .filter(a => a.unlocked)
                .sort((a, b) => new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime())
                .slice(0, 3)
                .map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
            </div>
          </div>
        )}

        {/* All Achievements */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Trophy className="h-5 w-5 text-habit-primary mr-2" />
            All Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      </div>

      {/* Motivational Section */}
      <Card className="bg-gradient-hero border-0 shadow-habit-md">
        <CardContent className="pt-6 text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Keep Going!
          </h3>
          <p className="text-muted-foreground mb-4">
            {unlockedCount === 0 
              ? "Complete your first task or habit to unlock your first achievement!"
              : unlockedCount === totalCount
              ? "Congratulations! You've unlocked all achievements. New ones coming soon!"
              : `You're ${totalCount - unlockedCount} achievements away from completing the collection!`
            }
          </p>
          
          {/* Next Achievement Hint */}
          {unlockedCount < totalCount && (
            <div className="bg-card/50 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-muted-foreground mb-2">Next Achievement:</p>
              {(() => {
                const nextAchievement = achievements.find(a => !a.unlocked);
                return nextAchievement ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{nextAchievement.icon}</span>
                    <div className="text-left">
                      <p className="font-medium text-sm text-foreground">{nextAchievement.title}</p>
                      <p className="text-xs text-muted-foreground">{nextAchievement.description}</p>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}