import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, RefreshControl, Alert, Pressable } from 'react-native'; // Added Pressable
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme as useCentralTheme } from '../styles/theme';

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

const HistoryScreen = () => {
  const theme = localTheme;
  // const { colors, fonts } = useCentralTheme(); // Merge if needed

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

  // Styles using the new localTheme
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
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.10,
      shadowRadius: 1.5,
    },
    itemTitle: {
      fontSize: theme.fontSizes.subheading,
      fontFamily: theme.fonts.bold,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: theme.spacing.small,
    },
    itemDetailText: {
      fontSize: theme.fontSizes.body,
      fontFamily: theme.fonts.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xsmall,
      lineHeight: theme.fontSizes.body * 1.4,
    },
    itemValueText: {
        color: theme.colors.text,
        fontFamily: theme.fonts.regular,
        fontWeight: '500',
    },
    errorText: {
      textAlign: 'center',
      marginBottom: theme.spacing.medium,
      fontSize: theme.fontSizes.body,
      fontFamily: theme.fonts.regular,
      color: theme.colors.error,
    },
    emptyText: {
      fontSize: theme.fontSizes.body,
      fontFamily: theme.fonts.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    loadingText: {
      color: theme.colors.text,
      marginTop: theme.spacing.small,
      fontSize: theme.fontSizes.body,
      fontFamily: theme.fonts.regular,
    },
    retryButton: { // Style for the "Tentar Novamente" Pressable
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.small,
        paddingHorizontal: theme.spacing.medium,
        borderRadius: theme.roundness,
        elevation: 1,
    },
    retryButtonText: {
        color: theme.colors.lightText,
        fontSize: theme.fontSizes.button,
        fontFamily: theme.fonts.bold,
        fontWeight: 'bold',
    }
  });

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
        <Pressable style={({pressed}) => [styles.retryButton, {opacity: pressed ? 0.8 : 1}]} onPress={() => fetchHistoryEvents()}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={historyEvents}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.disNo.toString()}
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
