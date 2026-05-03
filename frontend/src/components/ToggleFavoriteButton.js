import { fetchToggleFavorite } from '../api';

const ToggleFavoriteButton = ({ isFavorite, setIsFavorite, recipeId }) => {

    const toggleFavorite = async () => {
        try {
            const data = await fetchToggleFavorite(recipeId);
            setIsFavorite(data);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <button
            type='button'
            className={`favorites-button ${isFavorite ? 'activated' : ''}`}
            onClick={toggleFavorite}
        >
            {!isFavorite ? 'Add to favorites' : 'Remove from favorites'}
        </button>
    );
};

export default ToggleFavoriteButton;