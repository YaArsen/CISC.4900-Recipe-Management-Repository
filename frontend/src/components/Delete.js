import { fetchDeleteAccount } from '../api';
import { useNavigate } from 'react-router-dom';

const Delete = () => {
    const navigate = useNavigate(); // Initialize the navigate function for redirecting the user after account deletion.

    const deleteAccount = async () => {
        try {
            const data = await fetchDeleteAccount(); // Await the response from the API call that handles account deletion on the backend.
            localStorage.removeItem('token'); // Upon successful deletion, remove the user's authentication token from local storage.
            localStorage.setItem('message', data.message); // Store a success message in local storage to be displayed on the redirected page.
            navigate('/'); // Redirect the user to the login page ('/').
        } catch (error) {
            return alert(error);
        }
    };

    return <button onClick={deleteAccount}>Delete account</button>; // Render a button that, when clicked, triggers the deleteAccount function.
};

export default Delete;