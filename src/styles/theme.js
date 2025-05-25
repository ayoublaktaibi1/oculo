import { createTheme } from '@mui/material/styles';
import { frFR } from '@mui/material/locale';

// 🎨 PALETTE DE COULEURS SIMPLIFIÉE
const colors = {
  primary: {
    main: '#2563eb', // Bleu moderne
    light: '#60a5fa',
    dark: '#1d4ed8',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#64748b', // Gris bleu
    light: '#94a3b8',
    dark: '#475569',
    contrastText: '#ffffff'
  },
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669'
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626'
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706'
  },
  background: {
    default: '#f8fafc',
    paper: '#ffffff'
  },
  grey: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  }
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    background: colors.background,
    grey: colors.grey,
    text: {
      primary: colors.grey[900],
      secondary: colors.grey[600]
    },
    divider: colors.grey[200]
  },
  
  // 📏 TYPOGRAPHIE
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em'
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.025em'
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.33
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: colors.grey[700]
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: colors.grey[600]
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: colors.grey[500]
    }
  },
  
  // 📦 ESPACEMENT
  spacing: 8,
  
  // 🔲 BORDURES
  shape: {
    borderRadius: 8
  },
  
  // 🎯 COMPOSANTS PERSONNALISÉS
  components: {
    // Boutons
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-1px)'
          },
          '&:active': {
            transform: 'translateY(0)'
          }
        },
        contained: {
          backgroundColor: '#2563eb',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#1d4ed8'
          }
        },
        outlined: {
          borderColor: '#e2e8f0',
          color: '#334155',
          '&:hover': {
            borderColor: '#2563eb',
            backgroundColor: '#2563eb08',
            color: '#2563eb'
          }
        },
        text: {
          color: '#475569',
          '&:hover': {
            backgroundColor: '#f1f5f9',
            color: '#1e293b'
          }
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1rem'
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.8125rem'
        }
      }
    },
    
    // Cartes
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    
    // Paper
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0'
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        },
        elevation3: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }
      }
    },
    
    // Champs de saisie
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#ffffff',
            transition: 'all 0.2s ease-in-out',
            '& fieldset': {
              borderColor: '#cbd5e1'
            },
            '&:hover fieldset': {
              borderColor: '#94a3b8'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2563eb',
              borderWidth: 2
            },
            '&.Mui-error fieldset': {
              borderColor: '#ef4444'
            }
          },
          '& .MuiInputLabel-root': {
            color: '#475569',
            '&.Mui-focused': {
              color: '#2563eb'
            }
          }
        }
      }
    },
    
    // Select
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    
    // Chips
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.8125rem'
        },
        colorPrimary: {
          backgroundColor: '#2563eb20',
          color: '#2563eb',
          '&:hover': {
            backgroundColor: '#2563eb30'
          }
        },
        colorSecondary: {
          backgroundColor: '#64748b20',
          color: '#64748b'
        },
        colorSuccess: {
          backgroundColor: '#10b98120',
          color: '#10b981'
        },
        colorError: {
          backgroundColor: '#ef444420',
          color: '#ef4444'
        },
        colorWarning: {
          backgroundColor: '#f59e0b20',
          color: '#f59e0b'
        }
      }
    },
    
    // AppBar
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#0f172a',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid #e2e8f0'
        }
      }
    },
    
    // Dialog
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }
      }
    },
    
    // Menu
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }
      }
    },
    
    // Container
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
    },
    
    // AlertIcon styling
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: 'none'
        },
        standardSuccess: {
          backgroundColor: '#10b98110',
          color: '#059669'
        },
        standardError: {
          backgroundColor: '#ef444410',
          color: '#dc2626'
        },
        standardWarning: {
          backgroundColor: '#f59e0b10',
          color: '#d97706'
        },
        standardInfo: {
          backgroundColor: '#2563eb10',
          color: '#1d4ed8'
        }
      }
    },
    
    // Pagination
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            borderRadius: 6,
            fontWeight: 500,
            '&.Mui-selected': {
              backgroundColor: '#2563eb',
              color: '#ffffff'
            }
          }
        }
      }
    },
    
    // Avatar
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600
        }
      }
    },
    
    // Fab
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }
        }
      }
    },
    
    // Divider
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#e2e8f0'
        }
      }
    }
  }
}, frFR);

export default theme;