import { fetchGetAllUserRecipes } from '../api';
import AddRecipe from './AddRecipe';
import EditRecipe from './EditRecipe';
import DeleteRecipe from '../components/DeleteRecipe';
import RecipeDetails from '../components/RecipeDetails';
import Notification from '../components/Notification';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import threeVerticalDots from '../assets/three-dots-vertical.svg';

const Recipes = ({ userId }) => {
    const [recipes, setRecipes] = useState([]); // State to hold user's recipes
    const [recipeId, setRecipeId] = useState(null); // State to hold the ID of a recipe being edited
    const [isAddRecipePage, setIsAddRecipePage] = useState(false); // UI state to toggle Add Recipe view
    const [isEditRecipePage, setIsEditRecipePage] = useState(false); // UI state to toggle Edit Recipe view
    const [message, setMessage] = useState(''); // State for displaying user notifications
    const [isManaging, setIsManaging] = useState(false);
    const navigate = useNavigate();

    // Effect hook to fetch all user recipes on component mount
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

    if (!recipes) return <p>Loading...</p>; // Loading state
    // Conditional rendering for Add Recipe view
    if (isAddRecipePage) return <AddRecipe setMessage={setMessage} setIsAddRecipePage={setIsAddRecipePage} setRecipes={setRecipes} />;
    // Conditional rendering for Edit Recipe view
    if (isEditRecipePage) return <EditRecipe setIsManaging={setIsManaging} setMessage={setMessage} recipeId={recipeId} setIsEditRecipePage={setIsEditRecipePage} setRecipes={setRecipes} />;

    return (
        <>
            <div className='recipesobj'></div>
            <h1>Your Recipes</h1>
            <button className='add-recipe-btn' onClick={() => setIsAddRecipePage(true)}>Add a New Recipe</button>
            {message && setTimeout(() => setMessage(''), 2000) && <Notification message={message} />} {/* Display notification and clear it after 2 seconds */}

            {recipes.length === 0 ? (
                <p className='recipes-p'>No recipes yet!</p>
            ) : (
                <>
                    {recipes.map((recipe) => (
                        <div className='recipe-details' key={recipe._id}>
                            {/* Clickable area to view full recipe details */}
                            <div onClick={() => navigate(`/profile/recipes/${userId}/${recipe._id}`)}>
                                <RecipeDetails recipe={recipe} />
                                <h4>{recipe.isPublic ? 'Public' : 'Private'}</h4>
                            </div>
                            {/* Edit button sets the active recipe ID and switches view */}
                            <button className='manage-btn' onClick={() => setIsManaging(!isManaging)}>
                                <img src={threeVerticalDots} alt='manage' />
                            </button>
                    
                            {isManaging && (
                                <div className='is-managing-recipe-container'>
                                    <button 
                                        onClick={() => {
                                            setRecipeId(recipe._id);
                                            setIsEditRecipePage(true);
                                        }}
                                    >
                                        Edit
                                    </button>

                                    {/* Delete component handles API call and state update */}
                                    <DeleteRecipe setMessage={setMessage} recipeId={recipe._id} setRecipes={setRecipes} />
                                </div>
                    )}
                        
                        </div>
                    ))}
                </>
            )}
        </>
    );
};

export default Recipes;