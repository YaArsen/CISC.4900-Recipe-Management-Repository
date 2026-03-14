import { fetchGetAllUserRecipes } from '../api';
import Header from '../components/Header';
import DeleteRecipe from '../components/DeleteRecipe';
import RecipeDetails from '../components/RecipeDetails';
import Notification from '../components/Notification';
import threeVerticalDots from '../assets/three-dots-vertical.svg';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]); // State to hold user's recipes
    const [message, setMessage] = useState(''); // State for displaying user notifications
    const [isManaging, setIsManaging] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const message = localStorage.getItem('message');

        if (message) {
            localStorage.removeItem('message');
            setMessage(message);
        }
    }, []);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    // Effect hook to fetch all user recipes on component mount
    useEffect(() => {
        const getRecipes = async () => {
            try {
                const data = await fetchGetAllUserRecipes();
                setRecipes(data);
            } catch (error) {
                return alert(error);
            }
        };

        getRecipes();
    }, []);

    if (!recipes) return <p>Loading...</p>; // Loading state

    return (
        <>
            <Header />
            <h1>Your Recipes</h1>
            <button className='add-recipe-btn' onClick={() => navigate('/add-recipe')}>Add a New Recipe</button>
            {message && <Notification message={message} />} {/* Display notification */}

            {recipes.length === 0 ? (
                <p className='recipes-p'>No recipes yet!</p>
            ) : (
                <>
                    {recipes.map((recipe) => (
                        <div className='recipe-details' key={recipe._id}>
                            {/* Clickable area to view full recipe details */}
                            <div onClick={() => navigate(`/recipes/recipe-view/${recipe._id}`)}>
                                <RecipeDetails recipe={recipe} />
                                <h4>{recipe.isPublic ? 'Public' : 'Private'}</h4>
                            </div>

                            {/* Edit button sets the active recipe ID and switches view */}
                            <button className='manage-btn' onClick={() => setIsManaging(!isManaging)}>
                                <img src={threeVerticalDots} alt='manage' />
                            </button>
                    
                            {isManaging && (
                                <div className='is-managing-recipe-container'>
                                    <button onClick={() => navigate(`/edit-recipe/${recipe._id}`)}>Edit</button>
                                    {/* Delete component handles API call and state update */}
                                    <DeleteRecipe setMessage={setMessage} recipeId={recipe._id} setRecipes={setRecipes} />
                                </div>
                            )}
                        
                        </div>
                    ))}
                </>
            )}
        </>
    );
};

export default Recipes;