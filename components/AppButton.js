import React from 'react';
import { useTheme } from '../styles/theme';

const AppButton = ({ title, onClick, style = {}, textStyle = {}, type = 'primary', disabled = false }) => {
  const { colors } = useTheme();
  const buttonColors = {
    primary: { backgroundColor: colors.primary, textColor: colors.lightText },
    secondary: { backgroundColor: colors.secondary, textColor: colors.text },
    danger: { backgroundColor: colors.danger, textColor: colors.lightText },
    info: { backgroundColor: colors.info, textColor: colors.lightText },
  };

  const currentColors = buttonColors[type] || buttonColors.primary;

  const baseButtonStyle = {
    padding: '14px 25px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '15px',
    width: '100%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    backgroundColor: currentColors.backgroundColor,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    border: 'none',
  };

  const baseButtonTextStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: currentColors.textColor,
  };

  return (
    <button
      style={{ ...baseButtonStyle, ...style }}
      onClick={onClick}
      disabled={disabled}
    >
      <span style={{ ...baseButtonTextStyle, ...textStyle }}>
        {title}
      </span>
    </button>
  );
};

export default AppButton;