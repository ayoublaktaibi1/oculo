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
  Alert
} from '@mui/material';
import {
  Search,
  History,
  Favorite,
  TrendingUp
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
      const data = await announcementService.getAnnouncements({ limit: 8 });
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

  if (loading) {
    return <Loading message="Chargement de votre tableau de bord..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tableau de bord opticien
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Bienvenue, {user?.first_name} {user?.last_name}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Statistiques rapides */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Recherches récentes"
            value="12"
            icon={<Search />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Contacts effectués"
            value="8"
            icon={<History />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Favoris"
            value="5"
            icon={<Favorite />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Nouvelles annonces"
            value={recentAnnouncements.length}
            icon={<TrendingUp />}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Barre de recherche rapide */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recherche rapide
          </Typography>
          <Box component="form" onSubmit={handleSearch}>
            <TextField
              fullWidth
              placeholder="Rechercher des produits optiques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: (
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ ml: 1 }}
                  >
                    Rechercher
                  </Button>
                )
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Search />}
          onClick={() => navigate('/announcements')}
          sx={{ mr: 2 }}
        >
          Parcourir les annonces
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<History />}
          onClick={() => navigate('/history')}
        >
          Historique des contacts
        </Button>
      </Box>

      {/* Annonces récentes */}
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Annonces récentes
        </Typography>
        
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
          >
            Voir toutes les annonces
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default OpticianDashboard;