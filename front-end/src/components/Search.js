import Fetch from './Fetch';
import SearchForm from './SearchForm';
import RecipeDetails from './RecipeDetails';
import { useState } from 'react';

const Search = () => {
    const [recipes, setRecipes] = useState([]);
    const [isFetchedOk, setIsFetchedOk] = useState(false);
    const token = localStorage.getItem('token');

    const handleFormSubmit = async (recipe) => {
        setIsFetchedOk(false);
        setRecipes([]);

        const res = await Fetch('/api/recipes/search', { method: 'POST', token, body: recipe });
        const data = await res.json();
        if (!res.ok) {
            alert(data.message);
            setIsFetchedOk(true);
            return;
        }
        setRecipes(data);
        setIsFetchedOk(true);
    };

    return (
        <>
            <div className='searchobj'></div>
            <div className='search-results'>
                <SearchForm onSubmit={handleFormSubmit} />
                {isFetchedOk && recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <RecipeDetails recipe={recipe} component={'search'} />
                    ))
                ) : (
                        isFetchedOk && <h2>No recipes found</h2>
                )}
            </div>
        </>
    );
};

export default Search;