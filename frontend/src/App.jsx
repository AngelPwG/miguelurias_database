import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Importamos tu nuevo componente

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Aquí definimos las rutas de navegación */}
      <Routes>
        {/* Cuando la ruta sea "/" (la raíz), muestra el Home */}
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App