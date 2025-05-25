import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import {
  SearchRounded,
  TrendingUpRounded,
  SecurityRounded,
  SpeedRounded,
  ArrowForwardRounded,
  InventoryRounded
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { announcementService } from '../services/announcementService';
import { useCategories } from '../hooks/useCategories';
import AnnouncementCard from '../components/announcements/AnnouncementCard';
import Loading from '../components/common/Loading';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { data: categories, loading: categoriesLoading } = useCategories();
  
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentAnnouncements = async () => {
      try {
        const data = await announcementService.getAnnouncements({ limit: 6 });
        setRecentAnnouncements(data.announcements);
      } catch (error) {
        console.error('Erreur chargement annonces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAnnouncements();
  }, []);

  const features = [
    {
      icon: <SearchRounded sx={{ fontSize: 40 }} />,
      title: 'Recherche Simplifiée',
      description: 'Trouvez rapidement les produits optiques dont vous avez besoin avec nos filtres avancés.',
      color: 'primary'
    },
    {
      icon: <SecurityRounded sx={{ fontSize: 40 }} />,
      title: 'Plateforme Sécurisée',
      description: 'Transactions sécurisées et vérification des professionnels pour votre tranquillité.',
      color: 'success'
    },
    {
      icon: <SpeedRounded sx={{ fontSize: 40 }} />,
      title: 'Contact Direct',
      description: 'Contactez directement les fournisseurs par téléphone, email ou WhatsApp.',
      color: 'warning'
    },
    {
      icon: <TrendingUpRounded sx={{ fontSize: 40 }} />,
      title: 'Croissance Business',
      description: 'Développez votre réseau professionnel et augmentez vos ventes.',
      color: 'secondary'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 10 },
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
            <Grid item xs={12} md={6}>
              <Stack spacing={4}>
                <Box>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      fontWeight: 700,
                      mb: 2,
                      lineHeight: 1.4,
                      color: 'text.primary'
                    }}
                  >
                    La Plateforme B2B de l'Optique au Maroc
                  </Typography>
                  
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 4,
                      fontWeight: 400,
                      lineHeight: 1.5,
                      color: 'text.secondary'
                    }}
                  >
                    Connectez fournisseurs et opticiens. Trouvez vos produits optiques ou développez vos ventes en quelques clics.
                  </Typography>
                </Box>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/announcements')}
                    startIcon={<SearchRounded />}
                    sx={{ py: 1.5, px: 3 }}
                  >
                    Rechercher des produits
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{ py: 1.5, px: 3 }}
                  >
                    Devenir fournisseur
                  </Button>
                </Stack>
              </Stack>
            </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{ mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}
            >
              Pourquoi choisir OpticConnect ?
            </Typography>
            
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}
            >
              Une plateforme pensée par et pour les professionnels de l'optique au Maroc
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 2,
                    border: 'none',
                    boxShadow: 1
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={3} alignItems="flex-start">
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: `${feature.color}.main`,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 'fit-content'
                        }}
                      >
                        {feature.icon}
                      </Box>
                      
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      {!categoriesLoading && categories && (
        <Box sx={{ py: { xs: 8, md: 10 } }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                sx={{ mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}
              >
                Nos Catégories
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                Découvrez nos différentes catégories de produits optiques
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {categories.slice(0, 6).map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      height: '100%',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => navigate(`/announcements?category=${category.id}`)}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <InventoryRounded
                        sx={{
                          fontSize: 48,
                          color: 'primary.main',
                          mb: 2
                        }}
                      />
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {category.description}
                      </Typography>
                      {category.children && category.children.length > 0 && (
                        <Chip
                          size="small"
                          label={`${category.children.length} sous-catégories`}
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/announcements')}
                endIcon={<ArrowForwardRounded />}
              >
                Voir toutes les catégories
              </Button>
            </Box>
          </Container>
        </Box>
      )}

      {/* Recent Announcements */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{ mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}
            >
              Annonces Récentes
            </Typography>
            
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 400 }}
            >
              Découvrez les dernières offres de nos fournisseurs
            </Typography>
          </Box>

          {loading ? (
            <Loading message="Chargement des annonces..." />
          ) : (
            <>
              <Grid container spacing={3}>
                {recentAnnouncements.map((announcement) => (
                  <Grid item xs={12} sm={6} md={4} key={announcement.id}>
                    <AnnouncementCard announcement={announcement} />
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ textAlign: 'center', mt: 6 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/announcements')}
                  endIcon={<ArrowForwardRounded />}
                >
                  Voir toutes les annonces
                </Button>
              </Box>
            </>
          )}
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 8, md: 10 }
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{ mb: 2, fontSize: { xs: '1.8rem', md: '2.2rem' }, fontWeight: 600 }}
            >
              Prêt à développer votre activité ?
            </Typography>
            
            <Typography
              variant="h6"
              sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}
            >
              Rejoignez dès maintenant les professionnels de l'optique qui nous font confiance
            </Typography>
            
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  '&:hover': {
                    bgcolor: 'grey.100'
                  }
                }}
              >
                S'inscrire gratuitement
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/announcements')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  '&:hover': {
                    borderColor: 'white',
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Explorer la plateforme
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;