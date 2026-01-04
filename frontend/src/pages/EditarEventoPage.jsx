import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { obtenerEventoPorId, actualizarEvento } from '../api/eventoService';
import { obtenerArticuloPorId } from '../api/articuloService';
import { obtenerPersonasSimple } from '../api/personaService';
import { subirArchivo, subirMultiplesArchivos } from '../api/multimediaService';
import SeccionEditor from '../components/SeccionEditor';

const EditarEventoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estado para los datos del evento
    const [eventoData, setEventoData] = useState({
        nombre: '',
        fechaIni: '',
        fechaFin: '',
        ubicacion: '',
        sinopsis: ''
    });

    // Estados para participantes
    const [todasPersonas, setTodasPersonas] = useState([]);
    const [participantesSeleccionados, setParticipantesSeleccionados] = useState([]); // Array of { personaId, rol }
    const [selectedPersonaId, setSelectedPersonaId] = useState('');
    const [selectedRol, setSelectedRol] = useState('');

    // Estado para la galería (Existente + Nueva)
    const [galeriaExistente, setGaleriaExistente] = useState([]); // Array de { id, url }
    const [galeriaFiles, setGaleriaFiles] = useState([]); // Array de File (nuevos)
    const [galeriaPreviews, setGaleriaPreviews] = useState([]); // Previews de nuevos files

    // Estado para el artículo
    const [articuloData, setArticuloData] = useState({
        id: null,
        titulo: '',
        tipo: 'evento',
        secciones: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar listas
    useEffect(() => {
        const cargarDatos = async () => {
            // ... (existing loading logic, wrapped in try/catch check if needed, but the main check is before calling it)
            try {
                setLoading(true);
                // 1. Cargar Personas
                const dataPersonas = await obtenerPersonasSimple();
                setTodasPersonas(dataPersonas || []);

                // 2. Cargar Evento
                const evento = await obtenerEventoPorId(id);
                setEventoData({
                    nombre: evento.nombre,
                    fechaIni: evento.fechaIni ? evento.fechaIni.slice(0, 16) : '', // Format for datetime-local
                    fechaFin: evento.fechaFin ? evento.fechaFin.slice(0, 16) : '',
                    ubicacion: evento.ubicacion || '',
                    sinopsis: evento.sinopsis || ''
                });

                // Participantes
                if (evento.participantes) {
                    setParticipantesSeleccionados(evento.participantes.map(p => ({
                        personaId: p.id,
                        rol: p.rol
                    })));
                }

                // 3. Cargar Artículo Completo
                if (evento.articuloId) {
                    const articulo = await obtenerArticuloPorId(evento.articuloId);
                    setArticuloData({
                        id: articulo.id,
                        titulo: articulo.titulo,
                        tipo: 'evento',
                        secciones: articulo.secciones || [],
                        nivelAcceso: articulo.nivelAcceso || 0 // Added default
                    });

                    // Galería existente
                    if (articulo.galeria) {
                        setGaleriaExistente(articulo.galeria);
                    }
                }

            } catch (err) {
                console.error("Error cargando evento:", err);
                setError("No se pudo cargar el evento.");
            } finally {
                setLoading(false);
            }
        };

        const userRole = localStorage.getItem('userRole') || 'USER';
        // Asumimos que sólo admin o editor pueden editar. Lector (USER) no puede.
        if (userRole === 'ROLE_user' || userRole === 'USER') {
            alert('⛔ Acceso denegado: No tienes permisos para editar.');
            navigate('/');
        } else {
            if (id) cargarDatos();
        }
    }, [id, navigate]);

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
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGaleriaPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeGaleriaImageNew = (index) => {
        setGaleriaFiles(prev => prev.filter((_, i) => i !== index));
        setGaleriaPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeGaleriaImageExistente = (idToRemove) => {
        setGaleriaExistente(prev => prev.filter(img => img.id !== idToRemove));
    };

    // Participantes logic
    const handleAgregarParticipante = () => {
        if (!selectedPersonaId) return;
        const idNum = Number(selectedPersonaId);
        if (participantesSeleccionados.some(p => p.personaId === idNum)) {
            alert("Ya está agregado.");
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

    // ========== SECCIONES ==========
    const agregarSeccion = () => {
        setArticuloData(prev => ({
            ...prev,
            secciones: [...prev.secciones, {
                tipo: 'texto', titulo: '', contenido: '', orden: prev.secciones.length + 1, nivel: 1
            }]
        }));
    };

    const eliminarSeccion = (index) => {
        const nuevas = articuloData.secciones.filter((_, i) => i !== index);
        setArticuloData(prev => ({ ...prev, secciones: nuevas.map((s, i) => ({ ...s, orden: i + 1 })) }));
    };

    const actualizarSeccion = (index, campo, valor) => {
        setArticuloData(prev => ({
            ...prev,
            secciones: prev.secciones.map((s, i) => i === index ? { ...s, [campo]: valor } : s)
        }));
    };

    const moverSeccion = (index, direccion) => {
        const nuevas = [...articuloData.secciones];
        const nuevoIndex = direccion === 'arriba' ? index - 1 : index + 1;
        if (nuevoIndex < 0 || nuevoIndex >= nuevas.length) return;
        [nuevas[index], nuevas[nuevoIndex]] = [nuevas[nuevoIndex], nuevas[index]];
        setArticuloData(prev => ({ ...prev, secciones: nuevas.map((s, i) => ({ ...s, orden: i + 1 })) }));
    };

    // SUBMIT
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

            // 1. Subir nuevos archivos Galería
            let newGaleriaIds = [];
            if (galeriaFiles.length > 0) {
                newGaleriaIds = await subirMultiplesArchivos(galeriaFiles, 'imagen');
            }
            // Combinar con existentes
            const existingIds = galeriaExistente.map(img => img.id);
            const finalGaleriaIds = [...existingIds, ...newGaleriaIds];

            // 2. Subir imágenes Secciones
            const seccionesReady = await Promise.all(articuloData.secciones.map(async (sec) => {
                // Validar Nivel de Sección
                const nivelSeccion = Number(sec.nivel);

                // Regla General: Nivel Sección >= Nivel Artículo
                if (nivelSeccion < nivelArticulo) {
                    throw new Error(`⛔ La sección "${sec.titulo || 'Sin Título'}" tiene nivel ${nivelSeccion}, inferior al nivel del artículo (${nivelArticulo}).`);
                }

                // Regla Editor: Nivel Sección <= Nivel Usuario
                if (userRole === 'ROLE_editor' && nivelSeccion > userLevel) {
                    throw new Error(`⛔ Sección "${sec.titulo || 'Sin Título'}" excede tu nivel de usuario (${userLevel}).`);
                }

                if (sec.tipo === 'imagen' && sec.archivoImagen) {
                    const mid = await subirArchivo(sec.archivoImagen, 'imagen', sec.titulo || '');
                    return { ...sec, multimediaId: mid, archivoImagen: undefined };
                }
                return sec;
            }));

            // 3. Add section images to gallery too (optional logic from create)
            const sectionImageIds = seccionesReady.filter(s => s.tipo === 'imagen' && s.multimediaId).map(s => s.multimediaId);
            const allMultimediaIds = [...finalGaleriaIds, ...sectionImageIds];
            // Remove duplicates just in case
            const uniqueMultimediaIds = [...new Set(allMultimediaIds)];

            // 4. Update Event Object
            // Formatear fechas a ISO string si existen
            const formatDate = (dateStr) => {
                if (!dateStr) return null;
                // If it already contains 'T' (iso), leave it, otherwise construct
                // input datetime-local gives "YYYY-MM-DDTHH:mm"
                return new Date(dateStr).toISOString();
            };

            const updateRequest = {
                nombre: eventoData.nombre,
                fechaIni: formatDate(eventoData.fechaIni),
                fechaFin: formatDate(eventoData.fechaFin),
                ubicacion: eventoData.ubicacion,
                sinopsis: eventoData.sinopsis,
                sinopsis: eventoData.sinopsis,
                participantes: participantesSeleccionados, // Now sending objects with roles
                articuloRequest: {
                    ...articuloData,
                    galeriaMultimediaIds: uniqueMultimediaIds,
                    secciones: seccionesReady
                }
            };

            await actualizarEvento(id, updateRequest);
            alert('✅ Evento actualizado!');
            navigate('/');

        } catch (err) {
            console.error(err);
            setError("Error al actualizar evento.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !eventoData.nombre) return <div className="text-white p-8">Cargando...</div>;

    return (
        <div className="min-h-screen bg-wiki-bg text-wiki-text p-4 md:p-8 font-mono">
            <header className="mb-8 border-b border-wiki-border pb-6 flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">EDITAR EVENTO</h1>
                    <p className="text-wiki-muted text-sm">{eventoData.nombre}</p>
                </div>
                <button onClick={() => navigate('/')} className="border border-wiki-border px-4 py-2 hover:bg-wiki-border">← VOLVER</button>
            </header>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                {error && <div className="bg-red-900/20 border border-red-500 p-4 text-red-300">{error}</div>}

                {/* BASIC INFO */}
                <div className="bg-wiki-block border border-wiki-border p-6 rounded">
                    <h2 className="text-xl font-bold text-wiki-accent mb-4">[01] INFO BÁSICA</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block font-bold mb-1">Nombre</label>
                            <input name="nombre" value={eventoData.nombre} onChange={handleEventoChange} className="w-full bg-wiki-bg border border-wiki-border p-2" required />
                        </div>
                        <div>
                            <label className="block font-bold mb-1">Inicio</label>
                            <input type="datetime-local" name="fechaIni" value={eventoData.fechaIni} onChange={handleEventoChange} className="w-full bg-wiki-bg border border-wiki-border p-2" />
                        </div>
                        <div>
                            <label className="block font-bold mb-1">Fin</label>
                            <input type="datetime-local" name="fechaFin" value={eventoData.fechaFin} onChange={handleEventoChange} className="w-full bg-wiki-bg border border-wiki-border p-2" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block font-bold mb-1">Ubicación</label>
                            <input name="ubicacion" value={eventoData.ubicacion} onChange={handleEventoChange} className="w-full bg-wiki-bg border border-wiki-border p-2" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block font-bold mb-1">Sinopsis</label>
                            <textarea name="sinopsis" value={eventoData.sinopsis} onChange={handleEventoChange} rows="3" className="w-full bg-wiki-bg border border-wiki-border p-2" />
                        </div>
                    </div>
                </div>

                {/* PARTICIPANTES */}
                <div className="bg-wiki-block border border-wiki-border p-6 rounded">
                    <h2 className="text-xl font-bold text-wiki-accent mb-4">[02] PARTICIPANTES</h2>
                    <div className="flex gap-2 mb-4 items-end">
                        <div className="flex-1">
                            <label className="block text-xs font-bold mb-1 text-wiki-muted">Persona</label>
                            <select value={selectedPersonaId} onChange={(e) => setSelectedPersonaId(e.target.value)} className="w-full bg-wiki-bg border border-wiki-border p-2 text-white">
                                <option value="">Seleccionar Persona</option>
                                {todasPersonas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                            </select>
                        </div>
                        <div className="w-1/3">
                            <label className="block text-xs font-bold mb-1 text-wiki-muted">Rol (Opcional)</label>
                            <input
                                type="text"
                                value={selectedRol}
                                onChange={(e) => setSelectedRol(e.target.value)}
                                placeholder="Ej: General"
                                className="w-full bg-wiki-bg border border-wiki-border p-2 text-white"
                            />
                        </div>
                        <button type="button" onClick={handleAgregarParticipante} className="bg-blue-600 px-4 py-2 font-bold hover:bg-blue-500 h-10">+ Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {participantesSeleccionados.map((item, index) => {
                            const p = todasPersonas.find(x => x.id === item.personaId);
                            return (
                                <span key={index} className="bg-blue-900/40 border border-blue-500/40 rounded-full px-3 py-1 text-sm flex items-center">
                                    <span className="mr-1">{p ? p.nombre : 'Cargando...'}</span>
                                    <span className="text-xs text-blue-300 mr-2">({item.rol})</span>
                                    <button type="button" onClick={() => eliminarParticipante(item.personaId)} className="ml-2 text-red-400 font-bold hover:text-red-200">×</button>
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* GALERÍA */}
                <div className="bg-wiki-block border border-wiki-border p-6 rounded">
                    <h2 className="text-xl font-bold text-wiki-accent mb-4">[03] GALERÍA</h2>

                    {/* EXISTENTES */}
                    {galeriaExistente.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-wiki-muted mb-2">Imágenes Existentes:</p>
                            <div className="grid grid-cols-4 gap-2">
                                {galeriaExistente.map(img => (
                                    <div key={img.id} className="relative group">
                                        <img src={img.url} className="w-full h-20 object-cover rounded border border-wiki-border" />
                                        <button type="button" onClick={() => removeGaleriaImageExistente(img.id)} className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* NUEVAS */}
                    <div className="border-2 border-dashed border-wiki-border p-4 text-center">
                        <label className="cursor-pointer">
                            <span>📸 Agregar Nuevas Fotos</span>
                            <input type="file" multiple accept="image/*" onChange={handleGaleriaChange} className="hidden" />
                        </label>
                    </div>
                    {galeriaPreviews.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {galeriaPreviews.map((src, i) => (
                                <div key={i} className="relative group">
                                    <img src={src} className="w-full h-20 object-cover rounded" />
                                    <button type="button" onClick={() => removeGaleriaImageNew(i)} className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 flex justify-center items-center">×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ARTÍCULO */}
                <div className="bg-wiki-block border border-wiki-border p-6 rounded">
                    <div className="flex justify-between mb-4">
                        <h2 className="text-xl font-bold text-wiki-accent">[04] CONTENIDO</h2>
                        <button type="button" onClick={agregarSeccion} className="bg-wiki-accent text-black px-3 py-1 font-bold">+ Sección</button>
                    </div>
                    <label className="block mb-2">Título Artículo</label>
                    <input name="titulo" value={articuloData.titulo} onChange={handleArticuloChange} className="w-full bg-wiki-bg border border-wiki-border p-2 mb-4" />

                    <label className="block mb-2">Nivel de Acceso</label>
                    <input
                        type="number"
                        name="nivelAcceso"
                        value={articuloData.nivelAcceso || 0}
                        onChange={handleArticuloChange}
                        min="1"
                        max={Math.min(5, Number(localStorage.getItem('userLevel')) || 0)}
                        className="w-full bg-wiki-bg border border-wiki-border p-2 mb-4"
                    />
                    {/* removed explanatory helper text */}

                    <div className="space-y-4">
                        {articuloData.secciones.map((sec, i) => (
                            <SeccionEditor key={i} seccion={sec} index={i} onUpdate={actualizarSeccion} onDelete={eliminarSeccion} onMoveUp={() => moverSeccion(i, 'arriba')} onMoveDown={() => moverSeccion(i, 'abajo')} isFirst={i === 0} isLast={i === articuloData.secciones.length - 1} />
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/')} className="px-6 py-2 border border-wiki-border">CANCELAR</button>
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-wiki-accent text-black font-bold hover:bg-green-400">
                        {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditarEventoPage;
