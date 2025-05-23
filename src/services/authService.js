import api from './api';

export const authService = {
  // Inscription
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    
    if (response.data.success) {
      const { user, token } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    }
    
    throw new Error(response.data.message);
  },

  // Connexion
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.success) {
      const { user, token } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    }
    
    throw new Error(response.data.message);
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Récupérer le profil
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    
    if (response.data.success) {
      const user = response.data.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    
    throw new Error(response.data.message);
  },

  // Mettre à jour le profil
  updateProfile: async (updateData) => {
    const response = await api.put('/auth/profile', updateData);
    
    if (response.data.success) {
      const user = response.data.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    
    throw new Error(response.data.message);
  },

  // Changer le mot de passe
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    
    if (response.data.success) {
      return response.data.message;
    }
    
    throw new Error(response.data.message);
  },

  // Récupérer l'utilisateur depuis le localStorage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  // Récupérer le token depuis le localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }
};