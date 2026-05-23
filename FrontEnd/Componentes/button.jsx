import React from 'react';
import PropTypes from 'prop-types';

/*
Componente Button Reutilizável
*/
const Button = ({ 
  label = 'Clique', 
  onClick, 
  disabled = false, 
  variant = 'primary',
  className = '',
  children,
  loading = false,
  type = 'button'
}) => {
  const variants = {
    primary: {
      background: '#007bff',
      color: 'white',
      border: 'none'
    },
    danger: {
      background: '#dc3545',
      color: 'white',
      border: 'none'
    },
    success: {
      background: '#28a745',
      color: 'white',
      border: 'none'
    },
    secondary: {
      background: '#6c757d',
      color: 'white',
      border: 'none'
    }
  };

  const baseStyle = {
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.3s ease',
    fontWeight: '500',
    fontSize: '1rem',
    ...variants[variant]
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={baseStyle}
      className={className}
    >
      {loading ? ' Carregando...' : (children || label)}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'danger', 'success', 'secondary']),
  className: PropTypes.string,
  children: PropTypes.node,
  loading: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default Button;