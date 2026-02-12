import Fetch from './Fetch';
import { useNavigate } from 'react-router-dom';

const Delete = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const deleteAccount = async () => {
        const res = await Fetch('/api/auth/delete', { method: 'DELETE', token });
        const data = await res.json();
        if (!res.ok) return alert(data.message);
        localStorage.removeItem('token');
        navigate('/');
    };

    return <button onClick={deleteAccount}>Delete account</button>;
};

export default Delete;