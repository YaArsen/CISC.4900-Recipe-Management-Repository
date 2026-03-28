import { fetchLogin } from '../api'; // Import the API function for handling login requests
import ToastNotification from '../components/ToastNotification'; // Import a custom Notification component to display messages
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
        if (!user.email.trim() || !user.password.trim()) return;

        try {
            const data = await fetchLogin({ email: user.email.trim(), password: user.password.trim() }); // Call the API function to fetch login data using the user state
            localStorage.setItem('token', data.token); // Store the returned token in localStorage for authentication purposes
            navigate('/search'); // Navigate the user to the profile page upon successful login
        } catch (error) {
            return alert(error); // If an error occurs during login, display an alert with the error message
        }
    };

    // Generic change handler: updates the state based on the input's name attribute
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value }); // Updates the user state dynamically based on the input field's name attribute.
    };

    // Render the login form UI
    return (
        <div className='login-container'>
            <ToastNotification message={message} setMessage={setMessage} />

            {/* The form element with an onSubmit handler pointing to the login function */}
            <form onSubmit={login}>
                <h2>Login</h2>

                {/* Email input field with handlers for change events */}
                <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    onChange={handleChange}
                    required
                />

                {/* Password input field with handlers for change events */}
                <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    onChange={handleChange}
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