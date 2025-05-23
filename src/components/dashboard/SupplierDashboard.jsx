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
  IconButton,
  Menu,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Add,
  TrendingUp,
  Visibility,
  Edit,
  Delete,
  MoreVert,
  Assessment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { announcementService } from '../../services/announcementService';
import AnnouncementCard from '../announcements/AnnouncementCard';
import StatsCard from './StatsCard';
import Loading from '../common/Loading';
import { formatPrice } from '../../utils/formatters';
import { STATUS_LABELS, ANNOUNCEMENT_STATUS } from '../../utils/constants';

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleEditAnnouncement = (id) => {
    navigate(`/announcements/${id}/edit`);
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await announcementService.deleteAnnouncement(id);
        await fetchDashboardData(); // Recharger les données
      } catch (error) {
        console.error('Erreur suppression:', error);
        setError('Erreur lors de la suppression de l\'annonce');
      }
    }
  };

  if (loading) {
    return <Loading message="Chargement de votre tableau de bord..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tableau de bord fournisseur
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

      {/* Statistiques */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total annonces"
              value={stats.totalAnnouncements}
              icon={<Assessment />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Annonces actives"
              value={stats.activeAnnouncements}
              icon={<Visibility />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Annonces vendues"
              value={stats.soldAnnouncements}
              icon={<TrendingUp />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Valeur totale"
              value={formatPrice(stats.totalValue)}
              icon={<TrendingUp />}
              color="secondary"
            />
          </Grid>
        </Grid>
      )}

      {/* Actions rapides */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => navigate('/announcements/create')}
          sx={{ mr: 2 }}
        >
          Nouvelle annonce
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<Assessment />}
          onClick={() => navigate('/stats')}
        >
          Voir les statistiques
        </Button>
      </Box>

      {/* Liste des annonces */}
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Mes annonces ({announcements.length})
        </Typography>

        {announcements.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Aucune annonce créée
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Commencez par créer votre première annonce pour présenter vos produits aux opticiens.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/announcements/create')}
            >
              Créer ma première annonce
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {announcements.map((announcement) => (
              <Grid item xs={12} sm={6} md={4} key={announcement.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ flexGrow: 1, pr: 1 }}>
                        {announcement.title}
                      </Typography>
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={STATUS_LABELS[announcement.status]}
                        size="small"
                        color={
                          announcement.status === ANNOUNCEMENT_STATUS.ACTIVE ? 'success' :
                          announcement.status === ANNOUNCEMENT_STATUS.SOLD ? 'warning' :
                          'default'
                        }
                        sx={{ mb: 1 }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {announcement.description.substring(0, 100)}...
                    </Typography>

                    <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                      {formatPrice(announcement.price, announcement.currency)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Catégorie: {announcement.category?.name}
                    </Typography>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEditAnnouncement(announcement.id)}
                      sx={{ mr: 1 }}
                    >
                      Modifier
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                    >
                      Supprimer
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default SupplierDashboard;