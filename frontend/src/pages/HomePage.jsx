import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonajeCard from '../components/PersonajeCard';
import { obtenerPersonasCards, eliminarPersona } from '../api/personaService';
import { obtenerEventosCards, eliminarEvento } from '../api/eventoService';

const Home = () => {
  const navigate = useNavigate();
  const [seccionActual, setSeccionActiva] = useState('PERSONAJES');

  // Auth State
  const [currentUser, setCurrentUser] = useState({ id: null, role: 'USER', level: 0 });

  // Data State - Personas
  const [personas, setPersonas] = useState([]);
  const [personasPage, setPersonasPage] = useState(0);
  const [loadingPersonas, setLoadingPersonas] = useState(false);
  const [hasMorePersonas, setHasMorePersonas] = useState(true);
  const [errorPersonas, setErrorPersonas] = useState(null);

  // Data State - Events
  const [eventos, setEventos] = useState([]);
  const [eventosPage, setEventosPage] = useState(0);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [hasMoreEventos, setHasMoreEventos] = useState(true);
  const [errorEventos, setErrorEventos] = useState(null);
  const [eventosLoaded, setEventosLoaded] = useState(false); // Lazy load flag

  // 1. Cargar Usuario Local (Sync)
  useEffect(() => {
    const userId = Number(localStorage.getItem('userId'));
    const userRole = localStorage.getItem('userRole') || 'USER';
    const userLevel = Number(localStorage.getItem('userLevel')) || 0;
    setCurrentUser({ id: userId, role: userRole, level: userLevel });
  }, []);

  // 2. Cargar Personas (Pagina 0 al montar)
  useEffect(() => {
    cargarPersonas(0);
  }, []);

  // 3. Lazy Load Eventos
  useEffect(() => {
    if (seccionActual === 'EVENTOS' && !eventosLoaded) {
      cargarEventos(0);
      setEventosLoaded(true);
    }
  }, [seccionActual, eventosLoaded]);

  const cargarPersonas = async (page) => {
    try {
      setLoadingPersonas(true);
      const data = await obtenerPersonasCards(page, 10); // Page size 10

      if (page === 0) {
        setPersonas(data.content);
      } else {
        setPersonas(prev => [...prev, ...data.content]);
      }

      setHasMorePersonas(!data.last);
      setPersonasPage(page);
      setErrorPersonas(null);
    } catch (err) {
      console.error('Error cargando personas:', err);
      setErrorPersonas('No se pudieron cargar los datos.');
    } finally {
      setLoadingPersonas(false);
    }
  };

  const cargarEventos = async (page) => {
    try {
      setLoadingEventos(true);
      const data = await obtenerEventosCards(page, 10);

      if (page === 0) {
        setEventos(data.content);
      } else {
        setEventos(prev => [...prev, ...data.content]);
      }

      setHasMoreEventos(!data.last);
      setEventosPage(page);
      setErrorEventos(null);
    } catch (err) {
      console.error('Error cargando eventos:', err);
      setErrorEventos('No se pudieron cargar los eventos.');
    } finally {
      setLoadingEventos(false);
    }
  };

  const handleLoadMorePersonas = () => {
    if (!loadingPersonas && hasMorePersonas) {
      cargarPersonas(personasPage + 1);
    }
  };

  const handleLoadMoreEventos = () => {
    if (!loadingEventos && hasMoreEventos) {
      cargarEventos(eventosPage + 1);
    }
  };

  // Función de logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userLevel');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Función de eliminar
  const handleDelete = async (id) => {
    try {
      await eliminarPersona(id);
      // Eliminar de la lista localmente
      setPersonas(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Error eliminando la persona: ' + (err.response?.data?.message || err.message));
    }
  };

  // Función de eliminar evento
  const handleDeleteEvento = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este evento?")) return;
    try {
      await eliminarEvento(id);
      setEventos(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert('Error eliminando evento: ' + (err.response?.data?.message || err.message));
    }
  };

  // Evento destacado (solo visual)
  const eventoDestacado = eventos.length > 0 ? eventsSorted(eventos)[0] : {
    nombre: "Sin Eventos Próximos",
    fechaIni: null,
    imagenPortadaUrl: null
  };

  function eventsSorted(evs) {
    return evs; // Could sort by date if needed
  }

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
          <div className="flex gap-2">
            {(currentUser.role === 'ROLE_admin' || currentUser.role === 'admin' || currentUser.role === 'ROLE_editor' || currentUser.role === 'editor') && (
              <>
                <button
                  onClick={() => navigate('/crear-persona')}
                  className="px-4 py-2 bg-wiki-accent text-black font-bold hover:bg-green-400 transition-colors text-sm"
                >
                  + PERSONA
                </button>
                <button
                  onClick={() => navigate('/crear-evento')}
                  className="px-4 py-2 bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors text-sm"
                >
                  + EVENTO
                </button>
              </>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-colors text-sm"
          >
            CERRAR SESIÓN
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-wiki-block border border-wiki-border rounded text-xs text-green-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            SYSTEM ONLINE (Lvl {currentUser.level})
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
                {/* Error */}
                {errorPersonas && (
                  <div className="col-span-full">
                    <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded">
                      <p className="font-bold">⚠️ Error</p>
                      <p className="text-sm mt-1">{errorPersonas}</p>
                    </div>
                  </div>
                )}

                {/* Lista */}
                {personas.map((persona) => {
                  const isAdmin = currentUser.role === 'ROLE_admin' || currentUser.role === 'admin';
                  const isOwner = currentUser.id && persona.autorId && (currentUser.id === persona.autorId);
                  const shouldShowDelete = isAdmin || isOwner;

                  return (
                    <PersonajeCard
                      key={persona.id}
                      id={persona.id}
                      nombreCompleto={persona.nombre}
                      titulo={persona.apodos || 'Sin apodo'}
                      fotoUrl={persona.imagenPortadaUrl}
                      shouldShowDelete={shouldShowDelete}
                      onDelete={handleDelete}
                    />
                  );
                })}

                {/* Empty State */}
                {!loadingPersonas && personas.length === 0 && !errorPersonas && (
                  <div className="col-span-full text-center py-8 text-wiki-muted">
                    <p>No hay registros disponibles.</p>
                  </div>
                )}

                {/* Load More Button */}
                {hasMorePersonas && (
                  <div className="col-span-full flex justify-center mt-4">
                    <button
                      onClick={handleLoadMorePersonas}
                      disabled={loadingPersonas}
                      className="px-6 py-2 bg-wiki-block border border-wiki-border text-wiki-accent hover:bg-wiki-border transition-colors uppercase text-sm font-bold"
                    >
                      {loadingPersonas ? 'Cargando...' : 'Cargar más personas'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              // LÓGICA DE EVENTOS
              <>
                {errorEventos && (
                  <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded">
                    <p className="font-bold">⚠️ Error</p>
                    <p className="text-sm mt-1">{errorEventos}</p>
                  </div>
                )}

                {eventos.map((evento) => (
                  <div
                    key={evento.id}
                    onClick={() => navigate(`/eventos/${evento.id}`)}
                    className="bg-wiki-block border border-wiki-border rounded overflow-hidden hover:border-wiki-accent transition-colors flex h-32 cursor-pointer hover:border-wiki-accent/80"
                  >
                    {/* 1. FOTO DEL EVENTO */}
                    <div className="w-40 flex-shrink-0 bg-gray-800 relative">
                      {evento.imagenPortadaUrl ? (
                        <img
                          src={evento.imagenPortadaUrl}
                          alt={evento.nombre}
                          className="w-full h-full object-cover opacity-80"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">NO IMAGE</div>
                      )}
                    </div>

                    {/* 2. TEXTO DEL EVENTO */}
                    <div className="p-4 flex flex-col justify-center flex-1">
                      <h3 className="font-bold text-lg text-gray-100">{evento.nombre}</h3>
                      <p className="text-wiki-muted text-sm">
                        Fecha: {evento.fechaIni ? new Date(evento.fechaIni).toLocaleDateString() : 'N/A'}
                      </p>
                      {evento.ubicacion && <p className="text-xs text-gray-500 mt-1">📍 {evento.ubicacion}</p>}
                    </div>

                    {/* 3. ACCIONES (Admin) */}
                    {(currentUser.role === 'ROLE_admin' || currentUser.role === 'admin') && (
                      <div className="flex flex-col justify-center p-2 gap-2 border-l border-wiki-border bg-black/20">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/editar-evento/${evento.id}`); }}
                          className="bg-blue-600 text-white p-1 rounded hover:bg-blue-500 text-xs font-bold"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteEvento(evento.id); }}
                          className="bg-red-600 text-white p-1 rounded hover:bg-red-500 text-xs font-bold"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Empty State */}
                {!loadingEventos && eventsSorted.length === 0 && !errorEventos && (
                  <div className="text-center py-8 text-wiki-muted">
                    <p>No hay registros disponibles.</p>
                  </div>
                )}

                {/* Load More Button */}
                {hasMoreEventos && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={handleLoadMoreEventos}
                      disabled={loadingEventos}
                      className="px-6 py-2 bg-wiki-block border border-wiki-border text-wiki-accent hover:bg-wiki-border transition-colors uppercase text-sm font-bold"
                    >
                      {loadingEventos ? 'Cargando...' : 'Cargar más eventos'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* === COLUMNA DERECHA (SIDEBAR DESTACADO) === */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-wiki-block border border-wiki-border rounded-lg p-5">
              <div className="text-xs text-wiki-accent font-bold uppercase mb-2 flex justify-between">
                <span> Destacado</span>
                <span>{eventoDestacado.fechaIni ? new Date(eventoDestacado.fechaIni).toLocaleDateString() : 'Próximamente'}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                {eventoDestacado.nombre}
              </h3>

              <div className="w-full h-32 bg-gray-800 rounded mb-4 overflow-hidden border border-wiki-border">
                {eventoDestacado.imagenPortadaUrl ? (
                  <img
                    src={eventoDestacado.imagenPortadaUrl}
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
                <span className="font-mono text-green-500">{personas.length + eventos.length}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;