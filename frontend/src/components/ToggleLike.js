import { fetchToggleLike } from '../api';

const ToggleLike = ({ isActivated, recipeId, setRecipe, setIsActivated }) => {
    const toggleLike = async () => {
        try {
            const data = await fetchToggleLike(recipeId);
            setRecipe(data.recipe);
            setIsActivated(data.isActivated);
        } catch (error) {
            return alert(error);
        }
    };

    return (
        <>
            {isActivated ? (
                <button className='like-btn-activated' onClick={toggleLike}>Like</button>
            ) : (
                <button className='like-btn' onClick={toggleLike}>Like</button>
            )}
        </>
    );
};

export default ToggleLike;