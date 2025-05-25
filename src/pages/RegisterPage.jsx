import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  CircularProgress,
  Grid,
  Stack,
  Divider
} from '@mui/material';
import {
  PersonRounded,
  BusinessRounded,
  EmailRounded,
  LockRounded,
  PhoneRounded,
  LocationOnRounded,
  VisibilityRounded,
  VisibilityOffRounded,
  InventoryRounded
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOROCCAN_CITIES, USER_ROLES } from '../utils/constants';
import { isValidEmail, isValidMoroccanPhone } from '../utils/validators';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    first_name: '',
    last_name: '',
    company_name: '',
    phone: '',
    city: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mot de passe trop court (min 6 caractères)';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation mot de passe requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.role) {
      newErrors.role = 'Rôle requis';
    }

    if (!formData.first_name) {
      newErrors.first_name = 'Prénom requis';
    }

    if (!formData.last_name) {
      newErrors.last_name = 'Nom requis';
    }

    if (formData.phone && !isValidMoroccanPhone(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone marocain invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      navigate('/dashboard');
    } catch (error) {
      setSubmitError(error.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'grey.50',
        py: 6
      }}
    >
      <Container component="main" maxWidth="md">
        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, md: 4 },
            border: 1,
            borderColor: 'grey.200',
            borderRadius: 3
          }}
        >
          {/* En-tête avec logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  color: 'white'
                }}
              >
                <InventoryRounded sx={{ fontSize: 32 }} />
              </Box>
            </Box>
            
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Inscription
            </Typography>
            
            <Typography variant="body1" color="text.secondary">
              Rejoignez la communauté des professionnels de l'optique au Maroc
            </Typography>
          </Box>

          {submitError && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setSubmitError('')}
            >
              {submitError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Type de compte */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Type de compte
                </Typography>
                <FormControl fullWidth required error={!!errors.role}>
                  <InputLabel>Sélectionnez votre rôle</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    label="Sélectionnez votre rôle"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value={USER_ROLES.SUPPLIER}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <BusinessRounded color="primary" />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Fournisseur
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Vendez vos produits optiques
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                    <MenuItem value={USER_ROLES.OPTICIAN}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PersonRounded color="primary" />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Opticien
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Achetez des produits optiques
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  </Select>
                  {errors.role && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {errors.role}
                    </Typography>
                  )}
                </FormControl>
              </Box>

              <Divider />

              {/* Informations personnelles */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Informations personnelles
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="first_name"
                      label="Prénom"
                      value={formData.first_name}
                      onChange={handleChange}
                      error={!!errors.first_name}
                      helperText={errors.first_name}
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

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="last_name"
                      label="Nom"
                      value={formData.last_name}
                      onChange={handleChange}
                      error={!!errors.last_name}
                      helperText={errors.last_name}
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

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="email"
                      label="Adresse email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
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
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Mot de passe"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={errors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockRounded color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                            </IconButton>
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

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirmer le mot de passe"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockRounded color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                            </IconButton>
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
              </Box>

              <Divider />

              {/* Informations professionnelles */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Informations professionnelles
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="company_name"
                      label="Nom de l'entreprise"
                      value={formData.company_name}
                      onChange={handleChange}
                      error={!!errors.company_name}
                      helperText={errors.company_name}
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
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="phone"
                      label="Téléphone"
                      placeholder="+212 6XX XX XX XX"
                      value={formData.phone}
                      onChange={handleChange}
                      error={!!errors.phone}
                      helperText={errors.phone}
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
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.city}>
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
                      {errors.city && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {errors.city}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="address"
                      label="Adresse"
                      multiline
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      error={!!errors.address}
                      helperText={errors.address}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  mt: 2
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'S\'inscrire'
                )}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Déjà un compte ?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/login" 
                    sx={{ fontWeight: 600, textDecoration: 'none' }}
                  >
                    Se connecter
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;