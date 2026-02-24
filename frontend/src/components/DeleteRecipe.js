import { fetchDeleteRecipe } from '../api';

const DeleteRecipe = ({ setMessage, recipeId, setRecipes }) => {
    const deleteRecipe = async () => {
        try {
            const data = await fetchDeleteRecipe(recipeId);
            setMessage(data.message);
            setRecipes(data.recipes);
        } catch (error) {
            return alert(error);
        }
    };

    return <button onClick={deleteRecipe}>Delete</button>;
};

export default DeleteRecipe;