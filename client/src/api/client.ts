import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5000') + '/api',
  withCredentials: true, // Need this to pass cookies for JWT auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token to the header if available
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
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    // Redirect to login on 401 Unauthorized
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    
    return Promise.reject(new Error(message));
  }
);

export default api;
