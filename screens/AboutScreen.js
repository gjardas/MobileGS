import React from 'react';
import { ScrollView, View, Text, Button, StyleSheet, Pressable } from 'react-native';
import { useTheme as useCentralTheme } from '../styles/theme'; 
import Card from '../components/Cards';


const localTheme = {
  colors: {
    primary: '#0A4A7A', secondary: '#5DADE2', accent: '#F5A623',
    background: '#F4F6F8', surface: '#FFFFFF', card: '#FFFFFF',
    text: '#212121', textSecondary: '#757575', placeholder: '#BDBDBD',
    lightText: '#FFFFFF', error: '#D32F2F', success: '#388E3C',
    info: '#1976D2', warning: '#FFA000', border: '#E0E0E0', disabled: '#BDBDBD',
  },
  fonts: { regular: 'System', bold: 'System', header: 'System' },
  fontSizes: { caption: 12, button: 15, body: 16, input: 16, subheading: 18, title: 22, headline: 26 },
  spacing: { xxsmall: 2, xsmall: 4, small: 8, medium: 16, large: 24, xlarge: 32, xxlarge: 48 },
  roundness: 8,
};

const AboutScreen = ({ navigation }) => {
  const theme = localTheme;
  const styles = StyleSheet.create({
    scrollViewContainer: {
      flexGrow: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      padding: theme.spacing.medium,
      alignItems: 'center',
    },
    mainTitle: {
      fontSize: theme.fontSizes.headline,
      fontWeight: 'bold',
      fontFamily: theme.fonts.header,
      marginBottom: theme.spacing.large,
      textAlign: 'center',
      color: theme.colors.primary,
    },
    cardStyle: {
      width: '95%',
      backgroundColor: theme.colors.card,
      borderRadius: theme.roundness,  
      marginBottom: theme.spacing.medium,
      padding: theme.spacing.medium,
      elevation: 2,  
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.00,
    },
    cardTitle: {
      fontSize: theme.fontSizes.title,
      fontWeight: 'bold',
      fontFamily: theme.fonts.header,
      marginBottom: theme.spacing.medium, 
      color: theme.colors.primary,
    },
    cardText: {
      fontSize: theme.fontSizes.body,
      fontFamily: theme.fonts.regular,
      lineHeight: theme.fontSizes.body * 1.5, 
      marginBottom: theme.spacing.small,
      color: theme.colors.text,
    },
    boldText: {
      fontWeight: 'bold',
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
    },
    buttonContainer: { 
      marginTop: theme.spacing.large, 
      width: '80%',
    },
    pressableButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.medium,
      paddingHorizontal: theme.spacing.large,
      borderRadius: theme.roundness,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
    },
    pressableButtonText: {
      color: theme.colors.lightText,
      fontSize: theme.fontSizes.button,
      fontWeight: 'bold',
      fontFamily: theme.fonts.bold,
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer} style={{backgroundColor: theme.colors.background}}>
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
          <Pressable
            style={({ pressed }) => [styles.pressableButton, { opacity: pressed ? 0.8 : 1 }]}
            onPress={() => navigation.navigate('HomeApp')}
          >
            <Text style={styles.pressableButtonText}>Voltar para a Home</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default AboutScreen;
