import React from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Check, Lock, ChevronRight, User, Heart } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { ADVENTURE_STAGES } from '../constants/stagesConfig';

export default function MapPage() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  let mapTitle = "Peta Belajar";
  if (levelId === 'sd') mapTitle = "Logika Dasar SD";
  if (levelId === 'smp') mapTitle = "Sintaksis SMP";
  if (levelId === 'sma') mapTitle = "Algoritma SMA";
  if (levelId === 'pt') mapTitle = "Rekayasa PT";

  const currentMaxStage = user?.unlockedStages?.[levelId || 'sd'] || 1;
  const rawStages = ADVENTURE_STAGES[levelId || 'sd'] || ADVENTURE_STAGES['sd'];

  const stages = rawStages.map((stage) => {
    const stageNum = parseInt(stage.id);
    let status = 'locked';
    if (stageNum < currentMaxStage) status = 'completed';
    else if (stageNum === currentMaxStage) status = 'unlocked';
    return { ...stage, status };
  });

  return (
    <div className="flex flex-1 w-full min-h-screen overflow-y-auto overflow-x-hidden bg-[#F8F9FA] dark:bg-slate-900 pb-32 transition-colors duration-300">
      
      {/* Top Header */}
      <div className="fixed top-0 left-0 w-full z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b-2 border-slate-100 dark:border-slate-800 p-4 pt-16 md:pt-6 pb-4 hidden md:flex items-center justify-between">
         <div className="font-black text-teal-500 text-2xl flex items-center gap-2 px-4 cursor-pointer" onClick={() => navigate('/adventure')}>
           <ChevronRight className="w-6 h-6 rotate-180" /> {mapTitle}
         </div>
         <div className="flex items-center gap-4 px-4">
            <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-full font-bold text-yellow-600 dark:text-yellow-400">
              ⚡ {user?.xp || 0} XP
            </div>
         </div>
      </div>

      <main className="flex-1 relative flex flex-col pt-24 md:pt-32 pb-40 w-full max-w-3xl mx-auto px-6">
        
        {/* Mobile Title */}
        <div className="md:hidden font-black text-teal-500 text-2xl flex items-center gap-2 mb-10 cursor-pointer" onClick={() => navigate('/adventure')}>
          <ChevronRight className="w-6 h-6 rotate-180" /> {mapTitle}
        </div>

        <div className="relative flex flex-col gap-24 pt-10">
          {/* Dashed Timeline */}
          <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-1.5 h-[calc(100%-120px)] bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden pointer-events-none z-0">
             <div className="w-full h-full border-l-[6px] border-dashed border-slate-300 dark:border-slate-700 absolute left-0 top-0" />
          </div>

          {/* Nodes */}
          {stages.map((stage, idx) => {
            const isLeft = idx % 2 === 0;
            const statusColors = {
              completed: "bg-teal-400 border-teal-200 shadow-[0_4px_15px_rgba(45,212,191,0.5)] text-white",
              unlocked: "bg-orange-400 border-orange-200 shadow-[0_4px_15px_rgba(251,146,60,0.5)] text-white animate-pulse",
              locked: "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500"
            };
            
            const StatusIcon = stage.status === 'completed' ? Check : (stage.status === 'locked' ? Lock : Play);

            return (
              <div 
                key={stage.id} 
                className={`relative z-10 w-full flex items-center ${isLeft ? 'justify-start' : 'justify-end'} group cursor-pointer`}
                style={{ transform: `translateX(${isLeft ? '20%' : '-20%'})` }}
                onClick={() => {
                  if (stage.status !== 'locked') navigate(`/stage/${levelId}/${stage.id}`);
                }}
              >
                 <div className="flex flex-col items-center">
                   <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 relative transition-transform ${stage.status !== 'locked' ? 'hover:scale-110' : ''} ${statusColors[stage.status as keyof typeof statusColors]}`}>
                     <StatusIcon className="w-8 h-8 stroke-[3]" />
                     {stage.status !== 'locked' && (
                       <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 border-white dark:border-slate-800">
                         ★
                       </div>
                     )}
                   </div>
                   <div className="mt-4 bg-white dark:bg-slate-800 rounded-2xl px-5 py-3 shadow-md border border-slate-100 dark:border-slate-700 flex flex-col items-center max-w-[200px] md:max-w-[250px] text-center gap-1">
                     <span className="text-xs font-bold text-primary-accent uppercase tracking-wider">{stage.zone}</span>
                     <span className="text-sm font-black text-slate-800 dark:text-white leading-tight">Stage {stage.id}: {stage.title}</span>
                     {stage.status !== 'locked' && (
                       <div className="mt-2 text-[10px] md:text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-1">
                         <span><strong className="text-slate-700 dark:text-slate-300">Materi:</strong> {stage.material}</span>
                         <span><strong className="text-slate-700 dark:text-slate-300">Quest:</strong> {stage.quest}</span>
                       </div>
                     )}
                   </div>
                 </div>
              </div>
            )
          })}
          
        </div>
      </main>
    </div>
  );
}
