import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  CardActions,
  Button,
  Stack,
  Avatar
} from '@mui/material';
import {
  LocationOnRounded,
  VisibilityRounded,
  AccessTimeRounded,
  BusinessRounded,
  EditRounded,
  DeleteRounded
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatRelativeDate, truncateText } from '../../utils/formatters';
import { CONDITION_LABELS } from '../../utils/constants';

const AnnouncementCard = ({ announcement, showActions = false, onContact, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/announcements/${announcement.id}`);
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
        border: 1,
        borderColor: 'grey.200',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
          borderColor: 'primary.main'
        }
      }}
      onClick={handleCardClick}
    >
      {/* Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="div"
          sx={{
            height: 200,
            backgroundImage: primaryImage 
              ? `url(${primaryImage.cloudinary_secure_url})`
              : 'url(/api/placeholder/300/200)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            bgcolor: 'grey.100'
          }}
        />
        
        {/* Badges en haut */}
        <Box sx={{ position: 'absolute', top: 12, left: 12, right: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Stack spacing={1}>
              {announcement.is_featured && (
                <Chip
                  label="À la une"
                  size="small"
                  color="warning"
                  sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                />
              )}
              {announcement.is_urgent && (
                <Chip
                  label="Urgent"
                  size="small"
                  color="error"
                  sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                />
              )}
            </Stack>
            
            <Chip
              label={CONDITION_LABELS[announcement.condition_type]}
              size="small"
              variant="filled"
              sx={{
                bgcolor: 'background.paper',
                color: 'text.primary',
                fontWeight: 500,
                fontSize: '0.75rem'
              }}
            />
          </Box>
        </Box>

        {/* Prix en bas à droite */}
        <Box sx={{ position: 'absolute', bottom: 12, right: 12 }}>
          <Chip
            label={formatPrice(announcement.price, announcement.currency)}
            color="primary"
            sx={{
              fontWeight: 700,
              fontSize: '0.875rem',
              px: 1
            }}
          />
        </Box>
      </Box>

      {/* Contenu */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1.5,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.6em'
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
            overflow: 'hidden',
            lineHeight: 1.4,
            minHeight: '2.8em'
          }}
        >
          {truncateText(announcement.description, 100)}
        </Typography>

        {/* Métadonnées avec icônes */}
        <Stack spacing={1.5}>
          {announcement.brand && (
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                {announcement.brand}
                {announcement.model && ` • ${announcement.model}`}
              </Typography>
            </Box>
          )}

          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnRounded sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {announcement.city || 'Non spécifié'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeRounded sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {formatRelativeDate(announcement.created_at)}
              </Typography>
            </Box>
          </Stack>

          {/* Fournisseur */}
          {announcement.user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 1 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 24,
                  height: 24,
                  fontSize: '0.75rem'
                }}
              >
                {announcement.user.company_name ? (
                  <BusinessRounded sx={{ fontSize: 14 }} />
                ) : (
                  announcement.user.first_name?.charAt(0)?.toUpperCase()
                )}
              </Avatar>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                {announcement.user.company_name || 
                 `${announcement.user.first_name} ${announcement.user.last_name}`}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 3, pt: 0 }}>
        {!showActions ? (
          // Actions publiques
          <Button
            variant="contained"
            size="small"
            startIcon={<VisibilityRounded />}
            onClick={handleCardClick}
            fullWidth
            sx={{ py: 1 }}
          >
            Voir détails
          </Button>
        ) : (
          // Actions propriétaire
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditRounded />}
              onClick={(e) => handleActionClick(e, 'edit')}
              sx={{ flex: 1, py: 1 }}
            >
              Modifier
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<DeleteRounded />}
              onClick={(e) => handleActionClick(e, 'delete')}
              sx={{ flex: 1, py: 1 }}
            >
              Supprimer
            </Button>
          </Stack>
        )}
      </CardActions>
    </Card>
  );
};

export default AnnouncementCard;