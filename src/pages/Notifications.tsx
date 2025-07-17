import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Check, X, Clock, MessageSquare, Gift, TrendingUp, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'suggestion' | 'social' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
}

export default function Notifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Generate mock notifications on mount
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'reminder',
        title: 'Habit Reminder',
        message: "Don't forget to complete your morning meditation! You're on a 7-day streak.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        read: false,
        actionable: true,
      },
      {
        id: '2',
        type: 'achievement',
        title: 'Achievement Unlocked! 🏆',
        message: 'Congratulations! You\'ve completed 3 habits in a single day.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        read: false,
      },
      {
        id: '3',
        type: 'suggestion',
        title: 'AI Suggestion',
        message: 'Based on your patterns, consider adding a "Evening Planning" habit to improve your next-day productivity.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        read: true,
      },
      {
        id: '4',
        type: 'social',
        title: 'Squad Update',
        message: 'Alex_Fitness just completed their 15-day workout streak! Send them some motivation.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        read: true,
        actionable: true,
      },
      {
        id: '5',
        type: 'system',
        title: 'Weekly Summary Ready',
        message: 'Your weekly productivity report is ready. You completed 85% of your habits this week!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: true,
      },
      {
        id: '6',
        type: 'reminder',
        title: 'Task Due Soon',
        message: 'Your high-priority task "Finish project proposal" is due tomorrow.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        read: true,
        actionable: true,
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "Your notification inbox is now clear",
    });
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification deleted",
      description: "The notification has been removed",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Clock className="h-4 w-4 text-habit-warning" />;
      case 'achievement': return <Gift className="h-4 w-4 text-habit-success" />;
      case 'suggestion': return <TrendingUp className="h-4 w-4 text-habit-primary" />;
      case 'social': return <MessageSquare className="h-4 w-4 text-habit-secondary" />;
      case 'system': return <AlertCircle className="h-4 w-4 text-habit-error" />;
      default: return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reminder': return 'border-habit-warning bg-habit-warning/10';
      case 'achievement': return 'border-habit-success bg-habit-success/10';
      case 'suggestion': return 'border-habit-primary bg-habit-primary/10';
      case 'social': return 'border-habit-secondary bg-habit-secondary/10';
      case 'system': return 'border-habit-error bg-habit-error/10';
      default: return 'border-border bg-muted/10';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card className={`
      bg-gradient-card shadow-habit-md border-0 transition-all duration-300 hover:shadow-habit-lg
      ${!notification.read ? 'ring-2 ring-habit-primary/20' : ''}
    `}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg border ${getNotificationColor(notification.type)}`}>
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className={`font-medium text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                {notification.title}
              </h3>
              <div className="flex items-center space-x-2 ml-2">
                {!notification.read && (
                  <div className="w-2 h-2 bg-habit-primary rounded-full" />
                )}
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTimeAgo(notification.timestamp)}
                </span>
              </div>
            </div>
            
            <p className={`text-sm mb-3 ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
              {notification.message}
            </p>
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={`text-xs ${getNotificationColor(notification.type)}`}>
                {notification.type}
              </Badge>
              
              <div className="flex space-x-2">
                {notification.actionable && (
                  <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                    Action
                  </Button>
                )}
                
                {!notification.read && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="h-7 px-2 text-xs"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleDeleteNotification(notification.id)}
                  className="h-7 px-2 text-xs text-habit-error hover:text-habit-error"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications 🔔</h1>
          <p className="text-muted-foreground">Stay updated with your progress and reminders</p>
        </div>
        
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline">
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <Bell className="h-8 w-8 text-habit-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{notifications.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-8 w-8 text-habit-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{unreadCount}</div>
            <div className="text-sm text-muted-foreground">Unread</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <BellOff className="h-8 w-8 text-habit-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {notifications.filter(n => n.actionable).length}
            </div>
            <div className="text-sm text-muted-foreground">Actionable</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card className="bg-gradient-card shadow-habit-md border-0">
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('read')}
            >
              Read ({notifications.length - unreadCount})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="bg-gradient-hero border-0 shadow-habit-md">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="text-6xl mb-4">
              {filter === 'unread' ? '🔕' : filter === 'read' ? '✅' : '🔔'}
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {filter === 'unread' 
                ? 'No Unread Notifications' 
                : filter === 'read' 
                ? 'No Read Notifications'
                : 'No Notifications'
              }
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {filter === 'unread' 
                ? "You're all caught up! No new notifications to review."
                : filter === 'read'
                ? "You haven't read any notifications yet."
                : "You'll see important updates, reminders, and achievements here."
              }
            </p>
            {filter !== 'all' && (
              <Button variant="outline" onClick={() => setFilter('all')}>
                View All Notifications
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notification Settings */}
      <Card className="bg-gradient-hero border-0 shadow-habit-md">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Bell className="h-5 w-5 text-habit-primary mr-2" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Customize what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Habit Reminders</h4>
              <p className="text-sm text-muted-foreground">Get notified when it's time to complete your habits</p>
              <Button variant="outline" size="sm" className="w-full">Configure</Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Achievement Alerts</h4>
              <p className="text-sm text-muted-foreground">Celebrate when you unlock new achievements</p>
              <Button variant="outline" size="sm" className="w-full">Configure</Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">AI Suggestions</h4>
              <p className="text-sm text-muted-foreground">Receive personalized productivity suggestions</p>
              <Button variant="outline" size="sm" className="w-full">Configure</Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Squad Updates</h4>
              <p className="text-sm text-muted-foreground">Stay updated on your accountability partners</p>
              <Button variant="outline" size="sm" className="w-full">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}