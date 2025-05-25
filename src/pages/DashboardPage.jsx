import React from 'react';
import { Box, Container, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import SupplierDashboard from '../components/dashboard/SupplierDashboard';
import OpticianDashboard from '../components/dashboard/OpticianDashboard';
import Loading from '../components/common/Loading';
import { USER_ROLES } from '../utils/constants';

const DashboardPage = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Loading message="Chargement de votre tableau de bord..." />
      </Container>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Vous devez être connecté pour accéder à cette page.
        </Alert>
      </Container>
    );
  }

  // Rendu conditionnel basé sur le rôle utilisateur
  switch (user.role) {
    case USER_ROLES.SUPPLIER:
      return <SupplierDashboard />;
    case USER_ROLES.OPTICIAN:
      return <OpticianDashboard />;
    default:
      return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="warning">
            Rôle utilisateur non reconnu. Veuillez contacter le support.
          </Alert>
        </Container>
      );
  }
};

export default DashboardPage;