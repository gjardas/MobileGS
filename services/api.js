// services/api.js
// Este arquivo funciona como o cliente HTTP para interagir com a API GlobalSight.
// Ele encapsula toda a lógica de chamadas de rede para os diversos endpoints da API.
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8081'; // Updated port to 8081

const api = {
  // --- Funções de Autenticação ---
  /**
   * Autentica um usuário e armazena o token JWT.
   * POST /auth/login
   */
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Falha no login: ${response.status}`);
      }

      const data = await response.json();
      if (data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        const userDataToStore = {
          userId: data.userId,
          username: data.username,
          email: data.email,
          roles: data.roles
        };
        // Garantir que userDataToStore tenha os campos corretos antes de salvar
        if (userDataToStore.username && userDataToStore.email) {
           await AsyncStorage.setItem('userData', JSON.stringify(userDataToStore));
        } else {
          // Logar um aviso se campos essenciais estiverem faltando na resposta da API
          console.warn('Campos username ou email faltando na resposta da API de login:', data);
          // Consider not saving userData if essential fields are missing, or saving it partially
          // For now, we'll still save what we have, but the warning is important.
          await AsyncStorage.setItem('userData', JSON.stringify(userDataToStore));
        }
        return data; // Retorna AuthResponseDto completo
      } else {
        throw new Error(data?.message || 'Token não recebido do servidor.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  /**
   * Registra um novo usuário na plataforma.
   * POST /auth/register
   */
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Falha no registro: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  },

  /**
   * Realiza o logout do usuário limpando o token do AsyncStorage.
   * (Não envolve chamada de API neste exemplo, apenas limpeza local)
   */
  logout: async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  },

  /**
   * Obtém o cabeçalho de autenticação com o token JWT, se disponível.
   */
  getAuthHeader: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        return { 'Authorization': `Bearer ${token}` };
      }
      return {};
    } catch (error) {
      console.error('Erro ao obter cabeçalho de autenticação:', error);
      return {};
    }
  },

  // --- Funções de API para Histórico de Desastres ---
  /**
   * Busca o histórico paginado de eventos de desastre.
   * GET /api/history
   */
  getDisasterHistory: async (page = 0, size = 10, sort = 'yearEvent,desc', filters = {}) => {
    try {
      const authHeaders = await api.getAuthHeader();
      let queryParams = `?page=${page}&size=${size}&sort=${sort}`;
      for (const key in filters) {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams += `&${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`;
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/history${queryParams}`, {
        method: 'GET',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
      });

      if (response.status === 401) {
        throw new Error('UNAUTHORIZED_OR_EXPIRED_TOKEN');
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Falha ao buscar histórico de desastres: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar histórico de desastres:', error);
      throw error;
    }
  },

  /**
   * Busca um evento de desastre específico pelo seu DisNo (ID).
   * GET /api/history/{disNo}
   */
  getDisasterEventByDisNo: async (disNo) => {
    try {
      const authHeaders = await api.getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/api/history/${disNo}`, {
        method: 'GET',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
      });

      if (response.status === 401) {
        throw new Error('UNAUTHORIZED_OR_EXPIRED_TOKEN');
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Falha ao buscar evento ${disNo}: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar evento de desastre ${disNo}:`, error);
      throw error;
    }
  },

  /**
   * Cria um novo evento de desastre. Requer ROLE_ADMIN.
   * POST /api/history
   */
  createDisasterEvent: async (eventData) => {
    try {
      const authHeaders = await api.getAuthHeader();
      if (!authHeaders.Authorization) {
        throw new Error('Usuário não autenticado. Não é possível criar evento.');
      }

      const response = await fetch(`${API_BASE_URL}/api/history`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (response.status === 401) {
        throw new Error('UNAUTHORIZED_OR_EXPIRED_TOKEN');
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Falha ao criar evento de desastre: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar evento de desastre:', error);
      throw error;
    }
  },

  /**
   * Atualiza um evento de desastre existente. Requer ROLE_ADMIN.
   * PUT /api/history/{disNo}
   */
  updateDisasterEvent: async (disNo, eventData) => {
    try {
      const authHeaders = await api.getAuthHeader();
      if (!authHeaders.Authorization) {
        throw new Error('Usuário não autenticado. Não é possível atualizar evento.');
      }

      const response = await fetch(`${API_BASE_URL}/api/history/${disNo}`, {
        method: 'PUT',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (response.status === 401) {
        throw new Error('UNAUTHORIZED_OR_EXPIRED_TOKEN');
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Falha ao atualizar evento ${disNo}: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro ao atualizar evento de desastre ${disNo}:`, error);
      throw error;
    }
  },

  /**
   * Deleta um evento de desastre. Requer ROLE_ADMIN.
   * DELETE /api/history/{disNo}
   */
  deleteDisasterEvent: async (disNo) => {
    try {
      const authHeaders = await api.getAuthHeader();
      if (!authHeaders.Authorization) {
        throw new Error('Usuário não autenticado. Não é possível deletar evento.');
      }

      const response = await fetch(`${API_BASE_URL}/api/history/${disNo}`, {
        method: 'DELETE',
        headers: authHeaders,
      });

      if (response.status === 401) {
        throw new Error('UNAUTHORIZED_OR_EXPIRED_TOKEN');
      }
      if (response.status === 204) {
        return { success: true, message: `Evento ${disNo} deletado com sucesso.` };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData?.message || `Falha ao deletar evento ${disNo}: ${response.status}`);
      }

      return { success: true, message: `Evento ${disNo} processado com status ${response.status}.` };

    } catch (error) {
      console.error(`Erro ao deletar evento de desastre ${disNo}:`, error);
      throw error;
    }
  },

  // --- Funções de API para Simulações de Desastres ---
  /**
   * Cria uma ou mais novas simulações de desastre.
   * POST /api/simulations
   */
  createSimulation: async (simulationDataArray) => {
    try {
      const authHeaders = await api.getAuthHeader();
      if (!authHeaders.Authorization) {
        throw new Error('Usuário não autenticado. Não é possível criar simulação.');
      }

      const response = await fetch(`${API_BASE_URL}/api/simulations`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(simulationDataArray),
      });

      if (response.status === 401) {
        throw new Error('UNAUTHORIZED_OR_EXPIRED_TOKEN');
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Falha ao criar simulação: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar simulação:', error);
      throw error;
    }
  },

  /**
   * Busca uma simulação de desastre específica pelo seu ID.
   * GET /api/simulations/{simulationId}
   */
  getSimulationById: async (simulationId) => {
    try {
      const authHeaders = await api.getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/api/simulations/${simulationId}`, {
        method: 'GET',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
      });

      if (response.status === 401) {
        throw new Error('UNAUTHORIZED_OR_EXPIRED_TOKEN');
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Falha ao buscar simulação ${simulationId}: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar simulação ${simulationId}:`, error);
      throw error;
    }
  },

  /**
   * Busca as simulações de desastre criadas pelo usuário logado.
   * GET /api/simulations
   */
  getUserSimulations: async (page = 0, size = 10, sort = 'requestTimestamp,desc', filters = {}) => {
    try {
      const authHeaders = await api.getAuthHeader();
      if (!authHeaders.Authorization) {
        throw new Error('Usuário não autenticado. Não é possível buscar simulações do usuário.');
      }

      let queryParams = `?page=${page}&size=${size}&sort=${sort}`;
      for (const key in filters) {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams += `&${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`;
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/simulations${queryParams}`, {
        method: 'GET',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
      });

      if (response.status === 401) {
        throw new Error('UNAUTHORIZED_OR_EXPIRED_TOKEN');
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Falha ao buscar simulações do usuário: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar simulações do usuário:', error);
      throw error;
    }
  },

  /**
   * Aciona o processo de predição de IA para uma simulação específica.
   * POST /api/simulations/{simulationId}/predict
   */
  triggerSimulationPrediction: async (simulationId) => {
    try {
      const authHeaders = await api.getAuthHeader();
      if (!authHeaders.Authorization) {
        throw new Error('Usuário não autenticado. Não é possível acionar predição.');
      }

      const response = await fetch(`${API_BASE_URL}/api/simulations/${simulationId}/predict`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
      });

      if (response.status === 401) {
        throw new Error('UNAUTHORIZED_OR_EXPIRED_TOKEN');
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Falha ao acionar predição para simulação ${simulationId}: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro ao acionar predição para simulação ${simulationId}:`, error);
      throw error;
    }
  },

  // --- Funções de API para Simulação de Drone ---
  /**
   * Solicita o despacho simulado de drones para uma simulação específica.
   * POST /api/drone/dispatch/{simulationId}
   */
  getDroneDispatchForSimulation: async (simulationId) => {
    try {
      const authHeaders = await api.getAuthHeader();
      if (!authHeaders.Authorization) {
        throw new Error('Usuário não autenticado. Não é possível simular despacho de drone.');
      }

      const response = await fetch(`${API_BASE_URL}/api/drone/dispatch/${simulationId}`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
      });

      if (response.status === 401) {
        throw new Error('UNAUTHORIZED_OR_EXPIRED_TOKEN');
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Falha ao simular despacho de drone para simulação ${simulationId}: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro ao simular despacho de drone para simulação ${simulationId}:`, error);
      throw error;
    }
  },

};

export default api;
