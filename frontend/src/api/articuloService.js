import api from './axiosConfig';

/**
 * Obtener un artículo por su ID
 * GET /api/articulos/:id
 */
export const obtenerArticuloPorId = async (id) => {
    try {
        const response = await api.get(`/api/articulos/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener artículo ${id}:`, error);
        throw error;
    }
};
