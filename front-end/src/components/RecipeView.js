import Fetch from './Fetch';
import ToggleLike from './ToggleLike';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RecipeView = () => {
    const [recipe, setRecipe] = useState(null);
    const [isActivated, setIsActivated] = useState(null);
    const token = localStorage.getItem('token');
    const { component, recipeId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipe = async () => {
            const res = await Fetch(`/api/recipes/${recipeId}`, { token });
            const data = await res.json();
            if (!res.ok) return alert(data.message);
            setRecipe(data);
        };

        const isActivated = async () => {
            const res = await Fetch(`/api/recipes/isActivated/${recipeId}`, { token });
            const data = await res.json();
            if (!res.ok) return alert(data.message);
            setIsActivated(data);
        };

        isActivated();
        fetchRecipe();
    }, [token, recipeId]);

    if (!recipe || !isActivated) return <p>Loading...</p>;

    return (
        <div className='recipe-details'>
            <button onClick={() => {
                localStorage.setItem('component', component);
                navigate('/profile');
            }}>x</button>
            <img src={recipe.photoReference} alt='recipe' />
            <h4>{recipe.title}</h4>
            <h4>Ingredients: {recipe.ingredients}</h4>
            <h4>Instructions: {recipe.instructions}</h4>
            <h4>{recipe.cookingTime} min</h4>
            <h4>Difficulty: {recipe.difficulty}</h4>
            <h4>Category: {recipe.category}</h4>
            <ToggleLike isActivated={isActivated} recipeId={recipe._id} setRecipe={setRecipe} setIsActivated={setIsActivated} />
            <h4 className='recipe-likes'>{recipe.likes}</h4>
            <h4>Posted by {recipe.username}</h4>
            <h4>{new Date(recipe.timestamp).toLocaleString()}</h4>
        </div>
    );
};

export default RecipeView;