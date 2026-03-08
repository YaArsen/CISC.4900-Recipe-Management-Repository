import { fetchPasswordReset } from '../api';
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";


const PasswordReset = () => {
    const { verificationToken } = useParams();
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [isLowerCaseLetter, setIsLowerCaseLetter] = useState(false);
    const [isUpperCaseLetter, setIsUpperCaseLetter] = useState(false);
    const [isSpecialSymbol, setIsSpecialSymbol] = useState(false);
    const [isNumber, setIsNumber] = useState(false);
    const [isLengthEightOrMore, setIsLengtEightOrMore] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const navigate = useNavigate();

    const checkPassword = (e) => {
        const { value } = e.target;

        setIsLowerCaseLetter(/[a-z]/.test(value));
        setIsUpperCaseLetter(/[A-Z]/.test(value));
        setIsSpecialSymbol(/[!@#$%^&*(),.?":{}|<>]/.test(value));
        setIsNumber(/[0-9]/.test(value));
        setIsLengtEightOrMore(value.length >= 8);

        setPassword(value);
    };
 
    const passwordReset = async (e) => {
        e.preventDefault();

        if (!password.trim() || !repeatPassword.trim()) return;
        if (!(isLowerCaseLetter && isUpperCaseLetter && isSpecialSymbol && isNumber && isLengthEightOrMore)) return;
        if (password.trim() !== repeatPassword.trim()) return alert('Passwords do not match');

        try {
            const data = await fetchPasswordReset({ password: password.trim(), verificationToken });
            localStorage.setItem('message', data.message);
            navigate('/');
        } catch (error) {
            return alert(error);
        }
    };
    
    return (
        <form onSubmit={passwordReset}>
            <input
                value={password}
                type='password'
                placeholder='Password'
                onChange={checkPassword}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                required
            />

            {isFocus && <>
                <p style={{ color: isLowerCaseLetter ? 'green' : 'red' }}>Lower case letter</p>
                <p style={{ color: isUpperCaseLetter ? 'green' : 'red' }}>Upper case letter</p>
                <p style={{ color: isSpecialSymbol ? 'green' : 'red' }}>Special symbol</p>
                <p style={{ color: isNumber ? 'green' : 'red' }}>Number</p>
                <p style={{ color: isLengthEightOrMore ? 'green' : 'red' }}>Min 8 symbols</p>
            </>}
            
            <input
                value={repeatPassword}
                type='password'
                placeholder='Repeat password'
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
            />

            <button type='submit'>Reset password</button>
        </form>
    );
};

export default PasswordReset;