import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors as themeColors } from '@/styles/theme'; // ✅ Updated path

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(systemColorScheme || 'light');
  
  // Use the imported colors directly
  const baseColors = themeColors;

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Define theme colors based on current theme
  const currentColors = {
    background: theme === 'light' ? '#FFFFFF' : '#111827',
    surface: theme === 'light' ? '#F5F7FA' : '#1F2937',
    text: theme === 'light' ? '#111827' : '#F5F7FA',
    textSecondary: theme === 'light' ? '#6C757D' : '#9AA2B0',
    border: theme === 'light' ? '#E4E7EB' : '#374151',
    // Merge with base colors
    ...baseColors,
  };

  const value = {
    theme,
    colors: currentColors,
    toggleTheme,
    isDark: theme === 'dark',
  };

  console.log('🔍 ThemeProvider rendered', { 
    theme, 
    hasColors: !!currentColors,
    colorsKeys: Object.keys(currentColors).length 
  });

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};



