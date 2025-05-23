import api from './api';

export const announcementService = {
  // Récupérer toutes les annonces
  getAnnouncements: async (params = {}) => {
    const response = await api.get('/announcements', { params });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },

  // Rechercher des annonces
  searchAnnouncements: async (searchParams = {}) => {
    const response = await api.get('/announcements/search', { params: searchParams });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },

  // Récupérer une annonce par ID
  getAnnouncementById: async (id) => {
    const response = await api.get(`/announcements/${id}`);
    
    if (response.data.success) {
      return response.data.data.announcement;
    }
    
    throw new Error(response.data.message);
  },

  // Récupérer les annonces de l'utilisateur
  getUserAnnouncements: async (params = {}) => {
    const response = await api.get('/announcements/user/my-announcements', { params });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },

  // Créer une annonce
  createAnnouncement: async (announcementData) => {
    const response = await api.post('/announcements', announcementData);
    
    if (response.data.success) {
      return response.data.data.announcement;
    }
    
    throw new Error(response.data.message);
  },

  // Mettre à jour une annonce
  updateAnnouncement: async (id, updateData) => {
    const response = await api.put(`/announcements/${id}`, updateData);
    
    if (response.data.success) {
      return response.data.data.announcement;
    }
    
    throw new Error(response.data.message);
  },

  // Supprimer une annonce
  deleteAnnouncement: async (id) => {
    const response = await api.delete(`/announcements/${id}`);
    
    if (response.data.success) {
      return response.data.message;
    }
    
    throw new Error(response.data.message);
  },

  // Marquer comme vendu
  markAsSold: async (id) => {
    const response = await api.patch(`/announcements/${id}/sold`);
    
    if (response.data.success) {
      return response.data.message;
    }
    
    throw new Error(response.data.message);
  }
};