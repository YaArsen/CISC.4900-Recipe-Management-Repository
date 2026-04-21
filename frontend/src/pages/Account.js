import { fetchUpdateName, fetchUpdateEmail, fetchUpdatePassword } from '../api';
import { passwordChecker, areMatchingPasswordRequirements } from '../utils/checkPassword';
import PasswordRequirements from '../components/PasswordRequirements';
import ToastNotification from '../components/ToastNotification';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Account = () => {
    const { page } = useParams();
    const [userData, setUserData] = useState(null);
    const [user, setUser] = useState({});
    const [checkPassword, setCheckPassword] = useState({});
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
        const user = jwtDecode(token);
        setUserData(user);
    }, []);

    const updatePassword = async (e) => {
        e.preventDefault();
        if (!areMatchingPasswordRequirements(checkPassword) || !user.password.trim() || !user.newPassword.trim()) return;
        if (user.newPassword.trim() !== user.repeatPassword.trim()) return alert('Passwords do not match');

        try {
            const data = await fetchUpdatePassword({ password: user.password.trim(), newPassword: user.newPassword.trim() });
            setMessage(data.message);
            setUser({ ...user, password: '', newPassword: '', repeatPassword: '' });
            setCheckPassword({});
        } catch (error) {
            alert(error);
        }
    };

    const updateEmail = async (e) => {
        e.preventDefault();
        if (!user.email.trim()) return;

        try {
            const data = await fetchUpdateEmail({ page, email: user.email.trim(), password: user.passwordToChangeEmail.trim() });
            setMessage(data.message);
            setUser({ ...user, email: '', passwordToChangeEmail: '' });
        } catch (error) {
            alert(error);
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
            alert(error);
        }
    };

    // Generic change handler: updates the state based on the input's name attribute
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value }); // Updates the user state dynamically based on the input field's name attribute.
    };

    if (!userData) return <p className='loading'>Loading...</p>;

    return (
        <div className='account-container'>
            <div className='account-toast-notification'>
                <ToastNotification message={message} setMessage={setMessage} />
            </div>

            <button type='button' className='close-button' onClick={() => navigate(`/${page}`)}>x</button>

            <h4>User email: {userData.email}</h4>
            <form onSubmit={updateEmail}>
                <input
                    value={user.email ? user.email : ''} 
                    type='email' 
                    name='email' 
                    onChange={handleChange} 
                    placeholder='Email' 
                    required 
                />

                <input
                    value={user.passwordToChangeEmail ? user.passwordToChangeEmail : ''}
                    type='password'
                    name='passwordToChangeEmail'
                    onChange={handleChange}
                    placeholder='Current password'
                    required
                />

                <button type='submit'>Update email</button>
            </form>

            <h4>Username: {userData.name}</h4>
            <form onSubmit={updateName}>
                <input
                    value={user.name ? user.name : ''}
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
                    value={user.password ? user.password : ''}
                    type='password'
                    name='password'
                    onChange={handleChange}
                    placeholder='Current password'
                    required
                />

                <input
                    value={user.newPassword ? user.newPassword : ''}
                    type='password'
                    name='newPassword'
                    placeholder='New password'
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
                    value={user.repeatPassword ? user.repeatPassword : ''}
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