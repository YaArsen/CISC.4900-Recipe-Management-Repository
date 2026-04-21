import { fetchGetRecipe, fetchGetRecipeUsername } from '../api';
import ToggleFavoriteButton from '../components/ToggleFavoriteButton';
import ToggleLikeButton from '../components/ToggleLikeButton';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RecipeView = () => {
    const { page, pageNumber, recipeId } = useParams();
    const [username, setUsername] = useState('');
    const [recipe, setRecipe] = useState({}); // State to store the fetched recipe data
    const [tempRecipe, setTempRecipe] = useState(null);
    const [isFavoriteButtonActivated, setIsFavoriteButtonActivated] = useState(null);
    const [isLikeButtonActivated, setIsLikeButtonActivated] = useState(null); // State to check if the current user has liked the recipe
    const navigate = useNavigate();

    useEffect(() => {
        const recipe = localStorage.getItem('recipe');

        if (recipe) {
            localStorage.removeItem('recipe');
            setTempRecipe(JSON.parse(recipe));
        }
    }, []);

    // Fetch recipe data and like status when component mounts or recipeId changes
    useEffect(() => {
        // API call to get detailed recipe information
        const getRecipe = async () => {
            try {
                const data = await fetchGetRecipe(recipeId);
                setRecipe(data.recipe);
                setIsFavoriteButtonActivated(data.isFavoriteButtonActivated);
                setIsLikeButtonActivated(data.isLikeButtonActivated);
            } catch (error) {
                alert(error);
            }
        };

        getRecipe();
    }, [recipeId]);

    useEffect(() => {
        try {
            const getRecipeUsername = async () => {
                const data = await fetchGetRecipeUsername(recipe.user);
                setUsername(data);
            };

            if (recipe.user) getRecipeUsername();
        } catch (error) {
            alert(error);
        }
    }, [recipe.user]);

    if (isLikeButtonActivated === null) return <p className='loading'>Loading...</p>; // Render loading state while data is being fetched

    return (
        <div className='recipe-view'>
            <div className='recipe-header'>
                <h4>{recipe.title}</h4>

                <button
                    type='button'
                    className='close-button'
                    onClick={() => {
                        if (tempRecipe !== {}) localStorage.setItem('recipe', JSON.stringify(tempRecipe));
                        localStorage.setItem('pageNumber', pageNumber);
                        const array = page.split(' ');
                        array.length === 2 ? navigate(`/${array[0]}/${array[1]}`) : navigate(`/${page}`);
                    }}
                >
                    x
                </button>
            </div>

            {/* Recipe Details Display */}
            <img src={recipe.base64File} alt={recipe.title} />

            <div className='recipe-meta'>
                <h4>Category: {recipe.category}</h4>
                <h4>Difficulty: {recipe.difficulty}</h4>
                <h4>{recipe.cookingTime} min</h4>
            </div>

            <h4 style={{ color: '#555' }}>Ingredients:</h4>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>

            <h4 className='instructions'>Instructions:<br/>{recipe.instructions}</h4>

            <div className='action-button-container'>
                <div className='likes-container'>
                    <ToggleLikeButton
                        isActivated={isLikeButtonActivated}
                        recipeId={recipe._id}
                        setRecipe={setRecipe}
                        setIsActivated={setIsLikeButtonActivated}
                    />

                    <h4>{recipe.likes}</h4>
                </div>

                <ToggleFavoriteButton
                    isActivated={isFavoriteButtonActivated}
                    recipeId={recipe._id}
                    setIsActivated={setIsFavoriteButtonActivated}
                />
            </div>

            <div className='recipe-footer'>
                <span className='recipe-username'>{username}</span>
                <span className='recipe-timestamp'>{new Date(recipe.timestamp).toLocaleString()}</span>

                {/* Navigation to comments section */}
                <button
                    type='button'
                    className='comments-button'
                    onClick={() => {
                        if (tempRecipe !== {}) localStorage.setItem('recipe', JSON.stringify(tempRecipe));
                        navigate(`/${page}/${pageNumber}/recipe-view/${recipe._id}/comments`);
                    }}
                >
                    Comments
                </button>
            </div>
        </div>
    );
};

export default RecipeView;