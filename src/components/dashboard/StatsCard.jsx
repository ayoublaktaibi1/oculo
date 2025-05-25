import React from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';

const StatsCard = ({ title, value, icon, color = 'primary', trend, trendDirection }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        border: 1,
        borderColor: 'grey.200',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: `${color}.main`,
          boxShadow: 2,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          {/* Icône et valeur principale */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: `${color}.main`,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 56,
                height: 56
              }}
            >
              {icon}
            </Box>
            
            <Box sx={{ textAlign: 'right' }}>
              <Typography 
                variant="h4" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  lineHeight: 1
                }}
              >
                {value}
              </Typography>
              
              {trend && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: trendDirection === 'up' ? 'success.main' : 
                           trendDirection === 'down' ? 'error.main' : 'text.secondary',
                    fontWeight: 500
                  }}
                >
                  {trendDirection === 'up' ? '↗' : trendDirection === 'down' ? '↘' : ''} {trend}
                </Typography>
              )}
            </Box>
          </Box>
          
          {/* Titre */}
          <Box>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontWeight: 500,
                lineHeight: 1.2
              }}
            >
              {title}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StatsCard;