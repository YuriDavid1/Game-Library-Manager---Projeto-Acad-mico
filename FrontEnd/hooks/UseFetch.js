import { useState, useEffect, useCallback } from 'react';

/*
Hook customizado: useFetch
Abstrai a lógica de requisições HTTP/API calls
Baseado em padrões de async/await de home.js, biblioteca.js, modelo.js
 */
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    let isMounted = true; // Evitar memory leak

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      // so atualizar state se componente ainda está montado
      if (isMounted) {
        setData(result);
      }
    } catch (err) {
      if (isMounted) {
        setError(err.message || 'Erro ao carregar dados');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    // evitar memory leak
    return () => {
      isMounted = false;
    };
  }, [url, options]);

  useEffect(() => {
    const cleanup = fetchData();
    return cleanup;
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch
  };
};

export default useFetch;