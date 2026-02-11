import Fetch from './Fetch';
import AddRecipe from './AddRecipe';
import EditRecipe from './EditRecipe';
import DeleteRecipe from './DeleteRecipe';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [recipeId, setRecipeId] = useState(null);
    const [isAddRecipePage, setIsAddRecipePage] = useState(false);
    const [isEditRecipePage, setIsEditRecipePage] = useState(false);
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

    if (isAddRecipePage) return <AddRecipe setIsAddRecipePage={setIsAddRecipePage} setRecipes={setRecipes} />;
    if (isEditRecipePage) return <EditRecipe recipeId={recipeId} setIsEditRecipePage={setIsEditRecipePage} setRecipes={setRecipes} />;

    return (
        <>
            <div className='recipesobj'></div>
            <h3>Your Recipes</h3>
            <button className='add-recipe-btn' onClick={() => setIsAddRecipePage(true)}>Add a New Recipe</button>

            {recipes.length === 0 ? (
                <p>No recipes yet!</p>
            ) : (
                <div className='recipes-list'>
                    {recipes.map((recipe) => (
                        <div key={recipe._id}>
                            <img src={recipe.photoReference} alt='recipe' />
                            <h4>{recipe.title}</h4>

                            <button 
                                className='view-recipe-btn' 
                                onClick={() => navigate(`/recipe/recipes/${recipe._id}`)}
                            >
                                View
                            </button>

                            <button 
                                className='edit-recipe-btn' 
                                onClick={() => {
                                    setRecipeId(recipe._id);
                                    setIsEditRecipePage(true);
                                }}
                            >
                                Edit
                            </button>

                            <DeleteRecipe recipeId={recipe._id} setRecipes={setRecipes} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default Recipes;