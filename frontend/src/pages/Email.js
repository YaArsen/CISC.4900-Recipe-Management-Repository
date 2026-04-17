import { fetchPasswordReset } from '../api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Email = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const passwordReset = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        try {
            const data = await fetchPasswordReset({ email: email.trim() });
            localStorage.setItem('message', data.message);
            navigate('/');
        } catch (error) {
            alert(error);
        }
    };

    return (
        <form className='email-container' onSubmit={passwordReset}>
            <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} required />
            <button type='submit'>Verify email</button>
        </form>
    );
};

export default Email;