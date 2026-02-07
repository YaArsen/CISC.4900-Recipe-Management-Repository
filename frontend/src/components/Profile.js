import ToggleButton from './ToggleButton';
import Search from './Search';
import Recipes from './Recipes';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isSearchPage, setIsSearchPage] = useState(true);
    const [isRecipesPage, setIsRecipesPage] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return;
        const user = jwtDecode(token);
        setUser(user);
    }, [token]);

    useEffect(() => {
        if (isClicked) {
        setIsRecipesPage(true);
        setIsSearchPage(false);
        setIsClicked(false);
        }
    }, [isClicked, setIsClicked]);


    if (!token || !user) return <p>Loading...</p>;

    return (
        <div className='profile-header'>
            <h2>Welcome, {user.name}</h2>
            <ToggleButton />
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
            {isSearchPage && <Search userId={user._id} />}
            {isRecipesPage && <Recipes userId={user._id} />}
        </div>
    );
};

export default Profile;