import { fetchDeleteRecipe } from '../api';
import { useNavigate } from 'react-router-dom';

const DeleteRecipe = ({ setTotalPages, currentPage, setMessage, recipeId, setRecipes }) => {
    const navigate = useNavigate();

    // Handles the deletion process
    const deleteRecipe = async (e) => {
        e.stopPropagation();

        try {
            const data = await fetchDeleteRecipe(recipeId, currentPage); // API call to delete the recipe
            // Update UI with success message and new recipe list
            setMessage(data.message);

            if (data.recipes.length === 0 && data.currentPage !== 1) {
                navigate(`/recipes/page-number/${currentPage - 1}`);
            } else {
                setRecipes(data.recipes);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return <button type='button' onClick={deleteRecipe}>Delete</button>; // Button triggers the delete operation
};

export default DeleteRecipe;