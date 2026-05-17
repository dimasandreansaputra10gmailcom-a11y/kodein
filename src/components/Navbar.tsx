import { motion } from 'motion/react';
import { Star, Heart, Moon, Sun, Laptop, User } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { useAuthStore } from '../store/useAuthStore';
import { AudioController } from './AudioController';

export const Navbar = ({ xp = 0, lives = 5 }) => {
  const location = useLocation();
  const isDarkMap = location.pathname.includes('dark-map');
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAuthStore();
  
  const displayXp = isAuthenticated ? user?.xp : xp;
  const displayLives = isAuthenticated ? user?.lives : lives;
  
  const isHome = location.pathname === '/';
  const isOnboarding = location.pathname === '/onboarding';
  const isLogin = location.pathname === '/login';
  
  // only show lives on stage
  const showLivesPaths = ['/stage', '/logic-quest', '/pattern-challenge', '/coding'];
  const showLives = showLivesPaths.some(path => location.pathname.startsWith(path));

  // Calculate resolved theme
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    if (theme === 'system') {
      setResolvedTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  const toggleTargetTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const getThemeIcon = () => {
    if (resolvedTheme === 'dark') return <Sun className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-yellow-500" />;
    return <Moon className="w-4 h-4 md:w-5 md:h-5 text-slate-500 dark:text-slate-400" />;
  };

  return (
    <nav className={isDarkMap ? "bg-dark-navy/80 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/10" : "bg-white/80 dark:bg-[#0f172a]/60 backdrop-blur-xl sticky top-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between border-b-2 border-primary-bg dark:border-white/10 transition-colors duration-300"}>
      <Link to="/" className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-1 md:gap-2">
        <span className="text-primary-accent italic">Kode</span>
        <span className={isDarkMap ? "text-white" : "text-primary-accent dark:text-white transition-colors duration-300"}>.in</span>
      </Link>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <AudioController />
        
        <button 
          onClick={toggleTargetTheme} 
          title={`Active theme: ${theme}`}
          className="p-1.5 sm:p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300 shadow-sm flex items-center justify-center min-w-[36px]"
        >
          {getThemeIcon()}
        </button>

        {!isHome && !isOnboarding && !isLogin && (
          <>
            <div className="flex items-center gap-1 sm:gap-2 bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gray-100 dark:border-white/10 shadow-sm transition-colors duration-300">
              <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-xp-gold fill-xp-gold" />
              <span className="font-bold text-[#1e2d3d] dark:text-white text-[10px] md:text-sm transition-colors duration-300">{displayXp} XP</span>
            </div>
            
            {showLives && (
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl px-2 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gray-100 dark:border-white/10 shadow-sm transition-colors duration-300">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Heart key={i} className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-colors duration-300 ${i < (displayLives || 0) ? 'text-rose-500 fill-rose-500' : 'text-slate-300 dark:text-slate-600'}`} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};
