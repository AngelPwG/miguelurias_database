import api from './axiosConfig';

// Servicio para interactuar con el endpoint de personas

/**
 * Obtener todas las personas
 * GET /api/personas
 */
/**
 * Obtener todas las personas (Paginado)
 * GET /api/personas?page=0&size=10
 */
export const obtenerPersonas = async (page = 0, size = 10) => {
    try {
        const response = await api.get('/api/personas', {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener personas:', error);
        throw error;
    }
};

/**
 * Obtener lista simple de personas (ID y Nombre)
 * GET /api/personas/simple
 */
export const obtenerPersonasSimple = async () => {
    try {
        const response = await api.get('/api/personas/simple');
        return response.data;
    } catch (error) {
        console.error('Error al obtener lista simple de personas:', error);
        throw error;
    }
};

/**
 * Obtener Cartas de Personas (Vista Resumida para Home)
 * GET /api/personas/cards
 */
export const obtenerPersonasCards = async (page = 0, size = 10) => {
    try {
        const response = await api.get('/api/personas/cards', {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener cards de personas:', error);
        throw error;
    }
};

/**
 * Obtener una persona por ID
 * GET /api/personas/{id}
 */
export const obtenerPersonaPorId = async (id) => {
    try {
        const response = await api.get(`/api/personas/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener persona con ID ${id}:`, error);
        throw error;
    }
};

/**
 * Crear una nueva persona con su artículo
 * POST /api/personas
 * 
 * @param {Object} personaData - Datos de la persona
 * @param {Object} articuloData - Datos del artículo
 */
export const crearPersona = async (personaData, articuloData) => {
    try {
        const requestBody = {
            personaCreateDTO: personaData,
            articuloRequest: articuloData
        };

        const response = await api.post('/api/personas', requestBody);
        return response.data;
    } catch (error) {
        console.error('Error al crear persona:', error);
        throw error;
    }
};

/**
 * Actualizar una persona existente
 * PUT /api/personas/{id}
 */
export const actualizarPersona = async (id, personaData, articuloData) => {
    try {
        const requestBody = {
            personaCreateDTO: personaData,
            articuloRequest: articuloData
        };
        const response = await api.put(`/api/personas/${id}`, requestBody);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar persona ${id}:`, error);
        throw error;
    }
};

/**
 * Ejemplo de uso:
 * 
 * const personaData = {
 *   nombre: "Juan Pérez",
 *   apodos: "Juancho",
 *   cumple: "1990-05-15T00:00:00-07:00",
 *   telefono: "+1234567890",
 *   direccion: "Calle Principal 123",
 *   estado: "activo",
 *   lore: "Historia de la persona...",
 *   eventoDestacadoId: null
 * };
 * 
 * const articuloData = {
 *   titulo: "Biografía de Juan",
 *   tipo: "persona",
 *   galeriaMultimediaIds: [],
 *   secciones: [
 *     {
 *       tipo: "texto",
 *       contenido: "Biografía completa...",
 *       orden: 1,
 *       nivel: 0
 *     }
 *   ]
 * };
 * 
 * await crearPersona(personaData, articuloData);
 */

/**
 * Eliminar una persona (artículo) por ID
 * DELETE /api/articulos/{id}
 */
export const eliminarPersona = async (id) => {
    try {
        await api.delete(`/api/articulos/${id}`);
    } catch (error) {
        console.error(`Error al eliminar persona ${id}:`, error);
        throw error;
    }
};
