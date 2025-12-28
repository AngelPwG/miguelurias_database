import { Navigate } from 'react-router-dom';

/**
 * Componente para proteger rutas.
 * - Si `reverse` es false (default): Protege rutas privadas. Si no hay token, manda a login.
 * - Si `reverse` es true: Protege ruta login. Si YA hay token, manda al home (para que no se loguee 2 veces).
 */
const ProtectedRoute = ({ children, reverse = false }) => {
    const token = localStorage.getItem('token');

    if (reverse) {
        // Lógica inversa para Login: Si YA tiene token, no dejarlo entrar al login, mandarlo al home
        if (token) {
            return <Navigate to="/" replace />;
        }
        // Si NO tiene token, dejarlo ver el login
        return children;
    }

    // Lógica normal para rutas privadas
    if (!token) {
        // Si no hay token, redirigir al login
        return <Navigate to="/login" replace />;
    }

    // Si hay token, mostrar el componente hijo
    return children;
};

export default ProtectedRoute;
