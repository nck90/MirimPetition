import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import Index from "./pages/Index";
import PetitionList from "./pages/PetitionList";
import PetitionDetail from "./pages/PetitionDetail";
import CreatePetition from "./pages/CreatePetition";
import NotFound from "./pages/NotFound";
import "./index.css";
import Notices from "./pages/Notices";
import FAQ from "./pages/FAQ";
import { usePetitionStore } from "./store/usePetitionStore";
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

const queryClient = new QueryClient();

const App = () => {
  const { petitions, fetchPetitions } = usePetitionStore();
  if (petitions.length === 0) fetchPetitions();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/petitions" element={<PetitionList />} />
                <Route path="/petitions/:id" element={<PetitionDetail />} />
                <Route
                  path="/create-petition"
                  element={
                    <PrivateRoute>
                      <CreatePetition />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route path="/notices" element={<Notices />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
};

export default App;
