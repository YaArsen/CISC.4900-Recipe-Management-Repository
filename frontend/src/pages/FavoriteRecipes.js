import { fetchGetFavoriteRecipes } from '../api';
import Pagination from '../components/Pagination';
import RecipeDetails from '../components/RecipeDetails';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FavoriteRecipes = () => {
    const { page, pageNumber } = useParams();
    const [recipes, setRecipes] = useState(null);
    const [currentPage, setCurrentPage] = useState(parseInt(pageNumber));
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentPage(parseInt(pageNumber));
    }, [pageNumber]);

    useEffect(() => {
        const getFavoriteRecipes = async () => {
            try {
                const data = await fetchGetFavoriteRecipes(currentPage);
                setRecipes(data.recipes);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error(error);
            }
        };

        getFavoriteRecipes();
    }, [currentPage]);

    // Loading state
    if (!recipes) {
        return (
            <div className='loader-container'>
                <div className='loader'></div>
            </div>
        );
    }

    return (
        <div className='activity-page-container'>
            <div className='activity-page-header'>
                <input type='button' value='<' className='previous-button' onClick={() => navigate(`/${page}/page-number/1`)} />
                <h1>Favorite Recipes</h1>
            </div>

            {recipes.length === 0 ? (
                <p>No favorite recipes!</p>
            ) : (
                <>
                    <div className='recipe-details-container'>
                        {recipes.map((recipe) => (
                            // Clickable area to view full recipe details
                            <div
                                key={recipe._id}
                                className='recipe-details'
                                onClick={() => navigate(`/${page} favorite-recipes/page-number/${currentPage}/recipe-view/${recipe._id}`)}
                            >
                                <RecipeDetails recipe={recipe} />
                            </div>
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={(pageNumber) => navigate(`/${page}/page-number/${pageNumber}/favorite-recipes`)}
                        totalPages={totalPages}
                    />
                </>
            )}
        </div>
    );
};

export default FavoriteRecipes;