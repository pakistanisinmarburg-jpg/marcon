import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import HousingPage from './pages/HousingPage';
import JobsPage from './pages/JobsPage';
import MarketPage from './pages/MarketPage';
import QuestionsPage from './pages/QuestionsPage';
import ReportPage from './pages/ReportPage';
import SprachCafePage from './pages/SprachCafePage';
import CalendarPage from './pages/CalendarPage';
import CommunitiesPage from './pages/CommunitiesPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/housing" element={<HousingPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/sprach-cafe" element={<SprachCafePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
