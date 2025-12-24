import { useState } from 'react';
import PersonajeCard from '../components/PersonajeCard';
import { listaDePersonajes, listaDeEventos } from '../data';

const Home = () => {
  const [seccionActual, setSeccionActiva] = useState('PERSONAJES');

  // Tomamos el primer evento como "Destacado"
  // Si no hay foto, usamos un color gris por defecto
  const eventoDestacado = listaDeEventos[0]; 

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
        
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-wiki-block border border-wiki-border rounded text-xs text-green-400">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          SYSTEM ONLINE
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
              className={`pb-2 px-1 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
                seccionActual === 'PERSONAJES' 
                  ? 'border-wiki-accent text-white' 
                  : 'border-transparent text-wiki-muted hover:text-white'
              }`}
            >
              [01] Personajes
            </button>
            <button
              onClick={() => setSeccionActiva('EVENTOS')}
              className={`pb-2 px-1 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
                seccionActual === 'EVENTOS' 
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
              listaDePersonajes.map((personaje) => (
                <PersonajeCard 
                  key={personaje.id}
                  id={personaje.id}
                  nombreCompleto={personaje.nombreCompleto}
                  titulo={personaje.titulo}
                  fotoUrl={personaje.fotoUrl}
                />
              ))
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
                    <span className="font-mono text-green-500">{listaDePersonajes.length + listaDeEventos.length}</span>
                </div>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Home;