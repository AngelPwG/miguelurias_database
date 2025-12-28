import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonajeCard from '../components/PersonajeCard';
import { listaDeEventos } from '../data';
import { obtenerPersonas } from '../api/personaService';

const Home = () => {
  const navigate = useNavigate();
  const [seccionActual, setSeccionActiva] = useState('PERSONAJES');
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar personas desde el backend
  useEffect(() => {
    const cargarPersonas = async () => {
      try {
        setLoading(true);
        const data = await obtenerPersonas();
        setPersonas(data);
        setError(null);
      } catch (err) {
        console.error('Error cargando personas:', err);
        setError('No se pudieron cargar las personas. ¿Está el servidor corriendo?');
      } finally {
        setLoading(false);
      }
    };

    cargarPersonas();
  }, []);

  // Tomamos el primer evento como "Destacado"
  const eventoDestacado = listaDeEventos[0];

  // Función de logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-wiki-bg text-wiki-text p-4 md:p-8 font-mono">

      {/* --- HEADER --- */}
      <header className="mb-8 border-b border-wiki-border pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
            MIGUELURIAS<span className="text-wiki-accent">DATABASE</span>
          </h1>
          <p className="text-wiki-muted text-sm mt-1">Base de datos de la familia</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/crear-persona')}
            className="px-4 py-2 bg-wiki-accent text-black font-bold hover:bg-green-400 transition-colors text-sm"
          >
            + NUEVA PERSONA
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-colors text-sm"
          >
            CERRAR SESIÓN
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-wiki-block border border-wiki-border rounded text-xs text-green-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            SYSTEM ONLINE
          </div>
        </div>
      </header>

      {/* --- GRID PRINCIPAL --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* === COLUMNA IZQUIERDA (CONTENIDO) === */}
        <div className="lg:col-span-3">

          {/* PESTAÑAS DE NAVEGACIÓN */}
          <div className="flex gap-4 mb-6 border-b border-wiki-border">
            <button
              onClick={() => setSeccionActiva('PERSONAJES')}
              className={`pb-2 px-1 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${seccionActual === 'PERSONAJES'
                ? 'border-wiki-accent text-white'
                : 'border-transparent text-wiki-muted hover:text-white'
                }`}
            >
              [01] Personajes
            </button>
            <button
              onClick={() => setSeccionActiva('EVENTOS')}
              className={`pb-2 px-1 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${seccionActual === 'EVENTOS'
                ? 'border-wiki-accent text-white'
                : 'border-transparent text-wiki-muted hover:text-white'
                }`}
            >
              [02] Eventos
            </button>
          </div>

          {/* ÁREA DE CARGA DE DATOS */}
          <div className={seccionActual === 'PERSONAJES' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col gap-4"}>

            {/* LÓGICA DE PERSONAJES */}
            {seccionActual === 'PERSONAJES' ? (
              <>
                {/* Estado de Loading */}
                {loading && (
                  <div className="col-span-full text-center py-8 text-wiki-muted">
                    <p>Cargando personas desde el servidor...</p>
                  </div>
                )}

                {/* Estado de Error */}
                {error && (
                  <div className="col-span-full">
                    <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded">
                      <p className="font-bold">⚠️ Error</p>
                      <p className="text-sm mt-1">{error}</p>
                    </div>
                  </div>
                )}

                {/* Lista de Personas */}
                {!loading && !error && personas.length === 0 && (
                  <div className="col-span-full text-center py-8 text-wiki-muted">
                    <p>No hay personas registradas aún.</p>
                  </div>
                )}

                {!loading && !error && personas.map((persona) => (
                  <PersonajeCard
                    key={persona.id}
                    id={persona.id}
                    nombreCompleto={persona.nombre}
                    titulo={persona.apodos || 'Sin apodo'}
                    fotoUrl={persona.imagenPortadaUrl}
                  />
                ))}
              </>
            ) : (
              // LÓGICA DE EVENTOS (AQUÍ AGREGAMOS LA FOTO)
              listaDeEventos.map((evento) => (
                <div key={evento.id} className="bg-wiki-block border border-wiki-border rounded overflow-hidden hover:border-wiki-accent transition-colors flex h-32">

                  {/* 1. FOTO DEL EVENTO (Izquierda) */}
                  <div className="w-40 flex-shrink-0 bg-gray-800">
                    {evento.fotoUrl ? (
                      <img
                        src={evento.fotoUrl}
                        alt={evento.nombreEvento}
                        className="w-full h-full object-cover opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">NO IMAGE</div>
                    )}
                  </div>

                  {/* 2. TEXTO DEL EVENTO (Derecha) */}
                  <div className="p-4 flex flex-col justify-center">
                    <h3 className="font-bold text-lg text-gray-100">{evento.nombreEvento}</h3>
                    <p className="text-wiki-muted text-sm">Fecha clave: {evento.fecha}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* === COLUMNA DERECHA (SIDEBAR DESTACADO) === */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-wiki-block border border-wiki-border rounded-lg p-5">
              <div className="text-xs text-wiki-accent font-bold uppercase mb-2 flex justify-between">
                <span> Destacado</span>
                <span>{eventoDestacado.fecha}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                {eventoDestacado.nombreEvento}
              </h3>

              {/* FOTO DESTACADA EN EL SIDEBAR */}
              <div className="w-full h-32 bg-gray-800 rounded mb-4 overflow-hidden border border-wiki-border">
                {eventoDestacado.fotoUrl ? (
                  <img
                    src={eventoDestacado.fotoUrl}
                    alt="Destacado"
                    className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">NO DATA</div>
                )}
              </div>

              <p className="text-sm text-wiki-muted mb-4">
                Evento clasificado como de alta prioridad histórica.
              </p>

              <button className="w-full py-2 bg-transparent border border-wiki-border text-wiki-text text-xs hover:bg-wiki-border transition-colors uppercase">
                VER ARCHIVO CONFIDENCIAL
              </button>
            </div>

            {/* Decoración extra */}
            <div className="mt-4 p-4 border border-dashed border-wiki-border rounded opacity-60">
              <p className="text-xs text-wiki-muted">ESTADO DE RED:</p>
              <div className="flex justify-between text-sm mt-1">
                <span>Nodos Activos:</span>
                <span className="font-mono text-green-500">{personas.length + listaDeEventos.length}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;