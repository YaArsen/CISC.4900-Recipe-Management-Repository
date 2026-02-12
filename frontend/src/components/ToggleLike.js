import Fetch from './Fetch';

const ToggleLike = ({ isActivated, recipeId, setRecipe, setIsActivated }) => {
    const token = localStorage.getItem('token');

    const handleClick = async () => {
        const res = await Fetch(`/api/recipes/${recipeId}/likes`, { method: 'POST', token });
        const data = await res.json();
        if (!res.ok) return alert(data.message);
        setRecipe(data.recipe);
        setIsActivated(data.isActivated);
    };

    return (
        <>
            {isActivated === 'activated' ? (
                <button className='like-btn-activated' onClick={handleClick}>Like</button>
            ) : (
                <button className='like-btn' onClick={handleClick}>Like</button>
            )}
        </>
    );
};

export default ToggleLike;