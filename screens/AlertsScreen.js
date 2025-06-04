import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, RefreshControl, Alert } from 'react-native'; // Added Alert
import api from '../services/api'; // Adjust path if necessary
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useTheme } from '../styles/theme'; // Adjust path if necessary
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const AlertsScreen = () => {
  const [simulations, setSimulations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh

  const { colors, fonts } = useTheme();
  const navigation = useNavigation();
  const { logout } = useAuth(); // Get logout function

  const fetchSimulations = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement pagination in the future. For now, default page and size.
      const response = await api.getUserSimulations(0, 10, 'requestTimestamp,desc');
      if (response && response.content) {
        setSimulations(response.content);
      } else {
        setSimulations([]); // Ensure it's an array even if content is missing
      }
    } catch (err) {
      console.error("Failed to fetch simulations:", err.message);
      if (err.message === 'UNAUTHORIZED_OR_EXPIRED_TOKEN') {
        Alert.alert("Sessão Expirada", "Sua sessão expirou. Por favor, faça login novamente.", [
          { text: "OK", onPress: async () => await logout() }
        ]);
        setError("Sessão expirada. Faça login para continuar.");
      } else {
        setError(err.message || 'Ocorreu um erro ao buscar as simulações.');
      }
      setSimulations([]); // Clear simulations on error
    } finally {
      if (!isRefresh) setIsLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [logout]); // Added logout to dependency array

  useEffect(() => {
    fetchSimulations();
  }, [fetchSimulations]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSimulations(true);
  };

  const renderSimulationItem = ({ item }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.itemTitle, { color: colors.primary }]}>Simulação ID: {item.id}</Text>
      <Text style={[styles.itemText, { color: colors.text }]}>Tipo de Desastre: {item.disasterType || 'N/A'}</Text>
      <Text style={[styles.itemText, { color: colors.text }]}>Status Processamento IA: {item.iaProcessingStatus || 'N/A'}</Text>
      <Text style={[styles.itemText, { color: colors.text }]}>Categoria de Fatalidade (Predição): {item.predictedFatalityCategory || 'N/A'}</Text>
      <Text style={[styles.itemText, { color: colors.text }]}>Data Solicitação: {new Date(item.requestTimestamp).toLocaleString()}</Text>
      <View style={styles.buttonSeparator} />
      <Button
        title="Despachar Drones"
        onPress={() => navigation.navigate('DroneControl', { simulationId: item.id, disasterType: item.disasterType })}
        color={colors.accent || colors.primary} // Use accent or primary color from theme
      />
      {/* TODO: Add a button to navigate to full simulation details screen */}
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 10 }}>Carregando Simulações...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Erro: {error}</Text>
        <Button title="Tentar Novamente" onPress={() => fetchSimulations()} color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={simulations}
        renderItem={renderSimulationItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={[styles.emptyText, { color: colors.text }]}>Nenhuma simulação encontrada.</Text>
          </View>
        }
        contentContainerStyle={simulations.length === 0 ? styles.centered : styles.listContentContainer}
        refreshControl={ // Added pull-to-refresh
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]} // Android tint color
            tintColor={colors.primary} // iOS tint color
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  itemContainer: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 3,
  },
  buttonSeparator: { // Style for a small separator view
    height: 10,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  }
});

export default AlertsScreen;
