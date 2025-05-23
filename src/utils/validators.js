// Validation email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation téléphone marocain
export const isValidMoroccanPhone = (phone) => {
  const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
  return phoneRegex.test(phone);
};

// Validation mot de passe
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Validation prix
export const isValidPrice = (price) => {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice > 0 && numPrice <= 999999.99;
};

// Validation quantité
export const isValidQuantity = (quantity) => {
  const numQuantity = parseInt(quantity);
  return !isNaN(numQuantity) && numQuantity > 0;
};

// Validation des fichiers image
export const isValidImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return (
    file &&
    allowedTypes.includes(file.type) &&
    file.size <= maxSize
  );
};

// Messages d'erreur de validation
export const getValidationMessage = (field, value) => {
  switch (field) {
    case 'email':
      if (!value) return 'Email requis';
      if (!isValidEmail(value)) return 'Email invalide';
      break;
    
    case 'password':
      if (!value) return 'Mot de passe requis';
      if (!isValidPassword(value)) return 'Mot de passe trop court (min 6 caractères)';
      break;
    
    case 'phone':
      if (value && !isValidMoroccanPhone(value)) return 'Numéro de téléphone marocain invalide';
      break;
    
    case 'price':
      if (!value) return 'Prix requis';
      if (!isValidPrice(value)) return 'Prix invalide (max 999,999.99 MAD)';
      break;
    
    case 'quantity':
      if (!value) return 'Quantité requise';
      if (!isValidQuantity(value)) return 'Quantité invalide';
      break;
    
    case 'title':
      if (!value) return 'Titre requis';
      if (value.length < 5) return 'Titre trop court (min 5 caractères)';
      if (value.length > 255) return 'Titre trop long (max 255 caractères)';
      break;
    
    case 'description':
      if (!value) return 'Description requise';
      if (value.length < 20) return 'Description trop courte (min 20 caractères)';
      if (value.length > 5000) return 'Description trop longue (max 5000 caractères)';
      break;
    
    default:
      return '';
  }
  
  return '';
};