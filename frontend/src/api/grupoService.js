import axiosInstance from './axiosConfig';

export const obtenerGrupos = async () => {
    try {
        const response = await axiosInstance.get('/grupos');
        return response.data;
    } catch (error) {
        throw error;
    }
};
