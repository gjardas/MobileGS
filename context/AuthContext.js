import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const authLogin = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await api.login(username, password); 
      console.log('API Login Response:', response);
      if (response && response.token) {
        setUserToken(response.token);

        const userDataPayload = {
          userId: response.userId,
          username: response.username,
          email: response.email,
          roles: response.roles
        };
        console.log('Setting userData:', userDataPayload);
        setUserData(userDataPayload);
      } else {
        throw new Error(response?.message || 'Login failed: No token received');
      }
      setIsLoading(false);
      return response;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
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
      let token = null;


      try {
        token = await AsyncStorage.getItem('userToken');
        const uDataString = await AsyncStorage.getItem('userData');

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
            console.warn('Restored userData from AsyncStorage is incomplete or invalid:', parsedData);
            setUserData(null); 
            await AsyncStorage.removeItem('userData'); 
          }
        } else {
          setUserData(null); 
        }
      } catch (e) {
        console.error("Failed to restore or parse data from AsyncStorage:", e);

        setUserToken(null);
        setUserData(null);
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
