import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { Button } from '@/src/components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useAuthStore } from '../store/useAuthStore';
import { synth } from '../lib/synth';

export default function LogicQuest() {
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { user, consumeLife, addXp, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  // Konversi ke WIB String (YYYY-MM-DD)
  const getWIBDateString = () => {
    const wibDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    return wibDate.toISOString().split('T')[0];
  };
  const today = getWIBDateString();
  const isCompletedToday = user?.lastLogicQuestDate === today;

  useEffect(() => {
    // We do not load stored incorrect state if it's already a new day
    if (!isCompletedToday) {
      const saved = sessionStorage.getItem('logicQuestState');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.selected !== undefined) setSelected(parsed.selected);
          if (parsed.isCorrect !== undefined) setIsCorrect(parsed.isCorrect);
        } catch (e) {}
      }
    }
  }, [isCompletedToday]);

  const options = [
    { label: 'A', value: 'name = "Budi"' },
    { label: 'B', value: 'int name = "Budi"' },
    { label: 'C', value: 'name : "Budi"' },
    { label: 'D', value: 'string name = "Budi"' },
  ];

  const handleAnswer = (index: number) => {
    setSelected(index);
    const correct = index === 0;
    
    if (correct) {
      synth.playCorrect();
      setIsCorrect(true);
      addXp(50); // Tambahkan 50 XP (karena profil bilangnya +50 XP dari daily)
      updateProfile({ lastLogicQuestDate: today });
      sessionStorage.removeItem('logicQuestState');
    } else {
      synth.playWrong();
      setIsCorrect(false);
      consumeLife();
      sessionStorage.setItem('logicQuestState', JSON.stringify({ selected: index, isCorrect: correct }));
    }
  };

  if (isCompletedToday && isCorrect === null) {
    return (
      <div className="min-h-screen bg-transparent pb-32 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-6xl shadow-inner mb-6 border-4 border-green-400 dark:border-green-600">
          ✨
        </div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-4">Selesai untuk Hari Ini!</h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-sm">
          Kamu sudah menyelesaikan misi logic hari ini. Silakan kembali besok saat waktu reset selesai.
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
    <div className="min-h-screen bg-transparent pb-32 transition-colors duration-300">
      <header className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl px-6 py-4 flex flex-col gap-4 border-b border-slate-100 dark:border-white/10 sticky top-0 z-20 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-slate-800 dark:text-gray-100 text-sm tracking-tight overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] transition-colors duration-300">
            LOGIC QUEST #04 — The Variable Maze
          </h2>
          <div className="bg-cta-yellow/20 px-3 py-1 rounded-full flex items-center gap-2 border border-cta-yellow/30">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            <span className="font-black text-xs text-amber-700 dark:text-amber-500 tracking-tighter">00:45</span>
          </div>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors duration-300">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '40%' }}
            className="h-full bg-primary-accent rounded-full shadow-[0_0_8px_rgba(13,148,136,0.5)]" 
          />
        </div>
      </header>

      <div className="p-6 max-w-2xl mx-auto space-y-8">
        {/* Buddy Tooltip */}
        <div className="flex flex-row-reverse items-start gap-4">
          <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-3xl shadow-inner animate-bounce-slow border-2 border-primary-accent transition-colors duration-300">☄️</div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl p-4 rounded-[20px] shadow-sm border border-slate-100 dark:border-white/10 flex-1 relative mt-2 transition-colors duration-300"
          >
            <div className="absolute top-4 -right-2 w-4 h-4 bg-white dark:bg-slate-900 rotate-45 border-t border-r border-slate-100 dark:border-gray-800 transition-colors duration-300" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic transition-colors duration-300">
              "Ingat! Di Python, kita tidak perlu menyebutkan jenis variabelnya. Langsung masukkan aja!"
            </p>
          </motion.div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl p-8 rounded-[32px] shadow-sm border-2 border-slate-100 dark:border-white/10 transition-colors duration-300">
          <p className="text-lg font-black text-slate-800 dark:text-gray-100 leading-snug transition-colors duration-300">
            Bagaimana cara yang benar untuk menyimpan kata <span className="bg-teal-100 dark:bg-teal-900/30 text-primary-accent dark:text-teal-400 px-2 rounded-md transition-colors duration-300">"Budi"</span> ke dalam variabel bernama <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 px-2 rounded-md transition-colors duration-300">name</span>?
          </p>
        </div>

        {/* Answer Options */}
        <div className="space-y-4">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={isCorrect !== null}
              className={cn(
                "w-full p-5 rounded-[24px] border-4 transition-all duration-300 flex items-center gap-6 group text-left",
                selected === i 
                  ? (isCorrect && i === 0 ? "bg-green-50 dark:bg-green-900/20 border-green-500 shadow-[0_8px_0_0_#22c55e]" : "bg-red-50 dark:bg-red-900/20 border-red-500 shadow-[0_8px_0_0_#ef4444]")
                  : "bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl border-slate-100 dark:border-white/10 hover:border-primary-accent shadow-[0_6px_0_0_#f1f5f9] dark:shadow-[0_6px_0_0_#ffffff10] hover:shadow-[0_6px_0_0_#ccfbf1]"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-black text-lg transition-colors duration-300 flex-shrink-0",
                selected === i 
                  ? (isCorrect && i === 0 ? "bg-green-500 text-white" : "bg-red-500 text-white")
                  : "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-primary-accent group-hover:text-white"
              )}>
                {opt.label}
              </div>
              <p className="font-mono font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-white transition-colors duration-300">
                {opt.value}
              </p>
              {isCorrect && i === 0 && <CheckCircle2 className="w-6 h-6 text-green-500 ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Card */}
      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 p-6 z-[60] border-t-4 pb-8 transition-colors duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]",
              isCorrect ? "bg-green-50 dark:bg-green-950 border-green-400 dark:border-green-600" : "bg-red-50 dark:bg-red-950 border-red-400 dark:border-red-600"
            )}
          >
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className={cn(
                  "w-16 h-16 shrink-0 rounded-3xl flex items-center justify-center text-4xl shadow-lg border-2 transition-colors duration-300",
                  isCorrect ? "bg-white dark:bg-slate-900 border-green-200 dark:border-green-800" : "bg-white dark:bg-slate-900 border-red-200 dark:border-red-800"
                )}>
                  {isCorrect ? '✨' : '🔥'}
                </div>
                <div>
                  <h3 className={cn("font-black text-xl lg:text-2xl transition-colors duration-300", isCorrect ? "text-green-800 dark:text-green-400" : "text-red-800 dark:text-red-400")}>
                    {isCorrect ? 'Perfect Logic!' : 'Wah, Coba Lagi!'}
                  </h3>
                  <p className={cn("font-bold opacity-80 transition-colors duration-300", isCorrect ? "text-green-700 dark:text-green-500" : "text-red-700 dark:text-red-500")}>
                    {isCorrect ? '+50 XP Earned' : 'Ada sedikit kesalahan di sintaksnya.'}
                  </p>
                </div>
              </div>
              
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                {isCorrect ? (
                  <Link to="/profile" className="w-full block">
                    <Button variant="yellow" className="w-full sm:px-12 py-4">
                      SELESAI <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                ) : (
                  <Button onClick={() => { setIsCorrect(null); setSelected(null); }} variant="yellow" className="w-full sm:px-12 py-4">
                    COBA LAGI <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
