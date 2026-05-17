import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Play, Terminal, HelpCircle, Trophy, Heart } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { STAGE_CONTENTS } from '../constants/stageContents';
import { synth } from '../lib/synth';

type Phase = 'theory' | 'quiz' | 'code' | 'completed';

export default function Stage() {
  const { levelId, stageId } = useParams();
  const navigate = useNavigate();
  const { user, addXp, unlockStage, updateProfile } = useAuthStore();
  const [phase, setPhase] = useState<Phase>('theory');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [code, setCode] = useState('');
  
  // Heart & Popup system
  const [hearts, setHearts] = useState(user?.lives || 5);
  const [popup, setPopup] = useState<{message: string, isCorrect: boolean} | null>(null);

  useEffect(() => {
    if (hearts <= 0) {
      alert("Yah, Heart kamu habis! Coba lagi dari awal ya.");
      navigate(`/map/${levelId}`);
    }
  }, [hearts, navigate, levelId]);

  const showPopup = (message: string, isCorrect: boolean) => {
    setPopup({ message, isCorrect });
    setTimeout(() => setPopup(null), 3000);
  };

  const safeLevelId = levelId || 'sd';
  const safeStageId = stageId || '1';
  
  const content = STAGE_CONTENTS[safeLevelId]?.[safeStageId] || {
    title: `Stage ${safeStageId}`,
    theory: "Materi sedang disiapkan oleh KODE.in!",
    quizzes: [{ question: "Ayo lanjut?", options: ["Ya", "Tidak", "Mungkin", "Belum"], correct: 0 }],
    codeInstruction: "Ketik 'Mulai'",
    expectedCode: "Mulai"
  };

  const handleNextTheory = () => setPhase('quiz');
  
  const handleQuizSubmit = () => {
    if (selectedAnswer === content.quizzes[quizIndex].correct) {
      synth.playCorrect();
      showPopup("Jawaban kamu benar! Yeay!", true);
      addXp(10); // small XP boost per question
      setTimeout(() => {
        if (quizIndex < content.quizzes.length - 1) {
          setQuizIndex(quizIndex + 1);
          setSelectedAnswer(null);
        } else {
          setPhase('code');
        }
      }, 1500);
    } else {
      synth.playWrong();
      showPopup("Jawaban salah! Kurang 1 Heart.", false);
      const newHearts = hearts - 1;
      setHearts(newHearts);
      updateProfile({ lives: newHearts });
    }
  };

  const handleCodeSubmit = async () => {
    if (code.replace(/\s+/g, '').toLowerCase().includes(content.expectedCode.replace(/\s+/g, '').toLowerCase())) {
      synth.playLevelUp();
      showPopup("Kodingan Tepat! Hebat!", true);
      addXp(100);
      unlockStage(levelId || 'sd', parseInt(stageId || '1') + 1);
      
      // Simpan progress ke database
      if (user) {
        try {
          const progressId = `${user.id}_${levelId}_${stageId}`;
          await setDoc(doc(db, 'progress', progressId), {
            userId: user.id,
            levelId: levelId || 'sd',
            stageId: stageId || '1',
            completedAt: serverTimestamp()
          });
        } catch (error) {
          console.error("Gagal menyimpan progress:", error);
        }
      }
      
      setTimeout(() => setPhase('completed'), 1500);
    } else {
      synth.playWrong();
      showPopup("Kodemu belum tepat. Ayo coba lagi!", false);
      const newHearts = hearts - 1;
      setHearts(newHearts);
      updateProfile({ lives: newHearts });
    }
  };

  const handleComplete = () => {
    navigate(`/map/${levelId}`);
  };

  const calculateProgress = () => {
    if (phase === 'theory') return 20;
    if (phase === 'quiz') return 20 + ((quizIndex / content.quizzes.length) * 50);
    if (phase === 'code') return 85;
    return 100;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-8 pt-24 pb-32 transition-colors duration-300 relative overflow-hidden">
      
      {/* Dynamic Alert Pop-up Array */}
      <AnimatePresence>
        {popup && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full text-white font-bold shadow-xl border-2 flex items-center gap-2
              ${popup.isCorrect ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'}`}
          >
             {popup.isCorrect ? '🌟' : '💔'} {popup.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        {/* Header Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 mt-8">
            <button onClick={() => navigate(`/map/${levelId}`)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium flex items-center gap-1 transition-colors">
              <ChevronRight className="w-5 h-5 rotate-180" /> Kembali ke Map
            </button>
            <div className="font-bold text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30 px-3 py-1 rounded-full text-sm">
              Reward: 100 XP
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-6 pr-32">{content.title}</h1>
          
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 mb-6 overflow-hidden">
            <div className="bg-teal-500 h-3 rounded-full transition-all duration-500" style={{ width: `${calculateProgress()}%` }} />
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 md:p-10 shadow-sm border-2 border-slate-100 dark:border-slate-700">
          <AnimatePresence mode="wait">
            
            {phase === 'theory' && (
              <motion.div
                key="theory"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <Play className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Materi Dasar</h2>
                <div className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {content.theory.split('```').map((part, index) => {
                    if (index % 2 === 1) {
                      // Ini bagian kode
                      return (
                        <div key={index} className="my-4 bg-slate-900 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <span className="text-xs font-mono text-slate-400 ml-2">Contoh Kode</span>
                          </div>
                          <div className="p-4 overflow-x-auto text-left">
                            <pre className="font-mono text-sm text-green-400 m-0"><code>{part.trim()}</code></pre>
                          </div>
                        </div>
                      );
                    }
                    // Ini bagian teks biasa
                    return <span key={index}>{part}</span>;
                  })}
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl flex items-start gap-4">
                  <div className="text-4xl shrink-0">🤖</div>
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">BuddyBot bilang:</p>
                    <p className="text-slate-600 dark:text-slate-400">Pahami konsep ini baik-baik ya, karena kita akan menggunakan 5 pertanyaan kuis dan coding challenge berdasarkan teks ini!</p>
                  </div>
                </div>
                <Button variant="primary" onClick={handleNextTheory} className="w-full py-4 text-lg">
                  Lanjut ke Quiz
                </Button>
              </motion.div>
            )}

            {phase === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-500 rounded-2xl flex items-center justify-center">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <div className="text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
                    Pertanyaan {quizIndex + 1} dari 5
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Uji Pemahaman</h2>
                <p className="text-slate-700 dark:text-slate-200 text-xl font-semibold mb-6">
                  {content.quizzes[quizIndex].question}
                </p>
                
                <div className="space-y-3">
                  {content.quizzes[quizIndex].options.map((opt, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedAnswer(idx)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAnswer === idx ? 'border-primary-accent bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-teal-300'}`}
                    >
                      <h4 className={`font-bold ${selectedAnswer === idx ? 'text-primary-accent' : 'text-slate-700 dark:text-slate-300'}`}>
                        {opt}
                      </h4>
                    </div>
                  ))}
                </div>

                <Button variant="primary" onClick={handleQuizSubmit} disabled={selectedAnswer === null} className="w-full py-4 text-lg mt-8 disabled:opacity-50">
                  Cek Jawaban
                </Button>
              </motion.div>
            )}

            {phase === 'code' && (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                  <Terminal className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Tantangan Koding</h2>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl">
                  <p className="text-slate-700 dark:text-slate-300 font-medium whitespace-pre-wrap">
                    {content.codeInstruction}
                  </p>
                </div>
                
                <div className="bg-[#1E1E1E] rounded-2xl p-4 font-mono text-sm shadow-inner mt-4 border border-slate-800">
                  <div className="flex gap-2 mb-4 px-2">
                     <div className="w-3 h-3 rounded-full bg-red-500" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500" />
                     <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <textarea 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="// Tulis kodemu di sini..."
                    className="w-full bg-transparent text-slate-100 outline-none resize-none h-40"
                    spellCheck="false"
                  />
                </div>

                <Button variant="primary" onClick={handleCodeSubmit} className="w-full py-4 text-lg mt-4 shadow-md bg-orange-500 hover:bg-orange-600 outline-none">
                  Jalankan Kode
                </Button>
              </motion.div>
            )}

            {phase === 'completed' && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-12"
              >
                <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 rounded-full flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-20" />
                  <Trophy className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Stage Selesai!</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">Luar biasa! Kamu menyelesaikan semua kuis & kode.</p>
                <Button variant="primary" onClick={handleComplete} className="px-8 py-4 text-lg">
                  Lanjut Petualangan
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
