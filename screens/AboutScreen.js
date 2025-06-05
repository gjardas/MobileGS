import React from 'react';
import { ScrollView, View, Text, Button, StyleSheet } from 'react-native';
import { useTheme } from '../styles/theme'; // Assuming this provides RN compatible theme
import Card from '../components/Cards'; // Assuming this is an RN compatible Card component

const AboutScreen = ({ navigation }) => { // Changed 'navigate' to 'navigation' from react-navigation
  const { colors, fonts, spacing, roundness } = useTheme();

  // Define styles using StyleSheet
  const styles = StyleSheet.create({
    scrollViewContainer: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      padding: spacing?.medium || 16,
      backgroundColor: colors.background,
      alignItems: 'center', // Center cards horizontally
    },
    mainTitle: {
      fontSize: fonts?.sizes?.xlarge || 24, // Using theme font sizes
      fontWeight: 'bold',
      marginBottom: spacing?.large || 24,
      textAlign: 'center',
      color: colors.primary,
      fontFamily: fonts?.header || 'System', // Using theme header font or system default
    },
    cardStyle: { // Style for the Card component if it doesn't have its own that fits
      width: '95%', // Make cards take most of the width
      marginBottom: spacing?.medium || 16,
      padding: spacing?.medium || 16, // Default padding if Card doesn't handle it
      // If Card is a simple View, add these:
      // backgroundColor: colors.surface || colors.card || '#ffffff',
      // borderRadius: roundness || 8,
      // elevation: 3,
      // shadowColor: '#000',
      // shadowOffset: { width: 0, height: 1 },
      // shadowOpacity: 0.2,
      // shadowRadius: 2,
    },
    cardTitle: {
      fontSize: fonts?.sizes?.large || 20,
      fontWeight: 'bold',
      marginBottom: spacing?.small || 8,
      color: colors.primary,
      fontFamily: fonts?.header || 'System',
    },
    cardText: {
      fontSize: fonts?.sizes?.medium || 16,
      lineHeight: (fonts?.sizes?.medium || 16) * 1.4,
      marginBottom: spacing?.small || 8,
      color: colors.text,
      fontFamily: fonts?.regular || 'System',
    },
    boldText: {
      fontWeight: 'bold',
    },
    buttonContainer: {
      marginTop: spacing?.medium || 16,
      width: '80%', // Consistent button width
    },
  });

  return (
    <ScrollView style={{backgroundColor: colors.background}} contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Sobre o SAR-Drone</Text>

        <Card style={styles.cardStyle}>
          <Text style={styles.cardTitle}>Visão Geral</Text>
          <Text style={styles.cardText}>
            O SAR-Drone é uma solução inovadora para mitigar os impactos de desastres naturais,
            especialmente em áreas com infraestrutura de comunicação comprometida.
            Nosso sistema integra previsão inteligente, acionamento rápido, conectividade imediata
            e disseminação de informações críticas.
          </Text>
        </Card>

        <Card style={styles.cardStyle}>
          <Text style={styles.cardTitle}>Tecnologias Utilizadas</Text>
          <Text style={styles.cardText}>
            <Text style={styles.boldText}>Front-end:</Text> React Native, Expo
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.boldText}>Backend:</Text> API Java (Spring Boot)
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.boldText}>Previsão:</Text> Machine Learning, Análise de Dados
          </Text>
        </Card>

        <Card style={styles.cardStyle}>
          <Text style={styles.cardTitle}>Contato</Text>
          <Text style={styles.cardText}>
            Para mais informações, entre em contato com a Defesa Civil.
          </Text>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Voltar para a Home"
            onPress={() => navigation.navigate('HomeApp')} // Corrected to 'HomeApp' as defined in App.js
            color={colors.primary}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default AboutScreen;
