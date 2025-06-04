import React from 'react';
import { useTheme } from '../styles/theme';

const Card = ({ children, style = {} }) => {
  const { colors } = useTheme();
  const cardStyle = {
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    width: '100%',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${colors.borderColor}`,
    backgroundColor: colors.cardBackground,
  };
  return (
    <div style={{ ...cardStyle, ...style }}>
      {children}
    </div>
  );
};

export default Card;