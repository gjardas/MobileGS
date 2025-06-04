import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, RefreshControl, Alert } from 'react-native'; // Added Alert
import api from '../services/api'; // Adjust path if necessary
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useTheme } from '../styles/theme'; // Adjust path if necessary

const HistoryScreen = () => {
  const [historyEvents, setHistoryEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const { colors, fonts } = useTheme();
  const { logout } = useAuth(); // Get logout function

  const fetchHistoryEvents = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement pagination in the future.
      const response = await api.getDisasterHistory(0, 20, 'yearEvent,desc'); // Fetching 20 items for now
      if (response && response.content) {
        setHistoryEvents(response.content);
      } else {
        setHistoryEvents([]);
      }
    } catch (err) {
      console.error("Failed to fetch disaster history:", err.message);
      if (err.message === 'UNAUTHORIZED_OR_EXPIRED_TOKEN') {
        Alert.alert("Sessão Expirada", "Sua sessão expirou. Por favor, faça login novamente.", [
          { text: "OK", onPress: async () => await logout() }
        ]);
        setError("Sessão expirada. Faça login para continuar.");
      } else {
        setError(err.message || 'Ocorreu um erro ao buscar o histórico de desastres.');
      }
      setHistoryEvents([]);
    } finally {
      if (!isRefresh) setIsLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [logout]); // Added logout to dependency array

  useEffect(() => {
    fetchHistoryEvents();
  }, [fetchHistoryEvents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistoryEvents(true);
  };

  const renderHistoryItem = ({ item }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.itemTitle, { color: colors.primary }]}>Evento: {item.eventName || 'N/A'} (ID: {item.disNo})</Text>
      <Text style={[styles.itemText, { color: colors.text }]}>Tipo: {item.disasterType || 'N/A'}</Text>
      <Text style={[styles.itemText, { color: colors.text }]}>País: {item.country || 'N/A'}</Text>
      <Text style={[styles.itemText, { color: colors.text }]}>Ano: {item.yearEvent || 'N/A'}</Text>
      <Text style={[styles.itemText, { color: colors.text }]}>Data de Início: {item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A'}</Text>
      <Text style={[styles.itemText, { color: colors.text }]}>Data de Fim: {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'N/A'}</Text>
      {/* TODO: Add more details or navigation to a detail screen */}
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 10 }}>Carregando Histórico...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Erro: {error}</Text>
        <Button title="Tentar Novamente" onPress={() => fetchHistoryEvents()} color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={historyEvents}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.disNo} // Assuming disNo is unique string or can be converted
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={[styles.emptyText, { color: colors.text }]}>Nenhum evento histórico encontrado.</Text>
          </View>
        }
        contentContainerStyle={historyEvents.length === 0 ? styles.centered : styles.listContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
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
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 4,
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

export default HistoryScreen;
