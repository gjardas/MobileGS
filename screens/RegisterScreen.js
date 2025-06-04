import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Placeholder for navigation
const navigateToLogin = (navigation) => {
  if (navigation && navigation.navigate) {
    navigation.navigate('Login');
  } else {
    console.warn("Navigation not available for LoginScreen");
  }
};

const RegisterScreen = ({ navigation }) => { // Assuming navigation prop
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [completeName, setCompleteName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  // const navigation = useNavigation(); // Or use hook

  const handleRegister = async () => {
    if (!username || !email || !password || !completeName) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const userData = { username, email, password, completeName };
      const response = await register(userData);
      Alert.alert('Registro Bem-Sucedido', 'Você foi registrado com sucesso! Por favor, faça login.');
      navigateToLogin(navigation); // Navigate to login after successful registration
    } catch (err) {
      console.error("Registration failed on screen:", err);
      setError(err.message || 'Falha ao registrar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Nome de Usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={completeName}
        onChangeText={setCompleteName}
      />
      {isSubmitting ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Registrar" onPress={handleRegister} />
      )}
      <View style={styles.loginLink}>
        <Button
          title="Já tem uma conta? Faça Login"
          onPress={() => navigateToLogin(navigation)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  loginLink: {
    marginTop: 20,
  }
});

export default RegisterScreen;
