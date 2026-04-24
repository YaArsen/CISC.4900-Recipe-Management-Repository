import { fetchRegister } from '../api';
import { passwordChecker, areMatchingPasswordRequirements } from '../utils/checkPassword';
import PasswordRequirements from '../components/PasswordRequirements';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState(null); // State to store the user's form input data (name, email, password, repeatPassword).
    // State variable to track individual password validation criteria in real-time.
    const [checkPassword, setCheckPassword] = useState({});
    // State to track if the password input field currently has keyboard focus, used to conditionally show/hide the validation feedback messages.
    const [isFocus, setIsFocus] = useState(false);
    const navigate = useNavigate(); // Hook to get the navigation function for redirecting the user after registration.

    // Handler function called when the registration form is submitted.
    const register = async (e) => {
        e.preventDefault(); // Prevents the default browser form submission behavior.
        if (!areMatchingPasswordRequirements(checkPassword) || !user.name.trim() || !user.email.trim() || !user.password.trim()) return;
        if (user.password.trim() !== user.repeatPassword.trim()) return alert('Passwords do not match');

        try {
            // Calls the API function to attempt user registration.
            const data = await fetchRegister({ name: user.name.trim(), email: user.email.trim(), password: user.password.trim() });
            localStorage.setItem('message', data.message); // Stores a success message in localStorage for display on the next page/route.
            navigate('/');
        } catch (error) {
            alert(error);
        }
    };

    // Generic change handler: updates the state based on the input's name attribute
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value }); // Updates the user state dynamically based on the input field's name attribute.
    };

    return (
        <div className='register-container'>
            <form className='register-form' onSubmit={register}>
                <h2>Register</h2>

                {/* Standard input fields with change handlers and required attributes */}
                <input
                    name='name'
                    placeholder='Name'
                    onChange={handleChange}
                    required
                />

                <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    onChange={handleChange}
                    required
                />

                {/* Password input with specific handlers for validation (checkPassword) and focus tracking (onFocus, onBlur) */}
                <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    onChange={(e) => {
                        passwordChecker(e, setCheckPassword);
                        handleChange(e);
                    }}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    required
                />

                {/* Conditionally renders password criteria feedback only when the input is focused */}
                {isFocus && <PasswordRequirements checkPassword={checkPassword} />}

                <input
                    type='password'
                    name='repeatPassword'
                    placeholder='Repeat password'
                    onChange={handleChange}
                    required
                />

                <button type='submit'>Register</button>
            </form>
        </div>
    );
};

export default Register;