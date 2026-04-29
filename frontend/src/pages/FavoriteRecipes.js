import { fetchGetFavoriteRecipes } from '../api';
import Pagination from '../components/Pagination';
import RecipeDetails from '../components/RecipeDetails';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FavoriteRecipes = () => {
    const { page } = useParams();
    const [recipes, setRecipes] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const pageNumber = localStorage.getItem('pageNumber');

        if (pageNumber) {
            localStorage.removeItem('pageNumber');
            getFavoriteRecipes(pageNumber);
        } else {
            getFavoriteRecipes(currentPage);
        }
    }, [currentPage]);

    const getFavoriteRecipes = async (page) => {
        try {
            const data = await fetchGetFavoriteRecipes(page);
            setRecipes(data.recipes);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
        } catch (error) {
            alert(error);
        }
    };

    const handlePageChange = (page) => getFavoriteRecipes(page);

    if (page !== 'search' && page !== 'recipes') return <div>404 Not Found</div>;
    if (!recipes) return <p className='loading'>Loading...</p>; // Loading state

    return (
        <div className='activity-page-container'>
            <div className='activity-page-header'>
                <input type='button' value='<' className='previous-button' onClick={() => navigate(`/${page}`)} />
                <h1>Favorite Recipes</h1>
            </div>

            {recipes.length === 0 ? (
                <p>No favorite recipes!</p>
            ) : (
                <>
                    <div className='recipe-details-container'>
                        {recipes.map((recipe) => (
                            // Clickable area to view full recipe details
                            <div key={recipe._id} className='recipe-details' onClick={() => navigate(`/${page} favorite-recipes/${currentPage}/recipe-view/${recipe._id}`)}>
                                <RecipeDetails recipe={recipe} />
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
        </div>
    );
};

export default FavoriteRecipes;