import { fetchToggleLike } from '../api';

const ToggleLike = ({ isActivated, recipeId, setRecipe, setIsActivated }) => {
    // Handles the API call and state updates when the button is clicked
    const toggleLike = async () => {
        try {
            const data = await fetchToggleLike(recipeId); // Send request to backend to toggle like status
            setRecipe(data.recipe); // Update the recipe details (e.g., like count) in the parent component
            setIsActivated(data.isActivated); // Update the local button activation state (true/false)
        } catch (error) {
            return alert(error);
        }
    };

    return <button className={`like-button ${isActivated ? 'activated' : ''}`}  onClick={toggleLike}>Like</button>;
};

export default ToggleLike;