import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Pressable } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme as useCentralTheme } from '../styles/theme';

// Local theme definition
const localTheme = {
  colors: {
    primary: '#2E8B57', secondary: '#4682B4', accent: '#FF6347',
    background: '#F0F2F5', surface: '#FFFFFF', card: '#FFFFFF',
    text: '#333333', textSecondary: '#555555', placeholder: '#999999',
    lightText: '#FFFFFF', error: '#DC3545', success: '#28A745',
    info: '#17A2B8', warning: '#FFC107', border: '#DDDDDD', disabled: '#CCCCCC',
  },
  fonts: { regular: 'System', bold: 'System', header: 'System' },
  fontSizes: { caption: 12, button: 16, body: 16, input: 16, subheading: 18, title: 22, headline: 26, display1: 32 },
  spacing: { xxsmall: 2, xsmall: 4, small: 8, medium: 16, large: 24, xlarge: 32, xxlarge: 48 },
  roundness: 8,
};

const HomeScreen = ({ navigation }) => {
  const theme = localTheme; // Prioritize localTheme
  // const { colors, fonts } = useCentralTheme(); // Or merge if central theme is fixed

  const { logout, userData } = useAuth();
  console.log('HomeScreen userData:', userData);

  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logout bem-sucedido');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
    }
  };

  // Button Component using Pressable for consistent styling
  const ThemedButton = ({ title, onPress, type = 'primary', style = {} }) => {
    let backgroundColor = theme.colors.primary;
    if (type === 'secondary') backgroundColor = theme.colors.secondary;
    if (type === 'error') backgroundColor = theme.colors.error;
    if (type === 'info') backgroundColor = theme.colors.info;
    if (type === 'custom') backgroundColor = style.backgroundColor || theme.colors.primary;


    return (
      <Pressable
        style={({ pressed }) => [
          styles.pressableButton,
          { backgroundColor, opacity: pressed ? 0.8 : 1 },
          style, // Allow custom styles to be passed
        ]}
        onPress={onPress}
      >
        <Text style={styles.pressableButtonText}>{title}</Text>
      </Pressable>
    );
  };

  const styles = StyleSheet.create({
    scrollViewContainer: {
      flexGrow: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      padding: theme.spacing.medium,
    },
    headerTitle: {
      fontSize: theme.fontSizes.display1,
      fontFamily: theme.fonts.header,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      marginTop: theme.spacing.medium,
      marginBottom: theme.spacing.xsmall,
    },
    headerSubtitle: {
      fontSize: theme.fontSizes.subheading,
      fontFamily: theme.fonts.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.large,
    },
    userInfo: {
      fontSize: theme.fontSizes.body,
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.large,
      padding: theme.spacing.small,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.roundness,
      width: '95%',
    },
    card: {
      width: '95%',
      backgroundColor: theme.colors.card,
      borderRadius: theme.roundness,
      padding: theme.spacing.medium,
      marginBottom: theme.spacing.large,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: theme.roundness / 2,
    },
    cardTitle: {
      fontSize: theme.fontSizes.title,
      fontFamily: theme.fonts.bold,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: theme.spacing.medium,
    },
    cardText: {
      fontSize: theme.fontSizes.body,
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
      lineHeight: theme.fontSizes.body * 1.5,
      marginBottom: theme.spacing.small,
    },
    pressableButton: { // General style for Pressable buttons
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.medium,
      paddingHorizontal: theme.spacing.large,
      borderRadius: theme.roundness,
      marginVertical: theme.spacing.small,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
    },
    pressableButtonText: {
      fontSize: theme.fontSizes.button,
      fontFamily: theme.fonts.bold,
      color: theme.colors.lightText,
      fontWeight: 'bold',
    },
    // buttonContainer can be used for specific layout needs if Pressable is nested
    // For this layout, direct styling on Pressable is sufficient.
    logoutButtonContainer: { // Specific container for logout if needed for layout
      width: '95%',
      marginTop: theme.spacing.medium,
      marginBottom: theme.spacing.large,
    }
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>SAR-Drone</Text>
        <Text style={styles.headerSubtitle}>Sistema Autônomo de Resposta a Desastres</Text>

        {userData && (
          <Text style={styles.userInfo}>
            Logado como: {userData.username} ({userData.email})
          </Text>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bem-vindo ao SAR-Drone</Text>
          <Text style={styles.cardText}>
            Navegue pelas funcionalidades abaixo para gerenciar simulações, visualizar histórico e mais.
          </Text>

          <ThemedButton title="Minhas Simulações" onPress={() => navigation.navigate('Alerts')} type="primary" />
          <ThemedButton title="Histórico de Desastres" onPress={() => navigation.navigate('History')} type="info" />
          <ThemedButton title="Criar Nova Simulação" onPress={() => navigation.navigate('RiskPrediction')} type="secondary" />
          <ThemedButton title="Controle de Drones (Sim.)" onPress={() => navigation.navigate('DroneControl')} style={{backgroundColor: theme.colors.accent}} />
          <ThemedButton title="Sobre o SAR-Drone" onPress={() => navigation.navigate('About')} style={{backgroundColor: theme.colors.textSecondary}} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nossa Missão</Text>
          <Text style={styles.cardText}>
            Reduzir fatalidades e otimizar a resposta em áreas isoladas, fornecendo comunicação e dados em tempo real através de drones autônomos.
          </Text>
        </View>

        <View style={styles.logoutButtonContainer}>
          <ThemedButton title="Logout" onPress={handleLogout} type="error" />
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;