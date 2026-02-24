import { fetchSearchRecipes } from '../api';
import SearchForm from '../components/SearchForm';
import RecipeDetails from '../components/RecipeDetails';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [recipes, setRecipes] = useState([]);
    const [isFetchedOk, setIsFetchedOk] = useState(false);
    const navigate = useNavigate();

    const searchRecipes = async (recipe) => {
        setIsFetchedOk(false);
        setRecipes([]);

        try {
            const data = await fetchSearchRecipes(recipe);
            setRecipes(data);
            setIsFetchedOk(true);
        } catch (error) {
            alert(error);
            setIsFetchedOk(true);
            return;
        }
    };

    return (
        <>
            <div className='searchobj'></div>
                <SearchForm onSubmit={searchRecipes} />
                {isFetchedOk && recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <div onClick={() => navigate(`/profile/search/${recipe._id}`)} className='recipe-details' key={recipe._id}>
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