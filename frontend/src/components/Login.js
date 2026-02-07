import Fetch from './Fetch';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await Fetch('/api/auth/login', { method: 'POST', body: user });
        const data = await res.json();
        if (!data.ok) return alert(data.message);
        localStorage.setItem('token', data.token);
        navigate('/profile');
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input type='email' name='email' placeholder='Email' onChange={handleChange} required />
            <input type='password' name='password' placeholder='Password' onChange={handleChange} required />
            <button>Login</button>
            <Link to="/register">Register</Link>
        </form>
    );
};

export default Login;