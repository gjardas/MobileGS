import React, { useState, useEffect } from 'react';
import { useTheme } from '../styles/theme';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import CustomAlert from '../components/CustomAlert';
import api from '../services/api'; // Importa o serviço de API

const AlertsScreen = ({ navigate }) => { // Renomeado de EmergencyInfoScreen
  const { colors, fonts } = useTheme();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null); // Para edição
  const [alertForm, setAlertForm] = useState({ title: '', description: '', severity: 'Baixa' });
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAlerts();
      setAlerts(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))); // Ordena por mais recente
    } catch (err) {
      setAlertMessage(err.message);
      setAlertType('danger');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEditAlert = async () => {
    if (!alertForm.title || !alertForm.description) {
      setAlertMessage('Título e descrição são obrigatórios.');
      setAlertType('danger');
      setAlertVisible(true);
      return;
    }

    setLoading(true); // Ativa o loader para a operação de CRUD
    try {
      if (currentAlert) {
        // Atualizar Alerta
        await api.updateAlert({ ...currentAlert, ...alertForm });
        setAlertMessage('Alerta atualizado com sucesso!');
        setAlertType('success');
      } else {
        // Criar Alerta
        await api.createAlert(alertForm);
        setAlertMessage('Alerta criado com sucesso!');
        setAlertType('success');
      }
      setAlertVisible(true);
      setIsModalVisible(false);
      setAlertForm({ title: '', description: '', severity: 'Baixa' });
      setCurrentAlert(null);
      fetchAlerts(); // Recarrega a lista após a operação
    } catch (err) {
      setAlertMessage(err.message);
      setAlertType('danger');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (id) => {
    setLoading(true); // Ativa o loader
    try {
      await api.deleteAlert(id);
      setAlertMessage('Alerta deletado com sucesso!');
      setAlertType('success');
      setAlertVisible(true);
      fetchAlerts(); // Recarrega a lista
    } catch (err) {
      setAlertMessage(err.message);
      setAlertType('danger');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (alert) => {
    setCurrentAlert(alert);
    setAlertForm({ title: alert.title, description: alert.description, severity: alert.severity });
    setIsModalVisible(true);
  };

  const openAddModal = () => {
    setCurrentAlert(null);
    setAlertForm({ title: '', description: '', severity: 'Baixa' });
    setIsModalVisible(true);
  };

  if (loading && alerts.length === 0) { // Mostra loader apenas na primeira carga ou se não há dados
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
      }}>
        <div style={{
          animation: 'spin 1s linear infinite',
          borderRadius: '50%',
          height: '64px',
          width: '64px',
          borderTop: `4px solid ${colors.primary}`,
          borderBottom: `4px solid ${colors.primary}`,
          borderColor: colors.primary,
        }}></div>
        <p style={{ marginTop: '16px', fontSize: '18px', color: colors.text }}>Carregando alertas...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: colors.background,
      fontFamily: fonts.regular,
    }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '32px',
        textAlign: 'center',
        color: colors.primary,
        fontFamily: fonts.header,
      }}>
        Informações de Emergência
      </h1>

      <AppButton
        title="Adicionar Novo Alerta"
        onClick={openAddModal}
        style={{ marginBottom: '24px', backgroundColor: colors.info }}
        type="info"
      />

      {alerts.length === 0 && !error ? (
        <Card>
          <p style={{ fontSize: '18px', color: colors.text }}>Nenhum alerta de emergência ativo no momento.</p>
        </Card>
      ) : (
        alerts.map((alert) => (
          <Card key={alert.id} style={{ marginBottom: '16px', padding: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: colors.primary }}>{alert.title}</h3>
            <p style={{ fontSize: '16px', marginBottom: '8px', color: colors.text }}>{alert.description}</p>
            <p style={{
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: alert.severity === 'Alta' ? colors.danger : alert.severity === 'Média' ? colors.secondary : colors.info,
            }}>
              Severidade: {alert.severity}
            </p>
            <p style={{ fontSize: '12px', fontStyle: 'italic', color: colors.text }}>
              Publicado: {new Date(alert.timestamp).toLocaleString()}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px', gap: '8px' }}>
              <AppButton
                title="Editar"
                onClick={() => openEditModal(alert)}
                style={{ flex: 1, padding: '8px 16px', fontSize: '14px' }}
                type="secondary"
              />
              <AppButton
                title="Deletar"
                onClick={() => handleDeleteAlert(alert.id)}
                style={{ flex: 1, padding: '8px 16px', fontSize: '14px' }}
                type="danger"
                disabled={loading}
              />
            </div>
          </Card>
        ))
      )}

      <AppButton
        title="Atualizar Alertas"
        onClick={fetchAlerts}
        style={{ marginTop: '24px' }}
        disabled={loading}
      />
      <AppButton
        title="Voltar para a Home"
        onClick={() => navigate('Home')}
      />

      {/* Modal para Adicionar/Editar Alerta */}
      {isModalVisible && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          animation: 'fadeIn 0.3s ease-out forwards',
        }} onClick={() => setIsModalVisible(false)}>
          <div
            style={{
              borderRadius: '12px',
              padding: '32px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              transform: 'scale(0.95)',
              animation: 'scaleIn 0.3s ease-out forwards',
              backgroundColor: colors.cardBackground,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center', color: colors.primary }}>
              {currentAlert ? 'Editar Alerta' : 'Novo Alerta'}
            </h2>
            <input
              type="text"
              style={{
                border: `1px solid ${colors.borderColor}`,
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                width: '100%',
                fontSize: '16px',
                color: colors.text,
              }}
              placeholder="Título do Alerta"
              value={alertForm.title}
              onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
            />
            <textarea
              style={{
                border: `1px solid ${colors.borderColor}`,
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                width: '100%',
                fontSize: '16px',
                height: '100px',
                resize: 'none',
                verticalAlign: 'top',
                color: colors.text,
              }}
              placeholder="Descrição Detalhada"
              value={alertForm.description}
              onChange={(e) => setAlertForm({ ...alertForm, description: e.target.value })}
            ></textarea>
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginBottom: '24px',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${colors.borderColor}`,
            }}>
              <span style={{ fontSize: '16px', color: colors.text }}>Severidade:</span>
              {['Baixa', 'Média', 'Alta'].map((severityOption) => (
                <button
                  key={severityOption}
                  style={{
                    padding: '8px 15px',
                    borderRadius: '6px',
                    border: `1px solid ${alertForm.severity === severityOption ? colors.primary : 'transparent'}`,
                    transition: 'all 0.2s ease',
                    backgroundColor: alertForm.severity === severityOption ? colors.primary : 'transparent',
                    color: alertForm.severity === severityOption ? colors.lightText : colors.text,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                  onClick={() => setAlertForm({ ...alertForm, severity: severityOption })}
                >
                  <span>{severityOption}</span>
                </button>
              ))}
            </div>
            <AppButton
              title={currentAlert ? 'Salvar Alterações' : 'Criar Alerta'}
              onClick={handleAddEditAlert}
              style={{ marginBottom: '12px' }}
              disabled={loading}
            />
            <AppButton
              title="Cancelar"
              onClick={() => setIsModalVisible(false)}
              style={{ backgroundColor: colors.danger }}
              type="danger"
            />
          </div>
        </div>
      )}

      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        type={alertType}
      />
    </div>
  );
};

export default AlertsScreen;
