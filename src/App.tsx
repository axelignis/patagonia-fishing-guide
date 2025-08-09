import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import AdminDashboard from './pages/admin/Dashboard';
import GuidesList from './pages/admin/GuidesList';
import GuideEdit from './pages/admin/GuideEdit';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
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
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/guides" element={<ProtectedRoute><GuidesList /></ProtectedRoute>} />
            <Route path="/admin/guides/:id" element={<ProtectedRoute><GuideEdit /></ProtectedRoute>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
