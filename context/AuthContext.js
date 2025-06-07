// context/AuthContext.js
// Este contexto gerencia o estado de autenticação global do aplicativo,
// incluindo o token do usuário, dados do usuário e funções para login, logout e registro.
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api'; // Presumes api.js is in ../services/

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Realiza o login do usuário chamando a API e armazenando o token e dados do usuário.
   */
  const authLogin = async (username, password) => {
    console.log('[AuthContext] Tentando login com:', username); // DEBUG
    setIsLoading(true);
    try {
      const response = await api.login(username, password);
      console.log('[AuthContext] Resposta da API de login:', JSON.stringify(response, null, 2)); // DEBUG

      if (response && response.token && response.username && response.email) { // Check for essential fields
        setUserToken(response.token);
        const userDataPayload = {
          userId: response.userId,
          username: response.username,
          email: response.email,
          roles: response.roles
        };
        setUserData(userDataPayload);
        console.log('[AuthContext] Token e userData definidos no estado:', response.token, userDataPayload); // DEBUG
        setIsLoading(false); // Moved here
        return response;
      } else {
        console.error('[AuthContext] Resposta de login inválida ou sem token/username/email:', response); // DEBUG
        // Ensure consistent error object/message for UI to handle if needed
        throw new Error(response?.message || 'Falha no login: Dados essenciais ausentes na resposta.');
      }
    } catch (error) {
      console.error('[AuthContext] Erro em authLogin:', error.message, error); // DEBUG
      setUserToken(null);
      setUserData(null);
      setIsLoading(false); // Moved here
      throw error;
    }
  };

  /**
   * Registra um novo usuário.
   */
  const authRegister = async (data) => {
    setIsLoading(true);
    try {
      // data should be { username, email, password, completeName }
      const response = await api.register(data);
      setIsLoading(false);
      // Decide on behavior: auto-login or redirect to login
      // For now, just return the response. UI can handle next steps.
      return response;
    } catch (error) {
      console.error('Register error in AuthContext:', error);
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Realiza o logout do usuário, limpando o token e os dados do AsyncStorage.
   */
  const authLogout = async () => {
    setIsLoading(true);
    try {
      await api.logout(); // api.logout should handle AsyncStorage internally
    } catch (error) {
      console.error("Error during API logout:", error);
      // Still proceed to clear client-side context even if API call fails
    } finally {
      setUserToken(null);
      setUserData(null);
      // Ensure AsyncStorage is cleared, even if api.logout failed or didn't do it
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
      } catch (e) {
        console.error("Error removing items from AsyncStorage on logout:", e);
      }
      setIsLoading(false);
    }
  };

  // useEffect para verificar o token no AsyncStorage ao montar
  useEffect(() => {
    const bootstrapAsync = async () => {
      console.log('[AuthContext] Bootstrap: Verificando AsyncStorage...'); // DEBUG
      let token = null;
      let uDataString = null;

      try {
        token = await AsyncStorage.getItem('userToken');
        console.log('[AuthContext] Bootstrap: Token do Storage:', token); // DEBUG
        uDataString = await AsyncStorage.getItem('userData');
        console.log('[AuthContext] Bootstrap: UserData string do Storage:', uDataString); // DEBUG

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
