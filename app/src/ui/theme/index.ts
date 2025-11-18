// src/ui/theme/index.ts
import { MD3DarkTheme } from 'react-native-paper';
export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#48C9B0',
    secondary: '#1F8EFA',
    background: '#0E0E12',
    surface: '#16171D',
    text: '#000000ff',
    outline: '#2A2B33',
    error: '#FF4D4F',
  }
};
