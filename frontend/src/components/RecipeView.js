import Fetch from './Fetch';
import ToggleLike from './ToggleLike';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RecipeView = () => {
    const [recipe, setRecipe] = useState(null);
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

        fetchRecipe();
    }, [token, recipeId]);

    if (!recipe) return <p>Loading...</p>;

    return (
        <div className='recipe-details'>
            <button onClick={() => {
                localStorage.setItem('component', component);
                navigate('/profile');
            }}>x</button>
            <img src={recipe.photoReference} alt='recipe' />
            <h4>{recipe.title}</h4>
            {recipe.likes}
            <ToggleLike recipeId={recipe._id} setRecipe={setRecipe} />
        </div>
    );
};

export default RecipeView;