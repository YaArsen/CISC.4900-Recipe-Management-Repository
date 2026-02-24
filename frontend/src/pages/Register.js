import { fetchRegister } from '../api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState(null);
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

        setUser({ ...user, password: value });
    };

    const register = async (e) => {
        e.preventDefault();

        if (!(isLowerCaseLetter && isUpperCaseLetter && isSpecialSymbol && isNumber && isLengthEightOrMore)) return;
        if (user.password !== user.repeatPassword) return alert('Passwords do not match');

        try {
            const data = await fetchRegister(user);
            localStorage.setItem('message', data.message);
            navigate('/');
        } catch (error) {
            return alert(error);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
        <form className='register-container' onSubmit={register}>
            <h2>Register</h2>
            <input name='name' placeholder='Name' onChange={handleChange} required />
            <input type='email' name='email' placeholder='Email' onChange={handleChange} required />
            <input type='password' name='password' placeholder='Password' onChange={checkPassword} onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)} required />
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