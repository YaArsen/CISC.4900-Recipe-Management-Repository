import Fetch from '.Fetch';
import DeleteRecipe from './DeleteRecipe';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            const res = await Fetch('/api/recipes', { token });
            const data = await res.json();
            if (!res.ok) return alert(data.message);
            setRecipes(data);
        };

        fetchRecipes();
    }, [token]);

    if (!recipes) return <p>Loading...</p>;

    return (
        <>
            <div className='recipesobj'></div>
            <h3>Your recipes</h3>
            <button onClick={() => navigate('/add-recipe')}></button>

            {recipes.length === 0 ? (
                <p>No recipes yet!</p>
            ) : (
                <ul>
                    {recipes.map((recipe) => (
                        <li key={recipe._id}>
                            <img src={recipe.photoReference} alt={recipe.title} style={{ maxWidth: '100px' }} />
                            <h4>{recipe.title}</h4>
                            {recipe.isPublic ? <h4>PUBLIC</h4> : <h4>PRIVATE</h4>}
                            <h4>{recipe.username}</h4>
                            <h4>{new Date(recipe.timestamp).toLocaleTimeString()}</h4>
                            <div>
                                <button onClick={() => navigate(`/recipe/${userId}/${recipe._id}`)}>View</button>
                                <button onClick={() => navigate(`/edit-recipe/${recipe._id}`)}>Edit</button>
                                <DeleteRecipe recipeId={recipe._id} setRecipes={setRecipes} />
                                <button onClick={() => navigate(`/comments/${userId}/${recipe._id}`)}>Comments</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default Recipes;