import React from 'react';
import { useAuth } from '../context/AuthContext';
import SupplierDashboard from '../components/dashboard/SupplierDashboard';
import OpticianDashboard from '../components/dashboard/OpticianDashboard';
import { USER_ROLES } from '../utils/constants';

const DashboardPage = () => {
  const { user } = useAuth();

  if (user?.role === USER_ROLES.SUPPLIER) {
    return <SupplierDashboard />;
  } else if (user?.role === USER_ROLES.OPTICIAN) {
    return <OpticianDashboard />;
  }

  return null;
};

export default DashboardPage;