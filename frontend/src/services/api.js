import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pro přidání tokenu do každého požadavku
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token z localStorage:', token ? 'existuje' : 'neexistuje');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Přidávám token do hlavičky:', config.headers.Authorization);
  }
  return config;
});

// Interceptor pro zpracování chyb
api.interceptors.response.use(
  (response) => {
    console.log('Úspěšná odpověď:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('Chyba v odpovědi:', error.config.url, error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - odstraňuji token a přesměrovávám na login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post(API_ENDPOINTS.auth.login, credentials),
  register: (userData) => api.post(API_ENDPOINTS.auth.register, userData),
};

export const userService = {
  getProfile: () => api.get(API_ENDPOINTS.users.profile),
  updateProfile: (data) => api.put(API_ENDPOINTS.users.updateProfile, data),
};

export const trainingService = {
  getAll: () => api.get(API_ENDPOINTS.trainings.list),
  getById: (id) => api.get(API_ENDPOINTS.trainings.detail(id)),
  create: (data) => api.post(API_ENDPOINTS.trainings.list, data),
  update: (id, data) => api.put(API_ENDPOINTS.trainings.detail(id), data),
  delete: (id) => api.delete(API_ENDPOINTS.trainings.detail(id)),
  getExercises: (id) => api.get(API_ENDPOINTS.trainings.exercises(id)),
  addExercise: (trainingId, data) => api.post(API_ENDPOINTS.trainings.exercises(trainingId), data),
};

export const exerciseService = {
  getAll: () => api.get(API_ENDPOINTS.exercises.list),
  getById: (id) => api.get(API_ENDPOINTS.exercises.detail(id)),
};

export default api;