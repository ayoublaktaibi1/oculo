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
  useTheme,
  Stack,
  Divider
} from '@mui/material';
import {
  AccountCircleRounded,
  DashboardRounded,
  AddRounded,
  SearchRounded,
  ExitToAppRounded,
  MenuRounded,
  InventoryRounded
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
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 200
        }
      }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Connecté en tant que
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {user?.first_name} {user?.last_name}
        </Typography>
        {user?.company_name && (
          <Typography variant="caption" color="text.secondary">
            {user.company_name}
          </Typography>
        )}
      </Box>
      
      <Divider />
      
      <MenuItem onClick={() => handleNavigation('/profile')} sx={{ py: 1.5 }}>
        <AccountCircleRounded sx={{ mr: 2, fontSize: 20 }} />
        Mon Profil
      </MenuItem>
      
      <MenuItem onClick={() => handleNavigation('/dashboard')} sx={{ py: 1.5 }}>
        <DashboardRounded sx={{ mr: 2, fontSize: 20 }} />
        Tableau de bord
      </MenuItem>
      
      {user?.role === 'supplier' && (
        <MenuItem onClick={() => handleNavigation('/announcements/create')} sx={{ py: 1.5 }}>
          <AddRounded sx={{ mr: 2, fontSize: 20 }} />
          Nouvelle annonce
        </MenuItem>
      )}
      
      <Divider />
      
      <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
        <ExitToAppRounded sx={{ mr: 2, fontSize: 20 }} />
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
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 200
        }
      }}
    >
      <MenuItem onClick={() => handleNavigation('/')} sx={{ py: 1.5 }}>
        Accueil
      </MenuItem>
      
      <MenuItem onClick={() => handleNavigation('/announcements')} sx={{ py: 1.5 }}>
        <SearchRounded sx={{ mr: 2, fontSize: 20 }} />
        Rechercher
      </MenuItem>
      
      {!isAuthenticated && (
        <>
          <Divider />
          <MenuItem onClick={() => handleNavigation('/login')} sx={{ py: 1.5 }}>
            Connexion
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/register')} sx={{ py: 1.5 }}>
            Inscription
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          bgcolor: 'background.paper'
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, md: 72 } }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              mr: 4
            }}
          >
            <InventoryRounded 
              sx={{ 
                fontSize: 32, 
                color: 'primary.main', 
                mr: 1.5 
              }} 
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              OpticConnect
            </Typography>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {!isMobile && (
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Navigation Desktop */}
              <Button
                color="inherit"
                component={Link}
                to="/announcements"
                startIcon={<SearchRounded />}
                sx={{ 
                  color: 'text.primary',
                  fontWeight: 500,
                  px: 2
                }}
              >
                Rechercher
              </Button>

              {isAuthenticated ? (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/dashboard"
                    startIcon={<DashboardRounded />}
                    sx={{ 
                      color: 'text.primary',
                      fontWeight: 500,
                      px: 2
                    }}
                  >
                    Dashboard
                  </Button>

                  {user?.role === 'supplier' && (
                    <Button
                      variant="outlined"
                      component={Link}
                      to="/announcements/create"
                      startIcon={<AddRounded />}
                      sx={{ 
                        px: 2,
                        fontWeight: 500
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
                        bgcolor: 'primary.main',
                        width: 36,
                        height: 36,
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      {user?.first_name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </IconButton>
                </>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                    sx={{ 
                      color: 'text.primary',
                      fontWeight: 500,
                      px: 2
                    }}
                  >
                    Connexion
                  </Button>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/register"
                    sx={{ 
                      px: 2,
                      fontWeight: 500
                    }}
                  >
                    Inscription
                  </Button>
                </Stack>
              )}
            </Stack>
          )}

          {/* Menu mobile */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={isAuthenticated ? handleProfileMenuOpen : handleMobileMenuOpen}
              sx={{ color: 'text.primary' }}
            >
              {isAuthenticated ? (
                <Avatar
                  sx={{ 
                    bgcolor: 'primary.main',
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                >
                  {user?.first_name?.charAt(0)?.toUpperCase()}
                </Avatar>
              ) : (
                <MenuRounded />
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