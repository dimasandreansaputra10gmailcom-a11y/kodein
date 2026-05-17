import { Map as MapIcon, Compass, BarChart3, User, Terminal, Users, Home, ShieldAlert } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useAuthStore } from '../store/useAuthStore';

export const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  if (location.pathname === '/' || location.pathname === '/onboarding' || location.pathname === '/login' || location.pathname === '/verify-email') {
    return null;
  }

  const tabs = [
    { id: 'dashboard', label: 'HOME', icon: Home, path: '/dashboard' },
    { id: 'adventure', label: 'ADVENTURE', icon: MapIcon, path: '/adventure' },
    { id: 'community', label: 'COMMUNITY', icon: Users, path: '/community' },
    { id: 'rank', label: 'RANK', icon: BarChart3, path: '/leaderboard' },
    { id: 'me', label: 'PROFILE', icon: User, path: '/profile' },
  ];

  if (user?.isAdmin) {
    tabs.push({ id: 'admin', label: 'ADMIN', icon: ShieldAlert, path: '/admin' });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 px-2 sm:px-4 py-3 md:py-4 lg:py-6 flex justify-center z-[55] pointer-events-none">
      <div className="flex items-center justify-between sm:justify-center bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl rounded-full p-1 sm:p-1.5 border border-gray-200 dark:border-white/10 shadow-xl gap-0.5 sm:gap-1 w-full sm:w-auto max-w-full mx-auto pointer-events-auto transition-colors duration-300 overflow-x-auto hidden-scrollbar">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={tab.path}
            className={cn(
              "flex flex-col lg:flex-row items-center gap-0.5 md:gap-1.5 lg:gap-2 px-1 sm:px-2 md:px-3 lg:px-6 py-1.5 sm:py-2 rounded-full font-bold transition-all duration-300 whitespace-nowrap min-w-0 justify-center flex-1 sm:flex-none shrink-0",
              location.pathname === tab.path ? "bg-cta-yellow text-primary-accent tactile-btn border border-yellow-300" : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
            )}
          >
            <tab.icon className={cn("w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 shrink-0", location.pathname === tab.path ? "fill-primary-accent" : "")} />
            <span className={cn("text-[9px] md:text-[10px] lg:text-sm tracking-wide", location.pathname !== tab.path && "hidden md:inline-block")}>{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
