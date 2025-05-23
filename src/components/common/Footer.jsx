import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider
} from '@mui/material';
import {
  Facebook,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* À propos */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              OpticConnect Maroc
            </Typography>
            <Typography variant="body2" paragraph>
              La plateforme B2B dédiée aux professionnels de l'optique au Maroc. 
              Connectez fournisseurs et opticiens pour développer votre activité.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" href="#" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" href="#" aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" href="#" aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Liens rapides */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Liens rapides
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/announcements" color="inherit" underline="hover">
                Rechercher des produits
              </Link>
              <Link href="/register" color="inherit" underline="hover">
                Devenir fournisseur
              </Link>
              <Link href="/about" color="inherit" underline="hover">
                À propos
              </Link>
              <Link href="/contact" color="inherit" underline="hover">
                Contact
              </Link>
              <Link href="/terms" color="inherit" underline="hover">
                Conditions d'utilisation
              </Link>
              <Link href="/privacy" color="inherit" underline="hover">
                Politique de confidentialité
              </Link>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2">
                  Casablanca, Maroc
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" />
                <Typography variant="body2">
                  +212 5XX XX XX XX
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" />
                <Typography variant="body2">
                  contact@opticconnect.ma
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography variant="body2">
            © 2024 OpticConnect Maroc. Tous droits réservés.
          </Typography>
          <Typography variant="body2">
            Fait avec ❤️ pour les professionnels de l'optique
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;