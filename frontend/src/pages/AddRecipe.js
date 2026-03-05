import { fetchPostRecipe } from '../api';
import RecipeForm from '../components/RecipeForm';

const AddRecipe = ({ setMessage, setIsAddRecipePage, setRecipes }) => {
    // Handles form submission, API request, and state updates
    const postRecipe = async (recipe) => {
        try {
            const data = await fetchPostRecipe(recipe); // 1. Send recipe data to the API
            // 2. Update UI state with new data
            setMessage(data.message);
            setRecipes(data.recipes);
            setIsAddRecipePage(false); // 3. Navigate to the recipe list page
        } catch (error) {
            return alert(error);
        }
    };

    return (
        <>
            <h1>Add Recipe</h1>
            <RecipeForm onSubmit={postRecipe} setIsAddRecipePage={setIsAddRecipePage} />
        </>
    );
};

export default AddRecipe;