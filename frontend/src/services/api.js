import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/';
      } else if (error.response.status === 403) {
        // Forbidden - user doesn't have permission
        console.error('Access forbidden:', error.response.data);
      }
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
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(API_ENDPOINTS.users.uploadProfilePicture, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
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

export const progressService = {
  createMeasurement: (data) => api.post(API_ENDPOINTS.progress.create, data),
  getUserMeasurements: (userId, startDate, endDate) => 
    api.get(API_ENDPOINTS.progress.list(userId), { params: { startDate, endDate } }),
  getTrainingStats: (userId, startDate, endDate) => 
    api.get(API_ENDPOINTS.progress.stats(userId), { params: { startDate, endDate } })
};

export const trainerService = {
  getAll: () => api.get(API_ENDPOINTS.trainers.list),
  getById: (id) => api.get(API_ENDPOINTS.trainers.detail(id)),
  getReviews: (id) => api.get(API_ENDPOINTS.trainers.reviews(id)),
  addReview: (id, data) => api.post(API_ENDPOINTS.trainers.reviews(id), data),
  getMessages: (id) => api.get(API_ENDPOINTS.trainers.messages(id)),
  sendMessage: (id, data) => api.post(API_ENDPOINTS.trainers.messages(id), data),
  getTrainingPlans: (id) => api.get(API_ENDPOINTS.trainers.trainingPlans(id)),
  createTrainingPlan: (id, data) => api.post(API_ENDPOINTS.trainers.trainingPlans(id), data),
  acceptTrainingPlan: (id, planId) => api.post(API_ENDPOINTS.trainers.acceptTrainingPlan(id, planId))
};

export default api;