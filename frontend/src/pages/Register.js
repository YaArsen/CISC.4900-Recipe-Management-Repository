import { fetchRegister } from '../api'; // Imports the function responsible for making the API call to register a user.
import { passwordChecker } from '../utils/passwordChecker';
import { handleChange } from '../utils/handleChange';
// Imports necessary hooks from the React library for managing state and navigation.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState(null); // State to store the user's form input data (name, email, password, repeatPassword).
    // State variable to track individual password validation criteria in real-time.
    const [checkPassword, setCheckPassword] = useState({
        isLowerCaseLetter: false,
        isUpperCaseLetter: false,
        isSpecialSymbol: false,
        isNumber: false,
        isLengthEightOrMore: false
    });

    // State to track if the password input field currently has keyboard focus, used to conditionally show/hide the validation feedback messages.
    const [isFocus, setIsFocus] = useState(false);
    const navigate = useNavigate(); // Hook to get the navigation function for redirecting the user after registration.

    // Handler function called when the registration form is submitted.
    const register = async (e) => {
        e.preventDefault(); // Prevents the default browser form submission behavior.

        // Checks if all password validation criteria are met before proceeding. Stops execution if the password is not strong enough.
        if (!(checkPassword.isLowerCaseLetter && checkPassword.isUpperCaseLetter && checkPassword.isSpecialSymbol && checkPassword.isNumber && checkPassword.isLengthEightOrMore)) return;

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

    // The component's render function (JSX).
    return (
        <form className='register-container' onSubmit={register}>
            <h2>Register</h2>

            {/* Standard input fields with change handlers and required attributes */}
            <input name='name' placeholder='Name' onChange={(e) => handleChange(e, user, setUser)} required />
            <input type='email' name='email' placeholder='Email' onChange={(e) => handleChange(e, user,  setUser)} required />

            {/* Password input with specific handlers for validation (checkPassword) and focus tracking (onFocus, onBlur) */}
            <input type='password' name='password' placeholder='Password' onChange={(e) => passwordChecker(e, user, setUser, setCheckPassword)} onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)} required />

            {/* Conditionally renders password criteria feedback only when the input is focused */}
            {isFocus && <>
                <p style={{ color: checkPassword.isLowerCaseLetter ? 'green' : 'red' }}>Lower case letter</p>
                <p style={{ color: checkPassword.isUpperCaseLetter ? 'green' : 'red' }}>Upper case letter</p>
                <p style={{ color: checkPassword.isSpecialSymbol ? 'green' : 'red' }}>Special symbol</p>
                <p style={{ color: checkPassword.isNumber ? 'green' : 'red' }}>Number</p>
                <p style={{ color: checkPassword.isLengthEightOrMore ? 'green' : 'red' }}>Min 8 symbols</p>
            </>}
            <input type='password' name='repeatPassword' placeholder='Repeat password' onChange={(e) => handleChange(e, user, setUser)} required />
            <button type='submit'>Register</button>
        </form>
    );
};

export default Register;