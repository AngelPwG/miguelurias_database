import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerEventoPorId } from '../api/eventoService';
import { obtenerArticuloPorId } from '../api/articuloService';

const EventoDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [evento, setEvento] = useState(null);
    const [articulo, setArticulo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                // 1. Cargar Evento (incluye participantes)
                const dataEvento = await obtenerEventoPorId(id);
                setEvento(dataEvento);

                // 2. Cargar Artículo Completo (si tiene)
                if (dataEvento.articuloId) {
                    const dataArticulo = await obtenerArticuloPorId(dataEvento.articuloId);
                    setArticulo(dataArticulo);
                }
            } catch (err) {
                console.error("Error cargando evento:", err);
                setError("Evento Inexistente.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            cargarDatos();
        }
    }, [id]);

    if (loading) return <div className="text-white p-8 animate-pulse">Cargando datos del evento...</div>;
    if (error) return <div className="text-red-400 p-8 border border-red-500 bg-red-900/20 m-4 rounded">{error}</div>;
    if (!evento) return <div className="text-white p-8">Evento Inexistente.</div>;

    const tieneGaleria = articulo && articulo.galeria && articulo.galeria.length > 0;
    const secciones = articulo ? articulo.secciones.sort((a, b) => a.orden - b.orden) : [];

    return (
        <div className="min-h-screen bg-wiki-bg text-wiki-text p-4 md:p-8 font-mono">
            {/* HEADER */}
            <header className="mb-8 border-b border-wiki-border pb-6 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">EVENTO</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">
                        {evento.nombre}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-sm text-wiki-muted">
                        <div className="flex items-center gap-1">
                            <span>📅</span>
                            <span>{new Date(evento.fechaIni).toLocaleDateString()}</span>
                            {evento.fechaFin && <span> - {new Date(evento.fechaFin).toLocaleDateString()}</span>}
                        </div>
                        {evento.ubicacion && (
                            <div className="flex items-center gap-1">
                                <span>📍</span>
                                <span>{evento.ubicacion}</span>
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 border border-wiki-border hover:bg-wiki-border transition-colors text-sm"
                >
                    ← VOLVER
                </button>
            </header>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUMNA IZQUIERDA: CONTENIDO PRINCIPAL */}
                <div className="lg:col-span-2 space-y-8">

                    {/* SINOPSIS */}
                    {evento.sinopsis && (
                        <div className="bg-wiki-block border border-wiki-border p-6 rounded relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-wiki-accent"></div>
                            <h2 className="text-lg font-bold text-wiki-accent mb-2">Resumen Operativo</h2>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                {evento.sinopsis}
                            </p>
                        </div>
                    )}

                    {/* ARTICULO / HISTORIA */}
                    {articulo && (
                        <div className="space-y-8">
                            {secciones.map((sec) => (
                                <div key={sec.id} className="scroll-mt-20">
                                    {sec.titulo && <h3 className="text-2xl font-bold text-white mb-4 border-b border-wiki-border pb-2">{sec.titulo}</h3>}

                                    {/* Contenido Texto */}
                                    {sec.tipo?.toLowerCase() === 'texto' && sec.contenido && (
                                        <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line">
                                            {sec.contenido}
                                        </div>
                                    )}

                                    {/* Contenido Imagen (Sección) */}
                                    {sec.tipo?.toLowerCase() === 'imagen' && sec.multimedia && (
                                        <div className="my-4">
                                            <img
                                                src={sec.multimedia.url}
                                                alt={sec.titulo || 'Imagen de sección'}
                                                className="w-full rounded border border-wiki-border shadow-lg"
                                            />
                                            {sec.contenido && <p className="text-sm text-center text-wiki-muted mt-2 italic">{sec.contenido}</p>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* GALERÍA */}
                    {tieneGaleria && (
                        <div className="mt-12 pt-8 border-t border-wiki-border">
                            <h2 className="text-xl font-bold text-wiki-accent mb-4">Evidencia Visual</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {articulo.galeria.map((img) => (
                                    <div key={img.id} className="relative group aspect-square bg-gray-900 rounded overflow-hidden border border-wiki-border cursor-pointer hover:border-wiki-accent transition-colors">
                                        <img
                                            src={img.url}
                                            alt="Galeria"
                                            className="w-full h-full object-cover"
                                            onClick={() => window.open(img.url, '_blank')}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* COLUMNA DERECHA: SIDEBAR */}
                <div className="space-y-6">

                    {/* PARTICIPANTES */}
                    <div className="bg-wiki-block border border-wiki-border p-5 rounded">
                        <h3 className="text-sm font-bold text-wiki-accent uppercase tracking-wider mb-4 border-b border-wiki-border pb-2">
                            Personal Involucrado
                        </h3>
                        {evento.participantes && evento.participantes.length > 0 ? (
                            <ul className="space-y-3">
                                {evento.participantes.map((p) => (
                                    <li key={p.id} className="flex items-start gap-3 group cursor-pointer" onClick={() => navigate(`/personas/${p.id}`)}>
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold ring-1 ring-gray-600 group-hover:ring-wiki-accent">
                                            {p.nombre.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm group-hover:text-wiki-accent transition-colors">
                                                {p.nombre}
                                            </div>
                                            <div className="text-xs text-blue-300 font-mono">
                                                {p.rol || 'Participante'}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-wiki-muted italic">No hay participantes registrados.</p>
                        )}
                    </div>

                    {/* META DATA */}
                    <div className="border border-dashed border-wiki-border p-4 rounded opacity-70 text-xs text-wiki-muted font-mono">
                        {articulo && (
                            <div className="flex justify-between">
                                <span>AUTOR:</span>
                                <span>{articulo.usernameAutor || 'Desconocido'}</span>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EventoDetailPage;
