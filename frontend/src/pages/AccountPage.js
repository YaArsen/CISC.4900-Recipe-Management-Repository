import { fetchUpdateName, fetchUpdateEmail, fetchUpdatePassword } from '../api';
import Notification from '../components/Notification';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
    const [isLowerCaseLetter, setIsLowerCaseLetter] = useState(false);
    const [isUpperCaseLetter, setIsUpperCaseLetter] = useState(false);
    const [isSpecialSymbol, setIsSpecialSymbol] = useState(false);
    const [isNumber, setIsNumber] = useState(false);
    const [isLengthEightOrMore, setIsLengtEightOrMore] = useState(false);
    const [isFocus, setIsFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewePassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const checkNewPassword = (e) => {
        const { value } = e.target;

        setIsLowerCaseLetter(/[a-z]/.test(value));
        setIsUpperCaseLetter(/[A-Z]/.test(value));
        setIsSpecialSymbol(/[!@#$%^&*(),.?":{}|<>]/.test(value));
        setIsNumber(/[0-9]/.test(value));
        setIsLengtEightOrMore(value.length >= 8);

        setPassword(value);
    };

    const updatePassword = async (e) => {
        e.preventDefault();

        if (!password.trim() || !newPassword.trim() || !repeatPassword.trim()) return;
        if (!(isLowerCaseLetter && isUpperCaseLetter && isSpecialSymbol && isNumber && isLengthEightOrMore)) return;
        if (newPassword.trim() !== repeatPassword.trim()) return alert('Passwords do not match');

        try {
            const data = await fetchUpdatePassword({ password: password.trim(), newPassword: newPassword.trim() });
            setMessage(data.message);
            setPassword('');
            setNewePassword('');
            setRepeatPassword('');
        } catch (error) {
            return alert(error);
        }
    };

    const updateEmail = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        try {
            const data = await fetchUpdateEmail({ email: email.trim() });
            setMessage(data.message);
            setEmail('');
        } catch (error) {
            return alert(error);
        }
    };

    const updateName = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        
        try {
            const data = await fetchUpdateName({ name: name.trim() });
            setMessage(data.message);
            setName('');
        } catch (error) {
            return alert(error);
        }
    };

    return (
        <div>
            <button onClick={() => navigate('/profile')}>x</button>
            {message && setTimeout(() => setMessage(''), 2000) && <Notification message={message} />}

            <form onSubmit={updateEmail}>
                <input value={email} type='email' onChange={(e) => setEmail(e.target.value)} placeholder='Email' required />
                <button type='submit'>Update email</button>
            </form>

            <form onSubmit={updateName}>
                <input value={name} type='text' onChange={(e) => setName(e.target.value)} placeholder='Name' required />
                <button type='submit'>Update name</button>
            </form>

            <form onSubmit={updatePassword}>
                <input
                    value={password}
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Current password'
                    required
                />

                <input
                    value={newPassword}
                    type='password'
                    placeholder='New password'
                    onChange={checkNewPassword}
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

                <button type='submit'>Update password</button>
            </form>
        </div>
    );
};

export default AccountPage;