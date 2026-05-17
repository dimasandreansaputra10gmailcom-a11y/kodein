import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { auth, db } from '../lib/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthStore } from '../store/useAuthStore';

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    // If no current user in Firebase Auth is found, redirect to login
    const checkUser = setTimeout(() => {
      if (!auth.currentUser) {
        navigate('/login');
      }
    }, 1500);
    return () => clearTimeout(checkUser);
  }, [navigate]);

  const handleCheckVerification = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        // Fetch user data from firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          login({ id: auth.currentUser.uid, ...userData } as any);
          navigate('/dashboard');
        } else {
          alert('Data pengguna tidak ditemukan!');
          navigate('/login');
        }
      } else {
        alert('Email belum terverifikasi. Silakan cek ulang kotak masuk atau spam email kamu.');
      }
    } catch (error: any) {
      console.error(error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!auth.currentUser) return;
    setResendLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      alert('Email verifikasi telah dikirim ulang! Silakan periksa inbox atau spam.');
    } catch (error: any) {
      console.error(error);
      alert(`Gagal mengirim ulang email: ${error.message}`);
    } finally {
      setResendLoading(false);
    }
  };

  const userEmail = auth.currentUser?.email || 'email kamu';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-sm border-2 border-slate-100 dark:border-gray-800 transition-colors duration-300 text-center"
        >
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10" />
          </div>
          
          <h2 className="text-3xl font-black mb-4 dark:text-white transition-colors duration-300">Verifikasi Email</h2>
          
          <p className="text-slate-500 dark:text-slate-400 mb-6 transition-colors duration-300">
            Kami telah mengirimkan tautan verifikasi ke: <br />
            <span className="font-bold text-slate-800 dark:text-slate-200">{userEmail}</span>
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Klik tautan tersebut untuk memverifikasi akun kamu. Jika sudah, klik tombol di bawah ini.
          </p>

          <div className="space-y-4">
            <Button 
              variant="primary" 
              className="w-full py-4 text-lg shadow-sm flex justify-center items-center gap-2"
              onClick={handleCheckVerification}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> Sedang Memeriksa...
                </>
              ) : (
                <>
                  Saya Sudah Verifikasi <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

            <Button 
              variant="secondary" 
              className="w-full py-4"
              onClick={handleResendEmail}
              disabled={resendLoading}
            >
              {resendLoading ? 'Mengirim ulang...' : 'Kirim Ulang Email'}
            </Button>
          </div>

          <button 
            onClick={() => navigate('/login')} 
            className="mt-8 text-sm font-medium text-slate-500 hover:text-primary-accent dark:text-slate-400 dark:hover:text-primary-accent transition-colors"
          >
            Kembali ke Login
          </button>
        </motion.div>
      </div>
    </div>
  );
}
