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
  Grid
} from '@mui/material';
import {
  Person,
  Business,
  Email,
  Lock,
  Phone,
  LocationOn,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOROCCAN_CITIES, USER_ROLES } from '../utils/constants';
import { isValidEmail, isValidMoroccanPhone, getValidationMessage } from '../utils/validators';

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

    // Validation des champs requis
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

    // Validation téléphone si fourni
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
        // Exclure confirmPassword des données envoyées
        const { confirmPassword, ...registrationData } = formData;
        await register(registrationData);
        navigate('/dashboard');
    } catch (error) {
        setSubmitError(error.message || 'Erreur lors de l\'inscription');
    }
    };
    return (
        <Container component="main" maxWidth="md" sx={{ py: 8 }}>
        <Paper
        elevation={3}
        sx={{
        p: { xs: 3, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
        }}
        >
    <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
        Inscription
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        Rejoignez la communauté des professionnels de l'optique au Maroc
    </Typography>

    {submitError && (
      <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
        {submitError}
      </Alert>
    )}

    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        {/* Type de compte */}
        <Grid item xs={12}>
          <FormControl fullWidth required error={!!errors.role}>
            <InputLabel>Type de compte</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Type de compte"
            >
              <MenuItem value={USER_ROLES.SUPPLIER}>Fournisseur</MenuItem>
              <MenuItem value={USER_ROLES.OPTICIAN}>Opticien</MenuItem>
            </Select>
            {errors.role && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {errors.role}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Informations personnelles */}
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
                  <Person color="action" />
                </InputAdornment>
              )
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
                  <Person color="action" />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Email */}
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
                  <Email color="action" />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Mots de passe */}
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
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
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
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Informations professionnelles */}
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
                  <Business color="action" />
                </InputAdornment>
              )
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
                  <Phone color="action" />
                </InputAdornment>
              )
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
              startAdornment={
                <InputAdornment position="start">
                  <LocationOn color="action" />
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
            rows={2}
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
          />
        </Grid>
      </Grid>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 3, mb: 2, py: 1.5 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'S\'inscrire'
        )}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2">
          Déjà un compte ?{' '}
          <Link component={RouterLink} to="/login" fontWeight="bold">
            Se connecter
          </Link>
        </Typography>
      </Box>
    </Box>
  </Paper>
</Container>
);
};
export default RegisterPage;