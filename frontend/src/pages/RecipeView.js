import { fetchGetRecipe, fetchIsActivated } from '../api';
import ToggleLike from '../components/ToggleLike';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RecipeView = () => {
    const [recipe, setRecipe] = useState(null);
    const [isActivated, setIsActivated] = useState(null);
    const { page, recipeId } = useParams();
    const navigate = useNavigate();
 
    useEffect(() => {
        const getRecipe = async () => {
            try {
                const data = await fetchGetRecipe(recipeId);
                setRecipe(data);
            } catch (error) {
                return alert(error);
            }
        };

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

    if (!recipe || !isActivated) return <p>Loading...</p>;

    return (
        <div className='recipe-view'>
            <button onClick={() => {
                localStorage.setItem('page', page);
                navigate('/profile');
            }}>x</button>
            <img src={recipe.photoReference} alt={recipe.title} />
            <h4 className='title'>{recipe.title}</h4>
            <h4>Ingredients</h4>
            <ul>
                {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient}>{ingredient}</li>
                ))}
            </ul>
            <h4 className='instructions'>Instructions:<br/>
                <span className='instructions-content'>{recipe.instructions}</span>
            </h4>
            <h4 className='category'>Category: {recipe.category}</h4>
            <h4 className='difficulty'>Difficulty: {recipe.difficulty}</h4>
            <ToggleLike isActivated={isActivated} recipeId={recipe._id} setRecipe={setRecipe} setIsActivated={setIsActivated} />
            <h4 className='recipe-likes'>{recipe.likes}</h4>
            <h4 className='cooking-time'>{recipe.cookingTime} min</h4>
            <h4>Posted by {recipe.username}</h4>
            <h4 className='date'>{new Date(recipe.timestamp).toLocaleString()}</h4>
        </div>
    );
};

export default RecipeView;