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
  useMediaQuery
} from '@mui/material';
import {
  Visibility,
  Search,
  TrendingUp,
  Security,
  Speed,
  ArrowForward
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
      icon: <Search />,
      title: 'Recherche Simplifiée',
      description: 'Trouvez rapidement les produits optiques dont vous avez besoin avec nos filtres avancés.'
    },
    {
      icon: <Security />,
      title: 'Plateforme Sécurisée',
      description: 'Transactions sécurisées et vérification des professionnels pour votre tranquillité.'
    },
    {
      icon: <Speed />,
      title: 'Contact Direct',
      description: 'Contactez directement les fournisseurs par téléphone, email ou WhatsApp.'
    },
    {
      icon: <TrendingUp />,
      title: 'Croissance Business',
      description: 'Développez votre réseau professionnel et augmentez vos ventes.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  mb: 2,
                  lineHeight: 1.2
                }}
              >
                La Plateforme B2B de l'Optique au Maroc
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontWeight: 300,
                  lineHeight: 1.4
                }}
              >
                Connectez fournisseurs et opticiens. Trouvez vos produits optiques ou développez vos ventes en quelques clics.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/announcements')}
                  startIcon={<Search />}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'grey.100'
                    }
                  }}
                >
                  Rechercher des produits
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Devenir fournisseur
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: { xs: 4, md: 0 }
                }}
              >
                <Box
                  component="img"
                  src="/api/placeholder/500/400"
                  alt="Plateforme OpticConnect"
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{ mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}
        >
          Pourquoi choisir OpticConnect ?
        </Typography>
        
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          Une plateforme pensée par et pour les professionnels de l'optique au Maroc
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        p: 1.5,
                        borderRadius: 2,
                        mr: 2
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      {!categoriesLoading && categories && (
        <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              align="center"
              sx={{ mb: 6, fontSize: { xs: '2rem', md: '2.5rem' } }}
            >
              Nos Catégories
            </Typography>

            <Grid container spacing={3}>
              {categories.slice(0, 5).map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        elevation: 6,
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={() => navigate(`/announcements?category=${category.id}`)}
                  >
                    <Visibility
                      sx={{
                        fontSize: 48,
                        color: 'primary.main',
                        mb: 2
                      }}
                    />
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                    {category.children && category.children.length > 0 && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        {category.children.length} sous-catégories
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/announcements')}
                endIcon={<ArrowForward />}
              >
                Voir toutes les catégories
              </Button>
            </Box>
          </Container>
        </Box>
      )}

      {/* Recent Announcements */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{ mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}
        >
          Annonces Récentes
        </Typography>
        
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Découvrez les dernières offres de nos fournisseurs
        </Typography>

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
                endIcon={<ArrowForward />}
              >
                Voir toutes les annonces
              </Button>
            </Box>
          </>
        )}
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'secondary.main',
          color: 'white',
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            align="center"
            sx={{ mb: 2, fontSize: { xs: '1.8rem', md: '2.2rem' } }}
          >
            Prêt à développer votre activité ?
          </Typography>
          
          <Typography
            variant="h6"
            align="center"
            sx={{ mb: 4, opacity: 0.9 }}
          >
            Rejoignez dès maintenant les professionnels de l'optique qui nous font confiance
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap'
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: 'white',
                color: 'secondary.main',
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
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Explorer la plateforme
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;