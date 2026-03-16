import React from 'react';

const StickyBottomBar = ({ children }) => (
  <div className="fixed bottom-0 left-0 right-0 p-4 sm:px-8 md:px-12 lg:px-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom flex flex-col items-center justify-center max-w-6xl mx-auto">
    {children}
  </div>
);

export default React.memo(StickyBottomBar);
