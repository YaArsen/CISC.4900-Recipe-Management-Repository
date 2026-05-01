import { fetchSearchRecipes } from '../api'; // Import API functions to fetch a username and recipes
import Header from '../components/Header';
import Pagination from '../components/Pagination';
import SearchForm from '../components/SearchForm'; // Import component for user search input
import RecipeDetails from '../components/RecipeDetails';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook for navigation/routing
import { jwtDecode } from 'jwt-decode';

const Search = () => {
    const [tempRecipe, setTempRecipe] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState([]); // State to store fetched recipes
    const [isFetched, setIsFetched] = useState(false); // State to track if the API request has finished
    const navigate = useNavigate(); // Initialize navigation function

    useEffect(() => {
        const pageNumber = localStorage.getItem('pageNumber');
        const recipe = localStorage.getItem('recipe');

        if (pageNumber && recipe) {
            localStorage.removeItem('pageNumber');
            localStorage.removeItem('recipe');
            setTempRecipe(JSON.parse(recipe));
            searchRecipes(JSON.parse(recipe), pageNumber);
        } else {
            if (tempRecipe) {
                searchRecipes(tempRecipe, currentPage);
            }
        }
    }, [tempRecipe, currentPage]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = jwtDecode(token);
        setUser(user);
    }, []);

    // Async function to handle search submission
    const searchRecipes = async (recipe, page) => {
        setIsFetched(false); // Reset status before fetching
        setRecipes([]); // Clear previous results

        try {
            const data = await fetchSearchRecipes(recipe, page); // Fetch data from API
            setRecipes(data.recipes); // Set results in state
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
            setIsFetched(true); // Mark fetch as complete
        } catch (error) {
            setIsFetched(true);
            alert(error); // Alert error if request fails
        }
    };

    const handlePageChange = (page) => searchRecipes(tempRecipe, page);

    if (!user) return <p className='loading'>Loading...</p>;

    return (
        <>
            <Header user={user} page={'search'} />
            <SearchForm initialRecipe={tempRecipe} onSubmit={setTempRecipe} isFetched={isFetched} length={recipes.length} />

            {/* Conditional rendering: display recipes if found, or message if not */}
            {isFetched && recipes.length > 0 && (
                <>
                    <div className='recipe-details-container'>
                        {recipes.map((recipe) => (
                            // Make each recipe clickable, navigating to the detailed view
                            <div
                                key={recipe._id}
                                className='recipe-details'
                                onClick={() => {
                                    if (tempRecipe) localStorage.setItem('recipe', JSON.stringify(tempRecipe));
                                    navigate(`/search/${currentPage}/recipe-view/${recipe._id}`);
                                }}
                            >
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

export default Search;