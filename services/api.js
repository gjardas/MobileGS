const mockData = {
  alerts: [
    { id: '1', title: 'Alerta de Enchente', description: 'Nível do rio subindo rapidamente na área central. Evacuação imediata.', severity: 'Alta', timestamp: new Date().toISOString() },
    { id: '2', title: 'Risco de Deslizamento', description: 'Monitoramento de encostas na região serrana. Fique atento a sinais.', severity: 'Média', timestamp: new Date(Date.now() - 3600 * 1000).toISOString() },
    { id: '3', title: 'Previsão de Chuva Forte', description: 'Chuvas intensas esperadas para as próximas 24h. Prepare-se.', severity: 'Baixa', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
  ],
  drones: [
    { id: 'drone-001', name: 'SAR-Drone Alpha', status: 'Ativo', location: 'São Paulo', battery: 85, lastUpdate: new Date().toISOString() },
    { id: 'drone-002', name: 'SAR-Drone Beta', status: 'Inativo', location: 'Rio Grande do Sul', battery: 60, lastUpdate: new Date(Date.now() - 12 * 3600 * 1000).toISOString() },
  ]
};

const api = { // Renomeado de apiService para api
  // Simula um atraso de rede
  _delay: (ms) => new Promise(res => setTimeout(res, ms)),

  // Simula erro em 10% das requisições
  _shouldFail: () => Math.random() < 0.1,

  // Operações para Alertas
  getAlerts: async () => {
    await api._delay(500);
    if (api._shouldFail()) {
      throw new Error('Falha ao carregar alertas. Tente novamente.');
    }
    return mockData.alerts;
  },

  createAlert: async (newAlert) => {
    await api._delay(700);
    if (api._shouldFail()) {
      throw new Error('Falha ao criar alerta. Verifique os dados.');
    }
    const alertWithId = { ...newAlert, id: String(Date.now()), timestamp: new Date().toISOString() };
    mockData.alerts.push(alertWithId);
    return alertWithId;
  },

  updateAlert: async (updatedAlert) => {
    await api._delay(700);
    if (api._shouldFail()) {
      throw new Error('Falha ao atualizar alerta. Alerta não encontrado.');
    }
    const index = mockData.alerts.findIndex(a => a.id === updatedAlert.id);
    if (index > -1) {
      mockData.alerts[index] = { ...mockData.alerts[index], ...updatedAlert, timestamp: new Date().toISOString() };
      return mockData.alerts[index];
    }
    throw new Error('Alerta não encontrado para atualização.');
  },

  deleteAlert: async (alertId) => {
    await api._delay(500);
    if (api._shouldFail()) {
      throw new Error('Falha ao deletar alerta. Alerta não encontrado.');
    }
    const initialLength = mockData.alerts.length;
    mockData.alerts = mockData.alerts.filter(a => a.id !== alertId);
    if (mockData.alerts.length === initialLength) {
      throw new Error('Alerta não encontrado para exclusão.');
    }
    return { success: true, message: 'Alerta deletado com sucesso.' };
  },

  // Operações para Drones (apenas Read para demonstração)
  getDrones: async () => {
    await api._delay(500);
    if (api._shouldFail()) {
      throw new Error('Falha ao carregar dados dos drones.');
    }
    return mockData.drones;
  },
};

export default api;
