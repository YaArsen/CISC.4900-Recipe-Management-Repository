import { fetchRegister } from '../api'; // Imports the function responsible for making the API call to register a user.
// Imports necessary hooks from the React library for managing state and navigation.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState(null); // State to store the user's form input data (name, email, password, repeatPassword).
    // State variables to track individual password validation criteria in real-time.
    const [isLowerCaseLetter, setIsLowerCaseLetter] = useState(false);
    const [isUpperCaseLetter, setIsUpperCaseLetter] = useState(false);
    const [isSpecialSymbol, setIsSpecialSymbol] = useState(false);
    const [isNumber, setIsNumber] = useState(false);
    const [isLengthEightOrMore, setIsLengtEightOrMore] = useState(false);
    // State to track if the password input field currently has keyboard focus, used to conditionally show/hide the validation feedback messages.
    const [isFocus, setIsFocus] = useState(false);
    const navigate = useNavigate(); // Hook to get the navigation function for redirecting the user after registration.

    // Handler function triggered on every change in the 'password' input field.
    const checkPassword = (e) => {
        const { value } = e.target;

        setIsLowerCaseLetter(/[a-z]/.test(value));
        setIsUpperCaseLetter(/[A-Z]/.test(value));
        setIsSpecialSymbol(/[!@#$%^&*(),.?":{}|<>]/.test(value));
        setIsNumber(/[0-9]/.test(value));
        setIsLengtEightOrMore(value.length >= 8);

        setUser({ ...user, password: value });
    };

    // Handler function called when the registration form is submitted.
    const register = async (e) => {
        e.preventDefault(); // Prevents the default browser form submission behavior.

        // Checks if all password validation criteria are met before proceeding. Stops execution if the password is not strong enough.
        if (!(isLowerCaseLetter && isUpperCaseLetter && isSpecialSymbol && isNumber && isLengthEightOrMore)) return;

        // Checks if the 'password' and 'repeatPassword' fields match. Alerts the user if they don't match and stops execution.
        if (user.password !== user.repeatPassword) return alert('Passwords do not match');

        try {
            const data = await fetchRegister(user); // Calls the API function to attempt user registration.
            localStorage.setItem('message', data.message); // Stores a success message in localStorage for display on the next page/route.
            navigate('/'); // Navigates the user to the login page ('/').
        } catch (error) {
            return alert(error); // Catches and displays any errors returned by the API call (e.g., Email already exists).
        }
    };

    // Generic handler for the 'name', 'email', and 'repeatPassword' input fields.
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value }); // Updates the user state dynamically based on the input field's name attribute.
    };

    // The component's render function (JSX).
    return (
        <form className='register-container' onSubmit={register}>
            <h2>Register</h2>

            {/* Standard input fields with change handlers and required attributes */}
            <input name='name' placeholder='Name' onChange={handleChange} required />
            <input type='email' name='email' placeholder='Email' onChange={handleChange} required />

            {/* Password input with specific handlers for validation (checkPassword) and focus tracking (onFocus, onBlur) */}
            <input type='password' name='password' placeholder='Password' onChange={checkPassword} onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)} required />

            {/* Conditionally renders password criteria feedback only when the input is focused */}
            {isFocus && <>
                <p style={{ color: isLowerCaseLetter ? 'green' : 'red' }}>Lower case letter</p>
                <p style={{ color: isUpperCaseLetter ? 'green' : 'red' }}>Upper case letter</p>
                <p style={{ color: isSpecialSymbol ? 'green' : 'red' }}>Special symbol</p>
                <p style={{ color: isNumber ? 'green' : 'red' }}>Number</p>
                <p style={{ color: isLengthEightOrMore ? 'green' : 'red' }}>Min 8 symbols</p>
            </>}
            <input type='password' name='repeatPassword' placeholder='Repeat password' onChange={handleChange} required />
            <button type='submit'>Register</button>
        </form>
    );
};

export default Register;