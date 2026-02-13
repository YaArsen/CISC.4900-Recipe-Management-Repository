import Fetch from './Fetch';
import AddRecipe from './AddRecipe';
import EditRecipe from './EditRecipe';
import DeleteRecipe from './DeleteRecipe';
import RecipeDetails from './RecipeDetails';
import Notification from './Notification';
import { useState, useEffect } from "react";

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [recipeId, setRecipeId] = useState(null);
    const [isAddRecipePage, setIsAddRecipePage] = useState(false);
    const [isEditRecipePage, setIsEditRecipePage] = useState(false);
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');

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

    if (isAddRecipePage) return <AddRecipe setMessage={setMessage} setIsAddRecipePage={setIsAddRecipePage} setRecipes={setRecipes} />;
    if (isEditRecipePage) return <EditRecipe setMessage={setMessage} recipeId={recipeId} setIsEditRecipePage={setIsEditRecipePage} setRecipes={setRecipes} />;

    return (
        <>
            <div className='recipesobj'></div>
            <h3>Your Recipes</h3>
            {message &&  setTimeout(() => setMessage(''), 2000) && <Notification message={message} />}
            <button className='add-recipe-btn' onClick={() => setIsAddRecipePage(true)}>Add a New Recipe</button>

            {recipes.length === 0 ? (
                <p>No recipes yet!</p>
            ) : (
                <div className='recipes-list'>
                    {recipes.map((recipe) => (
                        <>
                            <RecipeDetails recipe={recipe} component={'recipes'} />

                            <button 
                                onClick={() => {
                                    setRecipeId(recipe._id);
                                    setIsEditRecipePage(true);
                                }}
                            >
                                Edit
                            </button>

                            <DeleteRecipe setMessage={setMessage} recipeId={recipe._id} setRecipes={setRecipes} />
                        </>
                    ))}
                </div>
            )}
        </>
    );
};

export default Recipes;