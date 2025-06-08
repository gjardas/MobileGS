import React from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { ThemeProvider } from './styles/theme';
import HomeScreen from './screens/HomeScreen';
import RiskPredictionScreen from './screens/RiskPredictionScreen';
import DroneControlScreen from './screens/DroneControlScreen';
import AlertsScreen from './screens/AlertsScreen';
import AboutScreen from './screens/AboutScreen';
import HistoryScreen from './screens/HistoryScreen';

const Stack = createStackNavigator();

const MainAppStack = createStackNavigator();

function MainNavigator() {
  return (
    <MainAppStack.Navigator>
      <MainAppStack.Screen name="HomeApp" component={HomeScreen} options={{ title: 'Dashboard Principal' }}/>
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

function AppRootNavigator() {
  const { userToken, isLoading } = useAuth();
  console.log('[App.js] AppRootNavigator: isLoading:', isLoading, 'userToken:', userToken);

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
