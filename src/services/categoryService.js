import api from './api';

export const categoryService = {
  // Récupérer toutes les catégories
  getCategories: async () => {
    const response = await api.get('/categories');
    
    if (response.data.success) {
      return response.data.data.categories;
    }
    
    throw new Error(response.data.message);
  },

  // Récupérer les catégories principales
  getMainCategories: async () => {
    const response = await api.get('/categories/main');
    
    if (response.data.success) {
      return response.data.data.categories;
    }
    
    throw new Error(response.data.message);
  },

  // Récupérer les sous-catégories
  getSubCategories: async (parentId) => {
    const response = await api.get(`/categories/${parentId}/subcategories`);
    
    if (response.data.success) {
      return response.data.data.subCategories;
    }
    
    throw new Error(response.data.message);
  },

  // Récupérer une catégorie par slug
  getCategoryBySlug: async (slug) => {
    const response = await api.get(`/categories/slug/${slug}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  }
};