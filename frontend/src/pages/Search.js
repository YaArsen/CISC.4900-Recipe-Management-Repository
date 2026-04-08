import { fetchSearchRecipes } from '../api'; // Import API functions to fetch a username and recipes
import Header from '../components/Header';
import Pagination from '../components/Pagination';
import SearchForm from '../components/SearchForm'; // Import component for user search input
import RecipeDetails from '../components/RecipeDetails';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook for navigation/routing
import { jwtDecode } from 'jwt-decode';

const Search = () => {
    const [recipe, setRecipe] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState([]); // State to store fetched recipes
    const [isFetchedOk, setIsFetchedOk] = useState(false); // State to track if the API request has finished
    const navigate = useNavigate(); // Initialize navigation function

    useEffect(() => {
        const pageNumber = localStorage.getItem('pageNumber');

        if (pageNumber) {
            localStorage.removeItem('pageNumber');
        } else {
            if (recipe) {
                searchRecipes(recipe, currentPage);
            }
        }
    }, [recipe, currentPage]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = jwtDecode(token);
        setUser(user);
    }, []);

    // Async function to handle search submission
    const searchRecipes = async (recipe, page) => {
        setIsFetchedOk(false); // Reset status before fetching
        setRecipes([]); // Clear previous results

        try {
            const data = await fetchSearchRecipes(recipe, page); // Fetch data from API
            setRecipes(data.recipes); // Set results in state
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
            setIsFetchedOk(true); // Mark fetch as complete
        } catch (error) {
            alert(error); // Alert error if request fails
            setIsFetchedOk(true); // Mark fetch as complete anyway to hide loading state
            return;
        }
    };

    const handlePageChange = (page) => searchRecipes(recipe, page);

    if (!user) return <p className='loading'>Loading...</p>;

    return (
        <>
            <Header user={user} page={'search'} />
            <SearchForm onSubmit={setRecipe} /> {/* Search form component, calling searchRecipes on submission */}

            {/* Conditional rendering: display recipes if found, or message if not */}
            {isFetchedOk && recipes.length > 0 ? (
                <>
                    <div className='recipe-details-container'>
                        {recipes.map((recipe) => (
                            // Make each recipe clickable, navigating to the detailed view
                            <div key={recipe._id} className='recipe-details' onClick={() => navigate(`/search/${currentPage}/recipe-view/${recipe._id}`)}>
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
            ) : (
                isFetchedOk && <h2 className='search-page-h2'>No recipes found</h2>
            )}
        </>
    );
};

export default Search;