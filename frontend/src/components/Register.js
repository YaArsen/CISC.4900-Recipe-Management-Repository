import Fetch from './Fetch';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await Fetch('/api/auth/register', { method: 'post', body: user });
        const data = await res.json();
        if (!data.ok) return alert(data.message);

        navigate('/');
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input name='name' placeholder='Name' onChange={handleChange} required />
            <input type='email' name='email' placeholder='Email' onChange={handleChange} required />
            <input type='password' name='password' placeholder='Password' onChange={handleChange} required />
            <input type='password' name='repeatPassword' placeholder='Repeat password' onChange={handleChange} required />
            <button>Register</button>
        </form>
    );
};

export default Register;