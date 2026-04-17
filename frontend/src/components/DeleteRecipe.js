import { fetchDeleteRecipe } from '../api';

const DeleteRecipe = ({ setTotalPages, currentPage, setCurrentPage, setMessage, recipeId, setRecipes }) => {
    // Handles the deletion process
    const deleteRecipe = async (e) => {
        e.stopPropagation();

        try {
            const data = await fetchDeleteRecipe(recipeId, currentPage); // API call to delete the recipe
            // Update UI with success message and new recipe list
            setMessage(data.message);

            if (data.recipes.length === 0 && data.currentPage !== 1) {
                setCurrentPage(c => c - 1);
            } else {
                setRecipes(data.recipes);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            alert(error); // Alert user if the deletion fails
        }
    };

    return <button type='button' onClick={deleteRecipe}>Delete</button>; // Button triggers the delete operation
};

export default DeleteRecipe;