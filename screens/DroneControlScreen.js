import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, ScrollView, Alert, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme as useCentralTheme } from '../styles/theme';

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


const DroneControlScreen = () => {
  const theme = localTheme; // Prioritize localTheme
  // const { colors, fonts } = useCentralTheme(); // Or merge if central theme is fixed

  const route = useRoute();
  const { simulationId, disasterType } = route.params || {};

  const [droneResponse, setDroneResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { logout } = useAuth();

  const fetchDroneDispatchInfo = useCallback(async () => {
    if (!simulationId) {
      setError('ID da Simulação não fornecido.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getDroneDispatchForSimulation(simulationId);
      setDroneResponse(response);
    } catch (err) {
      console.error(`Failed to fetch drone dispatch for simulation ${simulationId}:`, err.message);
      if (err.message === 'UNAUTHORIZED_OR_EXPIRED_TOKEN') {
        Alert.alert("Sessão Expirada", "Sua sessão expirou. Por favor, faça login novamente.", [{ text: "OK", onPress: async () => await logout() }]);
        setError("Sessão expirada. Faça login para continuar.");
      } else if (err.message && (err.message.includes('400') || err.message.includes('IA model is not ready') || err.message.includes('Prediction not available'))) {
        setError('Não foi possível despachar drones. A predição da IA pode não estar disponível ou a simulação é inválida.');
      } else {
        setError(err.message || 'Ocorreu um erro ao buscar informações de despacho dos drones.');
      }
      setDroneResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [simulationId, logout]);

  useEffect(() => {
    fetchDroneDispatchInfo();
  }, [fetchDroneDispatchInfo]);

  // Reusable ThemedButton for this screen
  const ThemedButton = ({ title, onPress, type = 'primary', style = {} }) => {
    let backgroundColor = theme.colors.primary;
    if (type === 'accent') backgroundColor = theme.colors.accent;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.pressableButton,
          { backgroundColor, opacity: pressed ? 0.8 : 1 },
          style,
        ]}
        onPress={onPress}
      >
        <Text style={styles.pressableButtonText}>{title}</Text>
      </Pressable>
    );
  };

  const styles = StyleSheet.create({
    scrollViewContainer: {
      flexGrow: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      padding: theme.spacing.medium,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.medium,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: theme.fontSizes.headline,
      fontFamily: theme.fonts.header,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: theme.spacing.small,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: theme.fontSizes.subheading,
      fontFamily: theme.fonts.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.large,
      textAlign: 'center',
    },
    infoCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.roundness,
      padding: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
      borderWidth: 1,
      borderColor: theme.colors.border,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1.5,
    },
    infoText: {
      fontSize: theme.fontSizes.body,
      fontFamily: theme.fonts.regular,
      color: theme.colors.text,
      marginBottom: theme.spacing.small,
      lineHeight: theme.fontSizes.body * 1.4,
    },
    infoLabel: {
      fontWeight: 'bold',
      fontFamily: theme.fonts.bold,
      color: theme.colors.text, // Or theme.colors.primary for more emphasis
    },
    errorText: {
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.medium,
      fontSize: theme.fontSizes.body,
      fontFamily: theme.fonts.regular,
    },
    pressableButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.small, // Slightly smaller for these actions
      paddingHorizontal: theme.spacing.medium,
      borderRadius: theme.roundness,
      marginVertical: theme.spacing.small,
      elevation: 1, // Subtle shadow
    },
    pressableButtonText: {
      fontSize: theme.fontSizes.button,
      fontFamily: theme.fonts.bold,
      color: theme.colors.lightText,
      fontWeight: 'bold',
    },
    loadingText: {
        color: theme.colors.text,
        marginTop: theme.spacing.small,
        fontSize: theme.fontSizes.body,
    }
  });

  if (!simulationId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro: ID da Simulação não encontrado.</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Buscando informações de despacho...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Despacho de Drones</Text>
      <Text style={styles.subtitle}>Simulação ID: {simulationId}</Text>
      {disasterType && <Text style={[styles.subtitle, {fontSize: theme.fontSizes.body, marginBottom: theme.spacing.medium}]}>Tipo de Desastre: {disasterType}</Text>}

      {error && (
        <View style={styles.infoCard}>
          <Text style={styles.errorText}>{error}</Text>
          <ThemedButton title="Tentar Novamente" onPress={fetchDroneDispatchInfo} type="primary" />
        </View>
      )}

      {droneResponse && !error && (
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Drones Despachados: </Text>
            {droneResponse.dronesDispatched !== undefined ? droneResponse.dronesDispatched : 'N/A'}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Área de Cobertura Estimada: </Text>
            {droneResponse.estimatedCoverageArea !== undefined ? `${droneResponse.estimatedCoverageArea} Km²` : 'N/A'}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Notas da Missão: </Text>
            {droneResponse.missionNotes || 'Nenhuma nota adicional.'}
          </Text>
          <ThemedButton title="Atualizar Informações" onPress={fetchDroneDispatchInfo} type="accent" />
        </View>
      )}

      {!droneResponse && !error && !isLoading && (
         <View style={styles.infoCard}>
            <Text style={styles.infoText}>Nenhuma informação de despacho de drone disponível para esta simulação no momento.</Text>
         </View>
      )}
    </ScrollView>
  );
};

export default DroneControlScreen;
