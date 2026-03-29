import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Maps to the API server running on port 5001
  withCredentials: true, // Need this to pass cookies for JWT auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors globally
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
