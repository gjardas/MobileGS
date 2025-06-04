import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Placeholder for navigation, replace with actual navigation call
// e.g., import { useNavigation } from '@react-navigation/native';
const navigateToRegister = (navigation) => {
  if (navigation && navigation.navigate) {
    navigation.navigate('Register');
  } else {
    console.warn("Navigation not available for RegisterScreen");
  }
};

const LoginScreen = ({ navigation }) => { // Assuming navigation prop is passed by React Navigation
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  // const navigation = useNavigation(); // Or use hook if preferred and available

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Por favor, preencha usuário e senha.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await login(username, password);
      // Navigation to main app stack will be handled by App.js logic based on userToken
    } catch (err) {
      console.error("Login failed on screen:", err);
      setError(err.message || 'Falha ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isSubmitting ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
      <View style={styles.registerLink}>
        <Button
          title="Não tem uma conta? Registre-se"
          onPress={() => navigateToRegister(navigation)} // Pass navigation prop
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  registerLink: {
    marginTop: 20,
  }
});

export default LoginScreen;
