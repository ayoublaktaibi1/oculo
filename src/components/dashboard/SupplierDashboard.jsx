import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Chip,
  Alert,
  Stack,
  Paper,
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  AddRounded,
  TrendingUpRounded,
  VisibilityRounded,
  EditRounded,
  DeleteRounded,
  MoreVertRounded,
  AssessmentRounded,
  InventoryRounded,
  BusinessRounded
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { announcementService } from '../../services/announcementService';
import StatsCard from './StatsCard';
import Loading from '../common/Loading';
import { formatPrice, formatRelativeDate } from '../../utils/formatters';
import { STATUS_LABELS, ANNOUNCEMENT_STATUS } from '../../utils/constants';

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les annonces de l'utilisateur
      const announcementsData = await announcementService.getUserAnnouncements();
      setAnnouncements(announcementsData.announcements);
      
      // Calculer les statistiques
      const totalAnnouncements = announcementsData.announcements.length;
      const activeAnnouncements = announcementsData.announcements.filter(
        a => a.status === ANNOUNCEMENT_STATUS.ACTIVE
      ).length;
      const soldAnnouncements = announcementsData.announcements.filter(
        a => a.status === ANNOUNCEMENT_STATUS.SOLD
      ).length;
      const totalValue = announcementsData.announcements
        .filter(a => a.status === ANNOUNCEMENT_STATUS.ACTIVE)
        .reduce((sum, a) => sum + parseFloat(a.price), 0);

      setStats({
        totalAnnouncements,
        activeAnnouncements,
        soldAnnouncements,
        totalValue
      });

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      setError('Erreur lors du chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, announcement) => {
    setAnchorEl(event.currentTarget);
    setSelectedAnnouncement(announcement);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAnnouncement(null);
  };

  const handleEditAnnouncement = (id) => {
    navigate(`/announcements/${id}/edit`);
    handleMenuClose();
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await announcementService.deleteAnnouncement(id);
        await fetchDashboardData(); // Recharger les données
        handleMenuClose();
      } catch (error) {
        console.error('Erreur suppression:', error);
        setError('Erreur lors de la suppression de l\'annonce');
      }
    }
  };

  const handleViewAnnouncement = (id) => {
    navigate(`/announcements/${id}`);
    handleMenuClose();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Loading message="Chargement de votre tableau de bord..." />
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* En-tête avec avatar et infos utilisateur */}
        <Paper sx={{ p: 4, mb: 4, border: 1, borderColor: 'grey.200' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'center', md: 'flex-start' }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 80,
                height: 80,
                fontSize: '2rem',
                fontWeight: 700
              }}
            >
              {user?.company_name ? (
                <BusinessRounded sx={{ fontSize: 40 }} />
              ) : (
                user?.first_name?.charAt(0)?.toUpperCase()
              )}
            </Avatar>
            
            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, flexGrow: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {user?.company_name || `${user?.first_name} ${user?.last_name}`}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Tableau de bord fournisseur
              </Typography>
              <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                <Chip 
                  label="Fournisseur" 
                  color="primary" 
                  variant="outlined"
                  icon={<BusinessRounded />}
                />
                {user?.city && (
                  <Chip 
                    label={user.city} 
                    variant="outlined"
                  />
                )}
              </Stack>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<AddRounded />}
              onClick={() => navigate('/announcements/create')}
              sx={{ px: 3 }}
            >
              Nouvelle annonce
            </Button>
          </Stack>
        </Paper>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }} 
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Statistiques */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Total annonces"
                value={stats.totalAnnouncements}
                icon={<AssessmentRounded />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Annonces actives"
                value={stats.activeAnnouncements}
                icon={<VisibilityRounded />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Annonces vendues"
                value={stats.soldAnnouncements}
                icon={<TrendingUpRounded />}
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Valeur totale"
                value={formatPrice(stats.totalValue)}
                icon={<TrendingUpRounded />}
                color="secondary"
              />
            </Grid>
          </Grid>
        )}

        {/* Actions rapides */}
        <Paper sx={{ p: 3, mb: 4, border: 1, borderColor: 'grey.200' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Actions rapides
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddRounded />}
              onClick={() => navigate('/announcements/create')}
            >
              Nouvelle annonce
            </Button>
            <Button
              variant="outlined"
              startIcon={<AssessmentRounded />}
              onClick={() => navigate('/stats')}
            >
              Voir les statistiques
            </Button>
            <Button
              variant="outlined"
              startIcon={<InventoryRounded />}
              onClick={() => navigate('/announcements')}
            >
              Parcourir les annonces
            </Button>
          </Stack>
        </Paper>

        {/* Liste des annonces */}
        <Paper sx={{ border: 1, borderColor: 'grey.200' }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'grey.200' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Mes annonces ({announcements.length})
            </Typography>
          </Box>

          {announcements.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <InventoryRounded sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Aucune annonce créée
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                Commencez par créer votre première annonce pour présenter vos produits aux opticiens.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddRounded />}
                onClick={() => navigate('/announcements/create')}
              >
                Créer ma première annonce
              </Button>
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {announcements.map((announcement) => (
                  <Grid item xs={12} sm={6} md={4} key={announcement.id}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        border: 1,
                        borderColor: 'grey.200',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: 2
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600,
                              flexGrow: 1, 
                              pr: 1,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {announcement.title}
                          </Typography>
                          <IconButton 
                            size="small"
                            onClick={(e) => handleMenuOpen(e, announcement)}
                          >
                            <MoreVertRounded />
                          </IconButton>
                        </Box>

                        <Stack spacing={2}>
                          <Chip
                            label={STATUS_LABELS[announcement.status]}
                            size="small"
                            color={
                              announcement.status === ANNOUNCEMENT_STATUS.ACTIVE ? 'success' :
                              announcement.status === ANNOUNCEMENT_STATUS.SOLD ? 'warning' :
                              'default'
                            }
                            sx={{ alignSelf: 'flex-start' }}
                          />

                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              minHeight: '2.4em'
                            }}
                          >
                            {announcement.description}
                          </Typography>

                          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                            {formatPrice(announcement.price, announcement.currency)}
                          </Typography>

                          <Divider />

                          <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Catégorie:</strong> {announcement.category?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Publié:</strong> {formatRelativeDate(announcement.created_at)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>

        {/* Menu contextuel */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { minWidth: 160 }
          }}
        >
          <MenuItem onClick={() => handleViewAnnouncement(selectedAnnouncement?.id)}>
            <VisibilityRounded sx={{ mr: 2, fontSize: 20 }} />
            Voir
          </MenuItem>
          <MenuItem onClick={() => handleEditAnnouncement(selectedAnnouncement?.id)}>
            <EditRounded sx={{ mr: 2, fontSize: 20 }} />
            Modifier
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={() => handleDeleteAnnouncement(selectedAnnouncement?.id)}
            sx={{ color: 'error.main' }}
          >
            <DeleteRounded sx={{ mr: 2, fontSize: 20 }} />
            Supprimer
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  );
};

export default SupplierDashboard;