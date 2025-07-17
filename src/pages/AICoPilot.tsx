import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useHabitStore } from '@/stores/habitStore';
import { Bot, Send, User, Sparkles, TrendingUp, Clock, Target } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AICoPilot() {
  const { habits, tasks, goals, settings, getCompletionRate } = useHabitStore();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('ai-messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Initial welcome message
      const welcomeMessage: Message = {
        id: '1',
        content: `Hi ${settings.userName}! 👋 I'm your AI Co-Pilot. I'm here to help you with your habits, tasks, and goals. Try asking me things like:

• "How am I doing today?"
• "What should I focus on?"
• "Show me my progress"
• "Remind me to meditate at 6 PM"
• "What habits should I work on?"`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [settings.userName]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    const completionRate = getCompletionRate();
    const pendingTasks = tasks.filter(t => !t.completed).length;
    const totalTasks = tasks.length;
    const todayDate = new Date().toISOString().split('T')[0];
    const completedHabitsToday = habits.filter(h => h.completedDates.includes(todayDate)).length;
    const totalHabits = habits.length;

    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `Hello ${settings.userName}! 😊 Ready to make today amazing? You have ${pendingTasks} pending tasks and ${totalHabits - completedHabitsToday} habits left to complete today.`;
    }

    // Progress inquiries
    if (message.includes('how am i doing') || message.includes('progress') || message.includes('doing today')) {
      return `Great question! Here's your progress snapshot:

📊 **Today's Completion**: ${Math.round(completionRate)}%
✅ **Tasks**: ${totalTasks - pendingTasks}/${totalTasks} completed
🔁 **Habits**: ${completedHabitsToday}/${totalHabits} completed
🎯 **Goals**: ${goals.filter(g => g.status === 'in-progress').length} active goals

${completionRate >= 80 ? "You're crushing it! 🔥" : completionRate >= 50 ? "Good momentum! Keep going! 💪" : "Let's get those numbers up! You've got this! 🚀"}`;
    }

    // Task-related queries
    if (message.includes('task') || message.includes('pending') || message.includes('to do')) {
      if (pendingTasks === 0) {
        return "🎉 Amazing! You have no pending tasks. You're all caught up! Time to relax or maybe create some new tasks for tomorrow.";
      }
      return `You have ${pendingTasks} pending tasks:

${tasks.filter(t => !t.completed).slice(0, 3).map(task => 
  `• ${task.title} ${task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}`
).join('\n')}

${pendingTasks > 3 ? `\n...and ${pendingTasks - 3} more.` : ''}

Focus on the high-priority ones first! 🎯`;
    }

    // Habit-related queries
    if (message.includes('habit') || message.includes('routine')) {
      const uncompletedToday = habits.filter(h => !h.completedDates.includes(todayDate));
      if (uncompletedToday.length === 0) {
        return "🌟 Incredible! You've completed all your habits for today. Your consistency is inspiring!";
      }
      return `You have ${uncompletedToday.length} habits left for today:

${uncompletedToday.slice(0, 3).map(habit => `• ${habit.name}`).join('\n')}

Remember, small consistent actions lead to big results! 💪`;
    }

    // Focus and motivation
    if (message.includes('focus') || message.includes('what should i') || message.includes('recommend')) {
      const suggestions = [];
      
      if (pendingTasks > 0) {
        const highPriorityTasks = tasks.filter(t => !t.completed && t.priority === 'high');
        if (highPriorityTasks.length > 0) {
          suggestions.push(`🔥 Tackle "${highPriorityTasks[0].title}" - it's high priority`);
        } else {
          suggestions.push(`📝 Complete "${tasks.filter(t => !t.completed)[0]?.title}" from your task list`);
        }
      }

      const uncompletedHabits = habits.filter(h => !h.completedDates.includes(todayDate));
      if (uncompletedHabits.length > 0) {
        suggestions.push(`🔁 Work on "${uncompletedHabits[0].name}" to maintain your streak`);
      }

      if (suggestions.length === 0) {
        return "🎯 You're doing great! All tasks and habits are complete. Consider setting a new goal or taking some well-deserved rest.";
      }

      return `Here's what I recommend focusing on:

${suggestions.join('\n')}

You've got this! 🚀`;
    }

    // Reminder setup (mock)
    if (message.includes('remind me') || message.includes('reminder')) {
      const reminderMatch = message.match(/remind me to (.+?) at (.+)/);
      if (reminderMatch) {
        const task = reminderMatch[1];
        const time = reminderMatch[2];
        return `✅ Got it! I'll remind you to ${task} at ${time}. 
        
(Note: This is a demo - reminders are not actually set yet, but this feature is coming soon!)`;
      }
      return "I'd love to help you set reminders! Try saying something like 'Remind me to meditate at 6 PM' 🔔";
    }

    // Goal-related
    if (message.includes('goal')) {
      const activeGoals = goals.filter(g => g.status === 'in-progress');
      if (activeGoals.length === 0) {
        return "🎯 You don't have any active goals right now. Consider setting some goals to give yourself direction and motivation!";
      }
      return `You have ${activeGoals.length} active goals:

${activeGoals.slice(0, 3).map(goal => 
  `• ${goal.title} (${goal.currentProgress}/${goal.targetCount})`
).join('\n')}

Keep pushing towards your targets! Every step counts! 🏆`;
    }

    // Analytics and stats
    if (message.includes('analytics') || message.includes('stats') || message.includes('performance')) {
      return `📈 Here are your key stats:

**This Week:**
• Average completion rate: ${Math.round(completionRate)}%
• Longest habit streak: ${Math.max(...habits.map(h => h.streak), 0)} days
• Tasks completed: ${tasks.filter(t => t.completed).length}

**Insights:**
${completionRate >= 70 ? "• You're maintaining excellent consistency! 🔥" : "• Focus on building more consistent daily habits 📈"}
• Your most successful habit: ${habits.length > 0 ? habits.reduce((a, b) => a.completedDates.length > b.completedDates.length ? a : b).name : 'None yet'}

Keep up the momentum! 💪`;
    }

    // Motivational responses
    if (message.includes('motivation') || message.includes('motivate') || message.includes('encourage')) {
      const motivationalMessages = [
        `🌟 ${settings.userName}, you're building something amazing! Every habit completed and task finished is a step towards the person you want to become.`,
        `💪 Remember, progress isn't about perfection - it's about consistency. You're already ${Math.round(completionRate)}% there today!`,
        `🚀 The fact that you're here, actively working on yourself, already puts you ahead of most people. Keep going!`,
        `🌱 Small daily improvements lead to stunning long-term results. You're planting seeds for future success!`,
        `⭐ Every expert was once a beginner. Every pro was once an amateur. Keep practicing, keep improving!`
      ];
      return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    }

    // Help and capabilities
    if (message.includes('help') || message.includes('what can you do')) {
      return `🤖 I'm here to help you succeed! Here's what I can do:

**📊 Track your progress:**
• Show completion rates and statistics
• Analyze your habit consistency
• Monitor task completion

**🎯 Provide guidance:**
• Suggest what to focus on next
• Give personalized recommendations
• Share motivational insights

**💬 Answer questions like:**
• "How am I doing today?"
• "What should I focus on?"
• "Show me my habits"
• "Motivate me!"

Just ask me anything about your productivity journey! 😊`;
    }

    // Thank you responses
    if (message.includes('thank') || message.includes('thanks')) {
      return `You're very welcome, ${settings.userName}! 😊 I'm here whenever you need guidance or motivation. Keep up the fantastic work! 🌟`;
    }

    // Default responses for unrecognized queries
    const defaultResponses = [
      `I'm not sure I understand that perfectly, but I'm here to help! Try asking me about your habits, tasks, or goals. 😊`,
      `Hmm, let me think... Could you rephrase that? I'm great at helping with productivity questions! 🤔`,
      `I want to help! Try asking me something like "How am I doing today?" or "What should I focus on?" 💡`,
      `That's an interesting question! I'm best at helping with your habits, tasks, and goals. What would you like to know about those? 🎯`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 seconds delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`p-2 rounded-full ${message.sender === 'user' ? 'bg-gradient-primary' : 'bg-secondary'}`}>
          {message.sender === 'user' ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-foreground" />
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          message.sender === 'user' 
            ? 'bg-gradient-primary text-white' 
            : 'bg-card border border-border'
        }`}>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
          <div className={`text-xs mt-1 ${
            message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );

  const suggestedQuestions = [
    "How am I doing today?",
    "What should I focus on?",
    "Show me my progress",
    "Motivate me!",
    "What habits should I work on?"
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Co-Pilot 🤖</h1>
          <p className="text-muted-foreground">Your intelligent productivity assistant</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-habit-primary" />
          <span className="text-sm font-medium text-foreground">Online</span>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 bg-gradient-card shadow-habit-md border-0 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground flex items-center">
            <Bot className="h-5 w-5 text-habit-primary mr-2" />
            Chat with your AI Assistant
          </CardTitle>
          <CardDescription>
            Ask me anything about your habits, tasks, and productivity goals
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            {messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="p-2 rounded-full bg-secondary">
                    <Bot className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="p-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage(question)}
                    className="text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isTyping}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}