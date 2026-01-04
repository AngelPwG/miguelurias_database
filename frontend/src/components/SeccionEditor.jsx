import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente para editar una sección individual de un artículo
 * Soporta diferentes tipos: texto, imagen
 */
const SeccionEditor = ({ seccion, index, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) => {
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (campo, valor) => {
        onUpdate(index, campo, valor);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Guardar el archivo en la sección
            handleChange('archivoImagen', file);

            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-wiki-bg border border-wiki-border rounded-lg p-4 space-y-4">
            {/* Header con controles */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-wiki-accent font-bold">#{index + 1}</span>
                    <select
                        value={seccion.tipo}
                        onChange={(e) => handleChange('tipo', e.target.value)}
                        className="bg-wiki-block border border-wiki-border rounded px-3 py-1 text-white text-sm focus:border-wiki-accent focus:outline-none"
                    >
                        <option value="texto">📝 Texto</option>
                        <option value="imagen">🖼️ Imagen</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    {/* Botones de reordenamiento */}
                    <button
                        type="button"
                        onClick={() => onMoveUp(index)}
                        disabled={isFirst}
                        className="px-2 py-1 border border-wiki-border hover:bg-wiki-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                        title="Mover arriba"
                    >
                        ↑
                    </button>
                    <button
                        type="button"
                        onClick={() => onMoveDown(index)}
                        disabled={isLast}
                        className="px-2 py-1 border border-wiki-border hover:bg-wiki-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                        title="Mover abajo"
                    >
                        ↓
                    </button>

                    {/* Botón de eliminar */}
                    <button
                        type="button"
                        onClick={() => onDelete(index)}
                        className="px-3 py-1 bg-red-900/20 border border-red-500 text-red-300 hover:bg-red-900/40 transition-colors text-xs"
                        title="Eliminar sección"
                    >
                        🗑️ Eliminar
                    </button>
                </div>
            </div>

            {/* Título opcional */}
            <div>
                <label className="block text-sm font-bold mb-2">Título (opcional)</label>
                <input
                    type="text"
                    value={seccion.titulo || ''}
                    onChange={(e) => handleChange('titulo', e.target.value)}
                    className="w-full bg-wiki-block border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none"
                    placeholder="Ej: Introducción, Historia, etc."
                />
            </div>

            {/* Contenido según el tipo */}
            {seccion.tipo === 'texto' && (
                <div>
                    <label className="block text-sm font-bold mb-2">Contenido *</label>
                    <textarea
                        value={seccion.contenido || ''}
                        onChange={(e) => handleChange('contenido', e.target.value)}
                        required
                        rows="6"
                        className="w-full bg-wiki-block border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none font-sans"
                        placeholder="Escribe el contenido de esta sección..."
                    />
                </div>
            )}

            {seccion.tipo === 'imagen' && (
                <div>
                    <label className="block text-sm font-bold mb-2">Imagen *</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full bg-wiki-block border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-wiki-accent file:text-black hover:file:bg-green-400"
                    />

                    {/* Preview de la imagen */}
                    {(imagePreview || seccion.multimedia?.url) && (
                        <div className="mt-3">
                            <p className="text-xs text-wiki-muted mb-2">Vista previa:</p>
                            <img
                                src={imagePreview || seccion.multimedia?.url}
                                alt="Preview"
                                className="max-w-full h-auto max-h-64 border border-wiki-border rounded"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Nivel de privacidad */}
            <div>
                <label className="block text-sm font-bold mb-2">
                    Nivel de Privacidad *
                    <span className="text-wiki-muted font-normal ml-2">(0 = Público, 5 = Máximo privado)</span>
                </label>
                <input
                    type="number"
                    min="0"
                    max="5"
                    value={seccion.nivel}
                    onChange={(e) => handleChange('nivel', parseInt(e.target.value))}
                    required
                    className="w-full bg-wiki-block border border-wiki-border rounded px-3 py-2 text-white focus:border-wiki-accent focus:outline-none"
                />
                <p className="text-xs text-wiki-muted mt-1">
                    Debe ser mayor o igual al nivel del artículo. Si eres Editor, no puedes exceder tu nivel.
                </p>
            </div>
        </div>
    );
};

SeccionEditor.propTypes = {
    seccion: PropTypes.shape({
        tipo: PropTypes.string.isRequired,
        titulo: PropTypes.string,
        contenido: PropTypes.string,
        multimediaId: PropTypes.number,
        archivoImagen: PropTypes.object,
        orden: PropTypes.number.isRequired,
        nivel: PropTypes.number.isRequired
    }).isRequired,
    index: PropTypes.number.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onMoveUp: PropTypes.func.isRequired,
    onMoveDown: PropTypes.func.isRequired,
    isFirst: PropTypes.bool.isRequired,
    isLast: PropTypes.bool.isRequired
};

export default SeccionEditor;
