import { motion } from 'motion/react';
import { Button } from '@/src/components/Button';
import { Play, Map, Bot, Trophy, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const islands = [
    { title: "Syntax Seas", color: "bg-blue-400", rotate: "-rotate-12", translate: "-translate-x-16 md:-translate-x-24" },
    { title: "Logic Land", color: "bg-teal-500", rotate: "rotate-0", translate: "translate-z-10" },
    { title: "Python Peak", color: "bg-orange-400", rotate: "rotate-12", translate: "translate-x-16 md:translate-x-24" },
  ];

  return (
    <div className="bg-transparent min-h-screen pb-24 transition-colors duration-300">
      {/* Hero Section */}
      <section className="px-4 md:px-8 pt-8 md:pt-16 pb-12 md:pb-20 text-center overflow-hidden flex flex-col items-center">
        <div className="relative h-48 md:h-64 flex justify-center items-center mb-8 md:mb-12 perspective-1000 w-full max-w-3xl">
          {islands.map((island, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className={`absolute w-32 h-44 md:w-48 md:h-60 rounded-3xl ${island.color} ${island.rotate} ${island.translate} fanned-card flex flex-col p-3 md:p-4 shadow-xl border-2 md:border-4 border-white/30`}
            >
              <div className="bg-white/20 w-full h-16 md:h-24 rounded-2xl mb-2 md:mb-4" />
              <p className="text-white font-extrabold text-sm md:text-xl mt-auto">{island.title}</p>
            </motion.div>
          ))}
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl lg:text-6xl max-w-4xl mx-auto font-black text-slate-800 dark:text-white leading-tight mb-4 transition-colors duration-300"
        >
          {isAuthenticated ? `Halo, ${user?.fullName || user?.username}!` : 'Jelajahi Dunia Koding yang Ajaib!'}
        </motion.h1>
        
        <p className="text-slate-600 dark:text-slate-300 font-medium mb-8 md:mb-10 max-w-md md:max-w-xl mx-auto text-sm md:text-lg transition-colors duration-300">
          {isAuthenticated 
            ? 'Siap untuk melanjutkan petualangan kodingmu hari ini? Buddy Bot sudah menunggumu!'
            : 'Belajar pemrograman jadi petualangan seru bersama Buddy Bot. Kumpulkan XP dan jadilah Master Koding!'}
        </p>

        <Link to={isAuthenticated ? "/dashboard" : "/onboarding"}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Button variant="yellow" className="text-base md:text-lg px-8 md:px-12 py-3 md:py-4 shadow-md hover:shadow-lg transition-all">
              {isAuthenticated ? 'Lanjutkan Perjalanan' : 'Mulai Petualangan'} <Play className="ml-2 w-4 h-4 md:w-5 md:h-5 fill-current" />
            </Button>
          </motion.div>
        </Link>
        {!isAuthenticated && (
          <motion.div whileHover={{ scale: 1.05, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="mt-6">
            <Link to="/login" className="text-primary-accent hover:text-teal-600 dark:hover:text-teal-400 font-bold text-sm underline-offset-4 hover:underline transition-colors inline-block p-2">
              Jika sudah memiliki akun, bisa klik ini!
            </Link>
          </motion.div>
        )}
      </section>

      <div className="px-4 md:px-8 space-y-6 max-w-4xl mx-auto pb-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">Apa itu Kode.in?</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
            Kode.in adalah platform belajar coding revolusioner yang dirancang khusus untuk siswa Indonesia. Kami mengubah pengalaman belajar pemrograman yang rumit menjadi petualangan game seru yang interaktif!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl rounded-[24px] p-6 shadow-sm border-2 border-slate-100 dark:border-white/10 flex flex-col gap-4 transition-colors duration-300"
          >
            <div className="bg-teal-100/50 dark:bg-teal-900/30 p-3 rounded-2xl w-fit">
              <Map className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg dark:text-white mb-2">Petualangan Interaktif</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Jelajahi berbagai dunia koding, mulai dari Logic Land hingga Python Peak. Selesaikan quest untuk membuka map baru dan asah logikamu di setiap levelnya.
              </p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl rounded-[24px] p-6 shadow-sm border-2 border-slate-100 dark:border-white/10 flex flex-col gap-4 transition-colors duration-300"
          >
            <div className="bg-blue-100/50 dark:bg-blue-900/30 p-3 rounded-2xl w-fit">
              <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg dark:text-white mb-2">Buddy Bot AI</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Jangan takut kesulitan! Buddy Bot, asisten AI ramah kami, siap membantumu 24/7. Ia akan menjelaskan konsep koding dengan analogi sederhana dan membimbingmu.
              </p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl rounded-[24px] p-6 shadow-sm border-2 border-slate-100 dark:border-white/10 flex flex-col gap-4 transition-colors duration-300"
          >
            <div className="bg-yellow-100/50 dark:bg-yellow-900/30 p-3 rounded-2xl w-fit">
              <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg dark:text-white mb-2">Gamifikasi & Peringkat</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Kumpulkan poin XP setiap kali menyelesaikan misi. Naikkan levelmu, dan bersainglah di papan peringkat (Top Global) untuk menjadi master koding sejati.
              </p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl rounded-[24px] p-6 shadow-sm border-2 border-slate-100 dark:border-white/10 flex flex-col gap-4 transition-colors duration-300"
          >
            <div className="bg-rose-100/50 dark:bg-rose-900/30 p-3 rounded-2xl w-fit">
              <Gamepad2 className="w-8 h-8 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg dark:text-white mb-2">Kurikulum Terstruktur</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Platform ini memiliki 20 level pembelajaran khusus yang didesain bertahap. Dari dasar logika algoritma hingga penguasaan sintaks bahasa pemrograman asli.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
