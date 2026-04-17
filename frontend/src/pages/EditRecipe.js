import { fetchGetRecipe, fetchUpdateRecipe } from '../api';
import RecipeForm from '../components/RecipeForm';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditRecipe = () => {
    const { recipeId, pageNumber } = useParams();
    const [recipe, setRecipe] = useState(null); // State to hold the recipe data fetched from the API
    const navigate = useNavigate();

    // useEffect to fetch the recipe data when the component mounts or when recipeId changes
    useEffect(() => {
        const getRecipe = async () => {
            try {
                const data = await fetchGetRecipe(recipeId);
                setRecipe(data.recipe);
            } catch (error) {
                return alert(error);
            }
        };

        getRecipe();
    }, [recipeId]);

    // Handles form submission to update the recipe
    const updateRecipe = async (recipe) => {
        try {
            const data = await fetchUpdateRecipe(recipeId, recipe);
            localStorage.setItem('message', data.message);
            localStorage.setItem('pageNumber', pageNumber);
            navigate('/recipes');
        } catch (error) {
            alert(error); // Basic error handling for updates
        }
    };

    if (!recipe) return <p className='loading'>Loading...</p>; // Show loading message while fetching data

    return (
        <>
            <h1 className='edit-recipe'>Edit Recipe</h1>
            <RecipeForm initialData={recipe} onSubmit={updateRecipe} />
        </>
    );
};

export default EditRecipe;