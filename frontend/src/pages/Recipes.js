import { fetchGetAllUserRecipes } from '../api';
import Header from '../components/Header';
import Pagination from '../components/Pagination';
import DeleteRecipe from '../components/DeleteRecipe';
import RecipeDetails from '../components/RecipeDetails';
import KebabMenuButton from '../components/KebabMenuButton';
import ToastNotification from '../components/ToastNotification';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Recipes = () => {
    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState([]); // State to hold user's recipes
    const [message, setMessage] = useState(''); // State for displaying user notifications
    const [activeManageId, setActiveManageId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const pageNumber = localStorage.getItem('pageNumber');

        if (pageNumber) {
            localStorage.removeItem('pageNumber');
            getRecipes(pageNumber);
        } else {
            getRecipes(currentPage);
        }
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

    const getRecipes = async (page) => {
        try {
            const data = await fetchGetAllUserRecipes(page);
            setRecipes(data.recipes);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
        } catch (error) {
            alert(error);
        }
    };

    const handlePageChange = (page) => getRecipes(page);

    if (!user || !recipes) return <p className='loading'>Loading...</p>; // Loading state

    return (
        <>
            <Header user={user} page={'recipes'} />

            <div className='recipes-toast-notification'>
                <ToastNotification message={message} setMessage={setMessage} /> {/* Display notification */}
            </div>

            <div className='recipes-header'>
                <h1>Your Recipes</h1>
                <button type='button' onClick={() => navigate(`/recipes/${currentPage}/add-recipe`)}>Add a New Recipe</button>
            </div>

            {recipes.length === 0 ? (
                <p className='recipes-page-p'>No recipes yet!</p>
            ) : (
                <>
                    <div className='recipe-details-container'>
                        {recipes.map((recipe) => (
                            // Clickable area to view full recipe details
                            <div key={recipe._id} className='recipe-details' onClick={() => navigate(`/recipes/${currentPage}/recipe-view/${recipe._id}`)}>
                                <RecipeDetails recipe={recipe} />
                                <h4>{recipe.isPublic ? 'Public' : 'Private'}</h4>

                                <KebabMenuButton
                                    setActiveManageId={setActiveManageId}
                                    activeManageId={activeManageId}
                                    id={recipe._id}
                                />

                                {activeManageId === recipe._id && (
                                    <div className='is-managing-container'>
                                        <button
                                            type='button'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/recipes/${currentPage}/edit-recipe/${recipe._id}`);
                                            }}
                                        >
                                            Edit
                                        </button>

                                        {/* Delete component handles API call and state update */}
                                        <DeleteRecipe
                                            setTotalPages={setTotalPages}
                                            setCurrentPage={setCurrentPage}
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
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                        handlePageChange={handlePageChange}
                    />
                </>
            )}
        </>
    );
};

export default Recipes;