import { fetchPasswordReset } from '../api';
import { passwordChecker, requirements } from '../utils/checkPassword';
import PasswordRequirements from '../components/PasswordRequirements';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PasswordReset = () => {
    const { verificationToken } = useParams();
    const [user, setUser] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    const [checkPassword, setCheckPassword] = useState(false);
    const navigate = useNavigate();
 
    const resetPassword = async (e) => {
        e.preventDefault();
        if (!requirements(checkPassword) || !user.password.trim()) return;
        if (user.password.trim() !== user.repeatPassword.trim()) return alert('Passwords do not match');

        try {
            const data = await fetchPasswordReset({ password: user.password.trim(), verificationToken });
            localStorage.setItem('message', data.message);
            navigate('/');
        } catch (error) {
            return alert(error);
        }
    };

    // Generic change handler: updates the state based on the input's name attribute
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value }); // Updates the user state dynamically based on the input field's name attribute.
    };
    
    return (
        <form className='password-reset-container' onSubmit={resetPassword}>
            <input
                value={user.password}
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

            {isFocus && <PasswordRequirements checkPassword={checkPassword} />}
            
            <input
                value={user.repeatPassword}
                type='password'
                name='repeatPassword'
                placeholder='Repeat password'
                onChange={handleChange}
                required
            />

            <button type='submit'>Reset password</button>
        </form>
    );
};

export default PasswordReset;