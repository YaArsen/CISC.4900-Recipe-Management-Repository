import { fetchToggleFavorite } from '../api';

const ToggleFavorite = ({ isActivated, setIsActivated, recipeId }) => {

    const toggleFavorite = async () => {
        try {
            const data = await fetchToggleFavorite(recipeId);
            setIsActivated(data);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <button
            type='button'
            className={`favorites-button ${isActivated ? 'activated' : ''}`}
            onClick={toggleFavorite}
        >
            {!isActivated ? 'Add to favorites' : 'Remove from favorites'}
        </button>
    );
};

export default ToggleFavorite;