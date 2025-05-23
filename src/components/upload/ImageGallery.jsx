import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ImageGallery = ({ images = [], title = '' }) => {
  if (!images || images.length === 0) {
    return (
      <Paper
        sx={{
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          color: 'text.secondary'
        }}
      >
        <Typography variant="h6">
          Aucune image disponible
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <img 
        src={images[0]?.cloudinary_secure_url || `https://via.placeholder.com/400x300?text=${encodeURIComponent(title)}`}
        alt={title}
        style={{ width: '100%', height: '400px', objectFit: 'cover' }}
      />
    </Box>
  );
};

export default ImageGallery;