import React from 'react';
import AppButton from './AppButton'; // Importa AppButton para o botão "OK"
import { useTheme } from '../styles/theme';

const CustomAlert = ({ visible, message, onClose, type = 'info' }) => {
  const { colors } = useTheme();
  const alertColors = {
    info: colors.info,
    success: colors.success,
    danger: colors.danger,
  };

  if (!visible) return null;

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    animation: 'fadeIn 0.3s ease-out forwards',
  };

  const alertContainerStyle = {
    padding: '32px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80%',
    maxWidth: '400px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    transform: 'scale(0.95)',
    animation: 'scaleIn 0.3s ease-out forwards',
    backgroundColor: alertColors[type],
  };

  const alertMessageStyle = {
    color: colors.lightText,
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '24px',
  };

  const alertButtonStyle = {
    backgroundColor: colors.lightText,
    padding: '10px 30px',
    borderRadius: '8px',
  };

  const alertButtonTextStyle = {
    color: colors.primary,
    fontWeight: 'bold',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={alertContainerStyle} onClick={(e) => e.stopPropagation()}>
        <p style={alertMessageStyle}>{message}</p>
        <AppButton
          title="OK"
          onClick={onClose}
          style={alertButtonStyle}
          textStyle={alertButtonTextStyle}
          type="none"
        />
      </div>
    </div>
  );
};

export default CustomAlert;
