import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState({ name: '', email: '', password: '', repeatPassword: '' });
    const navigate = useNavigate();

    const handleClick = async () => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const data = await res.json();
        if (!data.ok) alert(data.message);

        navigate('/');
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
        <form onClick={handleClick}>
            <h4>Register</h4>
            <input name='name' placeholder='Name' onChange={handleChange} />
            <input type='email' name='email' placeholder='Email' onChange={handleChange} />
            <input type='password' name='password' placeholder='Password' onChange={handleChange} />
            <input type='password' name='repeatPassword' placeholder='Repeat password' onChange={handleChange} />
            <button>Register</button>
        </form>
    );
};

export default Register;