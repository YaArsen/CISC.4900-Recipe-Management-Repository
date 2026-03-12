import { fetchGetUsername } from '../api';
import Search from './Search';
import Recipes from './Recipes';
import ToggleButton from '../components/ToggleButton';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
    // State for user data and navigation between sections
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState(null);
    const [isSearchPage, setIsSearchPage] = useState(true);
    const [isRecipesPage, setIsRecipesPage] = useState(false);
    const token = localStorage.getItem('token'); // Retrieve token for authentication

    // Effect to decode user info from token on mount or token change
    useEffect(() => {
        if (!token) return;
        const user = jwtDecode(token);
        setUser(user);
    }, [token]);

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

    // Effect to handle navigation state (e.g., loading from previous page)
    useEffect(() => {
        const page = localStorage.getItem('page');

        if (page) {
            localStorage.removeItem('page');

            if (page === 'search') {
                setIsSearchPage(true);
                setIsRecipesPage(false);
            } else {
                setIsRecipesPage(true);
                setIsSearchPage(false);
            }
        }
    }, []);

    if (!user || !username || !token) return <p>Loading...</p>; // Loading state if user data isn't available

    return (
        <div className='profile-header'>
            <h2>Welcome, {username}</h2>
            <ToggleButton />

            {/* Navigation Buttons */}
            <button
                className='search-page-btn' 
                onClick={() => {
                    setIsSearchPage(true);
                    setIsRecipesPage(false);
                }}
            >
                Search
            </button>

            <button
                className='recipes-page-btn' 
                onClick={() => {
                    setIsRecipesPage(true);
                    setIsSearchPage(false);
                }}
            >
                Recipes
            </button>

            {/* Conditional Rendering of Components */}
            {isSearchPage && <Search userId={user.userId} />}
            {isRecipesPage && <Recipes userId={user.userId} />}
        </div>
    );
};

export default Profile;