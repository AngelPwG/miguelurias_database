import axiosInstance from './axiosConfig';

export const obtenerEventos = async (page = 0, size = 10) => {
    try {
        const response = await axiosInstance.get('/api/eventos', {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const obtenerEventosSimple = async () => {
    try {
        const response = await axiosInstance.get('/api/eventos/simple');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const obtenerEventosCards = async (page = 0, size = 10) => {
    try {
        const response = await axiosInstance.get('/api/eventos/cards', {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const obtenerEventoPorId = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/eventos/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const crearEvento = async (eventoData) => {
    try {
        const response = await axiosInstance.post('/api/eventos', eventoData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const actualizarEvento = async (id, eventoData) => {
    try {
        const response = await axiosInstance.put(`/api/eventos/${id}`, eventoData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const eliminarEvento = async (id) => {
    try {
        await axiosInstance.delete(`/api/eventos/${id}`);
    } catch (error) {
        throw error;
    }
};
