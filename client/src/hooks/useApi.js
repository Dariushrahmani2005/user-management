import { useState, useEffect } from 'react'; // اضافه کردن useEffect

export const useApi = () => {
  const [loading, setLoading] = useState(false);

  const apiRequest = async (url, options = {}) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api${url}`, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطای سرور');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      
      if (error.message === 'دسترسی ممنوع' || error.message === 'توکن نامعتبر') {
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { apiRequest, loading };
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};