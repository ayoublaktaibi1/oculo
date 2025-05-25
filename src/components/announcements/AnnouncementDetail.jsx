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
  Snackbar,
  Stack,
  Breadcrumbs,
  Link,
  Tooltip
} from '@mui/material';
import {
  ArrowBackRounded,
  PhoneRounded,
  EmailRounded,
  WhatsApp,
  LocationOnRounded,
  AccessTimeRounded,
  VisibilityRounded,
  ShareRounded,
  FavoriteRounded,
  FavoriteBorderRounded,
  BusinessRounded,
  PersonRounded,
  ContentCopyRounded,
  SecurityRounded,
  VerifiedRounded
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Loading message="Chargement de l'annonce..." />
      </Container>
    );
  }

  if (error || !announcement) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error || 'Annonce non trouvée'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackRounded />}
          onClick={() => navigate('/announcements')}
        >
          Retour aux annonces
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Paper sx={{ p: 2, mb: 3, border: 1, borderColor: 'grey.200' }}>
          <Breadcrumbs>
            <Link component={RouterLink} to="/" underline="hover" color="inherit">
              Accueil
            </Link>
            <Link component={RouterLink} to="/announcements" underline="hover" color="inherit">
              Annonces
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 500 }}>
              {announcement.title}
            </Typography>
          </Breadcrumbs>
        </Paper>

        <Grid container spacing={4}>
          {/* Images et informations principales */}
          <Grid item xs={12} md={8}>
            {/* Galerie d'images */}
            <Paper sx={{ mb: 4, border: 1, borderColor: 'grey.200', overflow: 'hidden', borderRadius: 3 }}>
              <ImageGallery
                images={announcement.images || []}
                title={announcement.title}
              />
            </Paper>

            {/* Titre et informations de base */}
            <Paper sx={{ p: 4, mb: 4, border: 1, borderColor: 'grey.200' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.2 }}>
                    {announcement.title}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
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
                  </Stack>
                </Box>
                
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Ajouter aux favoris">
                    <IconButton onClick={toggleFavorite} color="primary" size="large">
                      {isFavorite ? <FavoriteRounded /> : <FavoriteBorderRounded />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Partager">
                    <IconButton onClick={handleShare} size="large">
                      <ShareRounded />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 3 }}>
                {formatPrice(announcement.price, announcement.currency)}
              </Typography>

              {/* Métadonnées */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnRounded fontSize="small" color="action" />
                    <Typography variant="body2">
                      {announcement.city || 'Non spécifié'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeRounded fontSize="small" color="action" />
                    <Typography variant="body2">
                      {formatRelativeDate(announcement.created_at)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <VisibilityRounded fontSize="small" color="action" />
                    <Typography variant="body2">
                      {Math.floor(Math.random() * 1000) + 100} vues
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <SecurityRounded fontSize="small" color="success.main" />
                    <Typography variant="body2" color="success.main">
                      Vérifié
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Description */}
            <Paper sx={{ p: 4, mb: 4, border: 1, borderColor: 'grey.200' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                {announcement.description}
              </Typography>
            </Paper>

            {/* Caractéristiques */}
            <Paper sx={{ p: 4, border: 1, borderColor: 'grey.200' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Caractéristiques
              </Typography>
              <Grid container spacing={3}>
                {announcement.brand && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Marque
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {announcement.brand}
                    </Typography>
                  </Grid>
                )}
                {announcement.model && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Modèle
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {announcement.model}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Quantité
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {announcement.quantity}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    État
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {CONDITION_LABELS[announcement.condition_type]}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Catégorie
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {announcement.category?.name}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Devise
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {announcement.currency}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Sidebar - Informations vendeur et contact */}
          <Grid item xs={12} md={4}>
            {/* Carte vendeur */}
            <Paper sx={{ p: 4, mb: 4, border: 1, borderColor: 'grey.200' }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 56,
                    height: 56
                  }}
                >
                  {announcement.user?.company_name ? (
                    <BusinessRounded />
                  ) : (
                    announcement.user?.first_name?.charAt(0)?.toUpperCase()
                  )}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {announcement.user?.company_name || 
                     `${announcement.user?.first_name} ${announcement.user?.last_name}`}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Fournisseur • {announcement.user?.city}
                    </Typography>
                    <VerifiedRounded sx={{ fontSize: 16, color: 'success.main' }} />
                  </Stack>
                </Box>
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* Options de contact */}
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Contacter le fournisseur
              </Typography>

              <Stack spacing={2}>
                {announcement.contact_phone && (
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<PhoneRounded />}
                    onClick={() => handleContactClick('phone')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Appeler
                  </Button>
                )}
                
                {announcement.contact_email && (
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<EmailRounded />}
                    onClick={() => handleContactClick('email')}
                    sx={{ justifyContent: 'flex-start' }}
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
                    sx={{ 
                      bgcolor: '#25D366', 
                      '&:hover': { bgcolor: '#1DA851' },
                      justifyContent: 'flex-start'
                    }}
                  >
                    WhatsApp
                  </Button>
                )}
              </Stack>

              {!isAuthenticated && (
                <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                  <Typography variant="body2">
                    Connectez-vous pour contacter ce fournisseur
                  </Typography>
                </Alert>
              )}
            </Paper>

            {/* Informations supplémentaires */}
            <Paper sx={{ p: 4, border: 1, borderColor: 'grey.200' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Informations
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Référence annonce
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" fontFamily="monospace" sx={{ fontWeight: 500 }}>
                      #{announcement.id.toString().padStart(6, '0')}
                    </Typography>
                    <Tooltip title="Copier la référence">
                      <IconButton 
                        size="small" 
                        onClick={() => copyToClipboard(`#${announcement.id.toString().padStart(6, '0')}`, 'Référence')}
                      >
                        <ContentCopyRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Publié le
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {new Date(announcement.created_at).toLocaleDateString('fr-FR')}
                  </Typography>
                </Box>
                
                {announcement.expires_at && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Expire le
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {new Date(announcement.expires_at).toLocaleDateString('fr-FR')}
                    </Typography>
                  </Box>
                )}

                {announcement.updated_at && announcement.updated_at !== announcement.created_at && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Mis à jour le
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {new Date(announcement.updated_at).toLocaleDateString('fr-FR')}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Dialog de confirmation de contact */}
        <Dialog
          open={contactDialogOpen}
          onClose={() => setContactDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ pb: 2 }}>
            Contacter le fournisseur
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              Vous allez contacter <strong>{announcement.user?.company_name || `${announcement.user?.first_name} ${announcement.user?.last_name}`}</strong> concernant l'annonce :
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
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
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setContactDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleConfirmContact}
              variant="contained"
              disabled={contactLoading}
              autoFocus
              startIcon={contactLoading ? <CircularProgress size={16} /> : null}
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
    </Box>
  );
};

export default AnnouncementDetail;