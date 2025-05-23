// URLs et endpoints
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Rôles utilisateur
export const USER_ROLES = {
  ADMIN: 'admin',
  SUPPLIER: 'supplier',
  OPTICIAN: 'optician'
};

// Statuts d'annonce
export const ANNOUNCEMENT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  SOLD: 'sold',
  EXPIRED: 'expired',
  SUSPENDED: 'suspended'
};

// Types de condition
export const CONDITION_TYPES = {
  NEW: 'new',
  USED: 'used',
  REFURBISHED: 'refurbished'
};

// Labels en français
export const STATUS_LABELS = {
  [ANNOUNCEMENT_STATUS.DRAFT]: 'Brouillon',
  [ANNOUNCEMENT_STATUS.ACTIVE]: 'Active',
  [ANNOUNCEMENT_STATUS.SOLD]: 'Vendue',
  [ANNOUNCEMENT_STATUS.EXPIRED]: 'Expirée',
  [ANNOUNCEMENT_STATUS.SUSPENDED]: 'Suspendue'
};

export const CONDITION_LABELS = {
  [CONDITION_TYPES.NEW]: 'Neuf',
  [CONDITION_TYPES.USED]: 'Occasion',
  [CONDITION_TYPES.REFURBISHED]: 'Reconditionné'
};

export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrateur',
  [USER_ROLES.SUPPLIER]: 'Fournisseur',
  [USER_ROLES.OPTICIAN]: 'Opticien'
};

// Villes principales du Maroc
export const MOROCCAN_CITIES = [
  'Casablanca',
  'Rabat',
  'Fès',
  'Marrakech',
  'Agadir',
  'Tangier',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
  'Safi',
  'Mohammedia',
  'El Jadida',
  'Beni Mellal',
  'Nador'
];

// Limites et contraintes
export const LIMITS = {
  MAX_IMAGES_PER_ANNOUNCEMENT: 10,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ANNOUNCEMENTS_PER_PAGE: 20,
  MAX_TITLE_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 5000
};

// Messages d'erreur communs
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  UNAUTHORIZED: 'Vous devez être connecté pour accéder à cette page.',
  FORBIDDEN: 'Vous n\'avez pas les permissions nécessaires.',
  NOT_FOUND: 'Ressource non trouvée.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  VALIDATION_ERROR: 'Données invalides. Vérifiez les champs.',
  UPLOAD_ERROR: 'Erreur lors de l\'upload. Vérifiez le format et la taille du fichier.'
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  ANNOUNCEMENT_CREATED: 'Annonce créée avec succès',
  ANNOUNCEMENT_UPDATED: 'Annonce mise à jour avec succès',
  ANNOUNCEMENT_DELETED: 'Annonce supprimée avec succès',
  PROFILE_UPDATED: 'Profil mis à jour avec succès',
  PASSWORD_CHANGED: 'Mot de passe changé avec succès',
  IMAGES_UPLOADED: 'Images uploadées avec succès'
};