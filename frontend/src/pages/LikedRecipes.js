import { fetchGetLikedRecipes } from '../api';
import Pagination from '../components/Pagination';
import RecipeDetails from '../components/RecipeDetails';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const LikedRecipes = () => {
    const { page } = useParams();
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const pageNumber = localStorage.getItem('pageNumber');

        if (pageNumber) {
            localStorage.removeItem('pageNumber');
            getLikedRecipes(pageNumber);
        } else {
            getLikedRecipes(currentPage);
        }
    }, [currentPage]);

    const getLikedRecipes = async (page) => {
        try {
            const data = await fetchGetLikedRecipes(page);
            setRecipes(data.recipes);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
        } catch (error) {
            alert(error);
        }
    };
    
    const handlePageChange = (page) => getLikedRecipes(page);

    if (!recipes) return <p className='loading'>Loading...</p>; // Loading state

    return (
        <>
            <h1>Liked Recipes</h1>
            <button type='button' className='close-button' onClick={() => navigate(`/${page}`)}>x</button>

            {recipes.length === 0 ? (
                <p>No liked recipes!</p>
            ) : (
                <>
                    <div className='recipe-details-container'>
                        {recipes.map((recipe) => (
                            // Clickable area to view full recipe details
                            <div key={recipe._id} className='recipe-details' onClick={() => navigate(`/${page} liked-recipes/${currentPage}/recipe-view/${recipe._id}`)}>
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
        </>
    );
};

export default LikedRecipes;