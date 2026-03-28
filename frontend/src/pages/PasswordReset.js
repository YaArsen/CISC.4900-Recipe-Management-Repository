import { fetchPasswordReset } from '../api';
import passwordChecker from '../utils/passwordChecker';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PasswordReset = () => {
    const { verificationToken } = useParams();
    const [user, setUser] = useState({
        password: '',
        repeatPassword: ''
    });
    const [isFocus, setIsFocus] = useState(false);
    const [checkPassword, setCheckPassword] = useState({
        isLowerCaseLetter: false,
        isUpperCaseLetter: false,
        isSpecialSymbol: false,
        isNumber: false,
        isLengthEightOrMore: false
    });

    const navigate = useNavigate();
 
    const passwordReset = async (e) => {
        e.preventDefault();

        if (!user.password.trim() || !user.repeatPassword.trim()) return;

        if (!(
            checkPassword.isLowerCaseLetter
            && checkPassword.isUpperCaseLetter
            && checkPassword.isSpecialSymbol
            && checkPassword.isNumber
            && checkPassword.isLengthEightOrMore
        )) return;

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
        <form className='password-reset-container' onSubmit={passwordReset}>
            <input
                value={user.password}
                type='password'
                name='password'
                placeholder='Password'
                onChange={(e) => passwordChecker(e, user, setUser, setCheckPassword)}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                required
            />

            {isFocus && <>
                <p style={{ color: checkPassword.isLowerCaseLetter ? 'green' : 'red' }}>Lower case letter</p>
                <p style={{ color: checkPassword.isUpperCaseLetter ? 'green' : 'red' }}>Upper case letter</p>
                <p style={{ color: checkPassword.isSpecialSymbol ? 'green' : 'red' }}>Special symbol</p>
                <p style={{ color: checkPassword.isNumber ? 'green' : 'red' }}>Number</p>
                <p style={{ color: checkPassword.isLengthEightOrMore ? 'green' : 'red' }}>Min 8 symbols</p>
            </>}
            
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