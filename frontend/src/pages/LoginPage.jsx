import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email: email,
                password: password
            });

            const tokenRecibido = response.data.token;
            localStorage.setItem('token', tokenRecibido);

            console.log("Login exitoso, token guardado. Obteniendo perfil...");

            // 2. Obtener datos del usuario (Nivel)
            try {
                // Config manual del header porque el interceptor a veces no pilla el token recien puesto si es muy rapido
                const meResponse = await api.get('/auth/me', {
                    headers: { Authorization: `Bearer ${tokenRecibido}` }
                });

                const userLevel = meResponse.data.nivel || 1;
                const userRole = meResponse.data.rol || 'USER';
                const userId = meResponse.data.id; // Get ID

                localStorage.setItem('userLevel', userLevel);
                localStorage.setItem('userRole', userRole);
                if (userId) localStorage.setItem('userId', userId); // Save ID

                console.log("Datos de usuario guardados:", { userLevel, userRole, userId });

            } catch (meError) {
                console.error("No se pudo obtener el perfil, asumiendo nivel 1", meError);
                localStorage.setItem('userLevel', 1);
                localStorage.setItem('userRole', 'USER');
                // userId might be missing if offline/error
            }

            navigate('/');

        } catch (err) {
            console.error("Falló el login", err);
            setError("Credenciales incorrectas o servidor apagado.");
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
                        MIGUELURIAS<span className="text-wiki-accent">DATABASE</span>
                    </h1>
                    <p className="text-wiki-muted text-sm">Sistema de autenticación</p>
                </div>

                {/* Form Card */}
                <div className="bg-wiki-block border border-wiki-border rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Iniciar Sesión</h2>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded">
                            <p className="text-red-300 text-sm">⚠️ {error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-bold text-wiki-text mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-wiki-bg border border-wiki-border rounded px-4 py-3 text-white focus:border-wiki-accent focus:outline-none transition-colors"
                                placeholder="usuario@ejemplo.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-bold text-wiki-text mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-wiki-bg border border-wiki-border rounded px-4 py-3 text-white focus:border-wiki-accent focus:outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-wiki-accent text-black font-bold rounded hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'INICIANDO SESIÓN...' : 'ENTRAR'}
                        </button>
                    </form>
                </div>

                <div className="mt-6 text-center space-y-4">
                    <p className="text-wiki-muted text-sm">
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="text-wiki-accent hover:underline font-bold">
                            Regístrate aquí
                        </Link>
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-wiki-muted">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span>SISTEMA ONLINE</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;