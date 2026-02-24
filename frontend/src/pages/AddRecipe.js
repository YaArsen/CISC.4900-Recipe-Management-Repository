import { fetchPostRecipe } from '../api';
import RecipeForm from '../components/RecipeForm';

const AddRecipe = ({ setMessage, setIsAddRecipePage, setRecipes }) => {
    const postRecipe = async (recipe) => {
        try {
            const data = await fetchPostRecipe(recipe);
            setMessage(data.message);
            setRecipes(data.recipes);
            setIsAddRecipePage(false);
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