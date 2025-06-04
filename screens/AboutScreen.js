import React from 'react';
import { useTheme } from '../styles/theme';
import AppButton from '../components/AppButton';
import Card from '../components/Cards'; // Corrected import path

const AboutScreen = ({ navigate }) => {
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
        Sobre o SAR-Drone
      </h1>

      <Card style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: colors.primary }}>Visão Geral</h3>
        <p style={{ fontSize: '18px', lineHeight: '1.5', marginBottom: '16px', color: colors.text }}>
          O SAR-Drone é uma solução inovadora para mitigar os impactos de desastres naturais,
          especialmente em áreas com infraestrutura de comunicação comprometida.
          Nosso sistema integra previsão inteligente, acionamento rápido, conectividade imediata
          e disseminação de informações críticas.
        </p>
      </Card>

      <Card style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: colors.primary }}>Tecnologias Utilizadas</h3>
        <p style={{ fontSize: '18px', marginBottom: '8px', color: colors.text }}>
          <span style={{ fontWeight: 'bold' }}>Front-end:</span> React, CSS Inline
        </p>
        <p style={{ fontSize: '18px', marginBottom: '8px', color: colors.text }}>
          <span style={{ fontWeight: 'bold' }}>Backend (Sugestão):</span> Java / .NET RESTful API
        </p>
        <p style={{ fontSize: '18px', marginBottom: '8px', color: colors.text }}>
          <span style={{ fontWeight: 'bold' }}>Previsão:</span> Machine Learning, Análise de Dados
        </p>
      </Card>

      <Card style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: colors.primary }}>Contato</h3>
        <p style={{ fontSize: '18px', color: colors.text }}>
          Para mais informações, entre em contato com a Defesa Civil.
        </p>
      </Card>

      <AppButton
        title="Voltar para a Home"
        onClick={() => navigate('Home')}
        style={{ marginTop: '24px' }}
      />
    </div>
  );
};

export default AboutScreen;
