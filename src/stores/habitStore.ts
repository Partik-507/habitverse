import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  streak: number;
  completedDates: string[];
  createdAt: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentProgress: number;
  dueDate: string;
  status: 'in-progress' | 'completed';
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Settings {
  darkMode: boolean;
  soundEffects: boolean;
  aiSuggestions: boolean;
  userName: string;
}

export interface SquadMember {
  id: string;
  username: string;
  avatar: string;
  currentStreak: number;
  lastActive: string;
}

interface HabitStore {
  // Data
  habits: Habit[];
  tasks: Task[];
  goals: Goal[];
  achievements: Achievement[];
  settings: Settings;
  squadMembers: SquadMember[];
  
  // Habit actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'completedDates' | 'isCompleted'>) => void;
  completeHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  // Goal actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'status'>) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  deleteGoal: (id: string) => void;
  
  // Achievement actions
  unlockAchievement: (id: string) => void;
  
  // Settings actions
  updateSettings: (settings: Partial<Settings>) => void;
  
  // Analytics getters
  getCompletionRate: () => number;
  getLongestStreak: () => number;
  getMostCompletedHabit: () => string;
  getTaskStats: () => { completed: number; total: number };
  
  // Reset
  resetAllData: () => void;
}

const initialAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Task Completed',
    description: 'Complete your very first task',
    icon: '✅',
    unlocked: false,
  },
  {
    id: '2',
    title: 'Hat Trick',
    description: 'Complete 3 habits in a single day',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: '3',
    title: 'Week Warrior',
    description: 'Maintain a 7-day habit streak',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: '4',
    title: 'Task Ninja',
    description: 'Complete 50 tasks',
    icon: '🥷',
    unlocked: false,
  },
  {
    id: '5',
    title: 'Goal Getter',
    description: 'Complete your first goal',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: '6',
    title: 'Consistency King',
    description: 'Complete habits for 30 days straight',
    icon: '👑',
    unlocked: false,
  },
];

const initialSquadMembers: SquadMember[] = [
  {
    id: '1',
    username: 'Alex_Fitness',
    avatar: '💪',
    currentStreak: 12,
    lastActive: '2 hours ago',
  },
  {
    id: '2',
    username: 'Sarah_Reader',
    avatar: '📚',
    currentStreak: 8,
    lastActive: '1 hour ago',
  },
  {
    id: '3',
    username: 'Mike_Coder',
    avatar: '💻',
    currentStreak: 15,
    lastActive: '30 min ago',
  },
  {
    id: '4',
    username: 'Emma_Yoga',
    avatar: '🧘‍♀️',
    currentStreak: 5,
    lastActive: '45 min ago',
  },
  {
    id: '5',
    username: 'David_Chef',
    avatar: '👨‍🍳',
    currentStreak: 7,
    lastActive: '3 hours ago',
  },
];

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      tasks: [],
      goals: [],
      achievements: initialAchievements,
      settings: {
        darkMode: false,
        soundEffects: true,
        aiSuggestions: true,
        userName: 'Kunal',
      },
      squadMembers: initialSquadMembers,

      addHabit: (habit) => {
        const newHabit: Habit = {
          ...habit,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          streak: 0,
          completedDates: [],
          isCompleted: false,
        };
        set((state) => ({ habits: [...state.habits, newHabit] }));
      },

      completeHabit: (id) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id === id) {
              const alreadyCompleted = habit.completedDates.includes(today);
              if (!alreadyCompleted) {
                const newCompletedDates = [...habit.completedDates, today];
                return {
                  ...habit,
                  completedDates: newCompletedDates,
                  streak: habit.streak + 1,
                  isCompleted: true,
                };
              }
            }
            return habit;
          }),
        }));
        
        // Check achievements
        const state = get();
        const completedToday = state.habits.filter(h => 
          h.completedDates.includes(today)
        ).length;
        
        if (completedToday >= 3) {
          get().unlockAchievement('2');
        }
        
        const longestStreak = Math.max(...state.habits.map(h => h.streak));
        if (longestStreak >= 7) {
          get().unlockAchievement('3');
        }
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        }));
      },

      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          completed: false,
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      completeTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, completed: true, completedAt: new Date().toISOString() }
              : task
          ),
        }));
        
        // Check achievements
        const state = get();
        const completedTasks = state.tasks.filter(t => t.completed).length;
        
        if (completedTasks === 1) {
          get().unlockAchievement('1');
        }
        if (completedTasks >= 50) {
          get().unlockAchievement('4');
        }
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      addGoal: (goal) => {
        const newGoal: Goal = {
          ...goal,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          status: 'in-progress',
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },

      updateGoalProgress: (id, progress) => {
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id === id) {
              const status = progress >= goal.targetCount ? 'completed' : 'in-progress';
              if (status === 'completed' && goal.status === 'in-progress') {
                get().unlockAchievement('5');
              }
              return { ...goal, currentProgress: progress, status };
            }
            return goal;
          }),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }));
      },

      unlockAchievement: (id) => {
        set((state) => ({
          achievements: state.achievements.map((achievement) =>
            achievement.id === id && !achievement.unlocked
              ? { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
              : achievement
          ),
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      getCompletionRate: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const totalHabits = state.habits.length;
        const completedToday = state.habits.filter(h => 
          h.completedDates.includes(today)
        ).length;
        return totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
      },

      getLongestStreak: () => {
        const state = get();
        return Math.max(...state.habits.map(h => h.streak), 0);
      },

      getMostCompletedHabit: () => {
        const state = get();
        const habits = state.habits;
        if (habits.length === 0) return 'No habits yet';
        
        const mostCompleted = habits.reduce((prev, current) => 
          prev.completedDates.length > current.completedDates.length ? prev : current
        );
        return mostCompleted.name;
      },

      getTaskStats: () => {
        const state = get();
        const completed = state.tasks.filter(t => t.completed).length;
        const total = state.tasks.length;
        return { completed, total };
      },

      resetAllData: () => {
        set({
          habits: [],
          tasks: [],
          goals: [],
          achievements: initialAchievements.map(a => ({ ...a, unlocked: false, unlockedAt: undefined })),
          settings: {
            darkMode: false,
            soundEffects: true,
            aiSuggestions: true,
            userName: 'Kunal',
          },
        });
      },
    }),
    {
      name: 'habit-store',
    }
  )
);