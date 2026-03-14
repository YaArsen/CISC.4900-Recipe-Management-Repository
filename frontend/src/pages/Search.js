import { fetchSearchRecipes } from '../api'; // Import API functions to fetch a username and recipes
import Header from '../components/Header';
import SearchForm from '../components/SearchForm'; // Import component for user search input
import RecipeDetails from '../components/RecipeDetails';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook for navigation/routing

const Search = () => {
    const [recipes, setRecipes] = useState([]); // State to store fetched recipes
    const [isFetchedOk, setIsFetchedOk] = useState(false); // State to track if the API request has finished
    const navigate = useNavigate(); // Initialize navigation function

    // Async function to handle search submission
    const searchRecipes = async (recipe) => {
        setIsFetchedOk(false); // Reset status before fetching
        setRecipes([]); // Clear previous results

        try {
            const data = await fetchSearchRecipes(recipe); // Fetch data from API
            setRecipes(data); // Set results in state
            setIsFetchedOk(true); // Mark fetch as complete
        } catch (error) {
            alert(error); // Alert error if request fails
            setIsFetchedOk(true); // Mark fetch as complete anyway to hide loading state
            return;
        }
    };

    return (
        <>
            <Header />
            <SearchForm onSubmit={searchRecipes} /> {/* Search form component, calling searchRecipes on submission */}

            {/* Conditional rendering: display recipes if found, or message if not */}
            {isFetchedOk && recipes.length > 0 ? (
                recipes.map((recipe) => (
                    // Make each recipe clickable, navigating to the detailed view
                    <div key={recipe._id} className='recipe-details' onClick={() => navigate(`/search/recipe-view/${recipe._id}`)}>
                        <RecipeDetails recipe={recipe} />
                    </div>
                ))
            ) : (
                isFetchedOk && <h2 className='search-h2'>No recipes found</h2>
            )}
        </>
    );
};

export default Search;