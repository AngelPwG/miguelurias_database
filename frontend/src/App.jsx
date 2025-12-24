import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

// COMPONENTES TEMPORALES
const DetallePage = () => <h1>Detalle del Personaje (Soy temporal)</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública: Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Privadas (Idealmente aquí iría protección después) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/persona/:id" element={<DetallePage />} />

        {/* Si escriben cualquier cosa rara, mandar al Home o Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
