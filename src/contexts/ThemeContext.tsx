import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeColor = 'blue' | 'green' | 'purple' | 'pink';
export type ThemeMode = 'light' | 'dark';
export type Theme = `${ThemeMode}-${ThemeColor}`;

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  mode: ThemeMode;
  color: ThemeColor;
  toggleMode: () => void;
  setColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'light-blue';
  });

  const [mode, color] = theme.split('-') as [ThemeMode, ThemeColor];

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('dark');
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    }
    // Apply color theme
    document.documentElement.setAttribute('data-color-theme', color);
  }, [theme, mode, color]);

  const toggleMode = () => {
    setTheme(prev => {
      const [currentMode, currentColor] = prev.split('-');
      const newMode = currentMode === 'light' ? 'dark' : 'light';
      return `${newMode}-${currentColor}` as Theme;
    });
  };

  const setColor = (newColor: ThemeColor) => {
    setTheme(`${mode}-${newColor}` as Theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mode, color, toggleMode, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};