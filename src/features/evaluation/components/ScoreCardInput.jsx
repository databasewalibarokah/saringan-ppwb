import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ScoreCardInput = ({ label, value, onChange }) => {
  const scores = [60, 70, 80, 90];

  return (
    <div className="mb-8">
      <label className="block text-slate-700 dark:text-slate-200 font-bold text-lg mb-4 flex items-center gap-2">
        <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
        {label}
      </label>
      
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {scores.map((score) => {
          const isSelected = value === score;
          
          return (
            <motion.button
              key={score}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(score)}
              className={`relative h-14 md:h-20 rounded-xl md:rounded-2xl flex flex-col items-center justify-center transition-all duration-200 border-2 overflow-hidden ${
                isSelected 
                  ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20 text-white' 
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-200 dark:hover:border-emerald-800'
              }`}
            >
              <span className="text-lg md:text-2xl font-black">{score}</span>
              <span className={`text-[8px] md:text-[10px] uppercase tracking-widest font-bold mt-0.5 md:mt-1 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                Poin
              </span>

              {isSelected && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <div className="bg-white/20 rounded-full p-1">
                    <Check size={12} className="text-white" strokeWidth={4} />
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(ScoreCardInput);
