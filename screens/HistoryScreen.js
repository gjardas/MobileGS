import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, RefreshControl, Alert } from 'react-native';
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

const HistoryScreen = () => {
  const theme = localTheme; // Prioritize localTheme
  // const { colors, fonts } = useCentralTheme(); // Or merge if central theme is fixed

  const [historyEvents, setHistoryEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const { logout } = useAuth();

  const fetchHistoryEvents = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    setError(null);
    try {
      const response = await api.getDisasterHistory(0, 20, 'yearEvent,desc');
      setHistoryEvents(response?.content || []);
    } catch (err) {
      console.error("Failed to fetch disaster history:", err.message);
      if (err.message === 'UNAUTHORIZED_OR_EXPIRED_TOKEN') {
        Alert.alert("Sessão Expirada", "Sua sessão expirou. Por favor, faça login novamente.", [{ text: "OK", onPress: async () => await logout() }]);
        setError("Sessão expirada. Faça login para continuar.");
      } else {
        setError(err.message || 'Ocorreu um erro ao buscar o histórico de desastres.');
      }
      setHistoryEvents([]);
    } finally {
      if (!isRefresh) setIsLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchHistoryEvents();
  }, [fetchHistoryEvents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistoryEvents(true);
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>
        {item.eventName || 'Evento Desconhecido'} (ID: {item.disNo})
      </Text>
      <Text style={styles.itemDetailText}>Tipo: <Text style={styles.itemValueText}>{item.disasterType || 'N/A'}</Text></Text>
      <Text style={styles.itemDetailText}>País: <Text style={styles.itemValueText}>{item.country || 'N/A'}</Text></Text>
      <Text style={styles.itemDetailText}>Ano: <Text style={styles.itemValueText}>{item.yearEvent || 'N/A'}</Text></Text>
      <Text style={styles.itemDetailText}>Data de Início: <Text style={styles.itemValueText}>{item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A'}</Text></Text>
      <Text style={styles.itemDetailText}>Data de Fim: <Text style={styles.itemValueText}>{item.endDate ? new Date(item.endDate).toLocaleDateString() : 'N/A'}</Text></Text>
    </View>
  );

  // Styles using localTheme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    listContentContainer: {
      padding: theme.spacing.medium,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.medium,
      backgroundColor: theme.colors.background,
    },
    itemContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.roundness,
      padding: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
      borderWidth: 1,
      borderColor: theme.colors.border,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2.0,
    },
    itemTitle: {
      fontSize: theme.fontSizes.subheading,
      fontFamily: theme.fonts.bold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.small,
      fontWeight: 'bold',
    },
    itemDetailText: {
      fontSize: theme.fontSizes.body,
      fontFamily: theme.fonts.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xsmall,
    },
    itemValueText: {
        color: theme.colors.text,
        fontWeight: '500',
    },
    errorText: {
      textAlign: 'center',
      marginBottom: theme.spacing.medium,
      fontSize: theme.fontSizes.body,
      color: theme.colors.error,
    },
    emptyText: {
      fontSize: theme.fontSizes.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    loadingText: {
      color: theme.colors.text,
      marginTop: theme.spacing.small,
      fontSize: theme.fontSizes.body,
    }
  });

  if (isLoading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando Histórico...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar Novamente" onPress={() => fetchHistoryEvents()} color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={historyEvents}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.disNo.toString()} // Ensure key is a string
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Nenhum evento histórico encontrado.</Text>
          </View>
        }
        contentContainerStyle={historyEvents.length === 0 ? styles.centered : styles.listContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
    </View>
  );
};

export default HistoryScreen;
