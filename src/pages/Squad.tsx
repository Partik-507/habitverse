import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHabitStore } from '@/stores/habitStore';
import { MessageCircle, Zap, Users, TrendingUp, Heart, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Squad() {
  const { squadMembers } = useHabitStore();
  const { toast } = useToast();
  const [motivatedUsers, setMotivatedUsers] = useState<Set<string>>(new Set());

  const handleMotivate = (username: string) => {
    setMotivatedUsers(prev => new Set([...prev, username]));
    toast({
      title: "Motivation sent! 🔥",
      description: `You've sent motivation to ${username}`,
    });
  };

  const mockFeed = [
    {
      id: '1',
      user: 'Alex_Fitness',
      avatar: '💪',
      action: 'completed all habits today',
      emoji: '🎉',
      time: '2 hours ago',
    },
    {
      id: '2',
      user: 'Sarah_Reader',
      avatar: '📚',
      action: 'reached a 10-day reading streak',
      emoji: '🔥',
      time: '4 hours ago',
    },
    {
      id: '3',
      user: 'Mike_Coder',
      avatar: '💻',
      action: 'finished 3 tasks before noon',
      emoji: '⚡',
      time: '6 hours ago',
    },
    {
      id: '4',
      user: 'Emma_Yoga',
      avatar: '🧘‍♀️',
      action: 'unlocked the "Week Warrior" achievement',
      emoji: '🏆',
      time: '1 day ago',
    },
  ];

  const SquadMemberCard = ({ member }: { member: any }) => (
    <Card className="bg-gradient-card shadow-habit-md border-0 hover:shadow-habit-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{member.avatar}</div>
            <div>
              <CardTitle className="text-lg text-foreground">{member.username}</CardTitle>
              <CardDescription className="text-sm">
                Active {member.lastActive}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-habit-success/10 text-habit-success border-habit-success/20">
            {member.currentStreak} day streak
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={motivatedUsers.has(member.username) ? "secondary" : "default"}
            onClick={() => handleMotivate(member.username)}
            disabled={motivatedUsers.has(member.username)}
            className={motivatedUsers.has(member.username) ? "opacity-50" : ""}
          >
            <Heart className="h-4 w-4 mr-1" />
            {motivatedUsers.has(member.username) ? "Motivated!" : "Motivate"}
          </Button>
          <Button size="sm" variant="outline">
            <MessageCircle className="h-4 w-4 mr-1" />
            Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const FeedItem = ({ item }: { item: any }) => (
    <div className="flex items-start space-x-3 p-4 bg-gradient-hero rounded-lg hover:bg-card/30 transition-colors duration-200">
      <div className="text-2xl">{item.avatar}</div>
      <div className="flex-1">
        <p className="text-sm text-foreground">
          <span className="font-medium">{item.user}</span> {item.action} {item.emoji}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Squad</h1>
        <p className="text-muted-foreground">Your accountability partners and motivation crew</p>
      </div>

      {/* Squad Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 text-habit-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{squadMembers.length}</div>
            <div className="text-sm text-muted-foreground">Squad Members</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 text-habit-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {Math.round(squadMembers.reduce((sum, m) => sum + m.currentStreak, 0) / squadMembers.length)}
            </div>
            <div className="text-sm text-muted-foreground">Avg. Streak</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <Zap className="h-8 w-8 text-habit-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {squadMembers.filter(m => m.lastActive.includes('hour') || m.lastActive.includes('min')).length}
            </div>
            <div className="text-sm text-muted-foreground">Active Today</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Squad Members */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center">
            <Users className="h-5 w-5 text-habit-primary mr-2" />
            Your Squad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {squadMembers.map(member => (
              <SquadMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center">
            <TrendingUp className="h-5 w-5 text-habit-primary mr-2" />
            Activity Feed
          </h2>
          <Card className="bg-gradient-card shadow-habit-md border-0">
            <CardContent className="p-4 space-y-3">
              {mockFeed.map(item => (
                <FeedItem key={item.id} item={item} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Join Squad CTA */}
      <Card className="bg-gradient-hero border-0 shadow-habit-md">
        <CardContent className="pt-6 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Invite Friends to Your Squad
          </h3>
          <p className="text-muted-foreground mb-4">
            Share your habit journey with friends and motivate each other to reach your goals!
          </p>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Users className="h-4 w-4 mr-2" />
            Invite Friends
          </Button>
        </CardContent>
      </Card>

      {/* Leaderboard Section */}
      <Card className="bg-gradient-card shadow-habit-md border-0">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Trophy className="h-5 w-5 text-habit-primary mr-2" />
            Weekly Leaderboard
          </CardTitle>
          <CardDescription>Top performers this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {squadMembers
              .sort((a, b) => b.currentStreak - a.currentStreak)
              .slice(0, 5)
              .map((member, index) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gradient-hero rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${index === 0 ? 'bg-yellow-500 text-white' : 
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-amber-600 text-white' :
                        'bg-muted text-muted-foreground'}
                    `}>
                      {index + 1}
                    </div>
                    <span className="text-lg">{member.avatar}</span>
                    <span className="font-medium text-foreground">{member.username}</span>
                  </div>
                  <Badge variant="outline" className="bg-habit-success/10 text-habit-success border-habit-success/20">
                    {member.currentStreak} days
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}