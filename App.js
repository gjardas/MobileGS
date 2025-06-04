import React, { useState } from 'react';
import { ThemeProvider } from './styles/theme';
import HomeScreen from './screens/HomeScreen';
import RiskPredictionScreen from './screens/RiskPredictionScreen';
import DroneControlScreen from './screens/DroneControlScreen';
import AlertsScreen from './screens/AlertsScreen'; // Importa a tela renomeada
import AboutScreen from './screens/AboutScreen';

const App = () => {
  const [currentPage, setCurrentPage] = useState('Home');

  const navigate = (pageName) => {
    setCurrentPage(pageName);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <HomeScreen navigate={navigate} />;
      case 'RiskPrediction':
        return <RiskPredictionScreen navigate={navigate} />;
      case 'DroneControl':
        return <DroneControlScreen navigate={navigate} />;
      case 'Alerts': // Usa o novo nome da rota
        return <AlertsScreen navigate={navigate} />;
      case 'About':
        return <AboutScreen navigate={navigate} />;
      default:
        return <HomeScreen navigate={navigate} />;
    }
  };

  return (
    <ThemeProvider>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
          body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
          }
          .animate-scale-in {
            animation: scaleIn 0.3s ease-out forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      {renderPage()}
    </ThemeProvider>
  );
};

export default App;
