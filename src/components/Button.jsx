import React from 'react';

const Button = ({ children, onClick, className = '', variant = 'primary' }) => {
  const variants = {
    primary: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700',
    secondary: 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600',
    outline: 'border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400',
  };
  
  return (
    <button 
      onClick={onClick}
      className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default React.memo(Button);
