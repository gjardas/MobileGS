import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, ScrollView, Alert } from 'react-native'; // Added Alert
import { useRoute } from '@react-navigation/native';
import api from '../services/api'; // Adjust path if necessary
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useTheme } from '../styles/theme'; // Adjust path if necessary

const DroneControlScreen = () => {
  const route = useRoute();
  const { simulationId, disasterType } = route.params || {};

  const [droneResponse, setDroneResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { colors, fonts } = useTheme();
  const { logout } = useAuth(); // Get logout function

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
        Alert.alert("Sessão Expirada", "Sua sessão expirou. Por favor, faça login novamente.", [
          { text: "OK", onPress: async () => await logout() }
        ]);
        setError("Sessão expirada. Faça login para continuar.");
      } else if (err.message && (err.message.includes('400') || err.message.includes('IA model is not ready'))) { // Example of specific error handling
        setError('Não foi possível despachar drones. A predição da IA pode não estar disponível ou a simulação é inválida.');
      } else {
        setError(err.message || 'Ocorreu um erro ao buscar informações de despacho dos drones.');
      }
      setDroneResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [simulationId, logout]); // Added logout to dependency array

  useEffect(() => {
    fetchDroneDispatchInfo();
  }, [fetchDroneDispatchInfo]);

  const styles = StyleSheet.create({
    scrollViewContainer: {
      flexGrow: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      padding: 20,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: fonts.sizes?.h2 || 22,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: fonts.sizes?.h3 || 18,
      color: colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 15,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoText: {
      fontSize: fonts.sizes?.body || 16,
      color: colors.text,
      marginBottom: 8,
    },
    infoLabel: {
      fontWeight: 'bold',
    },
    errorText: {
      color: colors.error,
      textAlign: 'center',
      marginBottom: 20,
      fontSize: fonts.sizes?.body || 16,
    },
    buttonContainer: {
      marginTop: 10,
    }
  });

  if (!simulationId) { // Should ideally not happen if navigation is set up correctly
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro: ID da Simulação não encontrado.</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 10 }}>Buscando informações de despacho dos drones...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Controle de Drones para Simulação</Text>
      <Text style={styles.subtitle}>ID da Simulação: {simulationId}</Text>
      {disasterType && <Text style={styles.subtitle}>Tipo de Desastre: {disasterType}</Text>}

      {error && (
        <View style={styles.infoCard}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Tentar Novamente" onPress={fetchDroneDispatchInfo} color={colors.primary} />
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
          <View style={styles.buttonContainer}>
            <Button title="Atualizar Informações" onPress={fetchDroneDispatchInfo} color={colors.accent || colors.primary} />
          </View>
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
