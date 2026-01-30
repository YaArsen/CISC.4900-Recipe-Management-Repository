import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [user, setUser] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleClick = async () => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const data = await res.json();
        if (!data.ok) alert(data.message);

        localStorage.setItem('token', data.token);
        navigate('/profile');
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
        <form onClick={handleClick}>
            <h4>Login</h4>
            <input type='email' name='email' placeholder='Email' onChange={handleChange} />
            <input type='password' name='password' placeholder='Password' onChange={handleChange} />
            <button>Login</button>
            <Link to="/register">Register</Link>
        </form>
    );
};

export default Login;