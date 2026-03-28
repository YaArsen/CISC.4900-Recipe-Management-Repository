import { fetchGetAllUserRecipes } from '../api';
import Header from '../components/Header';
import DeleteRecipe from '../components/DeleteRecipe';
import RecipeDetails from '../components/RecipeDetails';
import ToastNotification from '../components/ToastNotification';
import threeVerticalDots from '../assets/three-dots-vertical.svg';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Recipes = () => {
    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState([]); // State to hold user's recipes
    const [message, setMessage] = useState(''); // State for displaying user notifications
    const [activeManageId, setActiveManageId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const message = localStorage.getItem('message');

        if (message) {
            localStorage.removeItem('message');
            setMessage(message);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        const user = jwtDecode(token);
        setUser(user);
    }, []);

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

    if (!user || !recipes) return <p>Loading...</p>; // Loading state

    return (
        <div className='recipes-container'>
            <Header user={user} page={'recipes'} />

            <div className='recipes-header'>
                <h1>Your Recipes</h1>
                <ToastNotification message={message} setMessage={setMessage} /> {/* Display notification */}
                <button onClick={() => navigate('/add-recipe')}>Add a New Recipe</button>
            </div>

            {recipes.length === 0 ? (
                <p>No recipes yet!</p>
            ) : (
                <div className='recipe-details-container'>
                    {recipes.map((recipe) => (
                        <div key={recipe._id}>
                            {/* Clickable area to view full recipe details */}
                            <div className='recipe-details' onClick={() => navigate(`/recipes/recipe-view/${recipe._id}`)}>
                                <RecipeDetails recipe={recipe} />
                                <h4>{recipe.isPublic ? 'Public' : 'Private'}</h4>

                                {/* Edit button sets the active recipe ID and switches view */}
                                <button
                                    className='manage-button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveManageId(activeManageId === recipe._id ? '' : recipe._id.toString())
                                    }}
                                >
                                    <img src={threeVerticalDots} alt='manage' />
                                </button>
                    
                                {activeManageId === recipe._id && (
                                    <div className='is-managing-recipe-container'>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/edit-recipe/${recipe._id}`)
                                            }}
                                        >
                                            Edit
                                        </button>

                                        {/* Delete component handles API call and state update */}
                                        <DeleteRecipe
                                            setMessage={setMessage}
                                            recipeId={recipe._id}
                                            setRecipes={setRecipes}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Recipes;