import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Pressable } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme as useCentralTheme } from '../styles/theme';

// EOSDA-inspired local theme definition
const localTheme = {
  colors: {
    primary: '#0A4A7A', secondary: '#5DADE2', accent: '#F5A623',
    background: '#F4F6F8', surface: '#FFFFFF', card: '#FFFFFF',
    text: '#212121', textSecondary: '#757575', placeholder: '#BDBDBD',
    lightText: '#FFFFFF', error: '#D32F2F', success: '#388E3C',
    info: '#1976D2', warning: '#FFA000', border: '#E0E0E0', disabled: '#BDBDBD',
  },
  fonts: { regular: 'System', bold: 'System', header: 'System' },
  fontSizes: { caption: 12, button: 15, body: 16, input: 16, subheading: 18, title: 22, headline: 26, display1: 34 },
  spacing: { xxsmall: 2, xsmall: 4, small: 8, medium: 16, large: 24, xlarge: 32, xxlarge: 48 },
  roundness: 8,
};

const HomeScreen = ({ navigation }) => {
  const theme = localTheme;
  // const centralThemeHook = useCentralTheme(); // Merge if needed

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
    let buttonBackgroundColor = theme.colors.primary; // Default to primary
    switch (type) {
      case 'secondary':
        buttonBackgroundColor = theme.colors.secondary;
        break;
      case 'accent':
        buttonBackgroundColor = theme.colors.accent;
        break;
      case 'error':
        buttonBackgroundColor = theme.colors.error;
        break;
      case 'info':
        buttonBackgroundColor = theme.colors.info;
        break;
      case 'custom': // Allows passing full custom backgroundColor via style prop
        buttonBackgroundColor = style.backgroundColor || theme.colors.primary;
        break;
    }

    return (
      <Pressable
        style={({ pressed }) => [
          styles.pressableButton,
          { backgroundColor: buttonBackgroundColor, opacity: pressed ? 0.8 : 1 },
          style,
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
      paddingVertical: theme.spacing.large, // More vertical padding for the screen
      paddingHorizontal: theme.spacing.medium,
    },
    headerTitle: {
      fontSize: theme.fontSizes.display1,
      fontFamily: theme.fonts.header,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      marginTop: theme.spacing.medium,
      marginBottom: theme.spacing.small, // Adjusted spacing
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
      padding: theme.spacing.medium, // Increased padding
      backgroundColor: theme.colors.surface,
      borderRadius: theme.roundness,
      borderWidth: 1,
      borderColor: theme.colors.border,
      width: '95%',
      elevation: 1, // Subtle elevation for user info
    },
    card: {
      width: '95%',
      backgroundColor: theme.colors.card,
      borderRadius: theme.roundness,
      padding: theme.spacing.medium,
      marginBottom: theme.spacing.large,
      elevation: 3,
      shadowColor: '#000000', // Softer black for shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1, // Softer shadow
      shadowRadius: 3,    // Slightly larger radius
      borderWidth: 1,
      borderColor: theme.colors.border,
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
      marginBottom: theme.spacing.medium, // More space after main card text
    },
    pressableButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.medium,
      paddingHorizontal: theme.spacing.medium, // Adjusted for typical button width
      borderRadius: theme.roundness,
      marginVertical: theme.spacing.small,
      elevation: 2,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
      minWidth: '60%', // Ensure buttons have a decent minimum width
    },
    pressableButtonText: {
      fontSize: theme.fontSizes.button,
      fontFamily: theme.fonts.bold,
      color: theme.colors.lightText,
      fontWeight: 'bold',
      textAlign: 'center', // Ensure text is centered if it wraps
    },
    logoutButtonContainer: {
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
          {/* Custom style for DroneControl to use accent color */}
          <ThemedButton
            title="Controle de Drones (Simulação)"
            onPress={() => navigation.navigate('DroneControl')}
            type="custom"
            style={{backgroundColor: theme.colors.accent}}
          />
          <ThemedButton
            title="Sobre o SAR-Drone"
            onPress={() => navigation.navigate('About')}
            type="custom"
            style={{backgroundColor: theme.colors.textSecondary}}
          />
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