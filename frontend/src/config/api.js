const API_CONFIG = {
    development: {
      baseUrl: 'http://localhost:8080/api',
    },
    production: {
      baseUrl: 'https://vase-produkcni-api.cz/api', // zde bude vaše produkční URL
    },
    test: {
      baseUrl: 'http://localhost:8080/api',
    }
  };
  
  const env = process.env.REACT_APP_ENV || 'development';
  export const API_BASE_URL = API_CONFIG[env].baseUrl;
  
  export const API_ENDPOINTS = {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
    },
    users: {
      profile: '/users/profile',
      updateProfile: '/users/profile',
      uploadProfilePicture: '/files/profile-picture',
    },
    trainings: {
      list: '/trainings',
      detail: (id) => `/trainings/${id}`,
      exercises: (id) => `/trainings/${id}/exercises`,
    },
    exercises: {
      list: '/exercises',
      detail: (id) => `/exercises/${id}`,
    },
    progress: {
      list: (userId) => `/progress/user/${userId}`,
      create: '/progress',
      stats: (userId) => `/progress/user/${userId}/training-stats`,
    }
  }