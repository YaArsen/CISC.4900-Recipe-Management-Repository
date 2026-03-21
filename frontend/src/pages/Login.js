import { fetchLogin } from '../api'; // Import the API function for handling login requests
import { handleChange } from '../utils/handleChange';
import Notification from '../components/Notification'; // Import a custom Notification component to display messages
import { useState, useEffect } from 'react'; // Import necessary React hooks for state management and side effects
import { useNavigate, Link } from 'react-router-dom'; // Import navigation utilities from react-router-dom for routing

const Login = () => {
    const [user, setUser] = useState(null); // State hook to store user credentials (email and password)
    const [message, setMessage] = useState(''); // State hook to manage notification messages
    const navigate = useNavigate(); // Hook to enable programmatic navigation between routes

    // useEffect hook to check for a message in localStorage on component mount
    useEffect(() => {
        const message = localStorage.getItem('message');

        if (message) {
            // If a message exists, remove it from localStorage and set the component's message state
            localStorage.removeItem('message');
            setMessage(message);
        }
    }, []);

    // Async function to handle the login form submission
    const login = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior (page reload)

        try {
            const data = await fetchLogin(user); // Call the API function to fetch login data using the user state
            localStorage.setItem('token', data.token); // Store the returned token in localStorage for authentication purposes
            navigate('/search'); // Navigate the user to the profile page upon successful login
        } catch (error) {
            return alert(error); // If an error occurs during login, display an alert with the error message
        }
    };

    // Render the login form UI
    return (
        <div className='login-container'>
            <Notification message={message} setMessage={setMessage} />

            {/* The form element with an onSubmit handler pointing to the login function */}
            <form onSubmit={login}>
                <h2>Login</h2>

                {/* Email input field with handlers for change events */}
                <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    onChange={(e) => handleChange(e, user, setUser)}
                    required
                />

                {/* Password input field with handlers for change events */}
                <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    onChange={(e) => handleChange(e, user, setUser)}
                    required
                />
                
                <button>Login</button> {/* Submit button for the form */}
                <Link to='/register'>Register</Link> {/* A link to navigate to the registration page */}
                <Link to='/email'>Reset password</Link>
            </form>
        </div>
    );
};

export default Login;