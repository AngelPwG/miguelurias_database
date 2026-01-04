import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearEvento } from '../api/eventoService';
import { obtenerPersonasSimple } from '../api/personaService';
import { subirArchivo, subirMultiplesArchivos } from '../api/multimediaService';
import SeccionEditor from '../components/SeccionEditor';

const CrearEventoPage = () => {
    const navigate = useNavigate();

    // Estado para los datos del evento
    const [eventoData, setEventoData] = useState({
        nombre: '',
        fechaIni: '',
        fechaFin: '',
        ubicacion: '',
        sinopsis: ''
    });

    // Estados para participantes (Personas)
    const [todasPersonas, setTodasPersonas] = useState([]);
    const [participantesSeleccionados, setParticipantesSeleccionados] = useState([]); // Array of { personaId, rol }
    const [selectedPersonaId, setSelectedPersonaId] = useState('');
    const [selectedRol, setSelectedRol] = useState('');

    // Estado para la galería principal (Archivos + Previews)
    const [galeriaFiles, setGaleriaFiles] = useState([]);
    const [galeriaPreviews, setGaleriaPreviews] = useState([]);

    // Estado para el artículo
    const [articuloData, setArticuloData] = useState({
        titulo: '',
        tipo: 'evento', // Tipo fijo
        nivelAcceso: 1, // Default to 1 per user request
        secciones: [
            {
                tipo: 'texto',
                contenido: '',
                orden: 1,
                nivel: 1
            }
        ]
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar listas
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const dataPersonas = await obtenerPersonasSimple();
                setTodasPersonas(dataPersonas || []);
            } catch (err) {
                console.error("Error cargando personas:", err);
            }
        };

        const userRole = localStorage.getItem('userRole') || 'USER';
        if (userRole === 'ROLE_user' || userRole === 'USER') {
            alert('⛔ Acceso denegado: Los lectores no pueden crear contenido.');
            navigate('/');
        } else {
            cargarDatos();
        }
    }, [navigate]);

    const handleEventoChange = (e) => {
        const { name, value } = e.target;
        setEventoData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleArticuloChange = (e) => {
        const { name, value } = e.target;
        setArticuloData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejo de archivos de galería
    const handleGaleriaChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setGaleriaFiles(prev => [...prev, ...files]);

            // Generar previews
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGaleriaPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeGaleriaImage = (index) => {
        setGaleriaFiles(prev => prev.filter((_, i) => i !== index));
        setGaleriaPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Participantes logic
    const handleAgregarParticipante = () => {
        if (!selectedPersonaId) return;
        const idNum = Number(selectedPersonaId);

        if (participantesSeleccionados.some(p => p.personaId === idNum)) {
            alert("Esta persona ya está agregada como participante.");
            return;
        }

        const rolFinal = selectedRol.trim() || 'Participante';
        setParticipantesSeleccionados(prev => [...prev, { personaId: idNum, rol: rolFinal }]);
        setSelectedPersonaId('');
        setSelectedRol('');
    };

    const eliminarParticipante = (idEliminar) => {
        setParticipantesSeleccionados(prev => prev.filter(p => p.personaId !== idEliminar));
    };

    // ========== FUNCIONES PARA MANEJAR SECCIONES ==========

    const agregarSeccion = () => {
        const nuevaSeccion = {
            tipo: 'texto',
            titulo: '',
            contenido: '',
            orden: articuloData.secciones.length + 1,
            nivel: 1
        };

        setArticuloData(prev => ({
            ...prev,
            secciones: [...prev.secciones, nuevaSeccion]
        }));
    };

    const eliminarSeccion = (index) => {
        if (articuloData.secciones.length === 1) {
            alert('⚠️ Debe haber al menos una sección');
            return;
        }

        const nuevasSecciones = articuloData.secciones.filter((_, i) => i !== index);
        // Reajustar órdenes
        const seccionesReordenadas = nuevasSecciones.map((seccion, i) => ({
            ...seccion,
            orden: i + 1
        }));

        setArticuloData(prev => ({
            ...prev,
            secciones: seccionesReordenadas
        }));
    };

    const actualizarSeccion = (index, campo, valor) => {
        setArticuloData(prev => ({
            ...prev,
            secciones: prev.secciones.map((seccion, i) =>
                i === index ? { ...seccion, [campo]: valor } : seccion
            )
        }));
    };

    const moverSeccion = (index, direccion) => {
        const nuevasSecciones = [...articuloData.secciones];
        const nuevoIndex = direccion === 'arriba' ? index - 1 : index + 1;

        if (nuevoIndex < 0 || nuevoIndex >= nuevasSecciones.length) return;

        // Intercambiar posiciones
        [nuevasSecciones[index], nuevasSecciones[nuevoIndex]] =
            [nuevasSecciones[nuevoIndex], nuevasSecciones[index]];

        // Reajustar órdenes
        const seccionesReordenadas = nuevasSecciones.map((seccion, i) => ({
            ...seccion,
            orden: i + 1
        }));

        setArticuloData(prev => ({
            ...prev,
            secciones: seccionesReordenadas
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 0. Validaciones de Permisos y Niveles
            const userRole = localStorage.getItem('userRole');
            const userLevel = Number(localStorage.getItem('userLevel')) || 0;
            const nivelArticulo = Number(articuloData.nivelAcceso);

            // Regla General: Nivel máximo de artículo es 5
            if (nivelArticulo > 5) {
                throw new Error("⛔ El nivel máximo permitido para cualquier artículo es 5.");
            }

            // Regla Editor: Nivel artículo <= Nivel Usuario
            if (userRole === 'ROLE_editor' && nivelArticulo > userLevel) {
                throw new Error(`⛔ Como Editor, no puedes crear contenido con nivel mayor a tu rango (${userLevel}).`);
            }

            // 1️⃣ Subir imágenes de la galería principal
            let galeriaIds = [];
            if (galeriaFiles.length > 0) {
                try {
                    galeriaIds = await subirMultiplesArchivos(galeriaFiles, 'imagen');
                } catch (err) {
                    throw new Error(`Error al subir fotos de galería: ${err.message}`);
                }
            }

            // 2️⃣ Subir imágenes de las secciones
            const seccionesConImagenes = await Promise.all(
                articuloData.secciones.map(async (seccion) => {
                    // Validar Nivel de Sección
                    const nivelSeccion = Number(seccion.nivel);

                    // Regla General: Nivel Sección >= Nivel Artículo
                    if (nivelSeccion < nivelArticulo) {
                        throw new Error(`⛔ La sección "${seccion.titulo || 'Sin Título'}" tiene nivel ${nivelSeccion}, inferior al nivel del artículo (${nivelArticulo}).`);
                    }

                    // Regla Editor: Nivel Sección <= Nivel Usuario
                    if (userRole === 'ROLE_editor' && nivelSeccion > userLevel) {
                        throw new Error(`⛔ Sección "${seccion.titulo || 'Sin Título'}" excede tu nivel de usuario (${userLevel}).`);
                    }

                    if (seccion.tipo === 'imagen' && seccion.archivoImagen) {
                        try {
                            const multimediaId = await subirArchivo(
                                seccion.archivoImagen,
                                'imagen',
                                seccion.titulo || ''
                            );
                            return {
                                ...seccion,
                                multimediaId: multimediaId,
                                archivoImagen: undefined
                            };
                        } catch (error) {
                            throw new Error(`Error al subir imagen de la sección ${seccion.orden}: ${error.message}`);
                        }
                    } else {
                        return {
                            tipo: seccion.tipo,
                            titulo: seccion.titulo,
                            contenido: seccion.contenido,
                            orden: seccion.orden,
                            nivel: seccion.nivel
                        };
                    }
                })
            );

            // 3️⃣ Recolectar IDs de imágenes de las secciones para agregarlas también a la galería
            const idsDeSecciones = seccionesConImagenes
                .filter(s => s.tipo === 'imagen' && s.multimediaId)
                .map(s => s.multimediaId);

            const todosLosIdsMultimedia = [...galeriaIds, ...idsDeSecciones];

            // 4️⃣ Preparar Datos de Artículo
            const articuloConTitulo = {
                ...articuloData,
                titulo: articuloData.titulo || `Reporte de Evento: ${eventoData.nombre}`,
                galeriaMultimediaIds: todosLosIdsMultimedia,
                secciones: seccionesConImagenes
            };

            // 5️⃣ Preparar Request Final
            // Formatear fechas a ISO string si existen
            const formatDate = (dateStr) => {
                if (!dateStr) return null;
                return new Date(dateStr).toISOString();
            };

            const eventoCreateRequest = {
                nombre: eventoData.nombre,
                fechaIni: formatDate(eventoData.fechaIni),
                fechaFin: formatDate(eventoData.fechaFin),
                ubicacion: eventoData.ubicacion,
                sinopsis: eventoData.sinopsis,
                participantes: participantesSeleccionados, // Changed: sending objects list
                articuloRequest: articuloConTitulo
            };

            // 6️⃣ Enviar al backend
            await crearEvento(eventoCreateRequest);
            alert('✅ Evento creado exitosamente!');
            navigate('/');
        } catch (err) {
            console.error('Error al crear evento:', err);
            setError(err.response?.data?.message || err.message || 'Error al crear el evento.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-wiki-bg text-wiki-text p-4 md:p-8 font-mono">
            {/* Header */}
            <header className="mb-8 border-b border-wiki-border pb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
                            NUEVO <span className="text-wiki-accent">EVENTO</span>
                        </h1>
                        <p className="text-wiki-muted text-sm mt-1">Registrar acontecimiento histórico</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 border border-wiki-border hover:bg-wiki-border transition-colors text-sm"
                    >
                        ← VOLVER
                    </button>
                </div>
            </header>

            {/* Formulario */}
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded">
                            <p className="font-bold">⚠️ Error</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    )}

                    {/* Sección: Datos del Evento */}
                    <div className="bg-wiki-block border border-wiki-border rounded-lg p-6">
                        <h2 className="text-xl font-bold text-wiki-accent mb-4">[01] DATOS DEL EVENTO</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2">Nombre del Evento *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={eventoData.nombre}
                                    onChange={handleEventoChange}
                                    required
                                    className="w-full bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none"
                                    placeholder="Ej: La Batalla del Puente"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Fecha Inicio</label>
                                <input
                                    type="datetime-local" // Changed to datetime-local for better precision if needed, or date
                                    name="fechaIni"
                                    value={eventoData.fechaIni}
                                    onChange={handleEventoChange}
                                    className="w-full bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Fecha Fin</label>
                                <input
                                    type="datetime-local"
                                    name="fechaFin"
                                    value={eventoData.fechaFin}
                                    onChange={handleEventoChange}
                                    className="w-full bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2">Ubicación</label>
                                <input
                                    type="text"
                                    name="ubicacion"
                                    value={eventoData.ubicacion}
                                    onChange={handleEventoChange}
                                    className="w-full bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none"
                                    placeholder="Ej: Ciudad Central"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2">Sinopsis / Resumen</label>
                                <textarea
                                    name="sinopsis"
                                    value={eventoData.sinopsis}
                                    onChange={handleEventoChange}
                                    rows="3"
                                    className="w-full bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none"
                                    placeholder="Resumen corto del evento..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección: Participantes */}
                    <div className="bg-wiki-block border border-wiki-border rounded-lg p-6">
                        <h2 className="text-xl font-bold text-wiki-accent mb-4">[02] PARTICIPANTES</h2>
                        <div className="flex gap-4 mb-4 items-end">
                            <div className="flex-1">
                                <label className="block text-xs font-bold mb-1 text-wiki-muted">Persona</label>
                                <select
                                    value={selectedPersonaId}
                                    onChange={(e) => setSelectedPersonaId(e.target.value)}
                                    className="w-full bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent"
                                >
                                    <option value="">-- Seleccionar Persona --</option>
                                    {todasPersonas.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-1/3">
                                <label className="block text-xs font-bold mb-1 text-wiki-muted">Rol (Opcional)</label>
                                <input
                                    type="text"
                                    value={selectedRol}
                                    onChange={(e) => setSelectedRol(e.target.value)}
                                    placeholder="Ej: Comandante"
                                    className="w-full bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent"
                                />
                            </div>
                            <button type="button" onClick={handleAgregarParticipante}
                                className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500 transition-colors h-10">
                                + Agregar
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {participantesSeleccionados.map((item, index) => {
                                const persona = todasPersonas.find(p => p.id === item.personaId);
                                return (
                                    <div key={index} className="inline-flex items-center bg-blue-900/30 border border-blue-500/30 rounded-full px-3 py-1 text-sm text-blue-300">
                                        <span className="font-bold mr-2">
                                            {persona ? persona.nombre : 'Cargando...'}
                                            <span className="text-xs text-wiki-muted ml-1">({item.rol})</span>
                                        </span>
                                        <button type="button" onClick={() => eliminarParticipante(item.personaId)}
                                            className="text-red-400 hover:text-red-200 font-bold ml-1">
                                            ×
                                        </button>
                                    </div>
                                );
                            })}
                            {participantesSeleccionados.length === 0 && (
                                <p className="text-sm text-wiki-muted italic">No hay participantes seleccionados.</p>
                            )}
                        </div>
                    </div>

                    {/* Sección: Galería */}
                    <div className="bg-wiki-block border border-wiki-border rounded-lg p-6">
                        <h2 className="text-xl font-bold text-wiki-accent mb-4">[03] EVIDENCIA VISUAL (GALERÍA)</h2>
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-wiki-border rounded-lg p-6 text-center hover:border-wiki-accent transition-colors">
                                <label className="cursor-pointer block">
                                    <span className="text-4xl block mb-2">📸</span>
                                    <span className="font-bold">Click para agregar fotos</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleGaleriaChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Previews */}
                            {galeriaPreviews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    {galeriaPreviews.map((src, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={src}
                                                alt={`Preview ${index}`}
                                                className="w-full h-24 object-cover rounded border border-wiki-border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeGaleriaImage(index)}
                                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sección: Artículo/Biografía */}
                    <div className="bg-wiki-block border border-wiki-border rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-wiki-accent">[04] ARCHIVO DETALLADO (ARTÍCULO)</h2>
                            <button
                                type="button"
                                onClick={agregarSeccion}
                                className="px-4 py-2 bg-wiki-accent text-black font-bold hover:bg-green-400 transition-colors text-sm"
                            >
                                + Agregar Sección
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Título del Artículo</label>
                                <input
                                    type="text"
                                    name="titulo"
                                    value={articuloData.titulo}
                                    onChange={handleArticuloChange}
                                    className="w-full bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none"
                                    placeholder={`Reporte de Evento: ${eventoData.nombre || '...'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Nivel de Acceso</label>
                                <input
                                    type="number"
                                    name="nivelAcceso"
                                    value={articuloData.nivelAcceso}
                                    onChange={handleArticuloChange}
                                    min="1"
                                    max={Math.min(5, Number(localStorage.getItem('userLevel')) || 0)}
                                    className="w-full bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none"
                                />
                            </div>

                            {/* Lista de secciones */}
                            <div className="space-y-4 mt-6">
                                {articuloData.secciones.map((seccion, index) => (
                                    <SeccionEditor
                                        key={index}
                                        seccion={seccion}
                                        index={index}
                                        onUpdate={actualizarSeccion}
                                        onDelete={eliminarSeccion}
                                        onMoveUp={() => moverSeccion(index, 'arriba')}
                                        onMoveDown={() => moverSeccion(index, 'abajo')}
                                        isFirst={index === 0}
                                        isLast={index === articuloData.secciones.length - 1}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-6 py-2 border border-wiki-border hover:bg-wiki-border transition-colors"
                            disabled={loading}
                        >
                            CANCELAR
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-wiki-accent text-black font-bold hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'GUARDANDO...' : 'REGISTRAR EVENTO'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearEventoPage;
