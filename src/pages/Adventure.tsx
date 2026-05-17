import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Anchor, Mountain, Building, Lock } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const adventureLevels = [
  {
    id: 'sd',
    title: 'Sekolah Dasar (SD)',
    description: 'Terbang ke angkasa logika dasar dan pelajari konsep awal pemrograman dengan block coding yang menyenangkan!',
    icon: Rocket,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    bgClasses: 'from-blue-400 to-blue-600'
  },
  {
    id: 'smp',
    title: 'Sekolah Menengah Pertama (SMP)',
    description: 'Menjelajah laut sintaksis, mulai menulis kode nyata, dan pahami struktur data dasar dalam misi bawah laut!',
    icon: Anchor,
    color: 'bg-teal-500',
    hoverColor: 'hover:bg-teal-600',
    bgClasses: 'from-teal-400 to-teal-600'
  },
  {
    id: 'sma',
    title: 'SMA / SMK',
    description: 'Mendaki gunung algoritma, pecahkan masalah kompleks, dan persiapkan dirimu menaklukkan dunia pemrograman sesungguhnya!',
    icon: Mountain,
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600',
    bgClasses: 'from-orange-400 to-orange-600'
  },
  {
    id: 'pt',
    title: 'Perguruan Tinggi (PT)',
    description: 'Membangun kota arsitektur software, pelajari pola desain tingkat lanjut, dan jadilah engineer profesional!',
    icon: Building,
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    bgClasses: 'from-purple-400 to-purple-600'
  }
];

export default function Adventure() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleSelectLevel = (levelId: string) => {
    const tierMap: Record<string, string[]> = {
      sd: ['SD'],
      smp: ['SMP'],
      sma: ['SMA', 'SMK'],
      pt: ['Kuliah', 'Perguruan Tinggi']
    };
    
    // Check if user's tier matches the allowed tiers for this level
    const userTier = user?.tier || '';
    const isAllowed = user?.isAdmin || tierMap[levelId].some(t => userTier.includes(t));
    
    if (!isAllowed) {
      alert(`Info: Akses ditolak! Kamu tidak bisa masuk ke jenjang selain yang dipilih (Jenjangmu: ${userTier || 'Belum diatur'}).`);
      return;
    }
    
    navigate(`/map/${levelId}`);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pt-24 md:pt-32 relative">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="mb-12 text-center md:text-left relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 mb-4 tracking-tight">Pilih Jenjang Petualangan!</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">Setiap jenjang memiliki kurikulum dan misi khusus. Pilih map pembelajaran yang sesuai dengan tingkat pendidikanmu saat ini.</p>
        
        {user && user.level && (
           <div className="mt-8 inline-flex items-center gap-3 bg-teal-50 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 px-6 py-3 rounded-2xl font-bold lg:text-lg shadow-sm">
             <span className="flex w-3 h-3 rounded-full bg-teal-500 animate-pulse" />
             Rekomendasi dari sistem: Level {user.level || 'SD'}
           </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 relative z-10">
        {adventureLevels.map((level, index) => {
          const userTier = user?.tier || '';
          const tierMap: Record<string, string[]> = {
            sd: ['SD'],
            smp: ['SMP'],
            sma: ['SMA', 'SMK'],
            pt: ['Kuliah', 'Perguruan Tinggi']
          };
          const isAllowed = user?.isAdmin || tierMap[level.id].some(t => userTier.includes(t));

          return (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, type: 'spring', damping: 20 }}
            whileHover={isAllowed ? { scale: 1.03, y: -5 } : { scale: 1 }}
            whileTap={isAllowed ? { scale: 0.98 } : { scale: 1 }}
            onClick={() => handleSelectLevel(level.id)}
            className={`cursor-pointer ${!isAllowed ? 'opacity-80 grayscale-[0.8] hover:grayscale-0 transition-all duration-500' : ''} relative p-px rounded-[32px] overflow-hidden group shadow-lg hover:shadow-2xl`}
          >
            {/* Animated glowing border effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${level.bgClasses} opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative h-full bg-white dark:bg-slate-900/40 backdrop-blur-xl rounded-[31px] p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row gap-6 md:gap-8 items-start dark:border dark:border-white/10">
              {/* Giant watermark icon */}
              <level.icon className={`absolute -right-10 -bottom-10 w-48 h-48 opacity-[0.03] dark:opacity-[0.05] text-slate-900 dark:text-white pointer-events-none transform group-hover:scale-125 transition-transform duration-700`} />

              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-[24px] flex items-center justify-center text-white ${level.color} shadow-xl shrink-0 border-4 border-white dark:border-slate-800 rotate-[-5deg] group-hover:rotate-0 transition-transform duration-300`}>
                <level.icon className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              
              <div className="flex-1 flex flex-col h-full z-10">
                <div className="mb-auto">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                      {level.title}
                    </h3>
                    {!isAllowed && (
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 uppercase tracking-wider backdrop-blur-sm">
                        <Lock className="w-3 h-3" /> Terkunci
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                    {level.description}
                  </p>
                </div>
                
                <div className="pt-4">
                  <button className={`w-full sm:w-auto font-black text-white ${!isAllowed ? 'bg-slate-400 dark:bg-slate-700' : level.bgClasses} bg-gradient-to-r px-8 py-3.5 rounded-2xl text-sm sm:text-base shadow-sm ${isAllowed ? 'hover:shadow-lg hover:shadow-current/20' : ''} transition-all uppercase tracking-wide`}>
                    {isAllowed ? 'Mulai Eksplorasi' : 'Butuh Akses'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )})}
      </div>
    </div>
  );
}
