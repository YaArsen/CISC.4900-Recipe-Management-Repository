import { fetchDeleteRecipe } from '../api';

const DeleteRecipe = ({ setMessage, recipeId, setRecipes }) => {
    // Handles the deletion process
    const deleteRecipe = async () => {
        try {
            const data = await fetchDeleteRecipe(recipeId); // API call to delete the recipe
            // Update UI with success message and new recipe list
            setMessage(data.message);
            setRecipes(data.recipes);
        } catch (error) {
            return alert(error); // Alert user if the deletion fails
        }
    };

    return <button onClick={deleteRecipe}>Delete</button>; // Button triggers the delete operation
};

export default DeleteRecipe;