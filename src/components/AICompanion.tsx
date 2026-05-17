import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAIStore } from '../store/useAIStore';
import { getAICompanionResponse } from '../services/geminiService';
import { cn } from '../lib/utils';

export function AICompanion() {
  const { 
    isOpen, history, 
    toggleOpen, setOpen, addMessage, clearHistory 
  } = useAIStore();
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isTyping, isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    addMessage({ sender: 'user', text });
    setInput('');
    setIsTyping(true);
    
    try {
      const response = await getAICompanionResponse(
        text, 
        history, 
        { name: 'Buddy Bot', type: 'Friendly Tutor' }
      );
      
      addMessage({ sender: 'ai', text: response });
    } catch (err) {
      addMessage({ sender: 'ai', text: 'Maaf, terjadi kesalahan pada sistem AI ku.' });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const faqs = [
    "Apa itu Kode.in?",
    "Bagaimana cara bermain?",
    "Apa itu Python?",
    "Apa itu Loop?"
  ];

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleOpen}
            className="fixed bottom-[88px] sm:bottom-[96px] md:bottom-[104px] right-4 md:right-8 w-14 h-14 bg-white dark:bg-slate-900 border-2 border-primary-accent shadow-xl shadow-teal-500/20 rounded-full flex items-center justify-center z-[100] overflow-hidden group transition-colors duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-2xl z-10">🤖</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Interface Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-[96px] md:bottom-[104px] sm:right-4 md:right-8 w-full sm:w-[350px] md:w-[400px] h-full sm:h-[500px] lg:h-[600px] sm:max-h-[calc(100vh-140px)] bg-white dark:bg-slate-900 border-0 sm:border border-slate-200 dark:border-slate-800 sm:shadow-2xl sm:rounded-3xl z-[100] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-xl shadow-inner">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    Buddy Bot
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                    Friendly Tutor
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={clearHistory}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                  title="Hapus Pesan"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat History View */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 custom-scrollbar">
              {history.length === 0 && (
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 mx-4 mt-4 shadow-sm">
                  <div className="text-3xl mb-2">👋</div>
                  <h4 className="font-bold text-slate-800 dark:text-white mb-1">Halo Explorer!</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Aku Buddy Bot, asisten kodemu. Ada yang bisa aku bantu?
                  </p>
                </div>
              )}
              {history.map((msg) => (
                <div key={msg.id} className={cn("flex flex-col max-w-[85%]", msg.sender === 'user' ? "items-end self-end ml-auto" : "items-start")}>
                  <div className={cn(
                    "px-4 py-2.5 rounded-2xl text-[14px]",
                    msg.sender === 'user' 
                      ? "bg-primary-accent text-white rounded-br-sm shadow-sm" 
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-sm shadow-sm markdown-body"
                  )}>
                    {msg.sender === 'ai' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex flex-col items-start max-w-[85%]">
                  <div className="bg-white dark:bg-slate-800 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary-accent rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary-accent rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary-accent rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col">
              {/* FAQ Chips */}
              <div className="px-3 pt-3 pb-1 overflow-x-auto flex gap-2 hidden-scrollbar">
                {faqs.map((faq, idx) => (
                  <button 
                    key={idx}
                    onClick={() => sendMessage(faq)}
                    className="whitespace-nowrap px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-full transition-colors flex-shrink-0"
                  >
                    {faq}
                  </button>
                ))}
              </div>
              <div className="p-3">
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tanya Buddy Bot..."
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-accent transition-all"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-1 w-10 h-10 bg-primary-accent hover:bg-teal-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-full flex items-center justify-center transition-colors shadow-sm disabled:shadow-none"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
