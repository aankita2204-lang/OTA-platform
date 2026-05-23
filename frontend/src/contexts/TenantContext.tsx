import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeId =
  | 'blue-pink'
  | 'velvet-noir'
  | 'slate-storm'
  | 'emerald-abyss'
  | 'golden-dusk'
  | 'arctic-glass'
  | 'cosmic-purple'
  | 'rose-blush'
  | 'midnight-ocean'
  | 'obsidian-gold';

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  gradient: string;
  textColor: string;
}

export const THEMES: ThemeMeta[] = [
  { id: 'blue-pink',       label: 'Blue Pink',      gradient: 'linear-gradient(135deg,#1a0533,#3d5afe)',  textColor: '#fff' },
  { id: 'velvet-noir',     label: 'Velvet Noir',    gradient: 'linear-gradient(135deg,#1a0008,#6b0f1a)',  textColor: '#fff' },
  { id: 'slate-storm',     label: 'Slate Storm',    gradient: 'linear-gradient(135deg,#1c1f2e,#6c7ae0)',  textColor: '#fff' },
  { id: 'emerald-abyss',   label: 'Emerald Abyss',  gradient: 'linear-gradient(135deg,#020f08,#00c896)',  textColor: '#fff' },
  { id: 'golden-dusk',     label: 'Golden Dusk',    gradient: 'linear-gradient(135deg,#1a1200,#d4a017)',  textColor: '#fff' },
  { id: 'arctic-glass',    label: 'Arctic Glass',   gradient: 'linear-gradient(135deg,#cce0ff,#f0f6ff)',  textColor: '#0d1b2a' },
  { id: 'cosmic-purple',   label: 'Cosmic Purple',  gradient: 'linear-gradient(135deg,#07001a,#7209b7)',  textColor: '#fff' },
  { id: 'rose-blush',      label: 'Rose Blush',     gradient: 'linear-gradient(135deg,#150008,#f72585)',  textColor: '#fff' },
  { id: 'midnight-ocean',  label: 'Midnight Ocean', gradient: 'linear-gradient(135deg,#020a18,#00b4d8)',  textColor: '#fff' },
  { id: 'obsidian-gold',   label: 'Obsidian Gold',  gradient: 'linear-gradient(135deg,#080700,#c8a84b)',  textColor: '#fff' },
];

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    return (localStorage.getItem('ota_theme') as ThemeId) || 'blue-pink';
  });

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    localStorage.setItem('ota_theme', t);
  };

  useEffect(() => {
    if (theme === 'blue-pink') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
