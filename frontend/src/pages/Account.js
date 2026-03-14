import {
    fetchUpdateName,
    fetchUpdateEmail,
    fetchUpdatePassword,
    fetchGetUsername,
    fetchGetUserEmail
} from '../api';
import { passwordChecker } from '../utils/passwordChecker';
import { handleChange } from '../utils/handleChange';
import Notification from '../components/Notification';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Account = () => {
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        newPassword: '',
        repeatPassword: ''
    });

    const [checkPassword, setCheckPassword] = useState({
        isLowerCaseLetter: false,
        isUpperCaseLetter: false,
        isSpecialSymbol: false,
        isNumber: false,
        isLengthEightOrMore: false
    });

    const [isFocus, setIsFocus] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const message = localStorage.getItem('message');

        if (message) {
            localStorage.removeItem('message');
            setMessage(message);
        }
    }, []);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        try {
            const getUserEmail = async () => {
                const data = await fetchGetUserEmail();
                setUserEmail(data);
            };

            getUserEmail();
        } catch (error) {
            return alert(error);
        }
    }, []);

    useEffect(() => {
        try {
            const getUsername = async () => {
                const data = await fetchGetUsername();
                setUsername(data);
            };

            getUsername();
        } catch (error) {
            return alert(error);
        }
    }, []);

    const updatePassword = async (e) => {
        e.preventDefault();

        if (!user.password.trim() || !user.newPassword.trim() || !user.repeatPassword.trim()) return;

        if (!(
            checkPassword.isLowerCaseLetter
            && checkPassword.isUpperCaseLetter
            && checkPassword.isSpecialSymbol
            && checkPassword.isNumber
            && checkPassword.isLengthEightOrMore
        )) return;

        if (user.newPassword.trim() !== user.repeatPassword.trim()) return alert('Passwords do not match');

        try {
            const data = await fetchUpdatePassword({ password: user.password.trim(), newPassword: user.newPassword.trim() });
            setMessage(data.message);
            setUser({ ...user, password: '', newPassword: '', repeatPassword: '' });
        } catch (error) {
            return alert(error);
        }
    };

    const updateEmail = async (e) => {
        e.preventDefault();
        if (!user.email.trim()) return;

        try {
            const data = await fetchUpdateEmail({ email: user.email.trim() });
            setMessage(data.message);
            setUser({ ...user, email: '' });
        } catch (error) {
            return alert(error);
        }
    };

    const updateName = async (e) => {
        e.preventDefault();
        if (!user.name.trim()) return;
        
        try {
            const data = await fetchUpdateName({ name: user.name.trim() });
            setUsername(data.name);
            setMessage(data.message);
            setUser({ ...user, name: '' });
        } catch (error) {
            return alert(error);
        }
    };

    if (!username && !userEmail) return <p>Loading...</p>;

    return (
        <div>
            <button onClick={() => navigate(-1)}>x</button>
            {message && <Notification message={message} />}

            <h4>User email: {userEmail}</h4>
            <form onSubmit={updateEmail}>
                <input
                    value={user.email} 
                    type='email' 
                    name='email' 
                    onChange={(e) => handleChange(e, user, setUser)} 
                    placeholder='Email' 
                    required 
                />

                <button type='submit'>Update email</button>
            </form>

            <h4>Username: {username}</h4>
            <form onSubmit={updateName}>
                <input
                    value={user.name}
                    type='text'
                    name='name'
                    onChange={(e) => handleChange(e, user, setUser)}
                    placeholder='Name'
                    required
                />

                <button type='submit'>Update name</button>
            </form>

            <form onSubmit={updatePassword}>
                <input
                    value={user.password}
                    type='password'
                    name='password'
                    onChange={(e) => handleChange(e, user, setUser)}
                    placeholder='Current password'
                    required
                />

                <input
                    value={user.newPassword}
                    type='password'
                    name='newPassword'
                    placeholder='New password'
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
                    onChange={(e) => handleChange(e, user, setUser)}
                    required
                />

                <button type='submit'>Update password</button>
            </form>
        </div>
    );
};

export default Account;