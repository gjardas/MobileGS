import React from 'react';
import { useTheme } from '../styles/theme';
import AppButton from '../components/AppButton';
import Card from '../components/Card';

const HomeScreen = ({ navigate }) => {
  const { colors, fonts } = useTheme();
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
        marginBottom: '8px',
        textAlign: 'center',
        color: colors.primary,
        fontFamily: fonts.header,
      }}>
        SAR-Drone
      </h1>
      <h2 style={{
        fontSize: '18px',
        textAlign: 'center',
        marginBottom: '32px',
        color: colors.text,
      }}>
        Sistema Autônomo de Resposta a Desastres
      </h2>

      <Card style={{ marginBottom: '30px', padding: '24px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: colors.primary }}>Bem-vindo ao SAR-Drone</h3>
        <p style={{ fontSize: '18px', lineHeight: '1.5', marginBottom: '16px', color: colors.text }}>
          Sua ferramenta essencial para monitoramento, previsão e resposta a desastres naturais.
          Conectividade e informação crítica onde mais importa.
        </p>
        <AppButton
          title="Ver Alertas de Emergência"
          onClick={() => navigate('Alerts')}
          style={{ marginBottom: '12px' }}
        />
        <AppButton
          title="Monitorar Drones"
          onClick={() => navigate('DroneControl')}
          style={{ marginBottom: '12px' }}
        />
        <AppButton
          title="Previsão de Riscos"
          onClick={() => navigate('RiskPrediction')}
          style={{ marginBottom: '12px' }}
        />
        <AppButton
          title="Sobre o SAR-Drone"
          onClick={() => navigate('About')}
        />
      </Card>

      <Card style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: colors.primary }}>Nossa Missão</h3>
        <p style={{ fontSize: '18px', lineHeight: '1.5', color: colors.text }}>
          Reduzir fatalidades e otimizar a resposta em áreas isoladas, fornecendo comunicação e dados em tempo real através de drones autônomos.
        </p>
      </Card>
    </div>
  );
};

export default HomeScreen;