// App.js
// Ponto de entrada principal do aplicativo MobileGS.
// Configura os provedores globais (Tema, Autenticação) e o roteador de navegação principal.
import React from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// Import existing screens for the main app part
import { ThemeProvider } from './styles/theme'; // Assuming this is still needed
import HomeScreen from './screens/HomeScreen';
import RiskPredictionScreen from './screens/RiskPredictionScreen';
import DroneControlScreen from './screens/DroneControlScreen';
import AlertsScreen from './screens/AlertsScreen';
import AboutScreen from './screens/AboutScreen';
import HistoryScreen from './screens/HistoryScreen'; // Import HistoryScreen

const Stack = createStackNavigator();

// A simple placeholder for the main app navigation after login
// This can be expanded into a tab navigator or a more complex stack navigator
const MainAppStack = createStackNavigator();

function MainNavigator() {
  // For simplicity, starting with HomeScreen.
  // The original navigation logic (navigate, renderPage) can be integrated here
  // using react-navigation patterns if needed, or replaced by stack/tab navigators.
  return (
    <MainAppStack.Navigator>
      <MainAppStack.Screen name="HomeApp" component={HomeScreen} options={{ title: 'Dashboard Principal' }}/>
      {/* Add other main app screens here as needed, e.g. */}
      <MainAppStack.Screen name="RiskPrediction" component={RiskPredictionScreen} options={{ title: 'Criar Simulação' }} />
      <MainAppStack.Screen name="DroneControl" component={DroneControlScreen} options={{ title: 'Controle de Drones' }} />
      <MainAppStack.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Minhas Simulações' }} />
      <MainAppStack.Screen name="History" component={HistoryScreen} options={{ title: 'Histórico de Desastres' }} />
      <MainAppStack.Screen name="About" component={AboutScreen} />
    </MainAppStack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

/**
 * Componente raiz de navegação que decide qual stack de navegação (Autenticação ou Principal)
 * deve ser renderizado com base no estado de autenticação do usuário.
 */
function AppRootNavigator() {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        {/* Global styles from the original App.js - applied via ThemeProvider or direct style tag */}
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
            body { /* Note: 'body' styling might not directly apply in React Native environment as it does in web */
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
        <AppRootNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
