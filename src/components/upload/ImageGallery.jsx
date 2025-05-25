import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  Dialog,
  DialogContent,
  Stack,
  Chip
} from '@mui/material';
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  CloseRounded,
  ZoomInRounded,
  ImageRounded
} from '@mui/icons-material';

const ImageGallery = ({ images = [], title = '' }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setDialogOpen(true);
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <Paper
        sx={{
          height: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          color: 'text.secondary',
          border: 1,
          borderColor: 'grey.200'
        }}
      >
        <ImageRounded sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6">
          Aucune image disponible
        </Typography>
        <Typography variant="body2">
          Le fournisseur n'a pas ajouté d'images pour ce produit
        </Typography>
      </Paper>
    );
  }

  const primaryImage = images[selectedImageIndex] || images[0];

  return (
    <Box>
      {/* Image principale */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Box
          component="img"
          src={primaryImage?.cloudinary_secure_url || `https://via.placeholder.com/600x400?text=${encodeURIComponent(title)}`}
          alt={primaryImage?.alt_text || title}
          onClick={() => handleImageClick(selectedImageIndex)}
          sx={{
            width: '100%',
            height: 400,
            objectFit: 'cover',
            cursor: 'pointer',
            borderRadius: 2,
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
        />
        
        {/* Overlay avec contrôles */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: 0,
            transition: 'opacity 0.2s ease-in-out',
            '&:hover': {
              opacity: 1
            }
          }}
        >
          {images.length > 1 && (
            <>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                sx={{
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  ml: 2,
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)'
                  }
                }}
              >
                <ChevronLeftRounded />
              </IconButton>
              
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                sx={{
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  mr: 2,
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)'
                  }
                }}
              >
                <ChevronRightRounded />
              </IconButton>
            </>
          )}
        </Box>

        {/* Badge zoom */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16
          }}
        >
          <Chip
            icon={<ZoomInRounded />}
            label="Cliquer pour agrandir"
            size="small"
            sx={{
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              '& .MuiChip-icon': {
                color: 'white'
              }
            }}
          />
        </Box>

        {/* Compteur d'images */}
        {images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16
            }}
          >
            <Chip
              label={`${selectedImageIndex + 1} / ${images.length}`}
              size="small"
              sx={{
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white'
              }}
            />
          </Box>
        )}
      </Box>

      {/* Miniatures */}
      {images.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              height: 6
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'grey.200',
              borderRadius: 3
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'grey.400',
              borderRadius: 3
            }
          }}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              component="img"
              src={image.cloudinary_secure_url}
              alt={image.alt_text || `Image ${index + 1}`}
              onClick={() => handleThumbnailClick(index)}
              sx={{
                width: 80,
                height: 60,
                objectFit: 'cover',
                borderRadius: 1,
                cursor: 'pointer',
                border: 2,
                borderColor: selectedImageIndex === index ? 'primary.main' : 'transparent',
                opacity: selectedImageIndex === index ? 1 : 0.7,
                transition: 'all 0.2s ease-in-out',
                flexShrink: 0,
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.05)'
                }
              }}
            />
          ))}
        </Box>
      )}

      {/* Dialog plein écran */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0,0,0,0.9)',
            boxShadow: 'none',
            borderRadius: 0,
            margin: 0,
            maxHeight: '100vh',
            maxWidth: '100vw'
          }
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            position: 'relative'
          }}
        >
          {/* Bouton fermer */}
          <IconButton
            onClick={() => setDialogOpen(false)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)'
              }
            }}
          >
            <CloseRounded />
          </IconButton>

          {/* Image en plein écran */}
          <Box
            component="img"
            src={images[selectedImageIndex]?.cloudinary_secure_url}
            alt={images[selectedImageIndex]?.alt_text || title}
            sx={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain'
            }}
          />

          {/* Contrôles de navigation */}
          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: 'absolute',
                  left: 32,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)'
                  }
                }}
              >
                <ChevronLeftRounded />
              </IconButton>
              
              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: 32,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)'
                  }
                }}
              >
                <ChevronRightRounded />
              </IconButton>
            </>
          )}

          {/* Compteur en bas */}
          {images.length > 1 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 32,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 2
              }}
            >
              <Typography variant="body2">
                {selectedImageIndex + 1} / {images.length}
              </Typography>
            </Box>
          )}

          {/* Miniatures en bas */}
          {images.length > 1 && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: 'absolute',
                bottom: 80,
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: '80vw',
                overflowX: 'auto'
              }}
            >
              {images.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image.cloudinary_secure_url}
                  alt={`Miniature ${index + 1}`}
                  onClick={() => setSelectedImageIndex(index)}
                  sx={{
                    width: 60,
                    height: 40,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: 2,
                    borderColor: selectedImageIndex === index ? 'primary.main' : 'rgba(255,255,255,0.3)',
                    opacity: selectedImageIndex === index ? 1 : 0.6,
                    transition: 'all 0.2s ease-in-out',
                    flexShrink: 0,
                    '&:hover': {
                      opacity: 1
                    }
                  }}
                />
              ))}
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ImageGallery;