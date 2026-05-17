import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { Navigate } from 'react-router-dom';
import { ShieldAlert, Users, Map as MapIcon, Edit, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'users' | 'maps'>('users');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) return;

    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData: any[] = [];
      snapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setAllUsers(usersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleDeleteUser = async (userId: string, username: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun ${username}? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        alert(`Akun ${username} berhasil dihapus dari database.`);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-6 pb-32 flex flex-col items-center transition-colors duration-300">
      <div className="w-full max-w-6xl mt-12 md:mt-24 space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[32px] border-2 border-purple-200 dark:border-purple-900 shadow-sm"
        >
          <div className="w-16 h-16 bg-purple-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-1">Admin Panel Kode.in</h1>
            <p className="text-slate-500 dark:text-slate-400">Atur pengguna dan modifikasi konten pembelajaran</p>
          </div>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${activeTab === 'users' ? 'bg-purple-500 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'}`}
          >
            <Users className="w-5 h-5" /> Kelola Pengguna
          </button>
          <button 
            onClick={() => setActiveTab('maps')}
            className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${activeTab === 'maps' ? 'bg-purple-500 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'}`}
          >
            <MapIcon className="w-5 h-5" /> Modifikasi Map
          </button>
        </div>

        {/* Content Area */}
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 border-2 border-slate-100 dark:border-slate-800 shadow-sm"
        >
          {activeTab === 'users' ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                <h3 className="font-bold text-slate-800 dark:text-white">Daftar Pengguna ({loading ? 'Memuat...' : allUsers.length})</h3>
                <span className="text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 px-3 py-1 rounded-full">Total: {allUsers.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allUsers.map((u) => (
                  <div key={u.id} className="flex flex-col p-5 border-2 border-slate-100 dark:border-slate-700 rounded-[24px] bg-white dark:bg-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-4xl shadow-inner overflow-hidden border-2 border-slate-200 dark:border-slate-600 relative group">
                        {u.avatar && u.avatar.startsWith('http') ? (
                          <img src={u.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span>{u.avatar || '👤'}</span>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      {u.isAdmin && <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Admin</span>}
                    </div>
                    <div className="mb-4">
                      <div className="font-black text-slate-800 dark:text-white text-lg truncate" title={u.fullName || u.username}>{u.fullName || u.username}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 font-medium truncate" title={u.email}>{u.email}</div>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button 
                        onClick={() => handleDeleteUser(u.id, u.username)}
                        disabled={u.isAdmin} // Prevent accidently deleting an admin
                        className={`flex-1 p-2.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-colors ${u.isAdmin ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed' : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40'}`}
                        title={u.isAdmin ? 'Admin tidak dapat dihapus' : 'Hapus Akun'}
                      >
                        <Trash2 className="w-4 h-4" /> {u.isAdmin ? 'Aman' : 'Hapus'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-200 dark:border-red-900/30">
                <h4 className="font-bold text-red-800 dark:text-red-400 flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-5 h-5" /> Panduan Penghapusan Massal
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                  Untuk mengosongkan seluruh database seketika, lakukan di Firebase Console:
                </p>
                <ol className="list-decimal list-inside text-sm text-red-700 dark:text-red-300 space-y-1 ml-1">
                  <li>Buka <strong>Firestore Database</strong> di Firebase Console.</li>
                  <li>Hapus manual collection <code>users</code> dan <code>forums</code>.</li>
                  <li>Buka <strong>Authentication</strong> dan hapus user terdaftar.</li>
                </ol>
              </div>
              <p className="text-xs text-slate-500 mt-4 italic text-center">* Admin memiliki tugas memvalidasi foto profil setiap anggota. Hapus akun jika melanggar ketentuan atau menggunakan foto yang tidak layak.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl gap-4 sm:gap-0">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">Kelola Map Petualangan</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pilih map untuk mengedit stage atau tambahkan baru</p>
                </div>
                <button className="w-full sm:w-auto px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Tambah Topik
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {['Logika Pemrograman Dasar (SD)', 'Pengantar Python (SMP)', 'Pemrograman Berorientasi Objek (SMA)'].map((level, i) => (
                  <div key={i} className="p-5 border border-slate-200 dark:border-slate-700 rounded-2xl relative group">
                    <h4 className="font-bold text-slate-800 dark:text-white mb-1">{level}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{Math.floor(Math.random() * 10) + 3} Stages Active</p>
                    <div className="flex gap-2">
                       <button className="flex items-center justify-center gap-2 flex-1 p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors">
                         <Edit className="w-4 h-4" /> Edit Stage
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
