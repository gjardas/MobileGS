import React, { useState, useEffect } from 'react';
import { useTheme } from '../styles/theme';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import CustomAlert from '../components/CustomAlert';
import api from '../services/api'; // Importa o serviço de API

const DroneControlScreen = ({ navigate }) => {
  const { colors, fonts } = useTheme();
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');

  useEffect(() => {
    fetchDrones();
  }, []);

  const fetchDrones = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDrones();
      setDrones(data);
    } catch (err) {
      setError(err.message);
      setAlertMessage(err.message);
      setAlertType('danger');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const activateDrone = (droneId) => {
    // Simula a ativação do drone
    setAlertMessage(`Comando de ativação enviado para o drone ${droneId}.`);
    setAlertType('info');
    setAlertVisible(true);
    // Em um cenário real, você faria uma chamada de API para ativar o drone
    // Ex: api.activateDrone(droneId);
  };

  if (loading) {
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
        <p style={{ marginTop: '16px', fontSize: '18px', color: colors.text }}>Carregando drones...</p>
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
        Controle de Drones
      </h1>

      {drones.length === 0 && !error ? (
        <Card>
          <p style={{ fontSize: '18px', color: colors.text }}>Nenhum drone encontrado.</p>
        </Card>
      ) : (
        drones.map((drone) => (
          <Card key={drone.id} style={{ marginBottom: '16px', padding: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: colors.primary }}>{drone.name}</h3>
            <p style={{ fontSize: '16px', marginBottom: '4px', color: colors.text }}>ID: {drone.id}</p>
            <p style={{ fontSize: '16px', marginBottom: '4px', color: colors.text }}>
              Status: <span style={{ color: drone.status === 'Ativo' ? colors.success : colors.danger }}>{drone.status}</span>
            </p>
            <p style={{ fontSize: '16px', marginBottom: '4px', color: colors.text }}>Localização: {drone.location}</p>
            <p style={{ fontSize: '16px', marginBottom: '4px', color: colors.text }}>Bateria: {drone.battery}%</p>
            <p style={{ fontSize: '12px', fontStyle: 'italic', marginTop: '8px', color: colors.text }}>Última Atualização: {new Date(drone.lastUpdate).toLocaleString()}</p>
            <AppButton
              title={drone.status === 'Ativo' ? 'Desativar Drone' : 'Ativar Drone'}
              onClick={() => activateDrone(drone.id)}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                fontSize: '16px',
                backgroundColor: drone.status === 'Ativo' ? colors.danger : colors.primary,
              }}
            />
          </Card>
        ))
      )}

      <AppButton
        title="Atualizar Lista"
        onClick={fetchDrones}
        style={{ marginTop: '24px' }}
      />
      <AppButton
        title="Voltar para a Home"
        onClick={() => navigate('Home')}
      />
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        type={alertType}
      />
    </div>
  );
};

export default DroneControlScreen;
