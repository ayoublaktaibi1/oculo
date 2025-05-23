import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const CreateAnnouncementPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Créer une nouvelle annonce
      </Typography>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Formulaire de création d'annonce en cours de développement...
        </Typography>
      </Paper>
    </Container>
  );
};

export default CreateAnnouncementPage;