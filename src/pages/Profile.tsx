import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Edit2, Settings, Trophy, Flame, Star, Award, CalendarDays, CheckCircle2, ListTodo, ChevronRight, Lock, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/src/components/Button';
import { cn } from '@/src/lib/utils';
import { useTheme } from '../components/ThemeProvider';
import { doc, updateDoc, serverTimestamp, query, collection, where, getDocs, writeBatch } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { updatePassword } from 'firebase/auth';

export default function Profile() {
  const { user, isAuthenticated, logout, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [timeLeft, setTimeLeft] = useState('');
  
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [savingPin, setSavingPin] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [editFullName, setEditFullName] = useState(user?.fullName || '');
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Konversi ke WIB (UTC+7)
      const wibOffset = 7 * 60 * 60 * 1000;
      const utcDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
      const wibDate = new Date(utcDate.getTime() + wibOffset);

      // Cari tengah malam WIB berikutnya (hari esok jam 00:00:00)
      const nextMidnightWib = new Date(wibDate);
      nextMidnightWib.setDate(wibDate.getDate() + 1);
      nextMidnightWib.setHours(0, 0, 0, 0);

      const diff = nextMidnightWib.getTime() - wibDate.getTime();

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} Reset`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    try {
      if (!user) return;
      
      const updates: any = { updatedAt: serverTimestamp() };
      let fullNameUpdated = false;
      let usernameUpdated = false;

      // Check fullName changes
      if (editFullName !== user.fullName) {
        if (user.lastFullNameUpdate) {
          const lastUpdate = user.lastFullNameUpdate.toDate ? user.lastFullNameUpdate.toDate() : new Date(user.lastFullNameUpdate);
          const diffDays = (new Date().getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays < 7) {
            alert('Display Name hanya bisa diubah 1x dalam 7 hari.');
            return;
          }
        }
        updates.fullName = editFullName;
        updates.lastFullNameUpdate = serverTimestamp();
        fullNameUpdated = true;
      }

      // Check username changes
      if (editUsername !== user.username) {
        if (user.lastUsernameUpdate) {
          const lastUpdate = user.lastUsernameUpdate.toDate ? user.lastUsernameUpdate.toDate() : new Date(user.lastUsernameUpdate);
          const diffDays = (new Date().getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays < 30) {
            alert('Username hanya bisa diubah 1x dalam 30 hari.');
            return;
          }
        }
        updates.username = editUsername;
        updates.lastUsernameUpdate = serverTimestamp();
        usernameUpdated = true;
      }

      if (!fullNameUpdated && !usernameUpdated) {
        setShowProfileEditModal(false);
        return;
      }

      setSavingProfile(true);
      await updateDoc(doc(db, 'users', user.id), updates);
      
      const newDisplayName = editFullName || editUsername || 'Explorer';
      try {
        const forumsQuery = query(collection(db, 'forums'), where('authorId', '==', user.id));
        const forumsSnap = await getDocs(forumsQuery);
        const batch = writeBatch(db);
        forumsSnap.docs.forEach((doc) => {
          batch.update(doc.ref, { authorName: newDisplayName, updatedAt: serverTimestamp() });
        });
        await batch.commit();
      } catch (e) { console.warn('Failed to update authored forums', e); }

      // We will refresh the user info locally or trust `updateProfile`
      const localUpdates: any = {};
      if (fullNameUpdated) localUpdates.fullName = editFullName;
      if (usernameUpdated) localUpdates.username = editUsername;
      
      updateProfile(localUpdates);
      setShowProfileEditModal(false);
      setSavingProfile(false);
      alert('Berhasil menyimpan profil.');
    } catch (error: any) {
      setSavingProfile(false);
      alert(`Gagal menyimpan profil: ${error.message}`);
    }
  };
  
  const handleSavePin = async () => {
    if (newPin.length !== 6 || confirmPin.length !== 6) {
      alert("PIN harus 6 digit.");
      return;
    }
    if (newPin !== confirmPin) {
      alert("PIN dan Konfirmasi PIN tidak cocok.");
      return;
    }
    setSavingPin(true);
    try {
      if (!user) return;
      await updateDoc(doc(db, 'users', user.id), {
        loginPin: newPin,
        updatedAt: serverTimestamp()
      });
      updateProfile({ loginPin: newPin });
      alert("PIN berhasil disimpan!");
      setShowPinModal(false);
      setNewPin('');
      setConfirmPin('');
    } catch (error: any) {
      alert(`Gagal menyimpan PIN: ${error.message}`);
    } finally {
      setSavingPin(false);
    }
  };
  
  const handleSavePassword = async () => {
    if (newPassword.length < 6) {
      alert("Kata sandi minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Kata sandi dan konfirmasi tidak cocok.");
      return;
    }
    setSavingPassword(true);
    try {
      if (!auth.currentUser) {
        throw new Error("Sesi tidak valid");
      }
      await updatePassword(auth.currentUser, newPassword);
      alert("Kata sandi berhasil diubah!");
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        alert("Sesi keamanan sudah terlalu lama. Silakan logout dan login kembali untuk dapat mengubah kata sandi.");
      } else {
        alert(`Gagal mengubah kata sandi: ${error.message}`);
      }
    } finally {
      setSavingPassword(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      alert("Terima kasih! Foto profil telah berhasil diunggah dan sedang dilakukan pengecekan oleh admin untuk memastikan kelayakannya.");
    }
  };

  const getWIBDateString = () => {
    const wibDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    return wibDate.toISOString().split('T')[0];
  };
  const today = getWIBDateString();

  const isPatternDoneToday = user.lastPatternQuizDate === today;
  const patternProgress = isPatternDoneToday ? (user.unlockedStages?.['2'] || 0) : 0;
  const isPatternCompleted = isPatternDoneToday && patternProgress >= 2;

  const isCommunityMessageDoneToday = user.lastCommunityMessageDate === today;

  const dailyMissions = [
    { id: 1, title: 'Mainkan 1 Misi Logic', xp: 50, completed: user.lastLogicQuestDate === today, link: '/logic-quest' },
    { id: 2, title: 'Selesaikan 2 Quiz dengan Sempurna', xp: 100, completed: isPatternCompleted, progress: patternProgress, total: 2, link: '/pattern-challenge' },
    { id: 3, title: 'Kirim Pesan di Forum Komunitas', xp: 20, completed: isCommunityMessageDoneToday, progress: isCommunityMessageDoneToday ? 1 : 0, total: 1, link: '/community' },
  ];

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300 pt-6 pb-32 px-4 sm:px-6 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-white/10 transition-colors duration-300 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-accent/5 dark:bg-primary-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start relative z-10 w-full overflow-hidden">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[24px] bg-slate-100 dark:bg-slate-700/50 flex flex-col items-center justify-center text-5xl sm:text-6xl border-4 border-white dark:border-slate-800 shadow-xl transition-colors duration-300 overflow-hidden relative">
                {user.avatar}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Edit2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left space-y-2 w-full">
              <div className="flex flex-wrap sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
                <div className="flex items-center gap-3 justify-center sm:justify-start overflow-hidden w-full sm:w-auto">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white transition-colors duration-300 truncate">{user.fullName || user.username}</h2>
                  <button onClick={() => {
                    setEditFullName(user.fullName || '');
                    setEditUsername(user.username || '');
                    setShowProfileEditModal(true);
                  }} className="p-1.5 shrink-0 text-slate-400 hover:text-primary-accent transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                
                <span className="inline-flex shrink-0 items-center gap-1.5 bg-cta-yellow/20 text-yellow-700 dark:text-yellow-500 px-3 py-1 rounded-full text-sm font-bold w-max mx-auto sm:mx-0">
                  <Star className="w-4 h-4 fill-current" />
                  Level {user.level} {user.badges[0]}
                </span>
              </div>
              
              <p className="text-slate-800 dark:text-slate-200 font-bold text-lg mb-0.5">@{user.username}</p>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm transition-colors duration-300">{user.email || 'Belum ada email'}</p>
              
              <div className="flex items-center gap-4 pt-2 justify-center sm:justify-start">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Bergabung {new Date(user.joinDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total XP', value: user.xp, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
            { label: 'Current Streak', value: user.streak, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10', suffix: ' Hari' },
            { label: 'Misi Selesai', value: user.completedChallenges, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
            { label: 'Badges', value: user.badges.length, icon: Award, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl rounded-[24px] p-5 border border-slate-200 dark:border-white/10 flex flex-col items-center text-center gap-2 transition-colors duration-300"
            >
              <div className={cn("p-3 rounded-2xl mb-1", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <p className="text-2xl font-black text-slate-800 dark:text-white transition-colors duration-300">
                {stat.value}{stat.suffix}
              </p>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 transition-colors duration-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Misi Harian Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-300"
        >
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center transition-colors duration-300">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-teal-500" /> Misi Harian
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Selesaikan misi untuk XP tambahan!</p>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-bold px-3 py-1 rounded-full text-xs">
              {timeLeft}
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {dailyMissions.map((mission) => (
              <div 
                key={mission.id} 
                className={cn(
                  "p-4 rounded-[20px] flex items-center justify-between border-2 transition-all",
                  mission.completed 
                    ? "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-60" 
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-800"
                )}
              >
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2",
                    mission.completed 
                      ? "bg-green-100 border-green-200 text-green-500 dark:bg-green-900/30 dark:border-green-800" 
                      : "bg-slate-50 border-slate-100 text-slate-400 dark:bg-slate-800 dark:border-slate-700"
                  )}>
                    {mission.completed ? <CheckCircle2 className="w-5 h-5" /> : <ListTodo className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-bold text-sm truncate", mission.completed ? "line-through text-slate-500 dark:text-slate-400" : "text-slate-800 dark:text-slate-200")}>
                      {mission.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-md">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500">+{mission.xp} XP</span>
                      </div>
                      {!mission.completed && mission.total !== undefined && (
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{mission.progress}/{mission.total}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {!mission.completed && (
                  <button onClick={() => navigate(mission.link)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-primary-accent flex items-center justify-center transition-colors shrink-0 ml-3">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Settings Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/10 transition-colors duration-300"
        >
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-400" /> Pengaturan Akun
            </h3>
          </div>
          
          <div className="p-2">
            <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-colors duration-300">
              <div>
                <p className="font-bold text-slate-800 dark:text-white transition-colors duration-300">Tema Tampilan</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pilih tema terang, gelap, atau otomatis</p>
              </div>
              <div className="flex gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl transition-colors duration-300">
                <button 
                  onClick={() => setTheme('light')}
                  className={cn("px-4 py-1.5 rounded-lg text-sm font-bold transition-all", theme === 'light' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500")}
                >
                  Light
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={cn("px-4 py-1.5 rounded-lg text-sm font-bold transition-all", theme === 'dark' ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 dark:text-slate-400")}
                >
                  Dark
                </button>
                <button 
                  onClick={() => setTheme('system')}
                  className={cn("px-4 py-1.5 rounded-lg text-sm font-bold transition-all", theme === 'system' ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400")}
                >
                  Auto
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-colors duration-300">
              <div>
                <p className="font-bold text-slate-800 dark:text-white transition-colors duration-300">PIN Login Keamanan</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Verifikasi tambahan saat login</p>
              </div>
              <Button variant="secondary" className="py-2 scale-90" onClick={() => setShowPinModal(true)}>
                {user.loginPin ? 'Ubah PIN' : 'Atur PIN'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-colors duration-300">
              <div>
                <p className="font-bold text-slate-800 dark:text-white transition-colors duration-300">Kata Sandi Akun</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Ubah kata sandi untuk login</p>
              </div>
              <Button variant="secondary" className="py-2 scale-90" onClick={() => setShowPasswordModal(true)}>
                Ubah
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-colors duration-300 cursor-pointer" onClick={handleLogout}>
              <div>
                <p className="font-bold text-red-600 dark:text-red-400 transition-colors duration-300">Keluar (Logout)</p>
                <p className="text-sm text-red-500/70 dark:text-red-400/70">Keluar dari akunmu</p>
              </div>
              <LogOut className="w-5 h-5 text-red-500 dark:text-red-400" />
            </div>
          </div>
        </motion.div>

      </div>
      
      {/* Profile Edit Modal */}
      <AnimatePresence>
        {showProfileEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-primary-accent" /> Edit Profil
                </h3>
                <button onClick={() => setShowProfileEditModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Display Name</label>
                  <input 
                    type="text" 
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 outline-none focus:border-primary-accent text-slate-800 dark:text-white transition-colors"
                  />
                  <p className="text-xs text-slate-500 mt-1">Dapat diubah 1x dalam 7 hari</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Username</label>
                  <input 
                    type="text" 
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 outline-none focus:border-primary-accent text-slate-800 dark:text-white transition-colors"
                  />
                  <p className="text-xs text-slate-500 mt-1">Dapat diubah 1x dalam 30 hari</p>
                </div>
              </div>
              <div className="p-6 pt-0 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setShowProfileEditModal(false)}>Batal</Button>
                <Button variant="primary" onClick={handleSaveProfile} disabled={savingProfile || (!editFullName.trim() || !editUsername.trim())}>
                  {savingProfile ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PIN Modal */}
      <AnimatePresence>
        {showPinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary-accent" /> Atur PIN Login
                </h3>
                <button onClick={() => setShowPinModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">PIN Baru (6 Angka)</label>
                  <input 
                    type="password" 
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 outline-none focus:border-primary-accent text-center tracking-widest text-xl font-mono dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Konfirmasi PIN Baru</label>
                  <input 
                    type="password" 
                    maxLength={6}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 outline-none focus:border-primary-accent text-center tracking-widest text-xl font-mono dark:text-white transition-colors"
                  />
                </div>
              </div>
              <div className="p-6 pt-0 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setShowPinModal(false)}>Batal</Button>
                <Button variant="primary" onClick={handleSavePin} disabled={newPin.length !== 6 || confirmPin.length !== 6 || savingPin}>
                  {savingPin ? 'Menyimpan...' : 'Simpan PIN'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary-accent" /> Ubah Kata Sandi
                </h3>
                <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kata Sandi Baru</label>
                  <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 outline-none focus:border-primary-accent dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Konfirmasi Kata Sandi Baru</label>
                  <input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 outline-none focus:border-primary-accent dark:text-white transition-colors"
                  />
                </div>
              </div>
              <div className="p-6 pt-0 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>Batal</Button>
                <Button variant="primary" onClick={handleSavePassword} disabled={newPassword.length < 6 || confirmPassword.length < 6 || savingPassword}>
                  {savingPassword ? 'Menyimpan...' : 'Ubah Sandi'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
