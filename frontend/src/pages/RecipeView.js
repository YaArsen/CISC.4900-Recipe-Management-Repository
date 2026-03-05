import { fetchGetRecipe, fetchIsActivated } from '../api';
import ToggleLike from '../components/ToggleLike';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RecipeView = () => {
    const [recipe, setRecipe] = useState(null); // State to store the fetched recipe data
    const [isActivated, setIsActivated] = useState(null); // State to check if the current user has liked the recipe
    // Get route parameters for recipe identification
    const { page, userId, recipeId } = useParams();
    const navigate = useNavigate();
 
    // Fetch recipe data and like status when component mounts or recipeId changes
    useEffect(() => {
        // API call to get detailed recipe information
        const getRecipe = async () => {
            try {
                const data = await fetchGetRecipe(recipeId);
                setRecipe(data);
            } catch (error) {
                return alert(error);
            }
        };

        // API call to check if the user has liked this recipe
        const isActivated = async () => {
            try {
                const data = await fetchIsActivated(recipeId);
                setIsActivated(data);
            } catch (error) {
                return alert(error);
            }
        };

        isActivated();
        getRecipe();
    }, [recipeId]);

    if (!recipe || isActivated === null) return <p>Loading...</p>; // Render loading state while data is being fetched

    return (
        <div className='recipe-view'>
            {/* Close button to return to previous page (stored in localStorage) */}
            <button onClick={() => {
                localStorage.setItem('page', page);
                navigate('/profile');
            }}>x</button>

            {/* Recipe Details Display */}
            <img src={recipe.photoReference} alt={recipe.title} />
            <h4 className='title'>{recipe.title}</h4>
            <h4>Ingredients</h4>
            <ul>
                {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient}>{ingredient}</li> // List items need unique keys
                ))}
            </ul>
            <h4 className='instructions'>Instructions:<br/>{recipe.instructions}</h4>
            <h4 className='category'>Category: {recipe.category}</h4>
            <h4 className='difficulty'>Difficulty: {recipe.difficulty}</h4>
            <ToggleLike isActivated={isActivated} recipeId={recipe._id} setRecipe={setRecipe} setIsActivated={setIsActivated} /> {/* Like Button Component */}
            <h4 className='recipe-likes'>{recipe.likes}</h4>
            <h4 className='cooking-time'>{recipe.cookingTime} min</h4>
            <h4>Posted by {recipe.username}</h4>
            <h4 className='date'>{new Date(recipe.timestamp).toLocaleString()}</h4>
            <button onClick={() => navigate(`/${userId}/${recipe._id}/comments`)}>Comments</button> {/* Navigation to comments section */}
        </div>
    );
};

export default RecipeView;