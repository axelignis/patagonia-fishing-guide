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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/testimonios" element={<Testimonios />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/guias" element={<Guias />} />
        <Route path="/guia/:id" element={<GuiaPerfil />} />
        <Route path="/reservar/:id" element={<Reservar />} />
        <Route path="/guia-practica" element={<GuiaPractica />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </Routes>
    </Router>
  );
}

export default App;
