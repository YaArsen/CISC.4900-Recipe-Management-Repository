import { fetchLogin } from '../api';
import Notification from '../components/Notification'
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const message = localStorage.getItem('message');

        if (message) {
            localStorage.removeItem('message');
            setMessage(message);
        }
    }, []);

    const login = async (e) => {
        e.preventDefault();

        try {
            const data = await fetchLogin(user);
            localStorage.setItem('token', data.token);
            navigate('/profile');
        } catch (error) {
            return alert(error);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
        <div className='login-container'>
            {message && setTimeout(() => setMessage(''), 2000) && <Notification message={message} />}
            <form onSubmit={login}>
                <h2>Login</h2>
                <input type='email' name='email' placeholder='Email' onChange={handleChange} required />
                <input type='password' name='password' placeholder='Password' onChange={handleChange} required />
                <button>Login</button>
                <Link to='/register'>Register</Link>
            </form>
        </div>
    );
};

export default Login;