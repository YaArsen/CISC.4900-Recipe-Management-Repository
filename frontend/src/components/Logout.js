import { useNavigate } from 'react-router-dom';

const LogOut = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        localStorage.removeItem('token'); // 1. Removes the authentication token from local storage, effectively logging the user out.
        navigate('/'); // 2. Navigates the user to the login page.
    };

    return <button type='button' onClick={handleClick}>Log out</button>; // Renders a button that triggers the handleClick function when clicked.
};

export default LogOut;