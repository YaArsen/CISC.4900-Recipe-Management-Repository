import { fetchGetLikedRecipes } from '../api';
import Pagination from '../components/Pagination';
import RecipeDetails from '../components/RecipeDetails';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const LikedRecipes = () => {
    const { page, pageNumber } = useParams();
    const [recipes, setRecipes] = useState(null);
    const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentPage(parseInt(pageNumber) || 1);
    }, [pageNumber]);

    useEffect(() => {
        const getLikedRecipes = async () => {
            try {
                const data = await fetchGetLikedRecipes(currentPage);
                setRecipes(data.recipes);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error(error);
            }
        };

        getLikedRecipes();
    }, [currentPage]);

    if (!recipes) return <div className='loader-container'><div className='loader'></div></div>; // Loading state

    return (
        <div className='activity-page-container'>
            <div className='activity-page-header'>
                <input type='button' value='<' className='previous-button' onClick={() => navigate(`/${page}/page-number/1`)} />
                <h1>Liked Recipes</h1>
            </div>

            {recipes.length === 0 ? (
                <p>No liked recipes!</p>
            ) : (
                <>
                    <div className='recipe-details-container'>
                        {recipes.map((recipe) => (
                            // Clickable area to view full recipe details
                            <div
                                key={recipe._id}
                                className='recipe-details'
                                onClick={() => navigate(`/${page} liked-recipes/page-number/${currentPage}/recipe-view/${recipe._id}`)}
                            >
                                <RecipeDetails recipe={recipe} />
                            </div>
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={(page) => navigate(`/${page}/page-number/${pageNumber}/liked-recipes`)}
                        totalPages={totalPages}
                    />
                </>
            )}
        </div>
    );
};

export default LikedRecipes;