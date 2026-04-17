import { fetchToggleLike } from '../api';

const ToggleLikeButton = ({ isActivated, setIsActivated, recipeId, setRecipe }) => {
    // Handles the API call and state updates when the button is clicked
    const toggleLike = async () => {
        try {
            const data = await fetchToggleLike(recipeId); // Send request to backend to toggle like status
            setRecipe(data.recipe); // Update the recipe details (e.g., like count) in the parent component
            setIsActivated(data.isActivated); // Update the local button activation state (true/false)
        } catch (error) {
            alert(error);
        }
    };

    return (
        <button
            type='button'
            className={`likes-button ${isActivated ? 'activated' : ''}`} 
            onClick={toggleLike}
        >
            {!isActivated ? 'Like' : 'Unlike'}
        </button>
    );
};

export default ToggleLikeButton;