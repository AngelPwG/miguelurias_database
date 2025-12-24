import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const LoginPage = () => {
    const navigate = useNavigate(); // El hook para redireccionar
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await api.post('/auth/login', {
                email: email,
                password: password
            });

            const tokenRecibido = response.data.token;
            localStorage.setItem('token', tokenRecibido);

            console.log("Login exitoso, token guardado:", tokenRecibido);

            navigate('/');

        } catch (err) {
            console.error("Falló el login", err);
            setError("Credenciales incorrectas o servidor apagado.");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <form onSubmit={handleLogin} style={{ padding: '20px', border: '1px solid #ccc' }}>
                <h2>Iniciar Sesión</h2>
                
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label><br/>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Contraseña:</label><br/>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>

                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default LoginPage;