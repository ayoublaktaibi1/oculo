import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  AccountCircle,
  Dashboard,
  Add,
  Search,
  ExitToApp,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
    handleMobileMenuClose();
  };

  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => handleNavigation('/profile')}>
        <AccountCircle sx={{ mr: 1 }} />
        Mon Profil
      </MenuItem>
      
      <MenuItem onClick={() => handleNavigation('/dashboard')}>
        <Dashboard sx={{ mr: 1 }} />
        Tableau de bord
      </MenuItem>
      
      {user?.role === 'supplier' && (
        <MenuItem onClick={() => handleNavigation('/announcements/create')}>
          <Add sx={{ mr: 1 }} />
          Nouvelle annonce
        </MenuItem>
      )}
      
      <MenuItem onClick={handleLogout}>
        <ExitToApp sx={{ mr: 1 }} />
        Déconnexion
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchor}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(mobileMenuAnchor)}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => handleNavigation('/')}>
        Accueil
      </MenuItem>
      
      <MenuItem onClick={() => handleNavigation('/announcements')}>
        <Search sx={{ mr: 1 }} />
        Rechercher
      </MenuItem>
      
      {!isAuthenticated && (
        <>
          <MenuItem onClick={() => handleNavigation('/login')}>
            Connexion
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/register')}>
            Inscription
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <>
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{
            backgroundColor: 'primary.main',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
        <Toolbar>
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold'
            }}
          >
            OpticConnect
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Navigation Desktop */}
              <Button
                color="inherit"
                component={Link}
                to="/announcements"
                startIcon={<Search />}
              >
                Rechercher
              </Button>

              {isAuthenticated ? (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/dashboard"
                    startIcon={<Dashboard />}
                  >
                    Dashboard
                  </Button>

                  {user?.role === 'supplier' && (
                    <Button
                      color="inherit"
                      component={Link}
                      to="/announcements/create"
                      startIcon={<Add />}
                      variant="outlined"
                      sx={{ 
                        borderColor: 'white',
                        '&:hover': { 
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Nouvelle annonce
                    </Button>
                  )}

                  {/* Avatar utilisateur */}
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{ ml: 1 }}
                  >
                    <Avatar
                      sx={{ 
                        bgcolor: theme.palette.secondary.main,
                        width: 32,
                        height: 32
                      }}
                    >
                      {user?.first_name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </IconButton>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                  >
                    Connexion
                  </Button>
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/register"
                    sx={{ 
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': { 
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Inscription
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Menu mobile */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={isAuthenticated ? handleProfileMenuOpen : handleMobileMenuOpen}
            >
              {isAuthenticated ? (
                <Avatar
                  sx={{ 
                    bgcolor: theme.palette.secondary.main,
                    width: 32,
                    height: 32
                  }}
                >
                  {user?.first_name?.charAt(0)?.toUpperCase()}
                </Avatar>
              ) : (
                <MenuIcon />
              )}
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Menus */}
      {isAuthenticated ? renderProfileMenu : renderMobileMenu}
    </>
  );
};

export default Header;