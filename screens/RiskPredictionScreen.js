import React from 'react';
import { useTheme } from '../styles/theme';
import AppButton from '../components/AppButton';
import Card from '../components/Card';

const RiskPredictionScreen = ({ navigate }) => {
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
        marginBottom: '32px',
        textAlign: 'center',
        color: colors.primary,
        fontFamily: fonts.header,
      }}>
        Previsão de Riscos
      </h1>
      <Card style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: colors.primary }}>Análise Preditiva (ML)</h3>
        <p style={{ fontSize: '18px', lineHeight: '1.5', marginBottom: '16px', color: colors.text }}>
          Esta seção integraria modelos de Machine Learning para prever riscos de desastres.
          Aqui você veria mapas de calor, zonas de alerta e relatórios preditivos.
        </p>
        <div style={{
          backgroundColor: '#E0E0E0',
          padding: '20px',
          borderRadius: '10px',
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '150px',
          width: '100%',
          border: '1px solid #CCC',
        }}>
          <p style={{ fontSize: '18px', fontStyle: 'italic', color: '#777', textAlign: 'center' }}>
            [Gráfico de Risco de Enchente - Exemplo]
          </p>
        </div>
        <div style={{
          backgroundColor: '#E0E0E0',
          padding: '20px',
          borderRadius: '10px',
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '150px',
          width: '100%',
          border: '1px solid #CCC',
        }}>
          <p style={{ fontSize: '18px', fontStyle: 'italic', color: '#777', textAlign: 'center' }}>
            [Lista de Áreas de Alto Risco - Exemplo]
          </p>
        </div>
        <AppButton
          title="Voltar para a Home"
          onClick={() => navigate('Home')}
          style={{ marginTop: '24px' }}
        />
      </Card>
    </div>
  );
};

export default RiskPredictionScreen;