import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        // 1. Removes the authentication token from local storage, effectively logging the user out.
        // 'token' should match the key used during the login process to store the user's token.
        localStorage.removeItem('token');
        navigate('/'); // 2. Navigates the user to the login page.
    };

    return <button onClick={handleClick}>Logout</button>; // Renders a button that triggers the handleClick function when clicked.
};

export default Logout;