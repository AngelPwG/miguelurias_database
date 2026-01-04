import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CrearPersonaPage from './pages/CrearPersonaPage';
import CrearEventoPage from './pages/CrearEventoPage';
import EditarEventoPage from './pages/EditarEventoPage'; // Import
import EditarPersonaPage from './pages/EditarPersonaPage';
import PersonaDetailPage from './pages/PersonaDetailPage';
import EventoDetailPage from './pages/EventoDetailPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública: Login - Si ya está logueado, redirige al home */}
        <Route
          path="/login"
          element={
            <ProtectedRoute reverse>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute reverse>
              <RegisterPage />
            </ProtectedRoute>
          }
        />

        {/* Rutas Privadas - Requieren autenticación */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/persona/:id"
          element={
            <ProtectedRoute>
              <PersonaDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editar-persona/:id"
          element={
            <ProtectedRoute>
              <EditarPersonaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crear-persona"
          element={
            <ProtectedRoute>
              <CrearPersonaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crear-evento"
          element={
            <ProtectedRoute>
              <CrearEventoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editar-evento/:id"
          element={
            <ProtectedRoute>
              <EditarEventoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/eventos/:id"
          element={
            <ProtectedRoute>
              <EventoDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Si escriben cualquier cosa rara, mandar al Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
