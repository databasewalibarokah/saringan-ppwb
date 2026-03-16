import React, { Suspense } from 'react';
import BottomNavigation from '../BottomNavigation';
import Container from './Container';

const PageLoader = () => (
  <div className="h-full w-full flex items-center justify-center pt-32">
    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

/**
 * The main layout shell for the application.
 * Manages the responsive fluid background, decorative elements, container width, and bottom navigation.
 */
const AppLayout = ({ children, view, currentTab, onTabChange }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-emerald-200">
      {/* Background container expands up to max-w-6xl on desktop, full on mobile */}
      <div className="max-w-6xl mx-auto min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] dark:from-[#0f172a] dark:to-[#020617] relative shadow-2xl overflow-x-hidden sm:border-x border-slate-200/50 dark:border-slate-800/50">
        
        {/* Decorative Background Elements (Glass/Gradients/Islamic Geo hint) */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-100/60 to-transparent dark:from-emerald-900/20 z-0 pointer-events-none"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 -left-32 w-80 h-80 bg-amber-300/20 dark:bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Subtle Islamic Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none flex" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 15-15 15L15 15zM0 30l15 15-15 15L0 45zm60 0l-15 15 15 15V30zM30 60l15-15-15-15-15 15z' fill='%23059669' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`}}>
        </div>

        {/* Content Area bounded by the unified Container */}
        <Container className="relative z-10 pt-12 h-full min-h-screen pb-24">
          <Suspense fallback={<PageLoader />}>
            {children}
          </Suspense>
        </Container>

        {/* Bottom Navigation (Only show on main baseline pages) */}
        {view === 'main' && (
          <BottomNavigation currentTab={currentTab} onTabChange={onTabChange} />
        )}
      </div>
    </div>
  );
};

export default AppLayout;
