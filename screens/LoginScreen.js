import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, Pressable } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme as useCentralTheme } from '../styles/theme';

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

const LoginScreen = ({ navigation }) => {
  const theme = localTheme;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Por favor, preencha usuário e senha.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    console.log('[LoginScreen] Chamando authContext.login...');
    try {
      const response = await login(username, password); 
      console.log('[LoginScreen] Resposta do authContext.login:', response);
    } catch (err) {
      console.error('[LoginScreen] Erro ao tentar logar:', err.message);
      if (err.message === 'UNAUTHORIZED_OR_EXPIRED_TOKEN') {
         setError("Sessão expirada ou credenciais inválidas.");
      } else if (err.message && err.message.includes('Falha no login: Dados essenciais ausentes na resposta')) {
        setError('Falha no login: Dados essenciais ausentes. Tente novamente ou contate o suporte.');
      }
      else {
        setError(err.message || 'Falha ao fazer login. Verifique suas credenciais.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.large,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: theme.fontSizes.headline,
      fontFamily: theme.fonts.header,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.xlarge,
    },
    label: {
      fontSize: theme.fontSizes.body,
      fontFamily: theme.fonts.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xsmall,
     
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.roundness,
      paddingHorizontal: theme.spacing.medium,
      paddingVertical: theme.spacing.medium, 
      fontSize: theme.fontSizes.input,
      color: theme.colors.text,
      marginBottom: theme.spacing.medium,
    },
    errorText: {
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.medium,
      fontSize: theme.fontSizes.body,
      fontFamily: theme.fonts.regular,
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
    registerLink: {
      marginTop: theme.spacing.large,
      alignItems: 'center',
    },
    linkText: {
      color: theme.colors.primary, 
      fontSize: theme.fontSizes.body,
      fontFamily: theme.fonts.regular,
      textDecorationLine: 'underline',
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.label}>Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Seu nome de usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor={theme.colors.placeholder}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={theme.colors.placeholder}
      />

      {isSubmitting ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{marginTop: theme.spacing.medium, marginBottom: theme.spacing.large}}/>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.colors.primary, opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>
      )}

      <Pressable onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
        <Text style={styles.linkText}>Não tem uma conta? Registre-se</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;
