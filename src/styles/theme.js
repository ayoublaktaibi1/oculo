import { createTheme } from '@mui/material/styles';
import { frFR } from '@mui/material/locale';

// 🎨 COULEURS PRINCIPALES - MODIFIEZ ICI POUR CHANGER LES COULEURS
const colors = {
  primary: {
    main: '#1976d2', // Bleu au lieu du rouge marocain
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#9c27b0', // Purple au lieu du vert
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#FFFFFF'
  },
  accent: {
    main: '#ff9800', // Orange pour les accents
    light: '#ffb74d',
    dark: '#f57c00'
  },
  background: {
    default: '#f5f5f5', // Gris très clair
    paper: '#ffffff'
  }
};

const theme = createTheme({
  palette: {
    mode: 'light', // ou 'dark' pour le mode sombre
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: {
      primary: '#333333',
      secondary: '#666666'
    }
  },
  
  // 📏 TYPOGRAPHIE - MODIFIEZ LES TAILLES ET POLICES ICI
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      marginBottom: '1rem'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      marginBottom: '1rem'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6
    }
  },
  
  // 📦 ESPACEMENT - MODIFIEZ LES MARGES ET PADDINGS
  spacing: 8, // 1 unité = 8px
  
  // 🔲 BORDURES
  shape: {
    borderRadius: 12 // Bordures plus arrondies
  },
  
  // 🎯 COMPOSANTS PERSONNALISÉS - MODIFIEZ LE STYLE DES COMPOSANTS
  components: {
    // Boutons
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none', // Pas de majuscules automatiques
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }
        },
        contained: {
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
        }
      }
    },
    
    // Cartes
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)'
          },
          transition: 'all 0.3s ease'
        }
      }
    },
    
    // Champs de saisie
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8
          }
        }
      }
    },
    
    // Container principal
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (min-width: 600px)': {
            paddingLeft: '24px',
            paddingRight: '24px'
          }
        }
      }
    }
  }
}, frFR);

export default theme;