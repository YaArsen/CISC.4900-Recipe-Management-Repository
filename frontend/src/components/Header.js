import ToggleButton from './ToggleButton';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, page }) => {
    const navigate = useNavigate();

    return (
        <div className='profile-header'>
            <h2>Welcome, {user.name}</h2>
            <ToggleButton page={page} />

            {/* Navigation Buttons */}
            <button className={page === 'search' ? 'search-button show' : 'search-button'} onClick={() => navigate('/search')}>Search</button>
            <button className={page === 'recipes' ? 'recipes-button show' : 'recipes-button'} onClick={() => navigate('/recipes')}>Recipes</button>
        </div>
    );
};

export default Header;