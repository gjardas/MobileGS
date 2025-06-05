import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Pressable } from 'react-native';
import { useAuth } from '../context/AuthContext';
// Attempt to use the central theme, but will define a local fallback/override.
import { useTheme as useCentralTheme } from '../styles/theme';

// Local theme definition as a fallback or primary source if central theme update failed
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

const LoginScreen = ({ navigation }) => {
  // Prioritize localTheme for this exercise due to issues updating central theme.js
  const theme = localTheme;
  // const centralThemeHook = useCentralTheme(); // Could merge centralThemeHook with localTheme if needed

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
    try {
      await login(username, password);
    } catch (err) {
      console.error("Login failed on screen:", err);
      // Check if it's the specific auth error, otherwise show generic
      if (err.message === 'UNAUTHORIZED_OR_EXPIRED_TOKEN') {
         setError("Sessão expirada ou credenciais inválidas."); // AuthContext will handle logout
      } else {
        setError(err.message || 'Falha ao fazer login. Verifique suas credenciais.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.primary, fontFamily: theme.fonts.header, fontSize: theme.fontSizes.headline }]}>
        Login
      </Text>

      {error ? <Text style={[styles.errorText, { color: theme.colors.error, fontSize: theme.fontSizes.body }]}>{error}</Text> : null}

      <Text style={[styles.label, {color: theme.colors.textSecondary, fontSize: theme.fontSizes.body}]}>Usuário</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
            fontSize: theme.fontSizes.input,
            paddingVertical: theme.spacing.small,
          }
        ]}
        placeholder="Digite seu usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor={theme.colors.placeholder}
      />

      <Text style={[styles.label, {color: theme.colors.textSecondary, fontSize: theme.fontSizes.body}]}>Senha</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
            fontSize: theme.fontSizes.input,
            paddingVertical: theme.spacing.small,
          }
        ]}
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={theme.colors.placeholder}
      />

      {isSubmitting ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{marginTop: theme.spacing.medium}}/>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.colors.primary, opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={handleLogin}
        >
          <Text style={[styles.buttonText, { color: theme.colors.lightText, fontSize: theme.fontSizes.button, fontFamily: theme.fonts.bold }]}>Login</Text>
        </Pressable>
      )}

      <Pressable onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
        <Text style={[styles.linkText, { color: theme.colors.primary, fontSize: theme.fontSizes.body }]}>
          Não tem uma conta? Registre-se
        </Text>
      </Pressable>
    </View>
  );
};

// Styles using localTheme for consistency
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: localTheme.spacing.large, // Use localTheme for StyleSheet definition
  },
  title: {
    marginBottom: localTheme.spacing.xlarge,
    textAlign: 'center',
    fontWeight: 'bold', // fontWeight is still useful even with custom fonts
  },
  label: {
    marginBottom: localTheme.spacing.xsmall,
    marginLeft: localTheme.spacing.xxsmall, // Slight indent for label
  },
  input: {
    height: 50, // Increased height for better touch target
    borderWidth: 1,
    marginBottom: localTheme.spacing.medium,
    paddingHorizontal: localTheme.spacing.medium,
    borderRadius: localTheme.roundness,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: localTheme.spacing.medium,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: localTheme.spacing.medium,
    borderRadius: localTheme.roundness,
    marginTop: localTheme.spacing.medium, // Spacing from last input or error
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  buttonText: {
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  registerLink: {
    marginTop: localTheme.spacing.large,
    alignItems: 'center',
  },
  linkText: {
    textDecorationLine: 'underline',
  }
});

export default LoginScreen;
