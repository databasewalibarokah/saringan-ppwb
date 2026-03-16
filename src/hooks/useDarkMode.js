import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage global dark mode state
 * synchronizing with the DOM's html tag.
 */
export function useDarkMode(initialState = false) {
  const [darkMode, setDarkMode] = useState(initialState);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  return [darkMode, toggleDarkMode];
}
