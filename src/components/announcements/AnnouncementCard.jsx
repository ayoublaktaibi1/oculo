import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  CardActions,
  Button
} from '@mui/material';
import {
  LocationOn,
  Visibility,
  Phone,
  Email,
  WhatsApp,
  AccessTime
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatRelativeDate, truncateText } from '../../utils/formatters';
import { CONDITION_LABELS } from '../../utils/constants';

const AnnouncementCard = ({ announcement, showActions = false, onContact, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/announcements/${announcement.id}`);
  };

  const handleContactClick = (e, contactType) => {
    e.stopPropagation();
    if (onContact) {
      onContact(announcement.id, contactType);
    }
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    switch (action) {
      case 'edit':
        onEdit && onEdit(announcement.id);
        break;
      case 'delete':
        onDelete && onDelete(announcement.id);
        break;
      default:
        break;
    }
  };

  const primaryImage = announcement.images?.find(img => img.is_primary) || announcement.images?.[0];

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      }}
      onClick={handleCardClick}
    >
      {/* Image */}
      <CardMedia
        component="div"
        sx={{
          height: 200,
          position: 'relative',
          backgroundImage: primaryImage 
            ? `url(${primaryImage.cloudinary_secure_url})`
            : 'url(/api/placeholder/300/200)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Badges */}
        <Box sx={{ position: 'absolute', top: 8, left: 8, right: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {announcement.is_featured && (
                <Chip
                  label="À la une"
                  size="small"
                  sx={{
                    bgcolor: 'warning.main',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              )}
              {announcement.is_urgent && (
                <Chip
                  label="Urgent"
                  size="small"
                  sx={{
                    bgcolor: 'error.main',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              )}
            </Box>
            
            <Chip
              label={CONDITION_LABELS[announcement.condition_type]}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.9)',
                color: 'text.primary'
              }}
            />
          </Box>
        </Box>

        {/* Prix */}
        <Box sx={{ position: 'absolute', bottom: 8, right: 8 }}>
          <Chip
            label={formatPrice(announcement.price, announcement.currency)}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          />
        </Box>
      </CardMedia>

      {/* Contenu */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {announcement.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {truncateText(announcement.description, 100)}
        </Typography>

        {/* Métadonnées */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {announcement.brand && (
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              <strong>Marque:</strong> {announcement.brand}
              {announcement.model && ` - ${announcement.model}`}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {announcement.city || 'Non spécifié'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatRelativeDate(announcement.created_at)}
            </Typography>
          </Box>

          {announcement.user && (
            <Typography variant="body2" color="text.secondary">
              <strong>Fournisseur:</strong> {announcement.user.company_name || `${announcement.user.first_name} ${announcement.user.last_name}`}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
        {!showActions ? (
          // Actions publiques (contact)
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<Visibility />}
              onClick={handleCardClick}
              fullWidth
            >
              Voir détails
            </Button>
          </Box>
        ) : (
          // Actions propriétaire
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => handleActionClick(e, 'edit')}
              fullWidth
            >
              Modifier
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={(e) => handleActionClick(e, 'delete')}
              fullWidth
            >
              Supprimer
            </Button>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default AnnouncementCard;