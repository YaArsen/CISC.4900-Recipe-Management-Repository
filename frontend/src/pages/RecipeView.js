import { fetchGetRecipe } from '../api';
import ToggleLike from '../components/ToggleLike';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RecipeView = () => {
    const { page, pageNumber, recipeId } = useParams();
    const [recipe, setRecipe] = useState(null); // State to store the fetched recipe data
    const [isActivated, setIsActivated] = useState(null); // State to check if the current user has liked the recipe
    const navigate = useNavigate();
 
    // Fetch recipe data and like status when component mounts or recipeId changes
    useEffect(() => {
        // API call to get detailed recipe information
        const getRecipe = async () => {
            try {
                const data = await fetchGetRecipe(recipeId);
                setRecipe(data.recipe);
                setIsActivated(data.isActivated);
            } catch (error) {
                return alert(error);
            }
        };

        getRecipe();
    }, [recipeId]);

    if (!recipe || isActivated === null) return <p className='loading'>Loading...</p>; // Render loading state while data is being fetched

    return (
        <div className='recipe-view'>
            <div className='recipe-header'>
                <h4>{recipe.title}</h4>

                <button
                    className='close-button'
                    onClick={() => {
                        localStorage.setItem('pageNumber', pageNumber);
                        navigate(`/${page}`);
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
            
            <h4>Ingredients:</h4>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li> // List items need unique keys
                ))}
            </ul>

            <h4 className='instructions'>Instructions:<br/>{recipe.instructions}</h4>

            <div className='likes-container'>
                <ToggleLike
                    isActivated={isActivated}
                    recipeId={recipe._id}
                    setRecipe={setRecipe}
                    setIsActivated={setIsActivated}
                />

                <h4>{recipe.likes}</h4>
            </div>
            
            <div className='recipe-footer'>
                <h4>Posted by {recipe.username}</h4>
                <h4>{new Date(recipe.timestamp).toLocaleString()}</h4>
                <button className='comments-button' onClick={() => navigate(`/${page}/${pageNumber}/recipe-view/${recipe._id}/comments`)}>Comments</button> {/* Navigation to comments section */}
            </div>
        </div>
    );
};

export default RecipeView;