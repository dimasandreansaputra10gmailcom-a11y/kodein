import React from 'react';

export function DecorativeBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      
      {/* ---------------- DAY MODE: CLOUDS ---------------- */}
      <div className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-100 dark:opacity-0">
        <div className="absolute top-[15%] left-[5%] opacity-60">
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 70H85C101.569 70 115 56.5685 115 40C115 25.109 104.148 12.7538 89.8291 10.4285C85.5034 4.09322 78.1187 0 70 0C57.481 0 46.9959 8.76176 44.3312 20.5794C42.9463 20.1984 41.4947 20 40 20C23.4315 20 10 33.4315 10 50C10 61.0457 18.9543 70 30 70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="absolute top-[25%] right-[8%] opacity-50 scale-75">
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 70H85C101.569 70 115 56.5685 115 40C115 25.109 104.148 12.7538 89.8291 10.4285C85.5034 4.09322 78.1187 0 70 0C57.481 0 46.9959 8.76176 44.3312 20.5794C42.9463 20.1984 41.4947 20 40 20C23.4315 20 10 33.4315 10 50C10 61.0457 18.9543 70 30 70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="absolute bottom-[20%] left-[10%] opacity-40 scale-125">
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 70H85C101.569 70 115 56.5685 115 40C115 25.109 104.148 12.7538 89.8291 10.4285C85.5034 4.09322 78.1187 0 70 0C57.481 0 46.9959 8.76176 44.3312 20.5794C42.9463 20.1984 41.4947 20 40 20C23.4315 20 10 33.4315 10 50C10 61.0457 18.9543 70 30 70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="absolute bottom-[40%] right-[5%] opacity-60 scale-90">
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 70H85C101.569 70 115 56.5685 115 40C115 25.109 104.148 12.7538 89.8291 10.4285C85.5034 4.09322 78.1187 0 70 0C57.481 0 46.9959 8.76176 44.3312 20.5794C42.9463 20.1984 41.4947 20 40 20C23.4315 20 10 33.4315 10 50C10 61.0457 18.9543 70 30 70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* ---------------- NIGHT MODE: MOON & STARS ---------------- */}
      <div className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-0 dark:opacity-100">
        
        {/* Glowing Crescent Moon */}
        <div className="absolute top-[8%] right-[8%] md:top-[12%] md:right-[15%] w-24 h-24 md:w-32 md:h-32 opacity-90 drop-shadow-[0_0_20px_rgba(253,230,138,0.4)] transition-transform duration-1000 dark:scale-100 scale-75">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-yellow-200">
            <path d="M85 64C72 75 51 72.5 39.5 61C28 49.5 25.5 28.5 36.5 15.5C21 21 8 38 8 58C8 80.1 25.9 98 48 98C68 98 85 85 90.5 69.5C88.8 68.3 87 66.5 85 64Z" fill="currentColor"/>
          </svg>
        </div>

        {/* Scattered Stars */}
        <div className="absolute top-[15%] left-[15%] w-2 h-2 rounded-full bg-yellow-100 opacity-80 drop-shadow-[0_0_8px_rgba(253,230,138,0.8)] animate-pulse" />
        <div className="absolute top-[25%] left-[35%] w-1 h-1 rounded-full bg-white opacity-60" />
        <div className="absolute top-[8%] left-[60%] w-2.5 h-2.5 rounded-full bg-yellow-100 opacity-90 drop-shadow-[0_0_10px_rgba(253,230,138,0.8)] animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute top-[35%] right-[25%] w-1.5 h-1.5 rounded-full bg-white opacity-50" />
        <div className="absolute top-[45%] left-[8%] w-1.5 h-1.5 rounded-full bg-indigo-200 opacity-80 drop-shadow-[0_0_8px_rgba(199,210,254,0.6)] animate-pulse" style={{ animationDuration: '2.5s' }} />
        <div className="absolute top-[60%] right-[15%] w-2 h-2 rounded-full bg-blue-100 opacity-60" />
        <div className="absolute top-[75%] left-[20%] w-1.5 h-1.5 rounded-full bg-white opacity-80" />
        <div className="absolute top-[80%] right-[40%] w-2 h-2 rounded-full bg-purple-200 opacity-70 drop-shadow-[0_0_10px_rgba(233,213,255,0.5)] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-[85%] left-[70%] w-1.5 h-1.5 rounded-full bg-white opacity-40" />

        {/* Soft Comets */}
        <div className="absolute top-[25%] right-[30%] w-20 h-0.5 bg-gradient-to-r from-transparent via-cyan-100 to-white opacity-40 -rotate-45 rounded-full drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
        <div className="absolute top-[65%] left-[20%] w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-200 to-white opacity-30 -rotate-45 rounded-full drop-shadow-[0_0_4px_rgba(233,213,255,0.6)]" />

      </div>

    </div>
  );
}

