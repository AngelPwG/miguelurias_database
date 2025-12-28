import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerPersonaPorId } from '../api/personaService';
import { obtenerArticuloPorId } from '../api/articuloService';

const PersonaDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [persona, setPersona] = useState(null);
    const [articulo, setArticulo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para galería (simple carousel logic)
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                // 1. Cargar Persona
                const dataPersona = await obtenerPersonaPorId(id);
                setPersona(dataPersona);

                // 2. Cargar Artículo si existe
                if (dataPersona.articuloId) {
                    try {
                        const dataArticulo = await obtenerArticuloPorId(dataPersona.articuloId);
                        setArticulo(dataArticulo);
                    } catch (errArt) {
                        console.error('Error cargando artículo:', errArt);
                        // No fallamos toda la página si falta el artículo, solo mostramos lo que hay
                    }
                }
                setError(null);
            } catch (err) {
                console.error('Error cargando persona:', err);
                setError('No se pudo cargar la información de la persona.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            cargarDatos();
        }
    }, [id]);

    const nextImage = () => {
        if (!articulo?.galeria) return;
        setCurrentImageIndex((prev) =>
            prev === articulo.galeria.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        if (!articulo?.galeria) return;
        setCurrentImageIndex((prev) =>
            prev === 0 ? articulo.galeria.length - 1 : prev - 1
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-wiki-bg text-wiki-text p-4 md:p-8 font-mono flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-pulse text-wiki-accent text-xl mb-4">██████</div>
                    <p className="text-wiki-muted">Cargando datos clasificados...</p>
                </div>
            </div>
        );
    }

    if (error || !persona) {
        return (
            <div className="min-h-screen bg-wiki-bg text-wiki-text p-4 md:p-8 font-mono">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-900/20 border border-red-500 text-red-300 p-6 rounded">
                        <p className="font-bold text-xl mb-2">⚠️ Error</p>
                        <p>{error || 'Persona no encontrada'}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 px-4 py-2 border border-wiki-border hover:bg-wiki-border transition-colors"
                        >
                            ← VOLVER AL INICIO
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-wiki-bg text-wiki-text p-4 md:p-8 font-mono">
            {/* Header */}
            <header className="mb-8 border-b border-wiki-border pb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
                            ARCHIVO <span className="text-wiki-accent">#{persona.id}</span>
                        </h1>
                        <p className="text-wiki-muted text-sm mt-1 uppercase">
                            CLASIFICACIÓN: PÚBLICA
                        </p>
                    </div>
                    <div className="flex gap-4">
                        {['admin', 'editor'].includes(localStorage.getItem('userRole')) && (
                            <button
                                onClick={() => navigate(`/editar-persona/${id}`)}
                                className="px-4 py-2 bg-wiki-accent text-black font-bold hover:bg-green-400 transition-colors text-sm"
                            >
                                ✎ EDITAR
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 border border-wiki-border hover:bg-wiki-border transition-colors text-sm"
                        >
                            ← VOLVER
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* === COLUMNA IZQUIERDA (MAIN CONTENT) === */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. FICHA TÉCNICA (Resumen) */}
                        <div className="bg-wiki-block border border-wiki-border rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-24 h-24 bg-gray-800 border border-wiki-border rounded flex items-center justify-center overflow-hidden">
                                    {/* Preferir foto de portada si existe */}
                                    {persona.imagenPortadaUrl ? (
                                        <img src={persona.imagenPortadaUrl} className="w-full h-full object-cover" alt="Avatar" />
                                    ) : (
                                        <span className="text-4xl">👤</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-1">{persona.nombre}</h2>
                                    {persona.apodos && (
                                        <p className="text-wiki-accent text-sm mb-2 font-bold">
                                            ALIAS: "{persona.apodos}"
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${persona.estado === 'activo'
                                            ? 'bg-green-900/30 text-green-400 border border-green-500/50'
                                            : 'bg-gray-900/30 text-gray-400 border border-gray-500/50'
                                            }`}>
                                            STATUS: {persona.estado?.toUpperCase() || 'DESCONOCIDO'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {persona.loreGeneral && (
                                <div className="mt-6 p-4 bg-wiki-bg border-l-4 border-wiki-accent rounded italic text-wiki-muted text-sm">
                                    "{persona.loreGeneral}"
                                </div>
                            )}
                        </div>

                        {/* 2. GALERÍA DE IMÁGENES (Carousel) */}
                        {articulo?.galeria && articulo.galeria.length > 0 && (
                            <div className="bg-wiki-block border border-wiki-border rounded-lg p-2 overflow-hidden">
                                <div className="relative h-64 md:h-96 bg-black flex items-center justify-center">
                                    <img
                                        src={articulo.galeria[currentImageIndex].url}
                                        alt={`Galería ${currentImageIndex}`}
                                        className="max-h-full max-w-full object-contain"
                                    />

                                    {/* Controles del Carousel */}
                                    {articulo.galeria.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full"
                                            >
                                                &#10094;
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full"
                                            >
                                                &#10095;
                                            </button>
                                            <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                                                {currentImageIndex + 1} / {articulo.galeria.length}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 3. CONTENIDO DEL ARTÍCULO (Secciones) */}
                        {articulo ? (
                            <div className="space-y-8">
                                <div className="border-b border-wiki-border pb-2">
                                    <h3 className="text-xl font-bold text-wiki-accent uppercase tracking-wider">
                                        [01] INFORME BIOGRÁFICO
                                    </h3>
                                </div>

                                {articulo.secciones && articulo.secciones.length > 0 ? (
                                    articulo.secciones.map((seccion) => (
                                        <div key={seccion.id} className="animate-fade-in">
                                            {seccion.titulo && (
                                                <h4 className="text-lg font-bold text-white mb-2 mt-6 border-l-2 border-wiki-accent pl-2">
                                                    {seccion.titulo}
                                                </h4>
                                            )}

                                            {(seccion.tipo && seccion.tipo.toLowerCase() === 'texto') && (
                                                <div className="text-wiki-text leading-relaxed whitespace-pre-wrap text-justify">
                                                    {seccion.contenido}
                                                </div>
                                            )}

                                            {seccion.tipo === 'imagen' && seccion.multimedia && (
                                                <div className="my-4">
                                                    <img
                                                        src={seccion.multimedia.url}
                                                        alt={seccion.titulo || 'Imagen del artículo'}
                                                        className="w-full rounded border border-wiki-border hover:opacity-95 transition-opacity"
                                                    />
                                                    {seccion.titulo && (
                                                        <p className="text-xs text-center text-wiki-muted mt-1 italic">
                                                            Fig. {seccion.orden}: {seccion.titulo}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-wiki-muted italic">No hay registros detallados disponibles.</p>
                                )}
                            </div>
                        ) : (
                            <div className="p-8 text-center border border-dashed border-wiki-border rounded text-wiki-muted">
                                <p>Cargando datos del artículo o archivo corrupto...</p>
                            </div>
                        )}

                    </div>

                    {/* === COLUMNA DERECHA (METADATA SIDEBAR) === */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Datos de Contacto */}
                        <div className="bg-wiki-block border border-wiki-border rounded-lg p-5">
                            <h3 className="text-sm font-bold text-wiki-accent uppercase mb-4 flex items-center gap-2">
                                <span>📞</span> CANALES DE CONTACTO
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-wiki-muted text-xs mb-1">TELÉFONO</p>
                                    <p className="text-white font-mono">{persona.telefono || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-wiki-muted text-xs mb-1">DIRECCIÓN</p>
                                    <p className="text-white">{persona.direccion || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Info Extra */}
                        <div className="bg-wiki-block border border-wiki-border rounded-lg p-5">
                            <h3 className="text-sm font-bold text-wiki-accent uppercase mb-4">
                                DATOS DE REGISTRO
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-wiki-muted text-xs mb-1">CUMPLEAÑOS</p>
                                    <p className="text-white">
                                        {persona.cumple
                                            ? new Date(persona.cumple).toLocaleDateString(undefined, { timeZone: 'UTC' })
                                            : 'DESCONOCIDO'}
                                    </p>
                                </div>
                                {articulo?.autorNombre && (
                                    <div>
                                        <p className="text-wiki-muted text-xs mb-1">REGISTRADO POR</p>
                                        <p className="text-white font-mono uppercase text-wiki-accent">
                                            {articulo.autorNombre}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Afiliaciones (Grupos) - CHIPS */}
                        <div className="bg-wiki-block border border-wiki-border rounded-lg p-5">
                            <h3 className="text-sm font-bold text-wiki-accent uppercase mb-4">
                                AFILIACIONES
                            </h3>
                            {persona.grupos && persona.grupos.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {persona.grupos.map(grupo => (
                                        <div key={grupo.id} className="inline-flex items-center bg-wiki-accent/10 border border-wiki-accent/30 rounded-full px-3 py-1 text-xs hover:bg-wiki-accent/20 transition-colors cursor-pointer text-wiki-accent">
                                            <span className="font-bold mr-1">{grupo.nombre}</span>
                                            {grupo.liderNombre && (
                                                <span className="opacity-70 text-[10px] ml-1 border-l border-wiki-accent/30 pl-1">{grupo.liderNombre}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-wiki-muted text-xs italic">Sin afiliaciones conocidas.</p>
                            )}
                        </div>

                        {/* Relaciones Personales - CHIPS */}
                        <div className="bg-wiki-block border border-wiki-border rounded-lg p-5">
                            <h3 className="text-sm font-bold text-wiki-accent uppercase mb-4">
                                RELACIONES PERSONALES
                            </h3>
                            {persona.relaciones && persona.relaciones.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {persona.relaciones.map((rel, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => navigate(`/persona/${rel.personaDestinoId}`)}
                                            className="inline-flex items-center bg-purple-900/30 border border-purple-500/30 rounded-full px-3 py-1 text-xs hover:bg-purple-900/50 transition-colors cursor-pointer text-purple-300"
                                        >
                                            <span className="font-bold mr-1">{rel.personaDestinoNombre}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-wiki-muted text-xs italic">Sin relaciones personales registradas.</p>
                            )}
                        </div>

                        {/* Historial de Eventos - TIMELINE CHIPS */}
                        <div className="bg-wiki-block border border-wiki-border rounded-lg p-5">
                            <h3 className="text-sm font-bold text-wiki-accent uppercase mb-4">
                                HISTORIAL DE EVENTOS
                            </h3>
                            {persona.eventos && persona.eventos.length > 0 ? (
                                <div className="space-y-2">
                                    {persona.eventos.map(evento => (
                                        <div key={evento.id} className="flex items-center gap-2 text-xs bg-gray-900/50 p-2 rounded border border-gray-700 hover:border-wiki-muted transition-colors">
                                            <span className="font-mono text-wiki-muted bg-black/30 px-1 rounded">
                                                {evento.fechaIni ? new Date(evento.fechaIni).getFullYear() : 'N/A'}
                                            </span>
                                            <span className="font-bold text-gray-300 flex-1">{evento.nombre}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-wiki-muted text-xs italic">Sin participación en eventos.</p>
                            )}
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default PersonaDetailPage;
