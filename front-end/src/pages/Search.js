import { fetchSearchRecipes } from '../api'; // Import API functions to fetch a username and recipes
import Header from '../components/Header';
import Pagination from '../components/Pagination';
import SearchForm from '../components/SearchForm'; // Import component for user search input
import RecipeDetails from '../components/RecipeDetails';
import { useState, useEffect } from 'react';
import { useNavigate, useParams  } from 'react-router-dom'; // Hook for navigation/routing
import { jwtDecode } from 'jwt-decode';

const Search = () => {
    const { pageNumber } = useParams();
    const [tempRecipe, setTempRecipe] = useState(null);
    const [currentPage, setCurrentPage] = useState(parseInt(pageNumber));
    const [totalPages, setTotalPages] = useState(1);
    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState([]); // State to store fetched recipes
    const [isFetched, setIsFetched] = useState(false); // State to track if the API request has finished
    const navigate = useNavigate(); // Initialize navigation function

     useEffect(() => {
        setCurrentPage(parseInt(pageNumber));
    }, [pageNumber]);


    useEffect(() => {
        const recipe = localStorage.getItem('recipe');

        if (recipe) {
            localStorage.removeItem('recipe');
            setTempRecipe(JSON.parse(recipe));
        }

        // Async function to handle search submission
        const searchRecipes = async () => {
            setIsFetched(false); // Reset status before fetching
            setRecipes([]); // Clear previous results

            try {
                const data = await fetchSearchRecipes(tempRecipe, currentPage); // Fetch data from API
                setRecipes(data.recipes); // Set results in state
                setTotalPages(data.totalPages);
                setIsFetched(true); // Mark fetch as complete
            } catch (error) {
                setIsFetched(true);
                console.error(error);
            }
        };

        if (tempRecipe) {
            searchRecipes();
        }
    }, [tempRecipe, currentPage]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = jwtDecode(token);
        setUser(user);
    }, []);

    // Loading state
    if (!user) {
        return (
            <div className='loader-container'>
                <div className='loader'></div>
            </div>
        );
    }

    return (
        <>
            <Header user={user} page='search' />
            <SearchForm initialRecipe={tempRecipe} onSubmit={setTempRecipe} isFetched={isFetched} length={recipes.length} />

            {/* Loading state */}
            {!isFetched && tempRecipe && (
                <div className='search-page-loader'>
                    <div className='loader'></div>
                </div>
            )}

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
                                    navigate(`/search/page-number/${currentPage}/recipe-view/${recipe._id}`);
                                }}
                            >
                                <RecipeDetails recipe={recipe} />
                            </div>
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={(page) => navigate(`/search/page-number/${page}`)} 
                        totalPages={totalPages}
                    />
                </>
            )}
        </>
    );
};

export default Search;