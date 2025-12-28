import api from './axiosConfig';

/**
 * Servicio para subir archivos multimedia (imágenes, videos)
 */

/**
 * Subir un archivo (imagen o video) al servidor
 * POST /api/multimedia
 * 
 * @param {File} archivo - El archivo a subir
 * @param {string} tipo - Tipo de archivo ("imagen" o "video")
 * @param {string} descripcion - Descripción opcional del archivo
 * @returns {Promise<number>} - ID del archivo multimedia guardado
 */
export const subirArchivo = async (archivo, tipo = 'imagen', descripcion = '') => {
    try {
        const formData = new FormData();
        formData.append('archivo', archivo);
        formData.append('tipo', tipo);
        if (descripcion) {
            formData.append('descripcion', descripcion);
        }

        const response = await api.post('/api/multimedia', formData, {
            headers: {
                'Content-Type': undefined
            }
        });

        // El backend retorna el ID del archivo
        return response.data;
    } catch (error) {
        console.error('Error al subir archivo:', error);
        throw error;
    }
};

/**
 * Subir múltiples archivos
 * @param {File[]} archivos - Array de archivos a subir
 * @param {string} tipo - Tipo de archivo
 * @returns {Promise<number[]>} - Array de IDs de los archivos subidos
 */
export const subirMultiplesArchivos = async (archivos, tipo = 'imagen') => {
    try {
        const promesas = archivos.map(archivo => subirArchivo(archivo, tipo));
        return await Promise.all(promesas);
    } catch (error) {
        console.error('Error al subir múltiples archivos:', error);
        throw error;
    }
};
