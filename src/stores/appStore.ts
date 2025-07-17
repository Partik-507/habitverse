import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============= TYPES =============

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
}

export interface SecondBrainItem {
  id: string;
  title: string;
  content: string;
  type: 'link' | 'video' | 'text' | 'pdf';
  url?: string;
  tags: string[];
  createdAt: string;
  summary?: string;
}

export interface MoodEntry {
  id: string;
  mood: number; // 1-5 scale
  note?: string;
  date: string;
}

export interface SleepEntry {
  id: string;
  bedtime: string;
  wakeup: string;
  quality: number; // 1-5 scale
  date: string;
}

export interface MeditationEntry {
  id: string;
  duration: number; // minutes
  type: string;
  date: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: 'applied' | 'interviewed' | 'offer' | 'rejected';
  appliedDate: string;
  notes?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-100
  category: string;
  goalLevel: number;
  resources: string[];
}

export interface TravelDestination {
  id: string;
  name: string;
  country: string;
  visited: boolean;
  wishlistDate: string;
  visitDate?: string;
  rating?: number;
  notes?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  status: 'want-to-read' | 'reading' | 'completed';
  pages: number;
  currentPage: number;
  rating?: number;
  notes?: string;
  startedDate?: string;
  completedDate?: string;
}

export interface Movie {
  id: string;
  title: string;
  director: string;
  status: 'want-to-watch' | 'watching' | 'completed';
  rating?: number;
  notes?: string;
  watchedDate?: string;
}

export interface Relationship {
  id: string;
  name: string;
  relationship: string;
  birthday?: string;
  notes: string;
  lastContact: string;
  contactFrequency: number; // days
}

export interface GratitudeEntry {
  id: string;
  content: string;
  date: string;
}

export interface Affirmation {
  id: string;
  text: string;
  category: string;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  task: string;
  duration: number; // minutes
  type: 'pomodoro' | 'deep-work';
  completedAt: string;
  notes?: string;
}

// ============= STORE INTERFACE =============

interface AppStore {
  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;

  // Second Brain
  secondBrainItems: SecondBrainItem[];
  addSecondBrainItem: (item: Omit<SecondBrainItem, 'id' | 'createdAt'>) => void;
  deleteSecondBrainItem: (id: string) => void;

  // Wellness
  moodEntries: MoodEntry[];
  sleepEntries: SleepEntry[];
  meditationEntries: MeditationEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  addSleepEntry: (entry: Omit<SleepEntry, 'id'>) => void;
  addMeditationEntry: (entry: Omit<MeditationEntry, 'id'>) => void;

  // Finance
  expenses: Expense[];
  financialGoals: FinancialGoal[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addFinancialGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  updateFinancialGoal: (id: string, amount: number) => void;

  // Career
  jobApplications: JobApplication[];
  skills: Skill[];
  addJobApplication: (app: Omit<JobApplication, 'id'>) => void;
  updateJobApplicationStatus: (id: string, status: JobApplication['status']) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkillLevel: (id: string, level: number) => void;

  // Travel
  travelDestinations: TravelDestination[];
  addTravelDestination: (destination: Omit<TravelDestination, 'id'>) => void;
  markDestinationVisited: (id: string, rating: number, notes: string) => void;

  // Entertainment
  books: Book[];
  movies: Movie[];
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBookProgress: (id: string, currentPage: number) => void;
  addMovie: (movie: Omit<Movie, 'id'>) => void;

  // Relationships
  relationships: Relationship[];
  addRelationship: (relationship: Omit<Relationship, 'id'>) => void;
  updateLastContact: (id: string, date: string) => void;

  // Spiritual
  gratitudeEntries: GratitudeEntry[];
  affirmations: Affirmation[];
  addGratitudeEntry: (entry: Omit<GratitudeEntry, 'id'>) => void;
  addAffirmation: (affirmation: Omit<Affirmation, 'id'>) => void;

  // Focus
  focusSessions: FocusSession[];
  addFocusSession: (session: Omit<FocusSession, 'id'>) => void;

  // UI State
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentFocusMode: boolean;
  toggleFocusMode: () => void;

  // Analytics helpers
  getWeeklyMoodAverage: () => number;
  getMonthlyExpensesByCategory: () => Record<string, number>;
  getProductivityScore: () => number;
}

// ============= MOCK DATA =============

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    status: 'reading',
    pages: 320,
    currentPage: 145,
    startedDate: '2024-01-15',
  },
  {
    id: '2',
    title: 'The 7 Habits of Highly Effective People',
    author: 'Stephen Covey',
    status: 'completed',
    pages: 432,
    currentPage: 432,
    rating: 5,
    completedDate: '2024-01-10',
  },
];

const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'Inception',
    director: 'Christopher Nolan',
    status: 'completed',
    rating: 5,
    watchedDate: '2024-01-12',
  },
  {
    id: '2',
    title: 'The Matrix',
    director: 'Wachowski Sisters',
    status: 'want-to-watch',
  },
];

const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'React Development',
    level: 75,
    goalLevel: 90,
    category: 'Programming',
    resources: ['React Docs', 'Udemy Course'],
  },
  {
    id: '2',
    name: 'Public Speaking',
    level: 40,
    goalLevel: 80,
    category: 'Soft Skills',
    resources: ['Toastmasters', 'TED Talks'],
  },
];

const mockTravelDestinations: TravelDestination[] = [
  {
    id: '1',
    name: 'Tokyo',
    country: 'Japan',
    visited: false,
    wishlistDate: '2024-01-01',
  },
  {
    id: '2',
    name: 'Paris',
    country: 'France',
    visited: true,
    wishlistDate: '2023-06-01',
    visitDate: '2023-12-15',
    rating: 5,
    notes: 'Amazing architecture and food!',
  },
];

const mockAffirmations: Affirmation[] = [
  {
    id: '1',
    text: 'I am capable of achieving my goals',
    category: 'Self-Confidence',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    text: 'Every day I am getting better and better',
    category: 'Growth',
    createdAt: '2024-01-02',
  },
];

// ============= STORE IMPLEMENTATION =============

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial Data
      notes: [],
      secondBrainItems: [],
      moodEntries: [],
      sleepEntries: [],
      meditationEntries: [],
      expenses: [],
      financialGoals: [],
      jobApplications: [],
      skills: mockSkills,
      travelDestinations: mockTravelDestinations,
      books: mockBooks,
      movies: mockMovies,
      relationships: [],
      gratitudeEntries: [],
      affirmations: mockAffirmations,
      focusSessions: [],
      sidebarCollapsed: false,
      currentFocusMode: false,

      // Notes Actions
      addNote: (note) => {
        const newNote: Note = {
          ...note,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ notes: [...state.notes, newNote] }));
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((note) => note.id !== id) }));
      },

      togglePinNote: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, pinned: !note.pinned } : note
          ),
        }));
      },

      // Second Brain Actions
      addSecondBrainItem: (item) => {
        const newItem: SecondBrainItem = {
          ...item,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ secondBrainItems: [...state.secondBrainItems, newItem] }));
      },

      deleteSecondBrainItem: (id) => {
        set((state) => ({
          secondBrainItems: state.secondBrainItems.filter((item) => item.id !== id),
        }));
      },

      // Wellness Actions
      addMoodEntry: (entry) => {
        const newEntry: MoodEntry = { ...entry, id: Date.now().toString() };
        set((state) => ({ moodEntries: [...state.moodEntries, newEntry] }));
      },

      addSleepEntry: (entry) => {
        const newEntry: SleepEntry = { ...entry, id: Date.now().toString() };
        set((state) => ({ sleepEntries: [...state.sleepEntries, newEntry] }));
      },

      addMeditationEntry: (entry) => {
        const newEntry: MeditationEntry = { ...entry, id: Date.now().toString() };
        set((state) => ({ meditationEntries: [...state.meditationEntries, newEntry] }));
      },

      // Finance Actions
      addExpense: (expense) => {
        const newExpense: Expense = { ...expense, id: Date.now().toString() };
        set((state) => ({ expenses: [...state.expenses, newExpense] }));
      },

      addFinancialGoal: (goal) => {
        const newGoal: FinancialGoal = { ...goal, id: Date.now().toString() };
        set((state) => ({ financialGoals: [...state.financialGoals, newGoal] }));
      },

      updateFinancialGoal: (id, amount) => {
        set((state) => ({
          financialGoals: state.financialGoals.map((goal) =>
            goal.id === id ? { ...goal, currentAmount: amount } : goal
          ),
        }));
      },

      // Career Actions
      addJobApplication: (app) => {
        const newApp: JobApplication = { ...app, id: Date.now().toString() };
        set((state) => ({ jobApplications: [...state.jobApplications, newApp] }));
      },

      updateJobApplicationStatus: (id, status) => {
        set((state) => ({
          jobApplications: state.jobApplications.map((app) =>
            app.id === id ? { ...app, status } : app
          ),
        }));
      },

      addSkill: (skill) => {
        const newSkill: Skill = { ...skill, id: Date.now().toString() };
        set((state) => ({ skills: [...state.skills, newSkill] }));
      },

      updateSkillLevel: (id, level) => {
        set((state) => ({
          skills: state.skills.map((skill) =>
            skill.id === id ? { ...skill, level } : skill
          ),
        }));
      },

      // Travel Actions
      addTravelDestination: (destination) => {
        const newDestination: TravelDestination = {
          ...destination,
          id: Date.now().toString(),
        };
        set((state) => ({
          travelDestinations: [...state.travelDestinations, newDestination],
        }));
      },

      markDestinationVisited: (id, rating, notes) => {
        set((state) => ({
          travelDestinations: state.travelDestinations.map((dest) =>
            dest.id === id
              ? {
                  ...dest,
                  visited: true,
                  visitDate: new Date().toISOString().split('T')[0],
                  rating,
                  notes,
                }
              : dest
          ),
        }));
      },

      // Entertainment Actions
      addBook: (book) => {
        const newBook: Book = { ...book, id: Date.now().toString() };
        set((state) => ({ books: [...state.books, newBook] }));
      },

      updateBookProgress: (id, currentPage) => {
        set((state) => ({
          books: state.books.map((book) => {
            if (book.id === id) {
              const status = currentPage >= book.pages ? 'completed' : 'reading';
              return {
                ...book,
                currentPage,
                status,
                completedDate: status === 'completed' ? new Date().toISOString().split('T')[0] : book.completedDate,
              };
            }
            return book;
          }),
        }));
      },

      addMovie: (movie) => {
        const newMovie: Movie = { ...movie, id: Date.now().toString() };
        set((state) => ({ movies: [...state.movies, newMovie] }));
      },

      // Relationship Actions
      addRelationship: (relationship) => {
        const newRelationship: Relationship = {
          ...relationship,
          id: Date.now().toString(),
        };
        set((state) => ({ relationships: [...state.relationships, newRelationship] }));
      },

      updateLastContact: (id, date) => {
        set((state) => ({
          relationships: state.relationships.map((rel) =>
            rel.id === id ? { ...rel, lastContact: date } : rel
          ),
        }));
      },

      // Spiritual Actions
      addGratitudeEntry: (entry) => {
        const newEntry: GratitudeEntry = { ...entry, id: Date.now().toString() };
        set((state) => ({ gratitudeEntries: [...state.gratitudeEntries, newEntry] }));
      },

      addAffirmation: (affirmation) => {
        const newAffirmation: Affirmation = { ...affirmation, id: Date.now().toString() };
        set((state) => ({ affirmations: [...state.affirmations, newAffirmation] }));
      },

      // Focus Actions
      addFocusSession: (session) => {
        const newSession: FocusSession = { ...session, id: Date.now().toString() };
        set((state) => ({ focusSessions: [...state.focusSessions, newSession] }));
      },

      // UI Actions
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      toggleFocusMode: () => {
        set((state) => ({ currentFocusMode: !state.currentFocusMode }));
      },

      // Analytics
      getWeeklyMoodAverage: () => {
        const state = get();
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const recentMoods = state.moodEntries.filter(
          (entry) => new Date(entry.date) >= lastWeek
        );
        
        if (recentMoods.length === 0) return 0;
        
        return recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length;
      },

      getMonthlyExpensesByCategory: () => {
        const state = get();
        const thisMonth = new Date();
        thisMonth.setDate(1);
        
        const monthlyExpenses = state.expenses.filter(
          (expense) => new Date(expense.date) >= thisMonth
        );
        
        return monthlyExpenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {} as Record<string, number>);
      },

      getProductivityScore: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        
        // Calculate based on focus sessions and other wellness metrics
        const focusTime = state.focusSessions
          .filter((session) => session.completedAt.startsWith(today))
          .reduce((sum, session) => sum + session.duration, 0);
        
        const todayMood = state.moodEntries.find(entry => entry.date === today);
        const moodScore = todayMood ? todayMood.mood * 10 : 30; // Default neutral score
        
        const todayMeditation = state.meditationEntries
          .filter(entry => entry.date === today)
          .reduce((sum, entry) => sum + entry.duration, 0);
        
        // Simple scoring algorithm
        const focusScore = Math.min(focusTime / 60, 10) * 4; // Max 40 points for focus
        const meditationScore = Math.min(todayMeditation / 20, 10) * 2; // Max 20 points for meditation
        const wellnessScore = Math.min(moodScore + (meditationScore * 2), 40); // Max 40 points for wellness
        
        return Math.min(focusScore + wellnessScore, 100);
      },
    }),
    {
      name: 'app-store',
    }
  )
);