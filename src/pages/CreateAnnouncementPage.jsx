import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  FormControlLabel,
  Switch,
  Autocomplete,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  TitleRounded,
  DescriptionRounded,
  CategoryRounded,
  AttachMoneyRounded,
  LocationOnRounded,
  ImageRounded,
  PublishRounded,
  ArrowBackRounded,
  ArrowForwardRounded,
  SaveRounded,
  PreviewRounded
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../hooks/useCategories';
import ImageUpload from '../components/upload/ImageUpload';
import { MOROCCAN_CITIES, CONDITION_LABELS } from '../utils/constants';
import { isValidPrice, getValidationMessage } from '../utils/validators';
import { announcementService } from '../services/announcementService';
import { uploadService } from '../services/uploadService';

const CreateAnnouncementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: categories, loading: categoriesLoading } = useCategories();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    brand: '',
    model: '',
    condition_type: 'new',
    price: '',
    currency: 'MAD',
    quantity: '1',
    city: user?.city || '',
    contact_phone: user?.phone || '',
    contact_email: user?.email || '',
    contact_whatsapp: '',
    is_featured: false,
    is_urgent: false
  });
  
  const [errors, setErrors] = useState({});

  const steps = [
    { label: 'Informations de base', icon: <TitleRounded /> },
    { label: 'Détails du produit', icon: <CategoryRounded /> },
    { label: 'Prix et localisation', icon: <AttachMoneyRounded /> },
    { label: 'Images', icon: <ImageRounded /> },
    { label: 'Contact et publication', icon: <PublishRounded /> }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0: // Informations de base
        if (!formData.title.trim()) {
          newErrors.title = 'Titre requis';
        } else if (formData.title.length < 5) {
          newErrors.title = 'Titre trop court (minimum 5 caractères)';
        } else if (formData.title.length > 255) {
          newErrors.title = 'Titre trop long (maximum 255 caractères)';
        }
        
        if (!formData.description.trim()) {
          newErrors.description = 'Description requise';
        } else if (formData.description.length < 20) {
          newErrors.description = 'Description trop courte (minimum 20 caractères)';
        } else if (formData.description.length > 5000) {
          newErrors.description = 'Description trop longue (maximum 5000 caractères)';
        }
        break;
        
      case 1: // Détails du produit
        if (!formData.category_id) {
          newErrors.category_id = 'Catégorie requise';
        }
        if (!formData.condition_type) {
          newErrors.condition_type = 'État requis';
        }
        break;
        
      case 2: // Prix et localisation
        if (!formData.price) {
          newErrors.price = 'Prix requis';
        } else if (!isValidPrice(formData.price)) {
          newErrors.price = 'Prix invalide (doit être un nombre positif)';
        } else if (parseFloat(formData.price) <= 0) {
          newErrors.price = 'Le prix doit être supérieur à 0';
        } else if (parseFloat(formData.price) > 999999) {
          newErrors.price = 'Prix trop élevé (maximum 999,999 MAD)';
        }
        
        if (!formData.quantity) {
          newErrors.quantity = 'Quantité requise';
        } else if (parseInt(formData.quantity) <= 0) {
          newErrors.quantity = 'La quantité doit être supérieure à 0';
        } else if (parseInt(formData.quantity) > 10000) {
          newErrors.quantity = 'Quantité trop élevée (maximum 10,000)';
        }
        
        if (!formData.city) {
          newErrors.city = 'Ville requise';
        }
        break;
        
      case 3: // Images (optionnelles mais on peut valider le format)
        if (selectedImages.length > 10) {
          newErrors.images = 'Maximum 10 images autorisées';
        }
        break;
        
      case 4: // Contact
        if (!formData.contact_email.trim()) {
          newErrors.contact_email = 'Email de contact requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
          newErrors.contact_email = 'Email invalide';
        }
        
        if (formData.contact_phone && !/^(\+212|0)[5-7][0-9]{8}$/.test(formData.contact_phone.replace(/\s/g, ''))) {
          newErrors.contact_phone = 'Numéro de téléphone marocain invalide';
        }
        
        if (formData.contact_whatsapp && !/^(\+212|0)[5-7][0-9]{8}$/.test(formData.contact_whatsapp.replace(/\s/g, ''))) {
          newErrors.contact_whatsapp = 'Numéro WhatsApp marocain invalide';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;
    
    try {
      setLoading(true);
      setError('');

      // Étape 1: Préparer les données de l'annonce
      console.log('Préparation des données...');
      const announcementData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category_id: parseInt(formData.category_id),
        brand: formData.brand.trim() || null,
        model: formData.model.trim() || null,
        condition_type: formData.condition_type,
        price: parseFloat(formData.price),
        currency: formData.currency,
        quantity: parseInt(formData.quantity),
        city: formData.city,
        contact_phone: formData.contact_phone.trim() || null,
        contact_email: formData.contact_email.trim(),
        contact_whatsapp: formData.contact_whatsapp.trim() || null,
        is_featured: formData.is_featured,
        is_urgent: formData.is_urgent,
        status: 'active'
      };

      console.log('Données à envoyer:', announcementData);

      // Étape 2: Créer l'annonce
      const createdAnnouncement = await announcementService.createAnnouncement(announcementData);
      console.log('Annonce créée:', createdAnnouncement);

      // Étape 3: Upload des images si présentes
      if (selectedImages.length > 0) {
        console.log('Upload des images...');
        try {
          await uploadService.uploadImages(createdAnnouncement.id, selectedImages);
          console.log('Images uploadées avec succès');
        } catch (uploadError) {
          console.warn('Erreur upload images:', uploadError);
          // Ne pas bloquer la création pour les images
        }
      }

      // Succès
      console.log('Annonce créée avec succès !');
      navigate('/dashboard', { 
        state: { 
          message: 'Annonce créée avec succès !',
          type: 'success' 
        }
      });

    } catch (error) {
      console.error('Erreur complète:', error);
      
      // Afficher des détails d'erreur plus précis
      let errorMessage = 'Erreur lors de la création de l\'annonce';
      
      if (error.data && error.data.errors) {
        // Erreurs de validation du backend
        const validationErrors = error.data.errors;
        if (Array.isArray(validationErrors)) {
          errorMessage = validationErrors.join(', ');
        } else if (typeof validationErrors === 'object') {
          errorMessage = Object.values(validationErrors).flat().join(', ');
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      setError('');
      
      const draftData = {
        title: formData.title.trim() || 'Brouillon sans titre',
        description: formData.description.trim() || 'Description à compléter',
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        brand: formData.brand.trim() || null,
        model: formData.model.trim() || null,
        condition_type: formData.condition_type || 'new',
        price: formData.price ? parseFloat(formData.price) : null,
        currency: formData.currency,
        quantity: formData.quantity ? parseInt(formData.quantity) : 1,
        city: formData.city || null,
        contact_phone: formData.contact_phone.trim() || null,
        contact_email: formData.contact_email.trim() || user?.email,
        contact_whatsapp: formData.contact_whatsapp.trim() || null,
        is_featured: formData.is_featured,
        is_urgent: formData.is_urgent,
        status: 'draft'
      };

      console.log('Sauvegarde brouillon:', draftData);

      const draftAnnouncement = await announcementService.createAnnouncement(draftData);
      
      // Upload des images si présentes
      if (selectedImages.length > 0) {
        try {
          await uploadService.uploadImages(draftAnnouncement.id, selectedImages);
        } catch (uploadError) {
          console.warn('Erreur upload images brouillon:', uploadError);
        }
      }

      navigate('/dashboard', { 
        state: { 
          message: 'Brouillon sauvegardé avec succès !',
          type: 'info' 
        }
      });
    } catch (error) {
      console.error('Erreur sauvegarde brouillon:', error);
      setError('Erreur lors de la sauvegarde du brouillon');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // Créer une fenêtre de prévisualisation ou une modal
    const previewData = {
      ...formData,
      images: selectedImages.map(file => ({ 
        url: URL.createObjectURL(file), 
        name: file.name 
      }))
    };
    
    // Pour l'instant, on log les données. Plus tard on peut ouvrir une modal
    console.log('Prévisualisation:', previewData);
    
    // Optionnel: Ouvrir dans un nouvel onglet avec les données
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head><title>Prévisualisation - ${formData.title}</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>${formData.title || 'Titre non défini'}</h1>
            <p><strong>Prix:</strong> ${formData.price ? formData.price + ' MAD' : 'Non défini'}</p>
            <p><strong>Description:</strong></p>
            <div style="white-space: pre-wrap;">${formData.description || 'Aucune description'}</div>
            <p><strong>Marque:</strong> ${formData.brand || 'Non spécifiée'}</p>
            <p><strong>Modèle:</strong> ${formData.model || 'Non spécifié'}</p>
            <p><strong>Ville:</strong> ${formData.city || 'Non spécifiée'}</p>
            <p><strong>Images:</strong> ${selectedImages.length} sélectionnée(s)</p>
          </body>
        </html>
      `);
    }
  };

  // Créer une liste plate des catégories
  const getAllCategories = () => {
    if (!categories) return [];
    const allCategories = [];
    categories.forEach(category => {
      allCategories.push(category);
      if (category.children) {
        category.children.forEach(child => {
          allCategories.push({
            ...child,
            displayName: `${category.name} > ${child.name}`
          });
        });
      }
    });
    return allCategories;
  };

  const allCategories = getAllCategories();
  const selectedCategory = allCategories.find(cat => cat.id.toString() === formData.category_id);

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={4}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Informations de base
            </Typography>
            
            <TextField
              fullWidth
              label="Titre de l'annonce"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title || 'Soyez précis et descriptif (ex: "Montures Ray-Ban neuves collection 2024")'}
              placeholder="Ex: Montures optiques Ray-Ban RB5154 neuves"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleRounded color="action" />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <TextField
              fullWidth
              label="Description détaillée"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description || 'Décrivez votre produit en détail : caractéristiques, état, avantages...'}
              placeholder="Décrivez votre produit : matériaux, dimensions, couleurs, état, garantie..."
              multiline
              rows={6}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                    <DescriptionRounded color="action" />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={4}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Détails du produit
            </Typography>
            
            {!categoriesLoading && (
              <Autocomplete
                fullWidth
                options={allCategories}
                getOptionLabel={(option) => option.displayName || option.name}
                value={selectedCategory || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'category_id',
                      value: newValue ? newValue.id.toString() : ''
                    }
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Catégorie"
                    placeholder="Sélectionner une catégorie"
                    error={!!errors.category_id}
                    helperText={errors.category_id}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryRounded color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <TextField
                fullWidth
                label="Marque"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Ex: Ray-Ban, Oakley, Essilor..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <TextField
                fullWidth
                label="Modèle"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Ex: RB5154, Aviator..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>

            <FormControl fullWidth error={!!errors.condition_type}>
              <InputLabel>État du produit</InputLabel>
              <Select
                name="condition_type"
                value={formData.condition_type}
                onChange={handleChange}
                label="État du produit"
                sx={{ borderRadius: 2 }}
              >
                {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              {errors.condition_type && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.condition_type}
                </Typography>
              )}
            </FormControl>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={4}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Prix et localisation
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' }, gap: 3 }}>
              <TextField
                fullWidth
                label="Prix"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyRounded color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">MAD</InputAdornment>
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <TextField
                fullWidth
                label="Quantité"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                error={!!errors.quantity}
                helperText={errors.quantity}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>

            <Autocomplete
              fullWidth
              options={MOROCCAN_CITIES}
              value={formData.city || null}
              onChange={(event, newValue) => {
                handleChange({
                  target: {
                    name: 'city',
                    value: newValue || ''
                  }
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ville"
                  placeholder="Sélectionner une ville"
                  error={!!errors.city}
                  helperText={errors.city}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnRounded color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              )}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <Divider />

            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Options de mise en avant
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_featured}
                      onChange={handleChange}
                      name="is_featured"
                      color="warning"
                    />
                  }
                  label="Mettre en avant (À la une)"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_urgent}
                      onChange={handleChange}
                      name="is_urgent"
                      color="error"
                    />
                  }
                  label="Marquer comme urgent"
                />
              </Stack>
            </Box>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={4}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Images du produit
            </Typography>
            
            {errors.images && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {errors.images}
              </Alert>
            )}
            
            <ImageUpload
              onImagesSelected={setSelectedImages}
              selectedImages={selectedImages}
              maxImages={10}
            />
            
            <Box sx={{ bgcolor: 'info.50', p: 2, borderRadius: 2 }}>
              <Typography variant="body2" color="info.main">
                💡 <strong>Conseil :</strong> Ajoutez des images de qualité pour attirer plus d'acheteurs. 
                La première image sera utilisée comme image principale.
              </Typography>
            </Box>
          </Stack>
        );

      case 4:
        return (
          <Stack spacing={4}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Informations de contact
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <TextField
                fullWidth
                label="Email de contact"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleChange}
                error={!!errors.contact_email}
                helperText={errors.contact_email}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <TextField
                fullWidth
                label="Téléphone de contact"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                error={!!errors.contact_phone}
                helperText={errors.contact_phone}
                placeholder="+212 6XX XX XX XX"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>

            <TextField
              fullWidth
              label="WhatsApp (optionnel)"
              name="contact_whatsapp"
              value={formData.contact_whatsapp}
              onChange={handleChange}
              error={!!errors.contact_whatsapp}
              helperText={errors.contact_whatsapp}
              placeholder="+212 6XX XX XX XX"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <Box sx={{ bgcolor: 'info.50', p: 3, borderRadius: 2, border: 1, borderColor: 'info.200' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'info.main' }}>
                📋 Récapitulatif de votre annonce
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Titre:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.title || 'Non défini'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Prix:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formData.price ? `${formData.price} MAD` : 'Non défini'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Catégorie:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedCategory?.displayName || selectedCategory?.name || 'Non définie'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Ville:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.city || 'Non définie'}</Typography>
                </Box>
                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                  <Typography variant="body2" color="text.secondary">Images:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} sélectionnée{selectedImages.length > 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* En-tête */}
        <Paper sx={{ p: 4, mb: 4, border: 1, borderColor: 'grey.200' }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackRounded />}
              onClick={() => navigate('/dashboard')}
              size="small"
            >
              Retour
            </Button>
          </Stack>
          
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Créer une nouvelle annonce
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Présentez votre produit optique aux professionnels de votre région
          </Typography>
        </Paper>

        {/* Messages d'erreur */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Stepper */}
        <Paper sx={{ p: 4, mb: 4, border: 1, borderColor: 'grey.200' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={({ active, completed }) => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: completed ? 'success.main' : active ? 'primary.main' : 'grey.300',
                        color: 'white',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      {step.icon}
                    </Box>
                  )}
                >
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: activeStep === index ? 600 : 400 }}>
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Contenu de l'étape */}
        <Paper sx={{ p: 4, mb: 4, border: 1, borderColor: 'grey.200' }}>
          {renderStepContent()}
        </Paper>

        {/* Navigation */}
        <Paper sx={{ p: 3, border: 1, borderColor: 'grey.200' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBackRounded />}
            >
              Précédent
            </Button>

            <Typography variant="body2" color="text.secondary">
              Étape {activeStep + 1} sur {steps.length}
            </Typography>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <PublishRounded />}
                sx={{ minWidth: 140 }}
              >
                {loading ? 'Publication...' : 'Publier'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardRounded />}
              >
                Suivant
              </Button>
            )}
          </Stack>
        </Paper>

        {/* Actions supplémentaires */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<SaveRounded />}
            onClick={handleSaveDraft}
            disabled={loading}
          >
            Sauvegarder en brouillon
          </Button>
          <Button
            variant="outlined"
            startIcon={<PreviewRounded />}
            onClick={handlePreview}
            disabled={!formData.title && !formData.description}
          >
            Prévisualiser
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default CreateAnnouncementPage;