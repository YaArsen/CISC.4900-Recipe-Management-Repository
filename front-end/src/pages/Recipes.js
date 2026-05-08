import { fetchGetAllUserRecipes } from '../api';
import Header from '../components/Header';
import Pagination from '../components/Pagination';
import EditRecipe from '../components/EditRecipe';
import DeleteRecipe from '../components/DeleteRecipe';
import RecipeDetails from '../components/RecipeDetails';
import KebabMenu from '../components/KebabMenu';
import ToastNotification from '../components/ToastNotification';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Recipes = () => {
    const { pageNumber } = useParams();
    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState(null); // State to hold user's posted recipes
    const [message, setMessage] = useState(''); // State for displaying notifications
    const [activeManageId, setActiveManageId] = useState(null);
    const [currentPage, setCurrentPage] = useState(parseInt(pageNumber));
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentPage(parseInt(pageNumber));
    }, [pageNumber]);

    useEffect(() => {
        const getRecipes = async () => {
            try {
                const data = await fetchGetAllUserRecipes(currentPage);
                setRecipes(data.recipes);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error(error);
            }
        };

        getRecipes();
    }, [currentPage]);

    useEffect(() => {
        const message = localStorage.getItem('message');

        if (message) {
            localStorage.removeItem('message');
            setMessage(message);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = jwtDecode(token);
        setUser(user);
    }, []);

    // Loading state
    if (!user || !recipes) {
        return (
            <div className='loader-container'>
                <div className='loader'></div>
            </div>
        );
    }

    return (
        <>
            <Header user={user} page='recipes' />

            <div className='recipes-toast-notification'>
                <ToastNotification message={message} setMessage={setMessage} /> {/* Display notification */}
            </div>

            <div className='recipes-header'>
                <h1>Your Recipes</h1>
                <button type='button' onClick={() => navigate(`/recipes/page-number/${currentPage}/add-recipe`)}>Add a New Recipe</button>
            </div>

            {recipes.length === 0 ? (
                <p className='recipes-page-p'>No recipes yet!</p>
            ) : (
                <>
                    <div className='recipe-details-container'>
                        {recipes.map((recipe) => (
                            // Clickable area to view full recipe details
                            <div
                                key={recipe._id}
                                className='recipe-details'
                                onClick={() => navigate(`/recipes/page-number/${currentPage}/recipe-view/${recipe._id}`)}
                            >
                                <RecipeDetails recipe={recipe} />
                                <h4>{recipe.isPublic ? 'Public' : 'Private'}</h4>

                                <KebabMenu
                                    setActiveManageId={setActiveManageId}
                                    activeManageId={activeManageId}
                                    id={recipe._id}
                                />

                                {activeManageId === recipe._id && (
                                    <div className='is-managing-container'>
                                        <EditRecipe
                                            currentPage={currentPage}
                                            recipeId={recipe._id}
                                        />

                                        {/* Delete component handles API call and state update */}
                                        <DeleteRecipe
                                            setTotalPages={setTotalPages}
                                            currentPage={currentPage}
                                            setMessage={setMessage}
                                            recipeId={recipe._id}
                                            setRecipes={setRecipes}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={(page) => navigate(`/recipes/page-number/${page}`)}
                        totalPages={totalPages}
                    />
                </>
            )}
        </>
    );
};

export default Recipes;