const API_URL = 'http://localhost:8080';

const api = {
  /**
   * GET request com token
   */
  get: async (endpoint) => {
    const token = localStorage.getItem('authToken');
    
    try {
      console.log('GET:', `${API_URL}${endpoint}`);
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      console.log('Response Status:', response.status);

      // Se token expirou (401)
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '../login/login.html';
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('Dados recebidos:', data);
      return data;
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
      console.log('POST:', `${API_URL}${endpoint}`, data);
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data)
      });

      console.log('Response Status:', response.status);

      // Se token expirou (401)
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '../login/login.html';
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro do servidor:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Resposta:', responseData);
      return responseData;
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
      console.log('PUT:', `${API_URL}${endpoint}`, data);
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data)
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '../login/login.html';
        throw new Error('Sessão expirada.');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Resposta:', responseData);
      return responseData;
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
      console.log('DELETE:', `${API_URL}${endpoint}`);
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '../login/login.html';
        throw new Error('Sessão expirada.');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      if (response.status === 204) {
        console.log('Deletado com sucesso');
        return null;
      }

      const responseData = await response.json();
      console.log('Resposta:', responseData);
      return responseData;
    } catch (error) {
      console.error('Erro na requisição DELETE:', error);
      throw error;
    }
  }
};