import {
    fetchUpdateName,
    fetchUpdateEmail,
    fetchUpdatePassword,
} from '../api';
import passwordChecker from '../utils/passwordChecker';
import ToastNotification from '../components/ToastNotification';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Account = () => {
    const { page } = useParams();
    const [userData, setUserData] = useState(null);
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
        const token = localStorage.getItem('token');
        if (!token) return;
        const user = jwtDecode(token);
        setUserData(user);
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

    // Generic change handler: updates the state based on the input's name attribute
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value }); // Updates the user state dynamically based on the input field's name attribute.
    };

    const updateEmail = async (e) => {
        e.preventDefault();
        if (!user.email.trim()) return;

        try {
            const data = await fetchUpdateEmail({ email: user.email.trim() });
            setMessage(data.message);
            setUser({ ...user, email: '' });
            setUserData({ ...userData, email: user.email.trim() });
            localStorage.setItem('token', data.token);
        } catch (error) {
            return alert(error);
        }
    };

    const updateName = async (e) => {
        e.preventDefault();
        if (!user.name.trim()) return;
        
        try {
            const data = await fetchUpdateName({ name: user.name.trim() });
            setMessage(data.message);
            setUser({ ...user, name: '' });
            setUserData({ ...userData, name: user.name.trim() });
            localStorage.setItem('token', data.token);
        } catch (error) {
            return alert(error);
        }
    };

    if (!userData) return <p>Loading...</p>;

    return (
        <div className='account-container'>
            <div className='close-button-container'>
                <button className='close-btn' onClick={() => navigate(`/${page}`)}>x</button>
            </div>

            <ToastNotification message={message} setMessage={setMessage} />

            <h4>User email: {userData.email}</h4>
            <form onSubmit={updateEmail}>
                <input
                    value={user.email} 
                    type='email' 
                    name='email' 
                    onChange={handleChange} 
                    placeholder='Email' 
                    required 
                />

                <button type='submit'>Update email</button>
            </form>

            <h4>Username: {userData.name}</h4>
            <form onSubmit={updateName}>
                <input
                    value={user.name}
                    type='text'
                    name='name'
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    required
                />

                <button type='submit'>Update password</button>
            </form>

            <h4>Account was created on {new Date(userData.timestamp).toDateString()}</h4>
        </div>
    );
};

export default Account;