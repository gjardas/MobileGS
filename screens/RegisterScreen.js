import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView, Pressable } from 'react-native';
import { useAuth } from '../context/AuthContext';
// Attempt to use the central theme, but will define a local fallback/override.
import { useTheme as useCentralTheme } from '../styles/theme';

// Local theme definition (same as LoginScreen for consistency)
const localTheme = {
  colors: {
    primary: '#2E8B57', secondary: '#4682B4', accent: '#FF6347',
    background: '#F0F2F5', surface: '#FFFFFF', card: '#FFFFFF',
    text: '#333333', textSecondary: '#555555', placeholder: '#999999',
    lightText: '#FFFFFF', error: '#DC3545', success: '#28A745',
    info: '#17A2B8', warning: '#FFC107', border: '#DDDDDD', disabled: '#CCCCCC',
  },
  fonts: { regular: 'System', bold: 'System', header: 'System' },
  fontSizes: { caption: 12, button: 14, body: 16, input: 16, subheading: 18, title: 20, headline: 24, display1: 32 },
  spacing: { xxsmall: 2, xsmall: 4, small: 8, medium: 16, large: 24, xlarge: 32, xxlarge: 48 },
  roundness: 8,
};

const RegisterScreen = ({ navigation }) => {
  const theme = localTheme; // Prioritize localTheme
  // const centralThemeHook = useCentralTheme(); // Could merge if needed

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [completeName, setCompleteName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!username || !email || !password || !completeName) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const userData = { username, email, password, completeName };
      await register(userData); // register function in AuthContext handles the response
      Alert.alert('Registro Bem-Sucedido', 'Você foi registrado com sucesso! Por favor, faça login.');
      navigation.navigate('Login');
    } catch (err) {
      console.error("Registration failed on screen:", err);
       if (err.message === 'UNAUTHORIZED_OR_EXPIRED_TOKEN') {
         setError("Sua sessão pode ter expirado ou algo deu errado. Tente novamente o login.");
         // Potentially logout if a token was somehow set during a failed registration attempt
         // await logout(); // Requires logout from useAuth()
      } else {
        setError(err.message || 'Falha ao registrar. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles using localTheme for consistency
  const styles = StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.large,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: theme.fontSizes.headline,
      fontFamily: theme.fonts.header,
      color: theme.colors.primary,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: theme.spacing.xlarge,
    },
    label: {
      fontSize: theme.fontSizes.body,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xsmall,
      marginLeft: theme.spacing.xxsmall,
    },
    input: {
      height: 50,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.roundness,
      paddingHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
      fontSize: theme.fontSizes.input,
      color: theme.colors.text,
      paddingVertical: theme.spacing.small, // Added for consistency
    },
    errorText: {
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.medium,
      fontSize: theme.fontSizes.body,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.medium,
      borderRadius: theme.roundness,
      marginTop: theme.spacing.medium,
      backgroundColor: theme.colors.primary,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
    },
    buttonText: {
      color: theme.colors.lightText,
      fontSize: theme.fontSizes.button,
      fontFamily: theme.fonts.bold,
      fontWeight: 'bold',
      letterSpacing: 0.25,
    },
    loginLink: {
      marginTop: theme.spacing.large,
      alignItems: 'center',
    },
    linkText: {
      color: theme.colors.primary,
      fontSize: theme.fontSizes.body,
      textDecorationLine: 'underline',
    }
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={{backgroundColor: theme.colors.background}}>
      <View style={styles.container}>
        <Text style={styles.title}>Criar Conta</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.label}>Nome de Usuário</Text>
        <TextInput
          style={styles.input}
          placeholder="Escolha um nome de usuário"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor={theme.colors.placeholder}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu endereço de email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={theme.colors.placeholder}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Crie uma senha segura"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={theme.colors.placeholder}
        />

        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome completo"
          value={completeName}
          onChangeText={setCompleteName}
          placeholderTextColor={theme.colors.placeholder}
        />

        {isSubmitting ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{marginTop: theme.spacing.medium}} />
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Registrar</Text>
          </Pressable>
        )}

        <Pressable onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
          <Text style={styles.linkText}>Já tem uma conta? Faça Login</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
