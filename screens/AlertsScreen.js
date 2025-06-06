import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, RefreshControl, Alert, Pressable } from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme as useCentralTheme } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';


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

const AlertsScreen = () => {
  const theme = localTheme;
  const [simulations, setSimulations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const { logout } = useAuth();

  const fetchSimulations = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    setError(null);
    try {
      const response = await api.getUserSimulations(0, 10, 'requestTimestamp,desc');
      setSimulations(response?.content || []);
    } catch (err) {
      console.error("Failed to fetch simulations:", err.message);
      if (err.message === 'UNAUTHORIZED_OR_EXPIRED_TOKEN') {
        Alert.alert("Sessão Expirada", "Sua sessão expirou. Por favor, faça login novamente.", [{ text: "OK", onPress: async () => await logout() }]);
        setError("Sessão expirada. Faça login para continuar.");
      } else {
        setError(err.message || 'Ocorreu um erro ao buscar as simulações.');
      }
      setSimulations([]);
    } finally {
      if (!isRefresh) setIsLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchSimulations();
  }, [fetchSimulations]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSimulations(true);
  };


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
    dispatchButton: {
      marginTop: theme.spacing.medium,
      paddingVertical: theme.spacing.small,
      paddingHorizontal: theme.spacing.medium,
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 1,
    },
    dispatchButtonText: {
      color: theme.colors.lightText,
      fontSize: theme.fontSizes.button,
      fontFamily: theme.fonts.bold,
      fontWeight: 'bold',
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
    retryButton: {
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

  const renderSimulationItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>ID da Simulação: {item.id}</Text>
      <Text style={styles.itemDetailText}>Tipo de Desastre: <Text style={styles.itemValueText}>{item.disasterType || 'N/A'}</Text></Text>
      <Text style={styles.itemDetailText}>Status IA: <Text style={styles.itemValueText}>{item.iaProcessingStatus || 'N/A'}</Text></Text>
      <Text style={styles.itemDetailText}>Predição Fatalidade: <Text style={styles.itemValueText}>{item.predictedFatalityCategory || 'N/A'}</Text></Text>
      <Text style={styles.itemDetailText}>Data Solicitação: <Text style={styles.itemValueText}>{new Date(item.requestTimestamp).toLocaleString()}</Text></Text>

      {item.iaProcessingStatus === 'COMPLETED' && (
        <Pressable
          style={({ pressed }) => [
            styles.dispatchButton,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={() => navigation.navigate('DroneControl', { simulationId: item.id, disasterType: item.disasterType })}
        >
          <Text style={styles.dispatchButtonText}>Despachar Drones</Text>
        </Pressable>
      )}
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando Simulações...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={({pressed}) => [styles.retryButton, {opacity: pressed ? 0.8 : 1}]} onPress={() => fetchSimulations()}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={simulations}
        renderItem={renderSimulationItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Nenhuma simulação encontrada.</Text>
          </View>
        }
        contentContainerStyle={simulations.length === 0 ? styles.centered : styles.listContentContainer}
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

export default AlertsScreen;
