import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Snackbar
} from '@mui/material';
import {
  ArrowBack,
  Phone,
  Email,
  WhatsApp,
  LocationOn,
  AccessTime,
  Visibility,
  Share,
  Favorite,
  FavoriteBorder,
  Business,
  Person,
  ContentCopy
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { announcementService } from '../../services/announcementService';
import { contactService } from '../../services/contactService';
import ImageGallery from '../upload/ImageGallery';
import Loading from '../common/Loading';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, formatRelativeDate, formatPhoneNumber } from '../../utils/formatters';
import { CONDITION_LABELS, USER_ROLES } from '../../utils/constants';

const AnnouncementDetail = ({ announcementId }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedContactType, setSelectedContactType] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchAnnouncement();
  }, [announcementId]);

  const fetchAnnouncement = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await announcementService.getAnnouncementById(announcementId);
      setAnnouncement(data);
      
    } catch (error) {
      console.error('Erreur chargement annonce:', error);
      setError('Annonce non trouvée ou inaccessible');
    } finally {
      setLoading(false);
    }
  };

  const handleContactClick = (contactType) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user.role !== USER_ROLES.OPTICIAN) {
      setError('Seuls les opticiens peuvent contacter les fournisseurs');
      return;
    }
    
    setSelectedContactType(contactType);
    setContactDialogOpen(true);
  };

  const handleConfirmContact = async () => {
    try {
      setContactLoading(true);
      
      // Enregistrer le contact dans les logs
      if (isAuthenticated && user.role === USER_ROLES.OPTICIAN) {
        await contactService.logContact(announcementId, selectedContactType);
      }
      
      setContactDialogOpen(false);
      
      // Rediriger vers le contact approprié
      switch (selectedContactType) {
        case 'phone':
          window.location.href = `tel:${announcement.contact_phone}`;
          break;
        case 'email':
          const subject = encodeURIComponent(`Concernant: ${announcement.title}`);
          const body = encodeURIComponent(`Bonjour,\n\nJe suis intéressé(e) par votre annonce "${announcement.title}".\n\nCordialement`);
          window.location.href = `mailto:${announcement.contact_email}?subject=${subject}&body=${body}`;
          break;
        case 'whatsapp':
          const whatsappNumber = announcement.contact_whatsapp.replace(/\D/g, '');
          const message = encodeURIComponent(`Bonjour, je suis intéressé(e) par votre annonce "${announcement.title}" sur OpticConnect.`);
          window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Erreur contact:', error);
      setError('Erreur lors de l\'enregistrement du contact');
    } finally {
      setContactLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: announcement.title,
      text: `${announcement.title} - ${formatPrice(announcement.price)} sur OpticConnect`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copier l'URL dans le presse-papiers
      try {
        await navigator.clipboard.writeText(window.location.href);
        setSnackbarMessage('Lien copié dans le presse-papiers');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Erreur copie lien:', error);
        setSnackbarMessage('Erreur lors de la copie du lien');
        setSnackbarOpen(true);
      }
    }
  };

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Toggle favoris (logique à implémenter côté backend)
    setIsFavorite(!isFavorite);
    setSnackbarMessage(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
    setSnackbarOpen(true);
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbarMessage(`${label} copié`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erreur copie:', error);
    }
  };

  if (loading) {
    return <Loading message="Chargement de l'annonce..." />;
  }

  if (error || !announcement) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Annonce non trouvée'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/announcements')}
        >
          Retour aux annonces
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Navigation */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/announcements')}
          sx={{ mb: 2 }}
        >
          Retour aux annonces
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Images et informations principales */}
        <Grid item xs={12} md={8}>
          {/* Galerie d'images */}
          <Box sx={{ mb: 3 }}>
            <ImageGallery
              images={announcement.images || []}
              title={announcement.title}
            />
          </Box>

          {/* Titre et informations de base */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h4" component="h1" sx={{ flexGrow: 1, pr: 2 }}>
                {announcement.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={toggleFavorite} color="primary">
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                <IconButton onClick={handleShare}>
                  <Share />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {announcement.is_featured && (
                <Chip label="À la une" color="warning" size="small" />
              )}
              {announcement.is_urgent && (
                <Chip label="Urgent" color="error" size="small" />
              )}
              <Chip
                label={CONDITION_LABELS[announcement.condition_type]}
                variant="outlined"
                size="small"
              />
            </Box>

            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
              {formatPrice(announcement.price, announcement.currency)}
            </Typography>

            {/* Métadonnées */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" color="action" />
                <Typography variant="body2">
                  {announcement.city || 'Non spécifié'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="body2">
                  {formatRelativeDate(announcement.created_at)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Visibility fontSize="small" color="action" />
                <Typography variant="body2">
                  {Math.floor(Math.random() * 1000) + 100} vues
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Description */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {announcement.description}
              </Typography>
            </CardContent>
          </Card>

          {/* Caractéristiques */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Caractéristiques
              </Typography>
              <Grid container spacing={2}>
                {announcement.brand && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Marque
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {announcement.brand}
                    </Typography>
                  </Grid>
                )}
                {announcement.model && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Modèle
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {announcement.model}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Quantité
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {announcement.quantity}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    État
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {CONDITION_LABELS[announcement.condition_type]}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Catégorie
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {announcement.category?.name}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Devise
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {announcement.currency}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar - Informations vendeur et contact */}
        <Grid item xs={12} md={4}>
          {/* Carte vendeur */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  mr: 2,
                  width: 48,
                  height: 48
                }}
              >
                {announcement.user?.company_name ? (
                  <Business />
                ) : (
                  announcement.user?.first_name?.charAt(0)?.toUpperCase()
                )}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {announcement.user?.company_name || 
                   `${announcement.user?.first_name} ${announcement.user?.last_name}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fournisseur • {announcement.user?.city}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Options de contact */}
            <Typography variant="subtitle1" gutterBottom>
              Contacter le fournisseur
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {announcement.contact_phone && (
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Phone />}
                  onClick={() => handleContactClick('phone')}
                >
                  Appeler
                </Button>
              )}
              
              {announcement.contact_email && (
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Email />}
                  onClick={() => handleContactClick('email')}
                >
                  Envoyer un email
                </Button>
              )}
              
              {announcement.contact_whatsapp && (
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<WhatsApp />}
                  onClick={() => handleContactClick('whatsapp')}
                  sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#1DA851' } }}
                >
                  WhatsApp
                </Button>
              )}
            </Box>

            {!isAuthenticated && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Connectez-vous pour contacter ce fournisseur
                </Typography>
              </Alert>
            )}
          </Paper>

          {/* Informations supplémentaires */}
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informations
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Référence annonce
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontFamily="monospace">
                    #{announcement.id.toString().padStart(6, '0')}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => copyToClipboard(`#${announcement.id.toString().padStart(6, '0')}`, 'Référence')}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Publié le
                </Typography>
                <Typography variant="body2">
                  {new Date(announcement.created_at).toLocaleDateString('fr-FR')}
                </Typography>
              </Box>
              
              {announcement.expires_at && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Expire le
                  </Typography>
                  <Typography variant="body2">
                    {new Date(announcement.expires_at).toLocaleDateString('fr-FR')}
                  </Typography>
                </Box>
              )}

              {announcement.updated_at && announcement.updated_at !== announcement.created_at && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Mis à jour le
                  </Typography>
                  <Typography variant="body2">
                    {new Date(announcement.updated_at).toLocaleDateString('fr-FR')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog de confirmation de contact */}
      <Dialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Contacter le fournisseur
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Vous allez contacter <strong>{announcement.user?.company_name || `${announcement.user?.first_name} ${announcement.user?.last_name}`}</strong> concernant l'annonce :
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" paragraph>
            {announcement.title}
          </Typography>
          
          {selectedContactType === 'phone' && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Numéro : {formatPhoneNumber(announcement.contact_phone)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                En cliquant sur "Confirmer", votre application de téléphone s'ouvrira automatiquement.
              </Typography>
            </Box>
          )}
          {selectedContactType === 'email' && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email : {announcement.contact_email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                En cliquant sur "Confirmer", votre application de messagerie s'ouvrira avec un email pré-rempli.
              </Typography>
            </Box>
          )}
          {selectedContactType === 'whatsapp' && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                WhatsApp : {formatPhoneNumber(announcement.contact_whatsapp)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                En cliquant sur "Confirmer", WhatsApp s'ouvrira dans un nouvel onglet avec un message pré-rempli.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialogOpen(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleConfirmContact}
            variant="contained"
            disabled={contactLoading}
            autoFocus
          >
            {contactLoading ? 'Chargement...' : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default AnnouncementDetail;