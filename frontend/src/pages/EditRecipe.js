import { fetchGetRecipe, fetchUpdateRecipe } from '../api';
import RecipeForm from '../components/RecipeForm';
import { useState, useEffect } from 'react';

const EditRecipe = ({ setIsManaging, setMessage, recipeId, setIsEditRecipePage, setRecipes }) => {
    const [recipe, setRecipe] = useState(null); // State to hold the recipe data fetched from the API

    // useEffect to fetch the recipe data when the component mounts or when recipeId changes
    useEffect(() => {
        const getRecipe = async () => {
            try {
                const data = await fetchGetRecipe(recipeId);
                setRecipe(data);
            } catch (error) {
                return alert(error);
            }
        };

        getRecipe();
    }, [recipeId]);

    // Handles form submission to update the recipe
    const updateRecipe = async (recipe) => {
        try {
            const data = await fetchUpdateRecipe(recipeId, recipe);
            setMessage(data.message); // Set success message
            setRecipes(data.recipes); // Update parent state with new recipe list
            setIsEditRecipePage(false); // Close edit page/view
            setIsManaging(false);
        } catch (error) {
            return alert(error); // Basic error handling for updates
        }
    };

    if (!recipe) return <p>Loading...</p>; // Show loading message while fetching data

    return (
        <>
            <h1>Edit Recipe</h1>
            {/* RecipeForm pre-filled with existing data and handles submission */}
            <RecipeForm initialData={recipe} onSubmit={updateRecipe} setIsEditRecipePage={setIsEditRecipePage} />
        </>
    );
};

export default EditRecipe;