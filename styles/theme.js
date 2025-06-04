import { createContext, useContext } from 'react';

// Define as cores e fontes que serão usadas em todo o aplicativo
const ThemeContext = createContext();

const colors = {
  primary: '#2E8B57', // Verde escuro para ações principais
  secondary: '#FFD700', // Amarelo dourado para destaque
  background: '#F0F2F5', // Cinza claro para o fundo
  text: '#333333', // Cor de texto padrão
  lightText: '#FFFFFF', // Cor de texto para fundos escuros
  danger: '#DC3545', // Vermelho para ações de perigo/erro
  success: '#28A745', // Verde para sucesso
  info: '#17A2B8', // Azul claro para informações
  cardBackground: '#FFFFFF', // Fundo de cartões
  borderColor: '#DDDDDD', // Cor da borda
};

const fonts = {
  regular: 'Inter, sans-serif', // Fonte Inter para web
  bold: 'Inter, sans-serif', // Fonte Inter em negrito
  header: 'Inter, sans-serif', // Fonte Inter para cabeçalhos
};

const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ colors, fonts }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook customizado para usar o tema
const useTheme = () => useContext(ThemeContext);

export { colors, fonts, ThemeProvider, useTheme };