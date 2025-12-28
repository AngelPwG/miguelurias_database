import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearPersona, obtenerPersonas } from '../api/personaService';
import { obtenerGrupos } from '../api/grupoService';
import { obtenerEventos } from '../api/eventoService';
import { subirArchivo, subirMultiplesArchivos } from '../api/multimediaService';
import SeccionEditor from '../components/SeccionEditor';

const CrearPersonaPage = () => {
    const navigate = useNavigate();

    // Estado para los datos de la persona
    const [personaData, setPersonaData] = useState({
        nombre: '',
        apodos: '',
        cumple: '',
        telefono: '',
        direccion: '',
        estado: 'activo',
        loreGeneral: ''
    });

    // Estados para relaciones
    const [todasPersonas, setTodasPersonas] = useState([]);
    const [relaciones, setRelaciones] = useState([]);
    const [selectedPersonaId, setSelectedPersonaId] = useState('');

    // Estados para Grupos y Eventos
    const [todosGrupos, setTodosGrupos] = useState([]);
    const [todosEventos, setTodosEventos] = useState([]);

    const [gruposSeleccionados, setGruposSeleccionados] = useState([]); // Array de IDs
    const [eventosSeleccionados, setEventosSeleccionados] = useState([]); // Array de { eventoId, rol, nombreEvento }

    const [selectedGrupoId, setSelectedGrupoId] = useState('');
    const [selectedEventoId, setSelectedEventoId] = useState('');
    const [rolEnEvento, setRolEnEvento] = useState('');

    // Estado para la galería principal (Archivos + Previews)
    const [galeriaFiles, setGaleriaFiles] = useState([]);
    const [galeriaPreviews, setGaleriaPreviews] = useState([]);

    // Estado para el artículo
    const [articuloData, setArticuloData] = useState({
        titulo: '',
        tipo: 'persona',
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
                // Personas
                try {
                    console.log("Cargando lista de personas...");
                    const listaPersonas = await obtenerPersonas();
                    console.log("Lista de personas cargada:", listaPersonas);
                    setTodasPersonas(listaPersonas);
                } catch (e) {
                    console.error("Error cargando personas:", e);
                }

                // Grupos
                try {
                    const listaGrupos = await obtenerGrupos();
                    setTodosGrupos(listaGrupos);
                } catch (e) {
                    console.error("Error cargando grupos:", e);
                }

                // Eventos
                try {
                    const listaEventos = await obtenerEventos();
                    setTodosEventos(listaEventos);
                } catch (e) {
                    console.error("Error cargando eventos:", e);
                }
            } catch (err) {
                console.error("Error general al cargar listas:", err);
            }
        };
        cargarDatos();
    }, []);

    const handlePersonaChange = (e) => {
        const { name, value } = e.target;
        setPersonaData(prev => ({
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

    // Relaciones logic
    const handleAgregarRelacion = () => {
        if (!selectedPersonaId) return;

        // Check if relation already exists (using type coercion or explicit Number conversion)
        if (relaciones.some(r => Number(r.personaDestinoId) === Number(selectedPersonaId))) {
            alert("Esta relación ya existe.");
            return;
        }

        const personaSeleccionada = todasPersonas.find(p => p.id === Number(selectedPersonaId));
        if (personaSeleccionada) {
            setRelaciones(prev => [...prev, {
                personaDestinoId: personaSeleccionada.id,
                personaDestinoNombre: personaSeleccionada.nombre
            }]);
            setSelectedPersonaId('');
        }
    };

    const eliminarRelacion = (index) => {
        setRelaciones(prev => prev.filter((_, i) => i !== index));
    };

    // Handlers Grupos
    const handleAgregarGrupo = () => {
        if (!selectedGrupoId) return;
        const idNum = Number(selectedGrupoId);
        if (gruposSeleccionados.includes(idNum)) {
            alert("El grupo ya está agregado.");
            return;
        }
        setGruposSeleccionados(prev => [...prev, idNum]);
        setSelectedGrupoId('');
    };

    const eliminarGrupo = (idEliminar) => {
        setGruposSeleccionados(prev => prev.filter(id => id !== idEliminar));
    };

    // Handlers Eventos
    const handleAgregarEvento = () => {
        if (!selectedEventoId) return;
        const idNum = Number(selectedEventoId);

        if (eventosSeleccionados.some(e => e.eventoId === idNum)) {
            alert("Este evento ya está agregado.");
            return;
        }

        const eventoObj = todosEventos.find(e => e.id === idNum);
        if (eventoObj) {
            setEventosSeleccionados(prev => [...prev, {
                eventoId: idNum,
                nombreEvento: eventoObj.nombre,
                rol: rolEnEvento
            }]);
            setSelectedEventoId('');
            setRolEnEvento('');
        }
    };

    const eliminarEvento = (idEliminar) => {
        setEventosSeleccionados(prev => prev.filter(e => e.eventoId !== idEliminar));
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
                    if (seccion.tipo === 'imagen' && seccion.archivoImagen) {
                        try {
                            // Subir imagen y obtener ID
                            const multimediaId = await subirArchivo(
                                seccion.archivoImagen,
                                'imagen',
                                seccion.titulo || ''
                            );

                            // Retornar sección con multimediaId
                            return {
                                ...seccion,
                                multimediaId: multimediaId,
                                // Removemos archivoImagen antes de enviar (buena práctica aunque no estrictamente necesaria si el backend ignora extra fields)
                                archivoImagen: undefined
                            };
                        } catch (error) {
                            throw new Error(`Error al subir imagen de la sección ${seccion.orden}: ${error.message}`);
                        }
                    } else {
                        // Para secciones de texto, remover campos innecesarios
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

            // Combinar todos los IDs (Galería explicita + Fotos de secciones)
            const todosLosIdsMultimedia = [...galeriaIds, ...idsDeSecciones];

            // 4️⃣ Preparar Datos de Artículo
            const articuloConTitulo = {
                ...articuloData,
                titulo: articuloData.titulo || `Biografía de ${personaData.nombre}`,
                galeriaMultimediaIds: todosLosIdsMultimedia,
                secciones: seccionesConImagenes
            };

            // 5️⃣ Preparar Datos de Persona (con Relaciones, Grupos, Eventos)
            const relacionesDTO = relaciones.map(r => ({
                personaDestinoId: r.personaDestinoId
            }));

            // Mapear eventos para DTO
            const eventosDTO = eventosSeleccionados.map(e => ({
                eventoId: e.eventoId,
                rol: e.rol
            }));

            const personaCreate = {
                ...personaData,
                relaciones: relacionesDTO,
                gruposIds: gruposSeleccionados,
                eventos: eventosDTO
            };

            // 6️⃣ Enviar al backend
            await crearPersona(personaCreate, articuloConTitulo);
            alert('✅ Persona creada exitosamente!');
            navigate('/');
        } catch (err) {
            console.error('Error al crear persona:', err);
            setError(err.response?.data?.message || err.message || 'Error al crear la persona. Verifica los datos.');
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
                            NUEVA <span className="text-wiki-accent">PERSONA</span>
                        </h1>
                        <p className="text-wiki-muted text-sm mt-1">Agregar a la base de datos</p>
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

                    {/* Sección: Datos Personales */}
                    <div className="bg-wiki-block border border-wiki-border rounded-lg p-6">
                        <h2 className="text-xl font-bold text-wiki-accent mb-4">[01] DATOS PERSONALES</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Nombre Completo *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={personaData.nombre}
                                    onChange={handlePersonaChange}
                                    required
                                    className="w-full bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none"
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Apodos</label>
                                <input
                                    type="text"
                                    name="apodos"
                                    value={personaData.apodos}
                                    onChange={handlePersonaChange}
                                    className="w-full bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none"
                                    placeholder="Ej: Juancho"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Cumpleaños</label>
                                <input
                                    type="date"
                                    name="cumple"
                                    value={personaData.cumple}
                                    onChange={handlePersonaChange}
                                    className="w-full bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Teléfono</label>
                                <input
                                    type="text"
                                    name="telefono"
                                    value={personaData.telefono}
                                    onChange={handlePersonaChange}
                                    className="w-full bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none"
                                    placeholder="+1234567890"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Estado</label>
                                <input
                                    type="text"
                                    name="estado"
                                    value={personaData.estado}
                                    onChange={handlePersonaChange}
                                    className="w-full bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none"
                                    placeholder="Ej: Activo, Desaparecido, Fallecido"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2">Dirección</label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={personaData.direccion}
                                    onChange={handlePersonaChange}
                                    className="w-full bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none"
                                    placeholder="Calle Principal 123"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2">Lore / Descripción</label>
                                <textarea
                                    name="loreGeneral"
                                    value={personaData.loreGeneral}
                                    onChange={handlePersonaChange}
                                    rows="3"
                                    className="w-full bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none"
                                    placeholder="Breve descripción de la persona..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección: Galería */}
                    <div className="bg-wiki-block border border-wiki-border rounded-lg p-6">
                        <h2 className="text-xl font-bold text-wiki-accent mb-4">[02] GALERÍA (OPCIONAL)</h2>
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-wiki-border rounded-lg p-6 text-center hover:border-wiki-accent transition-colors">
                                <label className="cursor-pointer block">
                                    <span className="text-4xl block mb-2">📸</span>
                                    <span className="font-bold">Click para agregar fotos</span>
                                    <span className="text-sm text-wiki-muted block mt-1">Puedes seleccionar varias</span>
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

                    {/* [02.5] Relaciones (NEW) */}
                    <div className="bg-wiki-block border border-wiki-border rounded-lg p-6">
                        <h2 className="text-xl font-bold text-wiki-accent mb-4">[02.5] RELACIONES PERSONALES</h2>
                        <div className="flex gap-4 mb-4">
                            <select
                                value={selectedPersonaId}
                                onChange={(e) => setSelectedPersonaId(e.target.value)}
                                className="flex-1 bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent"
                            >
                                <option value="">-- Seleccionar Persona --</option>
                                {todasPersonas.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>
                            <button type="button" onClick={handleAgregarRelacion}
                                className="px-4 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-500 transition-colors">
                                + Agregar
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {relaciones.map((rel, index) => (
                                <div key={index} className="inline-flex items-center bg-purple-900/30 border border-purple-500/30 rounded-full px-3 py-1 text-sm text-purple-300">
                                    <span className="font-bold mr-2">{rel.personaDestinoNombre}</span>
                                    <button type="button" onClick={() => eliminarRelacion(index)}
                                        className="text-red-400 hover:text-red-200 font-bold ml-1">
                                        ×
                                    </button>
                                </div>
                            ))}
                            {relaciones.length === 0 && (
                                <p className="text-sm text-wiki-muted italic">No hay relaciones agregadas.</p>
                            )}
                        </div>
                    </div>

                    {/* [02.6] GRUPOS */}
                    <div className="bg-wiki-block border border-wiki-border rounded-lg p-6">
                        <h2 className="text-xl font-bold text-wiki-accent mb-4">[02.6] GRUPOS</h2>
                        <div className="flex gap-4 mb-4">
                            <select
                                value={selectedGrupoId}
                                onChange={(e) => setSelectedGrupoId(e.target.value)}
                                className="flex-1 bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent"
                            >
                                <option value="">-- Seleccionar Grupo --</option>
                                {todosGrupos.map(g => (
                                    <option key={g.id} value={g.id}>
                                        {g.nombre}
                                    </option>
                                ))}
                            </select>
                            <button type="button" onClick={handleAgregarGrupo}
                                className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500 transition-colors">
                                + Agregar
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {gruposSeleccionados.map((grupoId, index) => {
                                const grupo = todosGrupos.find(g => g.id === grupoId);
                                return (
                                    <div key={index} className="inline-flex items-center bg-blue-900/30 border border-blue-500/30 rounded-full px-3 py-1 text-sm text-blue-300">
                                        <span className="font-bold mr-2">{grupo ? grupo.nombre : 'Cargando...'}</span>
                                        <button type="button" onClick={() => eliminarGrupo(grupoId)}
                                            className="text-red-400 hover:text-red-200 font-bold ml-1">
                                            ×
                                        </button>
                                    </div>
                                );
                            })}
                            {gruposSeleccionados.length === 0 && (
                                <p className="text-sm text-wiki-muted italic">No hay grupos asignados.</p>
                            )}
                        </div>
                    </div>

                    {/* [02.7] EVENTOS */}
                    <div className="bg-wiki-block border border-wiki-border rounded-lg p-6">
                        <h2 className="text-xl font-bold text-wiki-accent mb-4">[02.7] EVENTOS</h2>
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <select
                                value={selectedEventoId}
                                onChange={(e) => setSelectedEventoId(e.target.value)}
                                className="flex-1 bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent"
                            >
                                <option value="">-- Seleccionar Evento --</option>
                                {todosEventos.map(e => (
                                    <option key={e.id} value={e.id}>
                                        {e.nombre}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Rol en evento (opcional)"
                                value={rolEnEvento}
                                onChange={(e) => setRolEnEvento(e.target.value)}
                                className="flex-1 bg-wiki-bg border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent"
                            />
                            <button type="button" onClick={handleAgregarEvento}
                                className="px-4 py-2 bg-yellow-600 text-white font-bold rounded hover:bg-yellow-500 transition-colors">
                                + Agregar
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {eventosSeleccionados.map((ev, index) => (
                                <div key={index} className="inline-flex items-center bg-yellow-900/30 border border-yellow-500/30 rounded-full px-3 py-1 text-sm text-yellow-300">
                                    <span className="font-bold mr-2">{ev.nombreEvento}</span>
                                    {ev.rol && <span className="italic mr-2 text-xs">({ev.rol})</span>}
                                    <button type="button" onClick={() => eliminarEvento(ev.eventoId)}
                                        className="text-red-400 hover:text-red-200 font-bold ml-1">
                                        ×
                                    </button>
                                </div>
                            ))}
                            {eventosSeleccionados.length === 0 && (
                                <p className="text-sm text-wiki-muted italic">No hay eventos asignados.</p>
                            )}
                        </div>
                    </div>

                    {/* Sección: Artículo/Biografía */}
                    <div className="bg-wiki-block border border-wiki-border rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-wiki-accent">[03] BIOGRAFÍA</h2>
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
                                    placeholder={`Biografía de ${personaData.nombre || '...'}`}
                                />
                                <p className="text-xs text-wiki-muted mt-1">
                                    Si lo dejas vacío, se usará: "Biografía de {personaData.nombre || '...'}"
                                </p>
                            </div>

                            {/* Lista de secciones */}
                            <div className="space-y-4 mt-6">
                                <p className="text-sm font-bold text-wiki-muted">
                                    SECCIONES ({articuloData.secciones.length})
                                </p>

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
                            {loading ? 'CREANDO...' : 'CREAR PERSONA'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearPersonaPage;