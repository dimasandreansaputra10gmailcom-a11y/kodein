import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AICompanion } from './components/AICompanion';
import { DecorativeBackground } from './components/DecorativeBackground';

// Pages
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Adventure from './pages/Adventure';
import Community from './pages/Community';
import MapPage from './pages/MapPage';
import Stage from './pages/Stage';
import QuestChat from './pages/QuestChat';
import LogicQuest from './pages/LogicQuest';
import PatternChallenge from './pages/PatternChallenge';
import Leaderboard from './pages/Leaderboard';
import DarkMap from './pages/DarkMap';
import CodingChallenge from './pages/CodingChallenge';
import Profile from './pages/Profile';

import { ThemeProvider } from './components/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="kodein-ui-theme">
      <Router>
        <div className="min-h-screen flex flex-col font-sans relative pb-20 md:pb-24">
        <DecorativeBackground />
        <Navbar xp={125} lives={5} />
        
        <main className="flex-1 flex flex-col w-full h-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/adventure" element={<Adventure />} />
            <Route path="/community" element={<Community />} />
            <Route path="/map/:levelId" element={<MapPage />} />
            <Route path="/stage/:levelId/:stageId" element={<Stage />} />
            <Route path="/quests" element={<QuestChat />} />
            <Route path="/logic-quest" element={<LogicQuest />} />
            <Route path="/pattern-challenge" element={<PatternChallenge />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/dark-map" element={<DarkMap />} />
            <Route path="/coding" element={<CodingChallenge />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <AICompanion />
        <BottomNav />
      </div>
    </Router>
    </ThemeProvider>
  );
}
