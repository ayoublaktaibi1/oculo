import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Stack,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  PersonRounded,
  BusinessRounded,
  EmailRounded,
  PhoneRounded,
  LocationOnRounded,
  EditRounded,
  SaveRounded,
  CancelRounded,
  SecurityRounded
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { MOROCCAN_CITIES, ROLE_LABELS } from '../utils/constants';
import { isValidEmail, isValidMoroccanPhone } from '../utils/validators';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company_name: user?.company_name || '',
    city: user?.city || '',
    address: user?.address || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name) {
      newErrors.first_name = 'Prénom requis';
    }

    if (!formData.last_name) {
      newErrors.last_name = 'Nom requis';
    }

    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (formData.phone && !isValidMoroccanPhone(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone marocain invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await updateUser(formData);
      setSuccess('Profil mis à jour avec succès');
      setEditing(false);
    } catch (error) {
      setError(error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company_name: user?.company_name || '',
      city: user?.city || '',
      address: user?.address || ''
    });
    setErrors({});
    setError('');
    setEditing(false);
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* En-tête */}
        <Paper sx={{ p: 4, mb: 4, border: 1, borderColor: 'grey.200' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'center', sm: 'flex-start' }}>
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
            
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flexGrow: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Mon Profil
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Gérez vos informations personnelles et professionnelles
              </Typography>
              <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    px: 2, 
                    py: 0.5, 
                    bgcolor: 'primary.100', 
                    color: 'primary.main',
                    borderRadius: 1,
                    fontWeight: 500
                  }}
                >
                  {ROLE_LABELS[user?.role]}
                </Typography>
              </Stack>
            </Box>

            {!editing && (
              <Button
                variant="contained"
                startIcon={<EditRounded />}
                onClick={() => setEditing(true)}
              >
                Modifier
              </Button>
            )}
          </Stack>
        </Paper>

        {/* Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Informations personnelles */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, border: 1, borderColor: 'grey.200' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Informations personnelles
              </Typography>

              <Stack spacing={3}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Prénom"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      error={!!errors.first_name}
                      helperText={errors.first_name}
                      disabled={!editing}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonRounded color="action" />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Nom"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      error={!!errors.last_name}
                      helperText={errors.last_name}
                      disabled={!editing}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonRounded color="action" />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Adresse email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRounded color="action" />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Téléphone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  disabled={!editing}
                  placeholder="+212 6XX XX XX XX"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneRounded color="action" />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Stack>
            </Paper>
          </Grid>

          {/* Informations professionnelles */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, border: 1, borderColor: 'grey.200' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Informations professionnelles
              </Typography>

              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Nom de l'entreprise"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessRounded color="action" />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />

                <FormControl fullWidth disabled={!editing}>
                  <InputLabel>Ville</InputLabel>
                  <Select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    label="Ville"
                    sx={{ borderRadius: 2 }}
                    startAdornment={
                      <InputAdornment position="start">
                        <LocationOnRounded color="action" />
                      </InputAdornment>
                    }
                  >
                    {MOROCCAN_CITIES.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Adresse"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!editing}
                  multiline
                  rows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Stack>
            </Paper>
          </Grid>

          {/* Sécurité */}
          <Grid item xs={12}>
            <Paper sx={{ p: 4, border: 1, borderColor: 'grey.200' }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <SecurityRounded color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Sécurité
                </Typography>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="outlined"
                  onClick={() => {/* Logique pour changer le mot de passe */}}
                >
                  Changer le mot de passe
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {/* Logique pour supprimer le compte */}}
                >
                  Supprimer le compte
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Actions d'édition */}
        {editing && (
          <Paper sx={{ p: 3, mt: 4, border: 1, borderColor: 'grey.200' }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<CancelRounded />}
                onClick={handleCancel}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveRounded />}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default ProfilePage;