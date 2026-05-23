const API_URL = 'http://localhost:8080/api';

const api = {
  /**
   * GET request com token
   */
  get: async (endpoint) => {
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        timeout: 10000
      });

      // Se token expirou (401)
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login/login.html';
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na requisição GET:', error);
      throw error;
    }
  },

  /**
   * POST request com token
   */
  post: async (endpoint, data = {}) => {
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data),
        timeout: 10000
      });

      // Se token expirou (401)
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login/login.html';
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na requisição POST:', error);
      throw error;
    }
  },

  /**
   * PUT request com token
   */
  put: async (endpoint, data = {}) => {
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data),
        timeout: 10000
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login/login.html';
        throw new Error('Sessão expirada.');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na requisição PUT:', error);
      throw error;
    }
  },

  /**
   * DELETE request com token
   */
  delete: async (endpoint) => {
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        timeout: 10000
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login/login.html';
        throw new Error('Sessão expirada.');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.status === 204 ? null : await response.json();
    } catch (error) {
      console.error('Erro na requisição DELETE:', error);
      throw error;
    }
  }
};