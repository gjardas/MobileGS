import React from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext'; // Ajuste o caminho se necessário
import { useTheme } from '../styles/theme'; // Supondo que o tema está aqui

const HomeScreen = ({ navigation }) => { // navigation prop from React Navigation
  const { logout, userData } = useAuth();
  const { colors, fonts } = useTheme(); // Assuming useTheme provides React Native compatible styles

  const handleLogout = async () => {
    try {
      await logout();
      // A navegação condicional em App.js cuidará de redirecionar para o AuthStack
      console.log('Logout bem-sucedido');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
    }
  };

  // Styles adapted for React Native
  const styles = StyleSheet.create({
    scrollViewContainer: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center', // Adjust as needed, maybe 'flex-start' if content is long
      padding: 20,
      backgroundColor: colors.background,
    },
    headerTitle: {
      fontSize: fonts.sizes?.h1 || 32, // Use theme font sizes if available
      fontWeight: 'bold',
      marginBottom: 8,
      textAlign: 'center',
      color: colors.primary,
      fontFamily: fonts.header,
    },
    headerSubtitle: {
      fontSize: fonts.sizes?.h2 || 18,
      textAlign: 'center',
      marginBottom: 32,
      color: colors.text,
      fontFamily: fonts.regular,
    },
    card: { // Basic card styling, can be expanded
      width: '90%',
      backgroundColor: colors.card || colors.surface || '#ffffff', // Theme card or surface color
      borderRadius: 8, // theme.roundness,
      padding: 24,
      marginBottom: 30,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardTitle: {
      fontSize: fonts.sizes?.h3 || 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: colors.primary,
    },
    cardText: {
      fontSize: fonts.sizes?.body || 18, // Assuming 'body' size in theme
      lineHeight: (fonts.sizes?.body || 18) * 1.5,
      marginBottom: 16,
      color: colors.text,
    },
    buttonContainer: {
      marginVertical: 8,
      width: '100%', // Buttons inside card take full card width
      // borderRadius: theme.roundness, // borderRadius on View for Button might need overflow: 'hidden'
      // overflow: 'hidden',
    },
    userInfo: {
      fontSize: fonts.sizes?.caption || 14,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    logoutButtonContainer: {
      marginTop: 20, // Space above logout button
      width: '80%', // Logout button width, similar to login/register screens
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
            Sua ferramenta essencial para monitoramento, previsão e resposta a desastres naturais.
            Conectividade e informação crítica onde mais importa.
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              title="Minhas Simulações" // Updated title to reflect AlertsScreen content
              onPress={() => navigation.navigate('Alerts')}
              color={colors.primary}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Histórico de Desastres"
              onPress={() => navigation.navigate('History')}
              color={colors.info || 'blue'} // Using theme.colors.info or a default blue
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Monitorar Drones"
              onPress={() => navigation.navigate('DroneControl')}
              color={colors.primary} // Assuming theme.colors.primary
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Previsão de Riscos"
              onPress={() => navigation.navigate('RiskPrediction')}
              color={colors.secondary}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Sobre o SAR-Drone"
              onPress={() => navigation.navigate('About')}
              color={colors.text} // Or another appropriate color from theme
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nossa Missão</Text>
          <Text style={styles.cardText}>
            Reduzir fatalidades e otimizar a resposta em áreas isoladas, fornecendo comunicação e dados em tempo real através de drones autônomos.
          </Text>
        </View>

        <View style={styles.logoutButtonContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            color={colors.error || 'red'}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;