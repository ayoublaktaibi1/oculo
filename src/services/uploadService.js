import api from './api';

export const uploadService = {
  // Upload d'images pour une annonce
  uploadImages: async (announcementId, files) => {
    const formData = new FormData();
    
    // Ajouter chaque fichier au FormData
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    const response = await api.post(`/upload/announcements/${announcementId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${progress}%`);
      }
    });
    
    if (response.data.success) {
      return response.data.data.images;
    }
    
    throw new Error(response.data.message);
  },

  // Supprimer une image
  deleteImage: async (imageId) => {
    const response = await api.delete(`/upload/images/${imageId}`);
    
    if (response.data.success) {
      return response.data.message;
    }
    
    throw new Error(response.data.message);
  },

  // Définir une image comme primaire
  setPrimaryImage: async (imageId) => {
    const response = await api.patch(`/upload/images/${imageId}/primary`);
    
    if (response.data.success) {
      return response.data.message;
    }
    
    throw new Error(response.data.message);
  }
};