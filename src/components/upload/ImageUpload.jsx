import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardMedia,
  Grid,
  Alert,
  LinearProgress,
  Chip,
  Paper
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Star,
  StarBorder,
  Image as ImageIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { formatFileSize } from '../../utils/formatters';
import { LIMITS } from '../../utils/constants';

const ImageUpload = ({ 
  onImagesSelected, 
  selectedImages = [], 
  maxImages = 10,
  existingImages = [],
  onDeleteExisting,
  onSetPrimary
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('');

    // Vérifier les fichiers rejetés
    if (rejectedFiles.length > 0) {
      const errorMessages = rejectedFiles.map(({ file, errors }) => {
        const errorTypes = errors.map(e => e.code);
        if (errorTypes.includes('file-too-large')) {
          return `${file.name}: Fichier trop volumineux (max ${formatFileSize(LIMITS.MAX_IMAGE_SIZE)})`;
        }
        if (errorTypes.includes('file-invalid-type')) {
          return `${file.name}: Format non supporté (JPEG, PNG, WebP seulement)`;
        }
        return `${file.name}: Fichier invalide`;
      });
      setError(errorMessages.join('\n'));
      return;
    }

    // Vérifier le nombre total d'images
    const totalImages = selectedImages.length + existingImages.length + acceptedFiles.length;
    if (totalImages > maxImages) {
      setError(`Maximum ${maxImages} images autorisées`);
      return;
    }

    // Ajouter les nouveaux fichiers
    const newImages = [...selectedImages, ...acceptedFiles];
    onImagesSelected(newImages);
  }, [selectedImages, existingImages, maxImages, onImagesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: LIMITS.MAX_IMAGE_SIZE,
    multiple: true
  });

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    onImagesSelected(newImages);
  };

  const handleDeleteExisting = (imageId) => {
    if (onDeleteExisting) {
      onDeleteExisting(imageId);
    }
  };

  const handleSetPrimary = (imageId) => {
    if (onSetPrimary) {
      onSetPrimary(imageId);
    }
  };

  const totalImages = selectedImages.length + existingImages.length;
  const canAddMore = totalImages < maxImages;

  return (
    <Box>
      {/* Zone de drop */}
      {canAddMore && (
        <Paper
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            bgcolor: isDragActive ? 'primary.50' : 'background.paper',
            mb: 3,
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.50'
            }
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Déposez vos images ici' : 'Glissez-déposez vos images'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            ou cliquez pour sélectionner des fichiers
          </Typography>
          
          <Button variant="outlined" component="span">
            Choisir des images
          </Button>
          
          <Typography variant="caption" display="block" sx={{ mt: 2 }}>
            JPEG, PNG, WebP • Max {formatFileSize(LIMITS.MAX_IMAGE_SIZE)} par image • {maxImages} images max
          </Typography>
        </Paper>
      )}

      {/* Barre de progression */}
      {uploading && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Upload en cours...
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {/* Messages d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{error}</pre>
        </Alert>
      )}

      {/* Compteur d'images */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Images ({totalImages}/{maxImages})
        </Typography>
        {totalImages > 0 && (
          <Chip
            label={`${totalImages} image${totalImages > 1 ? 's' : ''}`}
            color="primary"
            size="small"
          />
        )}
      </Box>

      {/* Images existantes */}
      {existingImages.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Images actuelles
          </Typography>
          <Grid container spacing={2}>
            {existingImages.map((image) => (
              <Grid item xs={6} sm={4} md={3} key={image.id}>
                <Card sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={image.cloudinary_secure_url}
                    alt={image.alt_text}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  {/* Badge image primaire */}
                  {image.is_primary && (
                    <Chip
                      label="Principale"
                      size="small"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: 4,
                        left: 4
                      }}
                    />
                  )}
                  
                  {/* Actions */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      display: 'flex',
                      gap: 0.5
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleSetPrimary(image.id)}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.8)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                      }}
                    >
                      {image.is_primary ? (
                        <Star color="primary" />
                      ) : (
                        <StarBorder />
                      )}
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteExisting(image.id)}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.8)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                      }}
                    >
                      <Delete color="error" />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Nouvelles images sélectionnées */}
      {selectedImages.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Nouvelles images
          </Typography>
          <Grid container spacing={2}>
            {selectedImages.map((file, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Card sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={URL.createObjectURL(file)}
                    alt={file.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  {/* Badge première image */}
                  {index === 0 && existingImages.length === 0 && (
                    <Chip
                      label="Principale"
                      size="small"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: 4,
                        left: 4
                      }}
                    />
                  )}
                  
                  {/* Bouton supprimer */}
                  <IconButton
                    size="small"
                    onClick={() => removeImage(index)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                  >
                    <Delete color="error" />
                  </IconButton>
                  
                  {/* Informations fichier */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      p: 0.5
                    }}
                  >
                    <Typography variant="caption" display="block" noWrap>
                      {file.name}
                    </Typography>
                    <Typography variant="caption">
                      {formatFileSize(file.size)}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Message si aucune image */}
      {totalImages === 0 && (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: 'grey.50'
          }}
        >
          <ImageIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
          <Typography variant="body1" color="text.secondary">
            Aucune image ajoutée
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Les annonces avec images attirent plus l'attention
          </Typography>
        </Paper>
      )}

      {/* Conseils */}
      {totalImages > 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Conseils :</strong>
          </Typography>
          <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
            <li>La première image sera utilisée comme image principale</li>
            <li>Utilisez des images de bonne qualité et bien éclairées</li>
            <li>Montrez le produit sous différents angles</li>
            <li>Évitez les images floues ou de mauvaise qualité</li>
          </ul>
        </Alert>
      )}
    </Box>
  );
};

export default ImageUpload;