import { fetchGetAllUserRecipes } from '../api';
import AddRecipe from './AddRecipe';
import EditRecipe from './EditRecipe';
import DeleteRecipe from '../components/DeleteRecipe';
import RecipeDetails from '../components/RecipeDetails';
import Notification from '../components/Notification';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [recipeId, setRecipeId] = useState(null);
    const [isAddRecipePage, setIsAddRecipePage] = useState(false);
    const [isEditRecipePage, setIsEditRecipePage] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getRecipes = async () => {
            try {
                const data = await fetchGetAllUserRecipes();
                setRecipes(data);
            } catch (error) {
                return alert(error);
            }
        };

        getRecipes();
    }, []);

    if (!recipes) return <p>Loading...</p>;

    if (isAddRecipePage) return <AddRecipe setMessage={setMessage} setIsAddRecipePage={setIsAddRecipePage} setRecipes={setRecipes} />;
    if (isEditRecipePage) return <EditRecipe setMessage={setMessage} recipeId={recipeId} setIsEditRecipePage={setIsEditRecipePage} setRecipes={setRecipes} />;

    return (
        <>
            <div className='recipesobj'></div>
            <h1>Your Recipes</h1>
            <button className='add-recipe-btn' onClick={() => setIsAddRecipePage(true)}>Add a New Recipe</button>
            {message &&  setTimeout(() => setMessage(''), 2000) && <Notification message={message} />}

            {recipes.length === 0 ? (
                <p className='recipes-p'>No recipes yet!</p>
            ) : (
                <>
                    {recipes.map((recipe) => (
                        <div className='recipe-details' key={recipe._id}>
                            <div onClick={() => navigate(`/profile/recipes/${recipe._id}`)}>
                                <h4>{recipe.isPublic ? 'Public' : 'Private'}</h4>
                                <RecipeDetails recipe={recipe} />
                            </div>
                                <button 
                                    onClick={() => {
                                        setRecipeId(recipe._id);
                                        setIsEditRecipePage(true);
                                    }}
                                >
                                    Edit
                                </button>

                                <DeleteRecipe setMessage={setMessage} recipeId={recipe._id} setRecipes={setRecipes} />
                        </div>
                    ))}
                </>
            )}
        </>
    );
};

export default Recipes;