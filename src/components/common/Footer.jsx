import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import {
  FacebookRounded,
  Instagram,
  LinkedIn,
  PhoneRounded,
  EmailRounded,
  LocationOnRounded,
  InventoryRounded
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* À propos */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <InventoryRounded sx={{ fontSize: 32, color: 'primary.light' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  OpticConnect Maroc
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
                La plateforme B2B dédiée aux professionnels de l'optique au Maroc. 
                Connectez fournisseurs et opticiens pour développer votre activité.
              </Typography>
              
              <Stack direction="row" spacing={1}>
                <IconButton 
                  color="inherit" 
                  href="#" 
                  aria-label="Facebook"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                  }}
                >
                  <FacebookRounded />
                </IconButton>
                <IconButton 
                  color="inherit" 
                  href="#" 
                  aria-label="Instagram"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                  }}
                >
                  <Instagram />
                </IconButton>
                <IconButton 
                  color="inherit" 
                  href="#" 
                  aria-label="LinkedIn"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                  }}
                >
                  <LinkedIn />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>

          {/* Liens rapides */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Liens rapides
            </Typography>
            <Stack spacing={1.5}>
              <Link 
                href="/announcements" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1 },
                  fontSize: '0.875rem'
                }}
              >
                Rechercher des produits
              </Link>
              <Link 
                href="/register" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1 },
                  fontSize: '0.875rem'
                }}
              >
                Devenir fournisseur
              </Link>
              <Link 
                href="/about" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1 },
                  fontSize: '0.875rem'
                }}
              >
                À propos
              </Link>
              <Link 
                href="/contact" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1 },
                  fontSize: '0.875rem'
                }}
              >
                Contact
              </Link>
              <Link 
                href="/terms" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1 },
                  fontSize: '0.875rem'
                }}
              >
                Conditions d'utilisation
              </Link>
              <Link 
                href="/privacy" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1 },
                  fontSize: '0.875rem'
                }}
              >
                Politique de confidentialité
              </Link>
            </Stack>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Contact
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocationOnRounded sx={{ fontSize: 20, opacity: 0.7 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Casablanca, Maroc
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PhoneRounded sx={{ fontSize: 20, opacity: 0.7 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +212 5XX XX XX XX
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailRounded sx={{ fontSize: 20, opacity: 0.7 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  contact@opticconnect.ma
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

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
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © 2024 OpticConnect Maroc. Tous droits réservés.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Fait avec ❤️ pour les professionnels de l'optique
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;