import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, ScrollView, Pressable } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme as useCentralTheme } from '../styles/theme'; // Kept for potential future use

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
  fontSizes: { caption: 12, button: 15, body: 16, input: 16, subheading: 18, title: 22, headline: 26 },
  spacing: { xxsmall: 2, xsmall: 4, small: 8, medium: 16, large: 24, xlarge: 32, xxlarge: 48 },
  roundness: 8,
};

const RegisterScreen = ({ navigation }) => {
  const theme = localTheme;
  // const centralThemeHook = useCentralTheme(); // Merge if needed

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [completeName, setCompleteName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth(); // Assuming logout is not directly needed here, but could be added to useAuth() if session expires during long form fill

  const handleRegister = async () => {
    if (!username || !email || !password || !completeName) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const userData = { username, email, password, completeName };
      await register(userData);
      Alert.alert('Registro Bem-Sucedido', 'Você foi registrado com sucesso! Por favor, faça login.');
      navigation.navigate('Login');
    } catch (err) {
      console.error("Registration failed on screen:", err);
      // Assuming register API doesn't typically return 401 unless it's a server config issue
      // If it could, similar 401 handling as login could be added.
      setError(err.message || 'Falha ao registrar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles using the new localTheme
  const styles = StyleSheet.create({
    scrollContainer: { // For ScrollView's own style if needed, e.g., backgroundColor
      flex: 1, // Ensure ScrollView takes up space
      backgroundColor: theme.colors.background,
    },
    container: { // For content inside ScrollView
      flexGrow: 1, // Allows content to grow and enable scrolling
      justifyContent: 'center',
      padding: theme.spacing.large,
      // backgroundColor is on ScrollView now
    },
    title: {
      fontSize: theme.fontSizes.headline,
      fontFamily: theme.fonts.header,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.large, // Reduced from xlarge for tighter packing on register
    },
    label: {
      fontSize: theme.fontSizes.body,
      fontFamily: theme.fonts.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xsmall,
      // marginLeft: theme.spacing.xxsmall, // Optional
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.roundness,
      paddingHorizontal: theme.spacing.medium,
      paddingVertical: theme.spacing.medium, // Consistent padding for height
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
      marginTop: theme.spacing.medium, // Spacing from last input
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
      fontFamily: theme.fonts.regular,
      textDecorationLine: 'underline',
    }
  });

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      {/* Removed the extra View with styles.container to simplify nesting with ScrollView */}
      <Text style={styles.title}>Criar Nova Conta</Text>
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
        <ActivityIndicator size="large" color={theme.colors.primary} style={{marginTop: theme.spacing.medium, marginBottom: theme.spacing.large}} />
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Criar Conta</Text>
        </Pressable>
      )}

      <Pressable onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
        <Text style={styles.linkText}>Já tem uma conta? Faça Login</Text>
      </Pressable>
    </ScrollView>
  );
};

export default RegisterScreen;
