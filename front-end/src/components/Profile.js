import Search from './Search';
import Recipes from './Recipes';
import ToggleButton from './ToggleButton';
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

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
        const component = localStorage.getItem('component');

        if (component) {
            localStorage.removeItem('component');

            if (component === 'search') {
                setIsSearchPage(true);
                setIsRecipesPage(false);
            } else {
                setIsRecipesPage(true);
                setIsSearchPage(false);
            }
        }
    }, []);

    if (!user || !token) return <p>Loading...</p>;

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

            {isSearchPage && <Search />}
            {isRecipesPage && <Recipes />}
        </div>
    );
};

export default Profile;