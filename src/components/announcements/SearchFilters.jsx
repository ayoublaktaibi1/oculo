import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Slider,
  Autocomplete,
  InputAdornment,
  Divider,
  Stack,
  IconButton,
  Collapse
} from '@mui/material';
import {
  SearchRounded,
  ClearRounded,
  FilterListRounded,
  ExpandMoreRounded,
  ExpandLessRounded
} from '@mui/icons-material';
import { useCategories } from '../../hooks/useCategories';
import { MOROCCAN_CITIES, CONDITION_LABELS } from '../../utils/constants';

const SearchFilters = ({ filters, onFiltersChange, resultsCount }) => {
  const { data: categories, loading: categoriesLoading } = useCategories();
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState([
    parseInt(filters.price_min) || 0,
    parseInt(filters.price_max) || 10000
  ]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
    setPriceRange([
      parseInt(filters.price_min) || 0,
      parseInt(filters.price_max) || 10000
    ]);
  }, [filters]);

  const handleInputChange = (field, value) => {
    const newFilters = {
      ...localFilters,
      [field]: value
    };
    setLocalFilters(newFilters);
    
    // Appliquer immédiatement pour certains champs
    if (['q', 'category_id', 'city', 'condition_type'].includes(field)) {
      onFiltersChange(newFilters);
    }
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handlePriceCommitted = (event, newValue) => {
    const newFilters = {
      ...localFilters,
      price_min: newValue[0] > 0 ? newValue[0].toString() : '',
      price_max: newValue[1] < 10000 ? newValue[1].toString() : ''
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      q: '',
      category_id: '',
      city: '',
      price_min: '',
      price_max: '',
      condition_type: '',
      page: 1
    };
    setLocalFilters(clearedFilters);
    setPriceRange([0, 10000]);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(localFilters).filter(value => 
      value && value !== '' && value !== '1'
    ).length;
  };

  // Créer une liste plate des catégories pour l'autocomplete
  const getAllCategories = () => {
    if (!categories) return [];
    
    const allCategories = [];
    categories.forEach(category => {
      allCategories.push(category);
      if (category.children) {
        category.children.forEach(child => {
          allCategories.push({
            ...child,
            displayName: `${category.name} > ${child.name}`
          });
        });
      }
    });
    
    return allCategories;
  };

  const allCategories = getAllCategories();
  const selectedCategory = allCategories.find(cat => cat.id.toString() === localFilters.category_id);

  return (
    <Card sx={{ border: 1, borderColor: 'grey.200' }}>
      <CardContent sx={{ p: 3 }}>
        {/* En-tête */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListRounded color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filtres
            </Typography>
          </Box>
          
          {getActiveFiltersCount() > 0 && (
            <Chip
              label={`${getActiveFiltersCount()} actif${getActiveFiltersCount() > 1 ? 's' : ''}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        <Stack spacing={3}>
          {/* Recherche textuelle */}
          <TextField
            fullWidth
            label="Rechercher"
            placeholder="Montures, verres, machines..."
            value={localFilters.q}
            onChange={(e) => handleInputChange('q', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded color="action" />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          {/* Filtres rapides */}
          <Stack spacing={2}>
            {/* Catégorie */}
            {!categoriesLoading && (
              <Autocomplete
                fullWidth
                options={allCategories}
                getOptionLabel={(option) => option.displayName || option.name}
                value={selectedCategory || null}
                onChange={(event, newValue) => {
                  handleInputChange('category_id', newValue ? newValue.id.toString() : '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Catégorie"
                    placeholder="Sélectionner une catégorie"
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box component="li" key={key} {...otherProps} sx={{ py: 1 }}>
                      <Typography variant="body2">
                        {option.displayName || option.name}
                      </Typography>
                    </Box>
                  );
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            )}

            {/* Ville */}
            <Autocomplete
              fullWidth
              options={MOROCCAN_CITIES}
              value={localFilters.city || null}
              onChange={(event, newValue) => {
                handleInputChange('city', newValue || '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ville"
                  placeholder="Sélectionner une ville"
                />
              )}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Stack>

          {/* Bouton pour afficher/masquer les filtres avancés */}
          <Button
            variant="text"
            onClick={() => setShowAdvanced(!showAdvanced)}
            endIcon={showAdvanced ? <ExpandLessRounded /> : <ExpandMoreRounded />}
            sx={{ alignSelf: 'flex-start', p: 1 }}
          >
            Filtres avancés
          </Button>

          {/* Filtres avancés */}
          <Collapse in={showAdvanced}>
            <Stack spacing={3}>
              <Divider />

              {/* État/Condition */}
              <FormControl fullWidth>
                <InputLabel>État du produit</InputLabel>
                <Select
                  value={localFilters.condition_type}
                  onChange={(e) => handleInputChange('condition_type', e.target.value)}
                  label="État du produit"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Tous les états</MenuItem>
                  {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Fourchette de prix */}
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Prix (MAD)
                </Typography>
                <Box sx={{ px: 2, mt: 2, mb: 3 }}>
                  <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    onChangeCommitted={handlePriceCommitted}
                    valueLabelDisplay="auto"
                    min={0}
                    max={10000}
                    step={100}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 2500, label: '2.5K' },
                      { value: 5000, label: '5K' },
                      { value: 7500, label: '7.5K' },
                      { value: 10000, label: '10K+' }
                    ]}
                    sx={{
                      '& .MuiSlider-valueLabel': {
                        backgroundColor: 'primary.main'
                      }
                    }}
                  />
                </Box>
                <Stack direction="row" spacing={2}>
                  <TextField
                    size="small"
                    label="Prix min"
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      const newRange = [value, priceRange[1]];
                      setPriceRange(newRange);
                      handlePriceCommitted(null, newRange);
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">MAD</InputAdornment>
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                  <TextField
                    size="small"
                    label="Prix max"
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 10000;
                      const newRange = [priceRange[0], value];
                      setPriceRange(newRange);
                      handlePriceCommitted(null, newRange);
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">MAD</InputAdornment>
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Stack>
              </Box>
            </Stack>
          </Collapse>

          <Divider />

          {/* Actions */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ClearRounded />}
              onClick={handleClearFilters}
              disabled={getActiveFiltersCount() === 0}
            >
              Effacer
            </Button>
          </Stack>

          {/* Résultats count */}
          {resultsCount !== undefined && (
            <Box sx={{ textAlign: 'center', pt: 2, borderTop: 1, borderColor: 'grey.200' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {resultsCount} résultat{resultsCount > 1 ? 's' : ''} trouvé{resultsCount > 1 ? 's' : ''}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;