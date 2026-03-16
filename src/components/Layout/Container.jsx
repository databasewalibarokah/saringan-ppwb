import React from 'react';

/**
 * Reusable Container component to constrain max-width and center content.
 * Handles the responsive padding (mobile to desktop) for the application.
 */
const Container = ({ children, className = '' }) => {
  return (
    <div className={`max-w-6xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
