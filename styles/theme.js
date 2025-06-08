import { createContext, useContext } from 'react';


const ThemeContext = createContext();

const colors = {
  primary: '#2E8B57',
  secondary: '#FFD700',
  background: '#F0F2F5',
  text: '#333333',
  lightText: '#FFFFFF', 
  danger: '#DC3545', 
  success: '#28A745', 
  info: '#17A2B8',
  cardBackground: '#FFFFFF', 
  borderColor: '#DDDDDD',
};

const fonts = {
  regular: 'Inter, sans-serif',
  bold: 'Inter, sans-serif',
  header: 'Inter, sans-serif', 
};

const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ colors, fonts }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { colors, fonts, ThemeProvider, useTheme };