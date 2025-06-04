import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import api from '../services/api'; // Adjust path if necessary
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useTheme } from '../styles/theme'; // Adjust path if necessary
import { useNavigation } from '@react-navigation/native'; // For optional navigation

const RiskPredictionScreen = () => {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation();
  const { logout } = useAuth(); // Get logout function

  // Form States
  const [inputYear, setInputYear] = useState('');
  const [inputStartMonth, setInputStartMonth] = useState('');
  const [inputStartDay, setInputStartDay] = useState('');
  const [inputEndYear, setInputEndYear] = useState('');
  const [inputEndMonth, setInputEndMonth] = useState('');
  const [inputEndDay, setInputEndDay] = useState('');
  const [inputDisasterGroup, setInputDisasterGroup] = useState('Natural');
  const [inputDisasterSubgroup, setInputDisasterSubgroup] = useState('Hydrological');
  const [inputDisasterType, setInputDisasterType] = useState('Flood');
  const [inputContinent, setInputContinent] = useState('South America');
  const [inputRegion, setInputRegion] = useState('South America (BRA)'); // Example from API
  const [inputDisMagScale, setInputDisMagScale] = useState('Km2');
  const [inputDisMagValue, setInputDisMagValue] = useState(''); // Handled as number or null
  const [inputLatitude, setInputLatitude] = useState(''); // Example: -23.5505
  const [inputLongitude, setInputLongitude] = useState(''); // Example: -46.6333
  const [inputCpi, setInputCpi] = useState(''); // Handled as number or null

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearForm = () => {
    setInputYear('');
    setInputStartMonth('');
    setInputStartDay('');
    setInputEndYear('');
    setInputEndMonth('');
    setInputEndDay('');
    setInputDisasterGroup('Natural');
    setInputDisasterSubgroup('Hydrological');
    setInputDisasterType('Flood');
    setInputContinent('South America');
    setInputRegion('South America (BRA)');
    setInputDisMagScale('Km2');
    setInputDisMagValue('');
    setInputLatitude('');
    setInputLongitude('');
    setInputCpi('');
    setError(null);
  };

  const handleCreateSimulation = async () => {
    setError(null);

    // Basic Validation (can be expanded)
    if (!inputYear || !inputStartMonth || !inputStartDay || !inputDisasterType || !inputLatitude || !inputLongitude) {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha todos os campos marcados com * ou os campos essenciais.');
      return;
    }

    setIsLoading(true);

    const simulationData = {
      inputYear: parseInt(inputYear, 10),
      inputStartMonth: parseInt(inputStartMonth, 10),
      inputStartDay: parseInt(inputStartDay, 10),
      inputEndYear: inputEndYear ? parseInt(inputEndYear, 10) : null, // Optional
      inputEndMonth: inputEndMonth ? parseInt(inputEndMonth, 10) : null, // Optional
      inputEndDay: inputEndDay ? parseInt(inputEndDay, 10) : null, // Optional
      inputDisasterGroup,
      inputDisasterSubgroup,
      inputDisasterType,
      inputContinent,
      inputRegion,
      inputDisMagScale,
      inputDisMagValue: inputDisMagValue ? parseFloat(inputDisMagValue) : null,
      inputLatitude: parseFloat(inputLatitude),
      inputLongitude: parseFloat(inputLongitude),
      inputCpi: inputCpi ? parseFloat(inputCpi) : null,
    };

    try {
      // API expects an array of simulations
      const response = await api.createSimulation([simulationData]);
      Alert.alert('Sucesso!', 'Simulação criada com sucesso.\nID da Simulação: ' + (response && response[0] ? response[0].id : 'N/A'));
      clearForm();
      // Optional: Navigate to the simulations list screen
      navigation.navigate('Alerts'); // 'Alerts' is 'Minhas Simulações'
    } catch (err) {
      console.error("Failed to create simulation:", err.message);
      if (err.message === 'UNAUTHORIZED_OR_EXPIRED_TOKEN') {
        Alert.alert("Sessão Expirada", "Sua sessão expirou. Por favor, faça login novamente.", [
          { text: "OK", onPress: async () => await logout() }
        ]);
        setError("Sessão expirada. Faça login para continuar.");
        // No Alert.alert for general error here, as the error state will be displayed by Text component.
        // Or, if preferred, keep the Alert.alert for other errors too.
      } else {
        setError(err.message || 'Ocorreu um erro ao criar a simulação.');
        Alert.alert('Erro', err.message || 'Não foi possível criar a simulação.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: fonts.sizes?.h2 || 24,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 20,
      textAlign: 'center',
    },
    label: {
      fontSize: fonts.sizes?.body || 16,
      color: colors.text,
      marginBottom: 5,
      marginTop: 10,
    },
    input: {
      backgroundColor: colors.surface || '#fff',
      borderColor: colors.border || '#ccc',
      borderWidth: 1,
      borderRadius: 5, // theme.roundness
      paddingHorizontal: 10,
      paddingVertical: 8,
      fontSize: fonts.sizes?.body || 16,
      color: colors.textInput || colors.text, // Color for text input
      marginBottom: 10,
    },
    errorText: {
      color: colors.error || 'red',
      textAlign: 'center',
      marginBottom: 10,
      fontSize: fonts.sizes?.body || 16,
    },
    buttonContainer: {
      marginTop: 20,
      marginBottom: 40, // Extra space at the bottom
    }
  });

  // Helper for creating form fields
  const FormField = ({ label, value, onChangeText, placeholder, keyboardType = 'default', required = false }) => (
    <>
      <Text style={styles.label}>{label}{required ? '*' : ''}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={colors.placeholder || '#aaa'}
      />
    </>
  );

  return (
    <ScrollView style={{flex: 1, backgroundColor: colors.background}} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar Nova Simulação de Desastre</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FormField label="Ano do Desastre (YYYY)" value={inputYear} onChangeText={setInputYear} keyboardType="numeric" placeholder="Ex: 2024" required />
      <FormField label="Mês de Início (1-12)" value={inputStartMonth} onChangeText={setInputStartMonth} keyboardType="numeric" placeholder="Ex: 1" required />
      <FormField label="Dia de Início (1-31)" value={inputStartDay} onChangeText={setInputStartDay} keyboardType="numeric" placeholder="Ex: 1" required />

      <FormField label="Ano de Fim (YYYY)" value={inputEndYear} onChangeText={setInputEndYear} keyboardType="numeric" placeholder="Opcional, ex: 2024" />
      <FormField label="Mês de Fim (1-12)" value={inputEndMonth} onChangeText={setInputEndMonth} keyboardType="numeric" placeholder="Opcional" />
      <FormField label="Dia de Fim (1-31)" value={inputEndDay} onChangeText={setInputEndDay} keyboardType="numeric" placeholder="Opcional" />

      <FormField label="Grupo do Desastre" value={inputDisasterGroup} onChangeText={setInputDisasterGroup} placeholder="Ex: Natural" required />
      <FormField label="Subgrupo do Desastre" value={inputDisasterSubgroup} onChangeText={setInputDisasterSubgroup} placeholder="Ex: Hydrological" required />
      <FormField label="Tipo do Desastre" value={inputDisasterType} onChangeText={setInputDisasterType} placeholder="Ex: Flood" required />

      <FormField label="Continente" value={inputContinent} onChangeText={setInputContinent} placeholder="Ex: South America" required />
      <FormField label="Região" value={inputRegion} onChangeText={setInputRegion} placeholder="Ex: South America (BRA)" required />

      <FormField label="Escala de Magnitude" value={inputDisMagScale} onChangeText={setInputDisMagScale} placeholder="Ex: Km2" required />
      <FormField label="Valor da Magnitude" value={inputDisMagValue} onChangeText={setInputDisMagValue} keyboardType="numeric" placeholder="Opcional, ex: 1500.50" />

      <FormField label="Latitude" value={inputLatitude} onChangeText={setInputLatitude} keyboardType="numeric" placeholder="Ex: -23.5505" required />
      <FormField label="Longitude" value={inputLongitude} onChangeText={setInputLongitude} keyboardType="numeric" placeholder="Ex: -46.6333" required />

      <FormField label="CPI (Índice de Corrupção)" value={inputCpi} onChangeText={setInputCpi} keyboardType="numeric" placeholder="Opcional, ex: 69.0" />

      <View style={styles.buttonContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <Button title="Criar Simulação" onPress={handleCreateSimulation} color={colors.primary} />
        )}
      </View>
    </ScrollView>
  );
};

export default RiskPredictionScreen;