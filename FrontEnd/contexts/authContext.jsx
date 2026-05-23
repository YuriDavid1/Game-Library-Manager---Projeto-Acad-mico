import React, { createContext, useContext, useState } from 'react';

/*
 * Context para gerenciar estado de autenticação
Refatoração do padrão de autenticação usado em:
- localStorage de usuário
- verificação de login em home.js, biblioteca.js, modelo.js
*/
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Inicializar com dados do localStorage se existirem
    try {
      const storedUser = localStorage.getItem('usuarioAtual');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Erro ao carregar usuário do localStorage:', error);
      return null;
    }
  });

  const isLoggedIn = !!user;

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('usuarioAtual', JSON.stringify(userData));
    localStorage.setItem('usuarioNome', userData.nome);
    localStorage.setItem('usuarioId', userData.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('usuarioAtual');
    localStorage.removeItem('usuarioNome');
    localStorage.removeItem('usuarioId');
  };

  const value = {
    user,
    isLoggedIn,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/*
Hook customizado para consumir AuthContext*/
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};

export default AuthContext;