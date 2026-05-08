import { fetchPostRecipe } from '../api';
import RecipeForm from '../components/RecipeForm';
import { useNavigate, useParams } from 'react-router-dom';

const AddRecipe = () => {
    const { pageNumber } = useParams();
    const navigate = useNavigate();

    // Handles form submission, API request, and state updates
    const postRecipe = async (recipe) => {
        try {
            const data = await fetchPostRecipe(recipe); // Send recipe data to the API
            localStorage.setItem('message', data.message);
            navigate(`/recipes/page-number/${pageNumber}`);
        } catch (error) {
            console.error(error);
        }
    };

    return <RecipeForm onSubmit={postRecipe} page='Add Recipe' />;
};

export default AddRecipe;