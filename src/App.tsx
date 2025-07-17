import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Tasks from "./pages/Tasks";
import Habits from "./pages/Habits";
import Calendar from "./pages/Calendar";
import AICoPilot from "./pages/AICoPilot";
import SecondBrain from "./pages/SecondBrain";
import Notes from "./pages/Notes";
import Analytics from "./pages/Analytics";
import Achievements from "./pages/Achievements";
import Squad from "./pages/Squad";
import Goals from "./pages/Goals";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Utilities from "./pages/Utilities";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="habits" element={<Habits />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="ai-copilot" element={<AICoPilot />} />
            <Route path="second-brain" element={<SecondBrain />} />
            <Route path="notes" element={<Notes />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="squad" element={<Squad />} />
            <Route path="goals" element={<Goals />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="utilities" element={<Utilities />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
