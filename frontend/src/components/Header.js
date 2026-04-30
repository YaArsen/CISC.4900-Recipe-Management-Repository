import HamburgerMenu from './HamburgerMenu';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, page }) => {
    const navigate = useNavigate();

    return (
        <div className='header'>
            <h2>Welcome, {user.name.split(' ')[0]}</h2>

            {/* Navigation Buttons */}
            <button
                type='button'
                className={`search-button ${page === 'search' ? 'show' : ''}`}
                onClick={() => navigate('/search')}
            >
                Search
            </button>

            <button
                type='button'
                className={`recipes-button ${page === 'recipes' ? 'show' : ''}`}
                onClick={() => navigate('/recipes')}
            >
                Recipes
            </button>

            <HamburgerMenu page={page} />
        </div>
    );
};

export default Header;