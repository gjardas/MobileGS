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
      console.log('API Login Response:', response); // DEBUG
      if (response && response.token) {
        setUserToken(response.token);

        const userDataPayload = {
          userId: response.userId,
          username: response.username,
          email: response.email,
          roles: response.roles
        };
        console.log('Setting userData:', userDataPayload); // DEBUG
        setUserData(userDataPayload);

        // Note: api.login in services/api.js already saves token and constructed userData to AsyncStorage.
        // So, we don't necessarily need to read it back from AsyncStorage here immediately after setting it.
        // The primary role here is to set it in the context's state.
        // The initial load in useEffect handles populating context from AsyncStorage.
      } else {
        // Handle cases where token or other vital info might be missing in response
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
      // uData will be processed and set inside the try block

      try {
        token = await AsyncStorage.getItem('userToken');
        const uDataString = await AsyncStorage.getItem('userData');

        if (token) { // Set token if it exists
          setUserToken(token);
        } else {
          setUserToken(null); // Ensure token is null if not found
        }

        if (uDataString) { // Process and set userData if it exists
          const parsedData = JSON.parse(uDataString); // Attempt to parse
          // Basic integrity check for essential fields
          if (parsedData && parsedData.username && parsedData.email) {
            setUserData(parsedData);
          } else {
            console.warn('Restored userData from AsyncStorage is incomplete or invalid:', parsedData);
            setUserData(null); // Clear if invalid to prevent app issues
            await AsyncStorage.removeItem('userData'); // Remove corrupted/invalid data
          }
        } else {
          setUserData(null); // Ensure userData is null if not found in storage
        }
      } catch (e) {
        console.error("Failed to restore or parse data from AsyncStorage:", e);
        // If parsing failed or any other error, ensure states are clean
        setUserToken(null);
        setUserData(null);
        // Optionally clear potentially corrupted items from storage
        // These might fail if AsyncStorage itself is having issues, but worth a try.
        try {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userData');
        } catch (removeError) {
          console.error("Failed to remove corrupted items from AsyncStorage:", removeError);
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
