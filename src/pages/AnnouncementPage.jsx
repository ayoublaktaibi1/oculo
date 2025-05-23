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
  Drawer
} from '@mui/material';
import { FilterList } from '@mui/icons-material';
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
  
  useEffect(() => {
    fetchAnnouncements();
  }, [searchParams]);

  // Si on a un ID, on affiche le détail de l'annonce
  if (id) {
    return <AnnouncementDetail announcementId={id} />;
  }

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

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await announcementService.searchAnnouncements(filters);
      
      setAnnouncements(data.announcements);
      setPagination(data.pagination);
      
    } catch (error) {
      console.error('Erreur recherche annonces:', error);
      setError('Erreur lors de la recherche des annonces');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
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
  };

  const renderFilters = () => (
    <SearchFilters
      filters={filters}
      onFiltersChange={handleFiltersChange}
      resultsCount={pagination.totalItems}
    />
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* Filtres - Desktop */}
        {!isMobile && (
          <Grid item md={3}>
            <Box sx={{ position: 'sticky', top: 24 }}>
              {renderFilters()}
            </Box>
          </Grid>
        )}

        {/* Contenu principal */}
        <Grid item xs={12} md={9}>
          {/* En-tête */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {filters.q ? `Résultats pour "${filters.q}"` : 'Toutes les annonces'}
            </Typography>
            
            {!loading && (
              <Typography variant="body2" color="text.secondary">
                {pagination.totalItems} annonce{pagination.totalItems > 1 ? 's' : ''} trouvée{pagination.totalItems > 1 ? 's' : ''}
              </Typography>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Loading message="Recherche en cours..." />
          ) : announcements.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 2
              }}
            >
              <Typography variant="h6" gutterBottom>
                Aucune annonce trouvée
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Essayez de modifier vos critères de recherche
              </Typography>
            </Box>
          ) : (
            <>
              {/* Grille des annonces */}
              <Grid container spacing={3}>
                {announcements.map((announcement) => (
                  <Grid item xs={12} sm={6} lg={4} key={announcement.id}>
                    <AnnouncementCard announcement={announcement} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size={isMobile ? 'small' : 'medium'}
                    showFirstButton
                    showLastButton
                  />
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
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setMobileFiltersOpen(true)}
        >
          <FilterList />
        </Fab>
      )}

      {/* Drawer filtres mobile */}
      <Drawer
        anchor="bottom"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        PaperProps={{
          sx: { maxHeight: '80vh', borderRadius: '16px 16px 0 0' }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filtrer les résultats
          </Typography>
          {renderFilters()}
        </Box>
      </Drawer>
    </Container>
  );
};

export default AnnouncementPage;