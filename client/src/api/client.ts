import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5001') + '/api',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('api-monitor-user');
    if (user) {
      try {
        const u = JSON.parse(user);
        if (u.token) {
          config.headers.Authorization = `Bearer ${u.token}`;
        }
      } catch (e) {}
    }
    return config;
  }
);
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error.response?.data;
    // If there's a list of validation errors, join them for display
    const details = Array.isArray(data?.errors) && data.errors.length > 0
      ? data.errors.join('. ')
      : null;
    const message = details || data?.message || error.message || 'An error occurred';
    
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    
    return Promise.reject(new Error(message));
  }
);

export default api;
