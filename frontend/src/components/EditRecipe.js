import Fetch from './Fetch';
import RecipeForm from './RecipeForm';
import { useState, useEffect } from 'react';

const EditRecipe = ({ recipeId, setIsEditRecipePage, setRecipes }) => {
    const [recipe, setRecipe] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchRecipe = async () => {
            const res = await Fetch(`/api/recipes/${recipeId}`, { token });
            const data = await res.json();
            if (!res.ok) return alert(data.message);
            setRecipe(data);
        };

        fetchRecipe();
    }, [recipeId, token]);

    const handleFormSubmit = async (recipe) => {
        const res = await Fetch(`/api/recipes/${recipeId}`, { method: 'PUT', token, body: recipe });
        const data = await res.json();
        if (!res.ok) return alert(data.message);
        setRecipes(data.recipes);
        alert('Recipe edited successfully');
        setIsEditRecipePage(false);
    };

    if (!recipe) return <p>Loading...</p>;

    return (
        <>
            <h2>Edit Recipe</h2>
            <RecipeForm initialData={recipe} onSubmit={handleFormSubmit} />
        </>
    );
};

export default EditRecipe;