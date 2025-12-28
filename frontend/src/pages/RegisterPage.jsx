import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        rol: 'lector', // Default
        nivel: 1
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await api.post('/auth/register', formData);

            // Registro exitoso, redirigir al login
            // Podríamos hacer login automático, pero por seguridad es mejor que se loguee
            navigate('/login');
            alert('Registro exitoso. ¡Ahora puedes iniciar sesión!');

        } catch (err) {
            console.error("Falló el registro", err);
            // Intentar obtener el mensaje de error de varias fuentes posibles
            let errorMessage = "Error al registrar usuario. Intenta con otro email/username.";

            if (err.response) {
                if (err.response.data) {
                    if (typeof err.response.data === 'string') {
                        errorMessage = err.response.data;
                    } else if (err.response.data.message) {
                        errorMessage = err.response.data.message;
                    } else if (err.response.data.error) {
                        errorMessage = err.response.data.error;
                    }
                }
            }

            // DEBUG TEMPORAL: Mostrar todo lo que llega
            console.log("Full error response:", err.response);
            if (!errorMessage || errorMessage === "Error al registrar usuario. Intenta con otro email/username.") {
                errorMessage = "Status: " + (err.response?.status || "N/A") + " | Data: " + JSON.stringify(err.response?.data || err.message);
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-wiki-bg text-wiki-text font-mono flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">
                        REGISTRO<span className="text-wiki-accent">WIKI</span>
                    </h1>
                    <p className="text-wiki-muted text-sm">Crear nueva cuenta de acceso</p>
                </div>

                {/* Form Card */}
                <div className="bg-wiki-block border border-wiki-border rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Datos de Cuenta</h2>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded">
                            <p className="text-red-300 text-sm">⚠️ {error}</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-bold text-wiki-text mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full bg-wiki-bg border border-wiki-border rounded px-4 py-3 text-white focus:border-wiki-accent focus:outline-none transition-colors"
                                placeholder="usuario_wiki"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-wiki-text mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-wiki-bg border border-wiki-border rounded px-4 py-3 text-white focus:border-wiki-accent focus:outline-none transition-colors"
                                placeholder="usuario@ejemplo.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-wiki-text mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-wiki-bg border border-wiki-border rounded px-4 py-3 text-white focus:border-wiki-accent focus:outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Rol (Para Testing) */}
                        <div>
                            <label className="block text-sm font-bold text-wiki-accent mb-2">
                                Rol (Testing)
                            </label>
                            <select
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                                className="w-full bg-wiki-bg border border-wiki-border rounded px-4 py-3 text-white focus:border-wiki-accent focus:outline-none transition-colors"
                            >
                                <option value="lector">Lector</option>
                                <option value="editor">Editor</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>

                        {/* Nivel (Para Testing) */}
                        <div>
                            <label className="block text-sm font-bold text-wiki-accent mb-2">
                                Nivel (Testing)
                            </label>
                            <input
                                type="number"
                                name="nivel"
                                min="1"
                                max="100"
                                value={formData.nivel}
                                onChange={handleChange}
                                className="w-full bg-wiki-bg border border-wiki-border rounded px-4 py-3 text-white focus:border-wiki-accent focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-wiki-accent text-black font-bold rounded hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? 'REGISTRANDO...' : 'CREAR CUENTA'}
                        </button>
                    </form>
                </div>

                {/* Footer Link */}
                <div className="mt-6 text-center">
                    <p className="text-wiki-muted text-sm">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="text-wiki-accent hover:underline font-bold">
                            Inicia Sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
