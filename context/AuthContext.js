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
    setIsLoading(true);
    try {
      const response = await api.login(username, password); // api.login should handle AsyncStorage internally
      if (response && response.token) {
        setUserToken(response.token);
        // Assuming api.login returns user details besides token, e.g., { token, userId, username, email, roles }
        // And these details are also stored in AsyncStorage by api.login or here.
        // For now, let's assume api.login returns the full user data needed by the app
        // and it has already stored it. We just need to set it in context.
        const storedUserDataString = await AsyncStorage.getItem('userData');
        if (storedUserDataString) {
            setUserData(JSON.parse(storedUserDataString));
        } else {
            // Fallback if api.login doesn't store it or if we need to construct it
             setUserData({ userId: response.userId, username: response.username, email: response.email, roles: response.roles });
        }
      } else {
        // Handle cases where token might be missing in response
        throw new Error(response?.message || 'Login failed: No token received');
      }
      setIsLoading(false);
      return response;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      setUserToken(null); // Ensure token is cleared on error
      setUserData(null);
      setIsLoading(false);
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
      let token = null;
      let uData = null;
      try {
        token = await AsyncStorage.getItem('userToken');
        const uDataString = await AsyncStorage.getItem('userData');
        uData = uDataString ? JSON.parse(uDataString) : null;
      } catch (e) {
        console.error("Failed to restore token/userData from AsyncStorage:", e);
        // Consider clearing storage if corrupted
        // await AsyncStorage.multiRemove(['userToken', 'userData']);
      }
      setUserToken(token);
      setUserData(uData);
      setIsLoading(false);
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
