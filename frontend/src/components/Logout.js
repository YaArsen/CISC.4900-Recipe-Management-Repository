import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <button onClick={handleClick}>Logout</button>
    );
};

export default Logout;