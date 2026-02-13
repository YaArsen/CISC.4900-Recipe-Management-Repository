import Fetch from './Fetch';
import RecipeForm from './RecipeForm';

const AddRecipe = ({ setMessage, setIsAddRecipePage, setRecipes }) => {
    const token = localStorage.getItem('token');

    const handleFormSubmit = async (recipe) => {
        const res = await Fetch('/api/recipes', { method: 'POST', token, body: recipe });
        const data = await res.json();
        if (!res.ok) return alert(data.message);
        setMessage(data.message);
        setRecipes(data.recipes);
        setIsAddRecipePage(false);
    };

    return (
        <>
            <h2>Add Recipe</h2>
            <RecipeForm onSubmit={handleFormSubmit} setIsAddRecipePage={setIsAddRecipePage} />
        </>
    );

};

export default AddRecipe;