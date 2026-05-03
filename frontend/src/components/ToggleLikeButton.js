import { fetchToggleLike } from '../api';

const ToggleLikeButton = ({ isLiked, setIsLiked, recipeId, setRecipe }) => {
    const toggleLike = async () => {
        try {
            const data = await fetchToggleLike(recipeId); // Send request to backend to toggle like status
            setRecipe(data.recipe); // Update the recipe details (e.g., like count) in the parent component
            setIsLiked(data.isActivated); // Update the local button activation state (true/false)
        } catch (error) {
            alert(error);
        }
    };

    return (
        <button
            type='button'
            className={`likes-button ${isLiked ? 'activated' : ''}`} 
            onClick={toggleLike}
        >
            {!isLiked ? 'Like' : 'Unlike'}
        </button>
    );
};

export default ToggleLikeButton;