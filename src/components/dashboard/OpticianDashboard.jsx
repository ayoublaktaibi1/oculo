import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  InputAdornment,
  Alert,
  Stack,
  Paper,
  Avatar,
  Chip,
  Divider
} from '@mui/material';
import {
  SearchRounded,
  HistoryRounded,
  FavoriteRounded,
  TrendingUpRounded,
  PersonRounded,
  BusinessRounded,
  InventoryRounded,
  ExploreRounded
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { announcementService } from '../../services/announcementService';
import AnnouncementCard from '../announcements/AnnouncementCard';
import StatsCard from './StatsCard';
import Loading from '../common/Loading';

const OpticianDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les annonces récentes
      const data = await announcementService.getAnnouncements({ limit: 6 });
      setRecentAnnouncements(data.announcements);

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      setError('Erreur lors du chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/announcements?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/announcements');
    }
  };

  const handleContactSupplier = (announcementId, contactType) => {
    // Logique de contact à implémenter
    console.log('Contact supplier:', announcementId, contactType);
  };

  const quickSearchItems = [
    { label: 'Montures', query: 'montures' },
    { label: 'Verres', query: 'verres' },
    { label: 'Machines', query: 'machines' },
    { label: 'Accessoires', query: 'accessoires' }
  ];

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
                Bienvenue, {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Tableau de bord opticien
              </Typography>
              <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                <Chip 
                  label="Opticien" 
                  color="secondary" 
                  variant="outlined"
                  icon={<PersonRounded />}
                />
                {user?.company_name && (
                  <Chip 
                    label={user.company_name} 
                    variant="outlined"
                  />
                )}
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
              startIcon={<SearchRounded />}
              onClick={() => navigate('/announcements')}
              sx={{ px: 3 }}
            >
              Rechercher des produits
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

        {/* Statistiques rapides */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Recherches récentes"
              value="12"
              icon={<SearchRounded />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Contacts effectués"
              value="8"
              icon={<HistoryRounded />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Favoris"
              value="5"
              icon={<FavoriteRounded />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Nouvelles annonces"
              value={recentAnnouncements.length}
              icon={<TrendingUpRounded />}
              color="secondary"
            />
          </Grid>
        </Grid>

        {/* Barre de recherche rapide */}
        <Paper sx={{ p: 4, mb: 4, border: 1, borderColor: 'grey.200' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Recherche rapide
          </Typography>
          
          <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Rechercher des produits optiques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ ml: 1, borderRadius: 2 }}
                  >
                    Rechercher
                  </Button>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  pr: 1
                }
              }}
            />
          </Box>

          {/* Recherches rapides */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Recherches populaires :
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {quickSearchItems.map((item) => (
                <Chip
                  key={item.query}
                  label={item.label}
                  variant="outlined"
                  clickable
                  onClick={() => navigate(`/announcements?q=${item.query}`)}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>
        </Paper>

        {/* Actions rapides */}
        <Paper sx={{ p: 3, mb: 4, border: 1, borderColor: 'grey.200' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Actions rapides
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              startIcon={<SearchRounded />}
              onClick={() => navigate('/announcements')}
            >
              Parcourir les annonces
            </Button>
            <Button
              variant="outlined"
              startIcon={<HistoryRounded />}
              onClick={() => navigate('/history')}
            >
              Historique des contacts
            </Button>
            <Button
              variant="outlined"
              startIcon={<FavoriteRounded />}
              onClick={() => navigate('/favorites')}
            >
              Mes favoris
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExploreRounded />}
              onClick={() => navigate('/categories')}
            >
              Explorer par catégorie
            </Button>
          </Stack>
        </Paper>

        {/* Annonces récentes */}
        <Paper sx={{ border: 1, borderColor: 'grey.200' }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'grey.200' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Annonces récentes
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/announcements')}
              >
                Voir tout
              </Button>
            </Stack>
          </Box>

          {recentAnnouncements.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <InventoryRounded sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Aucune annonce disponible
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Il n'y a pas d'annonces récentes pour le moment.
              </Typography>
              <Button
                variant="contained"
                startIcon={<SearchRounded />}
                onClick={() => navigate('/announcements')}
              >
                Explorer les annonces
              </Button>
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {recentAnnouncements.map((announcement) => (
                  <Grid item xs={12} sm={6} md={4} key={announcement.id}>
                    <AnnouncementCard
                      announcement={announcement}
                      onContact={handleContactSupplier}
                    />
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/announcements')}
                  startIcon={<InventoryRounded />}
                >
                  Voir toutes les annonces
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Section conseils et astuces */}
        <Paper sx={{ p: 4, mt: 4, bgcolor: 'primary.50', border: 1, borderColor: 'primary.200' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            💡 Conseils pour optimiser vos recherches
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>
                • Utilisez des mots-clés spécifiques (marque, modèle)
              </Typography>
              <Typography variant="body2" gutterBottom>
                • Filtrez par ville pour des livraisons rapides
              </Typography>
              <Typography variant="body2">
                • Contactez directement les fournisseurs pour négocier
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>
                • Sauvegardez vos recherches en favoris
              </Typography>
              <Typography variant="body2" gutterBottom>
                • Vérifiez régulièrement les nouvelles annonces
              </Typography>
              <Typography variant="body2">
                • Explorez différentes catégories de produits
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default OpticianDashboard;