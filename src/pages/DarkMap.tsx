import { motion } from 'motion/react';
import { Rocket, Sparkles, Lock, MessageSquare, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

export default function DarkMap() {
  const nodes = [
    { id: '1', label: 'NEBULA GATE', status: 'completed', icon: Rocket, glow: 'shadow-[0_0_20px_rgba(13,148,136,0.6)]', color: 'border-teal-500 bg-teal-500' },
    { id: '2', label: 'STAR STRIDER', status: 'completed', icon: Rocket, glow: 'shadow-[0_0_20px_rgba(13,148,136,0.6)]', color: 'border-teal-500 bg-teal-500' },
    { id: '3', label: 'GHOST SHELL', status: 'current', icon: Sparkles, glow: 'shadow-[0_0_30px_rgba(232,185,111,0.8)]', color: 'border-amber-400 bg-amber-400' },
    { id: '4', label: 'VOID VOX', status: 'locked', icon: Lock, glow: 'shadow-none', color: 'border-slate-700 bg-slate-800' },
  ];

  return (
    <div className="flex-1 w-full h-full bg-[#0D0D1A] flex flex-col relative overflow-hidden">
      {/* Background Star Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: Math.random() * 3 + 2, delay: Math.random() * 2 }}
          className="absolute bg-white rounded-full"
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
          }}
        />
      ))}

      {/* Header Overlay */}
      <div className="p-6 flex items-center justify-between z-20">
        <Link to="/map" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md border border-white/20">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="text-center">
          <h2 className="text-teal-400 font-black text-lg tracking-[0.2em]">NEBULA HEIGHTS</h2>
          <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase">Ancient World • Section Z</p>
        </div>
        <div className="w-12 h-12" />
      </div>

      {/* Map Content */}
      <div className="flex-1 px-6 py-12 flex flex-col items-center gap-32 relative z-10 overflow-y-auto scrollbar-hide pb-32">
        {nodes.map((node, i) => (
          <div key={node.id} className="relative w-full flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={cn(
                "w-full max-w-xs p-6 rounded-[32px] border-4 flex flex-col items-center text-center gap-4 transition-all duration-300 bg-[#1E2D3D]/40 backdrop-blur-sm",
                node.status === 'current' ? "border-amber-400/50" : "border-slate-800",
                node.glow
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-xl mb-2",
                node.color
              )}>
                <node.icon className="w-8 h-8" />
              </div>
              
              <div>
                <p className={cn(
                  "text-[10px] font-black tracking-widest mb-1",
                  node.status === 'completed' && "text-teal-400",
                  node.status === 'current' && "text-amber-400",
                  node.status === 'locked' && "text-slate-500"
                )}>
                  {node.status.toUpperCase()} {node.status === 'current' && 'MISSION'}
                </p>
                <h3 className="text-white font-black text-xl tracking-tight leading-none">{node.label}</h3>
              </div>

              {node.status === 'current' && (
                <Link to="/quests" className="w-full">
                  <button className="w-full bg-cta-yellow py-3 rounded-2xl font-black text-slate-800 text-sm shadow-[0_4px_20px_rgba(245,230,66,0.3)]">
                    ENTER CAVE
                  </button>
                </Link>
              )}
            </motion.div>

            {/* Connecting Line */}
            {i < nodes.length - 1 && (
              <div className="absolute top-full h-32 w-1 border-l-4 border-dashed border-teal-500/20" />
            )}
            
            {/* Ambient Glows */}
            {node.status === 'current' && (
              <div className="absolute -z-10 w-64 h-64 bg-amber-400/10 blur-[100px] rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Floating Chat Button */}
      <button className="fixed bottom-24 right-5 w-14 h-14 bg-teal-500 text-white rounded-full shadow-[0_0_20px_rgba(20,184,166,0.4)] flex items-center justify-center z-50">
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}
