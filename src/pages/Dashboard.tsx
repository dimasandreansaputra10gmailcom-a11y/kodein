import React from 'react';
import { motion } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Compass, Flame, Star, Trophy, ShieldAlert, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-transparent p-6 pb-32 flex flex-col items-center transition-colors duration-300">
      <div className="w-full max-w-5xl mt-12 md:mt-24 space-y-8">
        
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white transition-colors duration-300">
              Hai, {user.fullName || user.username}! <span className="text-4xl">👋</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Siap untuk belajar coding hari ini?</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
              <div className="font-black text-slate-800 dark:text-white text-xl">{user.streak} Hari</div>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <div className="font-black text-slate-800 dark:text-white text-xl">{user.xp} XP</div>
            </div>
          </div>
        </motion.div>

        {/* Admin Banner */}
        {user.isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-purple-100 dark:bg-purple-900/30 p-6 rounded-[32px] border-2 border-purple-200 dark:border-purple-800 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-purple-900 dark:text-purple-100 text-xl mb-1">Admin Panel Aktif</h3>
                <p className="text-purple-700 dark:text-purple-300 text-sm md:text-base">Anda memiliki akses untuk mengelola user dan memodifikasi map.</p>
              </div>
            </div>
            <Link to="/admin" className="shrink-0 w-full md:w-auto">
              <Button variant="primary" className="bg-purple-500 hover:bg-purple-600 border-none shadow-md w-full">
                Buka Admin Panel
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Focus Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Lanjut Belajar */}
          <div className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl rounded-[32px] p-8 shadow-sm border-2 border-slate-100 dark:border-white/10 relative overflow-hidden group hover:border-teal-500 dark:hover:border-teal-400 transition-colors cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-bl-[100px] transition-transform group-hover:scale-110" />
            <BookOpen className="w-10 h-10 text-teal-500 mb-4" />
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Petualangan Utama</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Lanjutkan pelajaran terakhir kamu di map petualangan sesuai dengan jenjang pendidikanmu.</p>
            <Link to="/adventure">
              <Button variant="primary" className="w-full py-3">Lanjut Belajar</Button>
            </Link>
          </div>

          {/* Misi Harian / Quests */}
          <div className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl rounded-[32px] p-8 shadow-sm border-2 border-slate-100 dark:border-white/10 relative overflow-hidden group hover:border-yellow-500 dark:hover:border-yellow-400 transition-colors cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-bl-[100px] transition-transform group-hover:scale-110" />
            <Trophy className="w-10 h-10 text-yellow-500 mb-4" />
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Misi Harian</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Selesaikan 3 stage hari ini untuk mendapatkan bonus 500 XP tambahan!</p>
            <Link to="/quests">
              <Button variant="yellow" className="w-full py-3">Lihat Misi Berjalan</Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
