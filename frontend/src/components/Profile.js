import ToggleButton from './ToggleButton';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;
        const user = jwtDecode(token);
        setUser(user);
    }, [token]);

    if (!token || !user) return <p>Loading...</p>;

    return (
        <>
            <h2>Welcome, {user.name}</h2>
            <ToggleButton />
            <a href={'/search'}>Search</a>
        </>
    );
};

export default Profile;