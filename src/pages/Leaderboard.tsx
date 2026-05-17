import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Star, Trophy, Target, ArrowUp, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/src/lib/utils';
import { useAuthStore } from '../store/useAuthStore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface Leader {
  id: string;
  rank: number;
  name: string;
  school: string;
  xp: number;
  avatar: string;
  isUser: boolean;
  color: string;
}

export default function Leaderboard() {
  const { user, isAuthenticated } = useAuthStore();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  const chartData = React.useMemo(() => {
    const todayDate = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayDate);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];
      
      const found = user?.weeklyXpActivity?.find((a: any) => a.date === dateStr);
      data.push({ day: dayName, xp: found ? found.xp : 0 });
    }
    return data;
  }, [user?.weeklyXpActivity]);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedLeaders: Leader[] = [];
      let r = 1;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const isCurrentUser = isAuthenticated && user?.id === doc.id;
        
        let color = 'bg-white dark:bg-slate-800/50 border-transparent';
        if (r === 1) color = 'bg-amber-100 dark:bg-amber-900/30 border-amber-400 dark:border-amber-700/50';
        else if (r === 2) color = 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700';
        else if (r === 3) color = 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700/50';
        
        if (isCurrentUser && r > 3) {
          color = 'bg-teal-50 dark:bg-teal-900/30 border-primary-accent dark:border-teal-700';
        }

        fetchedLeaders.push({
          id: doc.id,
          rank: r,
          name: data.fullName || data.username || 'Explorer',
          school: data.institution || 'Sekolah Umum',
          xp: data.xp || 0,
          avatar: data.avatar || '👤',
          isUser: isCurrentUser || false,
          color,
        });
        r++;
      });

      setLeaders(fetchedLeaders);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated, user?.id]);

  return (
    <div className="bg-transparent min-h-screen pb-32 transition-colors duration-300">
      {/* Top Podium */}
      <section className="px-4 sm:px-6 pt-16 sm:pt-8 pb-12 bg-white dark:bg-slate-900 rounded-b-[48px] shadow-sm flex flex-col items-center transition-colors duration-300 relative z-10">
        <h2 className="font-black text-2xl sm:text-3xl text-slate-800 dark:text-white mb-8 sm:mb-12 relative z-20">Pahlawan Kode</h2>
        
        <div className="flex items-end justify-center gap-2 sm:gap-4 w-full max-w-md h-48 sm:h-56 mt-4">
          {/* Rank 2 */}
          {leaders.length > 1 && (
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-50 dark:bg-slate-800 border-4 border-slate-200 dark:border-gray-700 flex items-center justify-center text-xl sm:text-2xl mb-2 transition-colors duration-300">
                {leaders[1].avatar}
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-2xl h-24 sm:h-28 flex flex-col items-center pt-2 px-1 transition-colors duration-300">
                <span className="font-black text-slate-400 dark:text-slate-400 text-xs sm:text-base">#2</span>
                <p className="text-[9px] sm:text-[11px] font-black text-slate-600 dark:text-slate-300 truncate w-full text-center">{leaders[1].name.split(' ')[0]}</p>
              </div>
            </div>
          )}
          
          {/* Rank 1 */}
          {leaders.length > 0 && (
            <div className="flex flex-col items-center flex-1 z-10">
               <div className="relative mb-2">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-amber-50 border-4 border-amber-400 flex items-center justify-center text-3xl sm:text-5xl shadow-xl">
                    {leaders[0].avatar}
                  </div>
                  <div className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2">
                     <div className="w-8 h-8 sm:w-12 sm:h-12 bg-cta-yellow rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                       <Star className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600 fill-current" />
                     </div>
                  </div>
               </div>
              <div className="w-full bg-amber-400 rounded-t-3xl h-32 sm:h-40 flex flex-col items-center pt-2 px-1 shadow-[0_-10px_20px_-5px_rgba(245,230,66,0.5)] relative z-20">
                <span className="font-black text-amber-800 text-sm sm:text-lg">#1</span>
                <p className="text-[10px] sm:text-xs font-black text-amber-900 truncate w-full text-center">{leaders[0].name.split(' ')[0]}</p>
              </div>
            </div>
          )}
          
          {/* Rank 3 */}
          {leaders.length > 2 && (
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-orange-50 border-4 border-orange-300 flex items-center justify-center text-xl sm:text-2xl mb-2">
                {leaders[2].avatar}
              </div>
              <div className="w-full bg-orange-200 rounded-t-2xl h-20 sm:h-24 flex flex-col items-center pt-2 px-1">
                <span className="font-black text-orange-800 text-xs sm:text-base">#3</span>
                <p className="text-[9px] sm:text-[11px] font-black text-orange-900 truncate w-full text-center">{leaders[2].name.split(' ')[0]}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
         {/* Learning Stats Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-5 sm:p-8 shadow-sm border-2 border-slate-100 dark:border-gray-800 flex flex-col md:flex-row gap-6 md:items-center transition-colors duration-300">
          <div className="flex-1 w-full overflow-hidden">
             <div className="flex items-center justify-between mb-6">
               <div>
                 <h3 className="font-black text-slate-800 dark:text-white text-lg">Review Mingguan</h3>
                 <p className="text-xs font-bold text-slate-400 tracking-wide uppercase">XP ACTIVITY</p>
               </div>
               <div className="bg-teal-50 dark:bg-teal-900/30 p-3 rounded-2xl md:hidden transition-colors duration-300">
                 <Target className="w-6 h-6 text-primary-accent" />
               </div>
             </div>

             <div className="h-40 w-full mb-2 md:mb-0" style={{ minWidth: 0 }}>
               <ResponsiveContainer width="100%" height={160}>
                 <BarChart data={chartData}>
                   <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                   <Bar dataKey="xp" radius={[8, 8, 8, 8]} barSize={24}>
                     {chartData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={index === 6 ? '#0D9488' : '#e2e8f0'} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:w-56 shrink-0">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-gray-800 flex flex-col justify-center transition-colors duration-300">
               <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase mb-1 flex items-center justify-between">
                 XP TOTAL
                 <Star className="w-3.5 h-3.5 text-xp-gold fill-current md:hidden" />
               </p>
               <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-1">
                 {leaders.find(l => l.isUser)?.xp.toLocaleString() || (user ? user.xp.toLocaleString() : '0')} <Star className="hidden md:block w-5 h-5 text-xp-gold fill-current" />
               </p>
             </div>
             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-gray-800 flex flex-col justify-center transition-colors duration-300">
               <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase mb-1 flex items-center justify-between">
                 RANKING
                 <ArrowUp className="w-3.5 h-3.5 text-green-500 md:hidden" />
               </p>
               <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-1">
                 {leaders.find(l => l.isUser)?.rank || '-'} <ArrowUp className="hidden md:flex w-5 h-5 text-green-500" />
               </p>
             </div>
           </div>
        </div>

        {/* Rank List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">Loading leaderboard...</div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">Belum ada explorer di leaderboard.</div>
          ) : (
            leaders.map((person) => (
              <motion.div
                key={person.id}
                whileHover={{ scale: 1.01 }}
                className={cn(
                  "p-4 rounded-[24px] border-2 flex items-center gap-4 transition-all duration-300",
                  person.color,
                  person.isUser ? "shadow-inner border-dashed" : "shadow-sm"
                )}
              >
                <div className="w-8 flex justify-center font-black text-slate-400">
                  {person.rank}
                </div>
                <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-xl shadow-sm border border-slate-100 dark:border-gray-800 transition-colors duration-300 shrink-0">
                  {person.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 dark:text-white text-sm leading-none mb-1 truncate">{person.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">{person.school}</p>
                </div>
                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-100 dark:border-gray-800 shadow-inner transition-colors duration-300 shrink-0">
                  <Star className="w-3.5 h-3.5 text-xp-gold fill-current" />
                  <span className="font-black text-sm text-slate-700 dark:text-slate-200">{person.xp.toLocaleString()}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


