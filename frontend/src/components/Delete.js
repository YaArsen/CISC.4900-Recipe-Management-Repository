import { fetchDeleteAccount } from '../api';
import { useNavigate } from 'react-router-dom';

const Delete = () => {
    const navigate = useNavigate();

    const deleteAccount = async () => {
        try {
            const data = await fetchDeleteAccount();
            localStorage.removeItem('token');
            localStorage.setItem('message', data.message);
            navigate('/');
        } catch (error) {
            return alert(error);
        }
    };

    return <button onClick={deleteAccount}>Delete account</button>;
};

export default Delete;