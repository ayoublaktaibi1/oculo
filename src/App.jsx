import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Theme et Context
import theme from './styles/theme';
import { AuthProvider } from './context/AuthContext';

// Composants communs
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AnnouncementPage from './pages/AnnouncementPage';
import CreateAnnouncementPage from './pages/CreateAnnouncementPage';
import ProfilePage from './pages/ProfilePage';

// Configuration React Query v4
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <AuthProvider>
            <Router>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh'
                }}
              >
                <Header />
                
                <Box component="main" sx={{ flexGrow: 1 }}>
                  <Routes>
                    {/* Routes publiques */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/announcements" element={<AnnouncementPage />} />
                    <Route path="/announcements/:id" element={<AnnouncementPage />} />

                    {/* Routes protégées */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Routes fournisseurs seulement */}
                    <Route
                      path="/announcements/create"
                      element={
                        <ProtectedRoute requiredRole="supplier">
                          <CreateAnnouncementPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Route 404 */}
                    <Route
                      path="*"
                      element={
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '400px',
                            textAlign: 'center'
                          }}
                        >
                          <div>
                            <h2>Page non trouvée</h2>
                            <p>La page que vous cherchez n'existe pas.</p>
                          </div>
                        </Box>
                      }
                    />
                  </Routes>
                </Box>
                
                <Footer />
              </Box>
            </Router>
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;