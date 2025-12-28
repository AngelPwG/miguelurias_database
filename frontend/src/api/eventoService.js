import axiosInstance from './axiosConfig';

export const obtenerEventos = async () => {
    try {
        const response = await axiosInstance.get('/eventos');
        return response.data;
    } catch (error) {
        throw error;
    }
};
