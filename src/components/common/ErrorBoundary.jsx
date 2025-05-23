import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
          padding={3}
          textAlign="center"
        >
          <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          
          <Typography variant="h5" gutterBottom>
            Oups ! Une erreur est survenue
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Nous nous excusons pour cette erreur. Veuillez recharger la page ou réessayer plus tard.
          </Typography>
          
          {process.env.NODE_ENV === 'development' && (
            <Alert severity="error" sx={{ mt: 2, mb: 2, textAlign: 'left' }}>
              <Typography variant="body2" component="pre">
                {this.state.error?.toString()}
              </Typography>
            </Alert>
          )}
          
          <Button
            variant="contained"
            onClick={this.handleReload}
            sx={{ mt: 2 }}
          >
            Recharger la page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;