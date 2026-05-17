import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/src/components/Button';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { auth, db } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { synth } from '../lib/synth';

export default function Login() {
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        const isAdmin = result.user.email === 'ineddewa@gmail.com';
        const newUserData = {
          username: result.user.email?.split('@')[0] || `user_${result.user.uid.substring(0,5)}`,
          email: result.user.email,
          avatar: '🤠',
          level: 1,
          xp: 150,
          streak: 1,
          lives: 5,
          isAdmin: isAdmin,
          tier: 'SD',
          institution: 'Sekolah Umum',
          unlockedStages: { sd: 1, smp: 1, sma: 1, pt: 1 },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(userRef, newUserData);
        login({ id: result.user.uid, ...newUserData, joinDate: new Date().toISOString().split('T')[0] });
      } else {
        const userData = userSnap.data();
        login({ id: result.user.uid, ...userData });
      }
      synth.playLoginSuccess();
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      alert(`Gagal login Google: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-6 pb-32 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-sm border-2 border-slate-100 dark:border-gray-800 transition-colors duration-300 mb-8 text-center"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black mb-2 dark:text-white transition-colors duration-300">Selamat Datang Kembali!</h2>
            <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">Siap melanjutkan petualangan kodingmu?</p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-4 text-lg shadow-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-[16px] flex items-center justify-center gap-3 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
                  <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1056C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/>
                  <path d="M5.50253 14.3003C5.00407 12.8099 5.00407 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC04"/>
                  <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"/>
                </svg>
                {loading ? 'Memproses...' : 'Login dengan Google'}
              </button>
            </div>
            
            <div className="mt-6">
              <Link to="/onboarding" className="text-sm font-medium text-slate-500 hover:text-primary-accent dark:text-slate-400 dark:hover:text-primary-accent transition-colors">
                Belum punya akun? Buat di sini
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

