import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './pages/Home';
import Testimonios from './pages/Testimonios';
import Galeria from './pages/Galeria';
import Guias from './pages/Guias';
import GuiaPerfil from './pages/GuiaPerfil';
import Reservar from './pages/Reservar';
import GuiaPractica from './pages/GuiaPractica';
import Marketplace from './pages/Marketplace';
import Footer from './components/Footer';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import GuidesList from './pages/admin/GuidesList';
import GuideEdit from './pages/admin/GuideEdit';
import GuideServicesManager from './pages/admin/GuideServicesManager';
import AllServicesAdmin from './pages/admin/AllServicesAdmin';
import LegacyServicesRedirect from './routes/LegacyServicesRedirect';
import GuidePanel from './pages/admin/GuidePanel';
import UserManagement from './pages/admin/UserManagement';
import Register from './pages/admin/Register';
import AuthCallback from './pages/admin/AuthCallback';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';

// Crear cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/testimonios" element={<Testimonios />} />
                <Route path="/galeria" element={<Galeria />} />
                <Route path="/guias" element={<Guias />} />
                <Route path="/guia/:id" element={<GuiaPerfil />} />
                <Route path="/reservar/:id" element={<Reservar />} />
                <Route path="/guia-practica" element={<GuiaPractica />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<Register />} />
                <Route path="/admin/auth/callback" element={<AuthCallback />} />
                <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/admin/guides" element={<ProtectedRoute requireAdmin><GuidesList /></ProtectedRoute>} />
                <Route path="/admin/guides/:id" element={<ProtectedRoute requireAdmin><GuideEdit /></ProtectedRoute>} />
                <Route path="/admin/services" element={<ProtectedRoute requireAdmin><AllServicesAdmin /></ProtectedRoute>} />
                {/* Nueva ruta para que los guías gestionen sus servicios fuera del espacio /admin */}
                <Route path="/panel-guia/guides/:id/services" element={<ProtectedRoute requireGuide><GuideServicesManager /></ProtectedRoute>} />
                {/* Ruta legacy: redirige de forma segura y evita que se use el path admin equivocadamente */}
                <Route path="/admin/guides/:id/services" element={<LegacyServicesRedirect />} />
                <Route path="/admin/users" element={<ProtectedRoute requireAdmin><UserManagement /></ProtectedRoute>} />
                <Route path="/mi-cuenta" element={<ProtectedRoute><GuidePanel /></ProtectedRoute>} />
                <Route path="/panel-guia" element={<ProtectedRoute><GuidePanel /></ProtectedRoute>} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
