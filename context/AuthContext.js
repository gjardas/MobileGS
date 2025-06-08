import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const authLogin = async (username, password) => {
    console.log('[AuthContext] Tentando login com:', username);
    setIsLoading(true);
    try {
      const response = await api.login(username, password);
      console.log('[AuthContext] Resposta da API de login:', JSON.stringify(response, null, 2));
      if (response && response.token && response.username && response.email) { 
        setUserToken(response.token);
        const userDataPayload = {
          userId: response.userId,
          username: response.username,
          email: response.email,
          roles: response.roles
        };
        setUserData(userDataPayload);
        console.log('[AuthContext] Token e userData definidos no estado:', response.token, userDataPayload); 
        setIsLoading(false); 
        return response;
      } else {
        console.error('[AuthContext] Resposta de login inválida ou sem token/username/email:', response);
        throw new Error(response?.message || 'Falha no login: Dados essenciais ausentes na resposta.');
      }
    } catch (error) {
      console.error('[AuthContext] Erro em authLogin:', error.message, error); 
      setUserToken(null);
      setUserData(null);
      setIsLoading(false); 
      throw error;
    }
  };

  const authRegister = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.register(data);
      setIsLoading(false);
      return response;
    } catch (error) {
      console.error('Register error in AuthContext:', error);
      setIsLoading(false);
      throw error;
    }
  };
  const authLogout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } catch (error) {
      console.error("Error during API logout:", error);
    } finally {
      setUserToken(null);
      setUserData(null);
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
      } catch (e) {
        console.error("Error removing items from AsyncStorage on logout:", e);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      console.log('[AuthContext] Bootstrap: Verificando AsyncStorage...');
      let token = null;
      let uDataString = null;

      try {
        token = await AsyncStorage.getItem('userToken');
        console.log('[AuthContext] Bootstrap: Token do Storage:', token);
        uDataString = await AsyncStorage.getItem('userData');
        console.log('[AuthContext] Bootstrap: UserData string do Storage:', uDataString);

        if (token) {
          setUserToken(token);
        } else {
          setUserToken(null);
        }

        if (uDataString) {
          const parsedData = JSON.parse(uDataString);
          if (parsedData && parsedData.username && parsedData.email) {
            setUserData(parsedData);
          } else {
            console.warn('[AuthContext] Bootstrap: userData do AsyncStorage está incompleto ou inválido:', parsedData);
            setUserData(null);
            await AsyncStorage.removeItem('userData');
          }
        } else {
          setUserData(null);
        }
      } catch (e) {
        console.error("[AuthContext] Bootstrap: Falha ao restaurar ou parsear dados do AsyncStorage:", e);
        setUserToken(null);
        setUserData(null);
        try {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userData');
        } catch (removeError) {
          console.error("[AuthContext] Bootstrap: Falha ao remover itens corrompidos do AsyncStorage:", removeError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, userData, isLoading, login: authLogin, logout: authLogout, register: authRegister }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
