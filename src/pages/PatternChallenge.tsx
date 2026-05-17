import { useState } from 'react';
import { motion } from 'motion/react';
import { Lightbulb, Trophy, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { synth } from '../lib/synth';

export default function PatternChallenge() {
  const [selected, setSelected] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const { user, addXp, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  const pattern = ['🌟', '⭕', '🌟', '?'];
  const options = ['🌟', '⭕', '🔺', '⬜'];

  const getWIBDateString = () => {
    const wibDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    return wibDate.toISOString().split('T')[0];
  };
  const today = getWIBDateString();
  const isCompletedToday = user?.unlockedStages?.['2'] !== undefined && user?.unlockedStages?.['2'] >= 2 && user?.lastPatternQuizDate === today;

  const handleChoice = (opt: string) => {
    if (complete || isCompletedToday) return;
    
    setSelected(opt);
    if (opt === '⭕') {
      synth.playCorrect();
      setComplete(true);
      // Give XP and update progress
      addXp(50);
      const currentProgress = user?.unlockedStages?.['2'] || 0;
      
      // Reset if it's a new day and they had 2 before
      let nextProgress = currentProgress;
      if (user?.lastPatternQuizDate !== today) {
         nextProgress = 1;
      } else {
         nextProgress += 1;
      }
      
      updateProfile({ 
        unlockedStages: { ...user?.unlockedStages, '2': nextProgress },
        lastPatternQuizDate: today
      });
    } else {
      synth.playWrong();
      setTimeout(() => setSelected(null), 1000);
    }
  };

  if (isCompletedToday && !complete) {
    return (
      <div className="min-h-screen bg-transparent pb-32 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-6xl shadow-inner mb-6 border-4 border-green-400 dark:border-green-600">
          🏆
        </div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-4">Selesai untuk Hari Ini!</h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-sm">
          Kamu sudah menyelesaikan misi pola hari ini dengan sempurna. Silakan kembali besok!
        </p>
        <Link to="/profile">
          <Button variant="primary" className="px-12 py-4 shadow-lg text-lg">
            Kembali ke Profil
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-6 pb-32 flex flex-col gap-8 transition-colors duration-300">
      {/* Buddy Instruction */}
      <div className="flex items-start gap-4 max-w-xl mx-auto">
        <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center text-4xl shadow-xl border-b-4 border-slate-100 dark:border-gray-800 flex-shrink-0 animate-bounce-slow transition-colors duration-300">
          ☄️
        </div>
        <div className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl p-5 rounded-[24px] shadow-sm border border-slate-50 dark:border-white/10 flex-1 relative mt-2 transition-colors duration-300">
          <div className="absolute top-4 -left-2 w-4 h-4 bg-white dark:bg-slate-900 rotate-45 border-l border-b border-white dark:border-gray-900 transition-colors duration-300" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic transition-colors duration-300">
            "Ayo Explorer! Lihat polanya baik-baik. Bentuk apa yang melengkapi 'The Sequence' ini?"
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center gap-12">
        {/* Pattern Card */}
        <div className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl p-12 rounded-[40px] shadow-2xl border-b-[8px] border-slate-100 dark:border-white/10 w-full max-w-sm transition-colors duration-300">
          <p className="text-center text-xs font-black text-slate-300 dark:text-slate-500 uppercase tracking-[0.2em] mb-8 transition-colors duration-300">THE SEQUENCE</p>
          <div className="grid grid-cols-2 gap-8 items-center justify-items-center">
            {pattern.map((p, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "w-20 h-20 rounded-3xl flex items-center justify-center text-3xl transition-all duration-300",
                  p === '?' ? "bg-slate-50 dark:bg-slate-800 border-4 border-dashed border-slate-200 dark:border-gray-700 text-slate-200 dark:text-slate-500" : "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 shadow-sm"
                )}
              >
                {p === '?' && selected ? selected : p}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleChoice(opt)}
              disabled={complete}
              className={cn(
                "w-full h-24 rounded-[24px] border-4 transition-all duration-300 flex items-center justify-center text-2xl group",
                selected === opt 
                  ? (opt === '⭕' ? "bg-green-50 dark:bg-green-900/20 border-green-500" : "bg-red-50 dark:bg-red-900/20 border-red-500")
                  : "bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl border-slate-100 dark:border-white/10 hover:border-primary-accent shadow-sm",
                complete && selected !== opt && "opacity-50 grayscale"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Motivational Toast */}
      {complete && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-6 z-[60] border-t-4 pb-8 transition-colors duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] bg-green-50 dark:bg-green-950 border-green-400 dark:border-green-600"
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-16 h-16 shrink-0 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center text-4xl shadow-lg border-2 border-green-200 dark:border-green-800 transition-colors duration-300">
                🏆
              </div>
              <div>
                <h3 className="font-black text-xl lg:text-2xl text-green-800 dark:text-green-400 transition-colors duration-300">
                  MASTER OF PATTERNS!
                </h3>
                <p className="font-bold opacity-80 text-green-700 dark:text-green-500 transition-colors duration-300">
                  Kamu punya mata Elang, Explorer! +50 XP
                </p>
              </div>
            </div>
            
            <div className="w-full sm:w-auto mt-2 sm:mt-0 flex gap-3">
              <Link to="/profile" className="flex-1 sm:flex-none">
                <Button variant="yellow" className="w-full sm:px-12 py-4">
                  SELESAI <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Footer */}
      {!complete && (
      <div className="flex items-center justify-between max-w-sm mx-auto w-full mb-8">
        <div className="flex items-center gap-2">
          <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm transition-colors duration-300">
            <Lightbulb className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 transition-colors duration-300">LIHAT PETUNJUK (2/3)</span>
        </div>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={cn("w-2 h-2 rounded-full transition-colors duration-300", i <= 4 ? "bg-primary-accent" : "bg-slate-200 dark:bg-slate-700")} />
          ))}
        </div>
      </div>
      )}
    </div>
  );
}
