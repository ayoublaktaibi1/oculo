import api from './api';

export const contactService = {
  logContact: async (announcementId, contactType) => {
    console.log('Contact logged:', announcementId, contactType);
    return { success: true };
  },

  getAnnouncementStats: async (announcementId) => {
    console.log('Getting stats for:', announcementId);
    return { totalContacts: 0, contactsByType: [], recentContacts: [] };
  },

  getContactHistory: async (params = {}) => {
    console.log('Getting contact history:', params);
    return { contactHistory: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0 } };
  },

  getSupplierStats: async () => {
    console.log('Getting supplier stats');
    return { totalAnnouncements: 0, totalContacts: 0, contactsByType: [], popularAnnouncements: [] };
  }
};