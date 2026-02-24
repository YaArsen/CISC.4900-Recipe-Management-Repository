import { fetchGetRecipe, fetchUpdateRecipe } from '../api';
import RecipeForm from '../components/RecipeForm';
import { useState, useEffect } from 'react';

const EditRecipe = ({ setMessage, recipeId, setIsEditRecipePage, setRecipes }) => {
    const [recipe, setRecipe] = useState(null);

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

    const updateRecipe = async (recipe) => {
        try {
            const data = await fetchUpdateRecipe(recipeId, recipe);
            setMessage(data.message);
            setRecipes(data.recipes);
            setIsEditRecipePage(false);
        } catch (error) {
            return alert(error);
        }
    };

    if (!recipe) return <p>Loading...</p>;

    return (
        <>
            <h1>Edit Recipe</h1>
            <RecipeForm initialData={recipe} onSubmit={updateRecipe} setIsEditRecipePage={setIsEditRecipePage} />
        </>
    );
};

export default EditRecipe;