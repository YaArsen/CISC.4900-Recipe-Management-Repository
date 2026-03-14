import { fetchGetUsername } from '../api';
import ToggleButton from './ToggleButton';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

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
    
    if (!username) return <p>Loading...</p>;

    return (
        <div className='profile-header'>
            <h2>Welcome, {username}</h2>
            <ToggleButton />

            {/* Navigation Buttons */}
            <button className='search-page-btn' onClick={() => navigate('/search')}>Search</button>
            <button className='recipes-page-btn' onClick={() => navigate('/recipes')}>Recipes</button>
        </div>
    );
};

export default Header;