import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const ProfilePage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mon Profil
      </Typography>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Page de profil en cours de développement...
        </Typography>
      </Paper>
    </Container>
  );
};

export default ProfilePage;