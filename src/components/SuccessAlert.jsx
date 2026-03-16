import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const SuccessAlert = ({ 
  isVisible, 
  message, 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 pointer-events-none">
          {/* Backdrop blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/10 dark:bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-white/50 dark:border-slate-700/50 flex flex-col items-center max-w-sm w-full pointer-events-auto"
          >
            <div className="relative mb-6">
              {/* Outer Glow */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, times: [0, 0.7, 1] }}
                className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40"
              >
                <motion.div
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Check className="text-white" size={40} strokeWidth={3} />
                </motion.div>
              </motion.div>
              
              {/* Subtle Pulsing Rings */}
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 border-2 border-emerald-500 rounded-full"
              />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 text-center">
              Berhasil!
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-center text-lg">
              {message}
            </p>
            
            <button 
              onClick={onClose}
              className="mt-8 px-8 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 font-bold rounded-2xl transition-colors active:scale-95"
            >
              Tutup
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessAlert;
