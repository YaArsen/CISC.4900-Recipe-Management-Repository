import { fetchGetCommentedRecipes } from '../api';
import Pagination from '../components/Pagination';
import RecipeDetails from '../components/RecipeDetails';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CommentedRecipes = () => {
    const { page } = useParams();
    const [recipes, setRecipes] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const pageNumber = localStorage.getItem('pageNumber');

        if (pageNumber) {
            localStorage.removeItem('pageNumber');
            getCommentedRecipes(pageNumber);
        } else {
            getCommentedRecipes(currentPage);
        }
    }, [currentPage]);

    const getCommentedRecipes = async (page) => {
        try {
            const data = await fetchGetCommentedRecipes(page);
            setRecipes(data.recipes);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
        } catch (error) {
            alert(error);
        }
    };

    const handlePageChange = (page) => getCommentedRecipes(page);

    if (!recipes) return <p className='loading'>Loading...</p>; // Loading state

    return (
        <>
            {recipes.length === 0 ? (
                <p className='commented-recipes-page-p'>No commented recipes!</p>
            ) : (
                <div className='commented-recipes'>
                    <div className='commented-recipes-header'>
                        <h1>Commented Recipes</h1>
                        <button type='button' className='close-button' onClick={() => navigate(`/${page}`)}>x</button>
                    </div>

                    <div className='recipe-details-container'>
                        {recipes.map((recipe) => (
                            // Clickable area to view full recipe details
                            <div key={recipe._id} className='recipe-details' onClick={() => navigate(`/${page} commented-recipes/${currentPage}/recipe-view/${recipe._id}`)}>
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
                </div>
            )}
        </>
    );
};

export default CommentedRecipes;