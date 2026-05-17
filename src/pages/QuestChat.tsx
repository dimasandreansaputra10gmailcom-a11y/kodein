import React from 'react';
import { motion } from 'motion/react';
import { Trophy, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';

export default function QuestChat() {
  const { user } = useAuthStore();

  const dailyQuests = [
    {
      id: 1,
      title: 'Selesaikan 3 Stage',
      desc: 'Selesaikan 3 stage pembelajaran apapun hari ini.',
      progress: 1,
      total: 3,
      reward: 500,
      completed: false
    },
    {
      id: 2,
      title: 'Latihan Kode 1x',
      desc: 'Selesaikan bagian Coding Challenge tanpa bantuan.',
      progress: 0,
      total: 1,
      reward: 200,
      completed: false
    },
    {
      id: 3,
      title: 'Login Berturut-turut',
      desc: 'Pertahankan streak belajarmu hari ini.',
      progress: 1,
      total: 1,
      reward: 100,
      completed: true
    }
  ];

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-8 pt-24 md:pt-32 pb-32 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Misi Harian
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Selesaikan misi di bawah ini untuk mendapatkan bonus XP!</p>
        </div>

        <div className="space-y-6">
          {dailyQuests.map((quest, index) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border-2 border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 overflow-hidden relative group"
            >
              {quest.completed && (
                 <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-[100px]" />
              )}
              
              <div className="flex gap-4 items-start relative z-10 w-full sm:w-auto">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${quest.completed ? 'bg-green-100 dark:bg-green-900/30 text-green-500' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500'}`}>
                  {quest.completed ? <CheckCircle2 className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
                </div>
                
                <div className="flex-1 w-full">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{quest.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{quest.desc}</p>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${quest.completed ? 'bg-green-500' : 'bg-teal-500'}`}
                        style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-xs text-slate-500 dark:text-slate-400">
                      {quest.progress}/{quest.total}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center w-full sm:w-auto shrink-0 gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-6 relative z-10">
                 <div className="flex items-center gap-2 font-black text-yellow-500 text-lg">
                   ⚡ {quest.reward} XP
                 </div>
                 {quest.completed ? (
                   <span className="font-bold text-green-500 text-sm">Selesai!</span>
                 ) : (
                   <Button variant="secondary" className="px-6 py-2 text-sm bg-slate-100 dark:bg-slate-800 border-none shrink-0">Lanjut</Button>
                 )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
