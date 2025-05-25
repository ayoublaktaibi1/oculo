import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Pagination,
  Alert,
  Fab,
  useMediaQuery,
  useTheme,
  Drawer,
  Stack,
  Chip,
  Paper,
  Button
} from '@mui/material';
import { 
  FilterListRounded, 
  SearchRounded,
  CloseRounded,
  ViewModuleRounded,
  ViewListRounded
} from '@mui/icons-material';
import { useSearchParams, useParams } from 'react-router-dom';
import { announcementService } from '../services/announcementService';
import AnnouncementCard from '../components/announcements/AnnouncementCard';
import SearchFilters from '../components/announcements/SearchFilters';
import AnnouncementDetail from '../components/announcements/AnnouncementDetail';
import Loading from '../components/common/Loading';

const AnnouncementPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'

  // Paramètres de recherche depuis l'URL
  const filters = {
    q: searchParams.get('q') || '',
    category_id: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    price_min: searchParams.get('price_min') || '',
    price_max: searchParams.get('price_max') || '',
    condition_type: searchParams.get('condition') || '',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 20
  };

  // Déclaration de fetchAnnouncements AVANT le useEffect
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Nettoyer les filtres avant envoi - ne pas envoyer de paramètres vides
      const cleanFilters = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '' && value !== '0' && value !== 0 && key !== 'limit') {
          cleanFilters[key] = value;
        }
      });
      
      // Toujours inclure limit
      cleanFilters.limit = filters.limit;
      
      console.log('Filtres envoyés:', cleanFilters);
      
      // Utiliser getAnnouncements si pas de filtres, sinon searchAnnouncements
      const hasFilters = Object.keys(cleanFilters).some(key => 
        key !== 'limit' && key !== 'page' && cleanFilters[key]
      );
      
      let data;
      if (hasFilters) {
        data = await announcementService.searchAnnouncements(cleanFilters);
      } else {
        // Utiliser la route normale pour récupérer toutes les annonces
        data = await announcementService.getAnnouncements({
          page: filters.page,
          limit: filters.limit
        });
      }
      
      setAnnouncements(data.announcements);
      setPagination(data.pagination);
      
    } catch (error) {
      console.error('Erreur recherche annonces:', error);
      setError('Erreur lors de la recherche des annonces');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Ne pas exécuter la recherche si on affiche les détails d'une annonce
    if (!id) {
      fetchAnnouncements();
    }
  }, [searchParams, id]);

  // Si on a un ID, on affiche le détail de l'annonce
  if (id) {
    return <AnnouncementDetail announcementId={id} />;
  }

  const handleFiltersChange = (newFilters) => {
    const params = new URLSearchParams();
    
    // Ne pas ajouter les paramètres vides
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '' && value !== '0' && value !== 0) {
        params.set(key, value);
      }
    });
    
    // Reset page when filters change
    if (params.get('page') !== '1') {
      params.set('page', '1');
    }
    
    setSearchParams(params);
  };

  const handlePageChange = (event, page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value && value !== '' && value !== '1' && value !== 1
    ).length;
  };

  const renderFilters = () => (
    <SearchFilters
      filters={filters}
      onFiltersChange={handleFiltersChange}
      resultsCount={pagination.totalItems}
    />
  );

  const renderAnnouncementGrid = () => (
    <Grid container spacing={3}>
      {announcements.map((announcement) => (
        <Grid size={{ xs: 12, sm: 6, md: viewMode === 'grid' ? 4 : 12 }} key={announcement.id}>
          <AnnouncementCard announcement={announcement} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Filtres - Desktop */}
          {!isMobile && (
            <Grid size={{ md: 3 }}>
              <Box sx={{ position: 'sticky', top: 24 }}>
                {renderFilters()}
              </Box>
            </Grid>
          )}

          {/* Contenu principal */}
          <Grid size={{ xs: 12, md: 9 }}>
            {/* En-tête avec titre et contrôles */}
            <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.200' }}>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                justifyContent="space-between" 
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {filters.q ? `Résultats pour "${filters.q}"` : 'Toutes les annonces'}
                  </Typography>
                  
                  {!loading && (
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Typography variant="body2" color="text.secondary">
                        {pagination.totalItems} annonce{pagination.totalItems > 1 ? 's' : ''} trouvée{pagination.totalItems > 1 ? 's' : ''}
                      </Typography>
                      
                      {getActiveFiltersCount() > 0 && (
                        <Chip
                          size="small"
                          label={`${getActiveFiltersCount()} filtre${getActiveFiltersCount() > 1 ? 's' : ''}`}
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  )}
                </Box>

                {/* Contrôles de vue - Desktop seulement */}
                {!isMobile && announcements.length > 0 && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setViewMode('grid')}
                      startIcon={<ViewModuleRounded />}
                    >
                      Grille
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setViewMode('list')}
                      startIcon={<ViewListRounded />}
                    >
                      Liste
                    </Button>
                  </Stack>
                )}
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

            {loading ? (
              <Box sx={{ py: 8 }}>
                <Loading message="Recherche en cours..." />
              </Box>
            ) : announcements.length === 0 ? (
              <Paper
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 4,
                  border: 1,
                  borderColor: 'grey.200'
                }}
              >
                <SearchRounded sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Aucune annonce trouvée
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Essayez de modifier vos critères de recherche ou explorez d'autres catégories
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => handleFiltersChange({})}
                >
                  Effacer les filtres
                </Button>
              </Paper>
            ) : (
              <>
                {/* Grille des annonces */}
                {renderAnnouncementGrid()}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Paper sx={{ p: 2, border: 1, borderColor: 'grey.200' }}>
                      <Pagination
                        count={pagination.totalPages}
                        page={pagination.currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size={isMobile ? 'small' : 'medium'}
                        showFirstButton
                        showLastButton
                        siblingCount={isMobile ? 0 : 1}
                      />
                    </Paper>
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>

        {/* Bouton filtres mobile */}
        {isMobile && (
          <Fab
            color="primary"
            sx={{ 
              position: 'fixed', 
              bottom: 24, 
              right: 24,
              zIndex: theme.zIndex.fab
            }}
            onClick={() => setMobileFiltersOpen(true)}
          >
            <FilterListRounded />
          </Fab>
        )}

        {/* Drawer filtres mobile */}
        <Drawer
          anchor="bottom"
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          PaperProps={{
            sx: { 
              maxHeight: '85vh', 
              borderRadius: '16px 16px 0 0',
              border: 1,
              borderColor: 'grey.200'
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Filtrer les résultats
              </Typography>
              <Button
                onClick={() => setMobileFiltersOpen(false)}
                startIcon={<CloseRounded />}
                variant="outlined"
                size="small"
              >
                Fermer
              </Button>
            </Stack>
            {renderFilters()}
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
};

export default AnnouncementPage;