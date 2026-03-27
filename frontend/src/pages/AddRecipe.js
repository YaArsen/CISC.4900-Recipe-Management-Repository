import { fetchPostRecipe } from '../api';
import RecipeForm from '../components/RecipeForm';
import { useNavigate } from 'react-router-dom';

const AddRecipe = () => {
    const navigate = useNavigate();
    
    // Handles form submission, API request, and state updates
    const postRecipe = async (recipe) => {
        try {
            const data = await fetchPostRecipe(recipe); // Send recipe data to the API
            localStorage.setItem('message', data.message);
            navigate('/recipes');
        } catch (error) {
            return alert(error);
        }
    };

    return (
        <div className='add-recipe-container'>
            <h1>Add Recipe</h1>
            <RecipeForm onSubmit={postRecipe} />
        </div>
    );
};

export default AddRecipe;