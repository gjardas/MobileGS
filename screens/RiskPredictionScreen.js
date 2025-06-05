import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Pressable, // Import Pressable
} from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme as useCentralTheme } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';

// Local theme definition
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

const RiskPredictionScreen = () => {
  const theme = localTheme; // Prioritize localTheme
  // const centralThemeHook = useCentralTheme(); // Could merge if needed

  const navigation = useNavigation();
  const { logout } = useAuth();

  // Form States (condensed for brevity, assume they are all here)
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
  const [inputRegion, setInputRegion] = useState('South America (BRA)');
  const [inputDisMagScale, setInputDisMagScale] = useState('Km2');
  const [inputDisMagValue, setInputDisMagValue] = useState('');
  const [inputLatitude, setInputLatitude] = useState('');
  const [inputLongitude, setInputLongitude] = useState('');
  const [inputCpi, setInputCpi] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearForm = () => {
    // (Implementation as before)
    setInputYear(''); setInputStartMonth(''); setInputStartDay('');
    setInputEndYear(''); setInputEndMonth(''); setInputEndDay('');
    setInputDisasterGroup('Natural'); setInputDisasterSubgroup('Hydrological');
    setInputDisasterType('Flood'); setInputContinent('South America');
    setInputRegion('South America (BRA)'); setInputDisMagScale('Km2');
    setInputDisMagValue(''); setInputLatitude(''); setInputLongitude('');
    setInputCpi(''); setError(null);
  };

  const handleCreateSimulation = async () => {
    setError(null);
    if (!inputYear || !inputStartMonth || !inputStartDay || !inputDisasterType || !inputLatitude || !inputLongitude) {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha todos os campos marcados com * ou os campos essenciais.');
      return;
    }
    setIsLoading(true);
    const simulationData = {
      inputYear: parseInt(inputYear, 10), inputStartMonth: parseInt(inputStartMonth, 10),
      inputStartDay: parseInt(inputStartDay, 10),
      inputEndYear: inputEndYear ? parseInt(inputEndYear, 10) : null,
      inputEndMonth: inputEndMonth ? parseInt(inputEndMonth, 10) : null,
      inputEndDay: inputEndDay ? parseInt(inputEndDay, 10) : null,
      inputDisasterGroup, inputDisasterSubgroup, inputDisasterType,
      inputContinent, inputRegion, inputDisMagScale,
      inputDisMagValue: inputDisMagValue ? parseFloat(inputDisMagValue) : null,
      inputLatitude: parseFloat(inputLatitude), inputLongitude: parseFloat(inputLongitude),
      inputCpi: inputCpi ? parseFloat(inputCpi) : null,
    };
    try {
      const response = await api.createSimulation([simulationData]);
      Alert.alert('Sucesso!', 'Simulação criada com sucesso.\nID da Simulação: ' + (response && response[0] ? response[0].id : 'N/A'));
      clearForm();
      navigation.navigate('Alerts');
    } catch (err) {
      console.error("Failed to create simulation:", err.message);
      if (err.message === 'UNAUTHORIZED_OR_EXPIRED_TOKEN') {
        Alert.alert("Sessão Expirada", "Sua sessão expirou. Por favor, faça login novamente.", [{ text: "OK", onPress: async () => await logout() }]);
        setError("Sessão expirada. Faça login para continuar.");
      } else {
        setError(err.message || 'Ocorreu um erro ao criar a simulação.');
        Alert.alert('Erro', err.message || 'Não foi possível criar a simulação.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Styles using localTheme
  const styles = StyleSheet.create({
    scrollViewContent: { // Renamed from container to avoid conflict with View's container
      flexGrow: 1,
      padding: theme.spacing.medium, // Consistent padding
    },
    containerView: { // New: A wrapping view for the content inside ScrollView
        paddingBottom: theme.spacing.xxlarge, // Ensure space for the button at the very end
    },
    title: {
      fontSize: theme.fontSizes.headline,
      fontFamily: theme.fonts.header,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: theme.spacing.large,
      textAlign: 'center',
    },
    label: {
      fontSize: theme.fontSizes.body,
      fontFamily: theme.fonts.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xsmall,
      marginTop: theme.spacing.medium,
    },
    input: {
      height: 50,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.roundness,
      paddingHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.small, // Reduced bottom margin for tighter packing
      fontSize: theme.fontSizes.input,
      color: theme.colors.text,
      paddingVertical: theme.spacing.small,
    },
    errorText: {
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.medium,
      fontSize: theme.fontSizes.body,
    },
    button: { // Copied from LoginScreen for consistency
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.medium,
      borderRadius: theme.roundness,
      marginTop: theme.spacing.large, // More space before button
      backgroundColor: theme.colors.primary,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
    },
    buttonText: { // Copied from LoginScreen
      color: theme.colors.lightText,
      fontSize: theme.fontSizes.button,
      fontFamily: theme.fonts.bold,
      fontWeight: 'bold',
      letterSpacing: 0.25,
    },
    buttonContainer: { // Kept for consistency if needed, but Pressable is used directly
      marginTop: theme.spacing.large,
      marginBottom: theme.spacing.xlarge, // Ensure enough space at the bottom
    }
  });

  const FormField = ({ label, value, onChangeText, placeholder, keyboardType = 'default', required = false }) => (
    <>
      <Text style={styles.label}>{label}{required ? '*' : ''}</Text>
      <TextInput
        style={styles.input}
        value={String(value || '')}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={theme.colors.placeholder}
      />
    </>
  );

  return (
    <ScrollView style={{flex: 1, backgroundColor: theme.colors.background}} contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.containerView}>
        <Text style={styles.title}>Criar Nova Simulação</Text>

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
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.button,
                { opacity: pressed ? 0.8 : 1 }
              ]}
              onPress={handleCreateSimulation}
            >
              <Text style={styles.buttonText}>Criar Simulação</Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default RiskPredictionScreen;