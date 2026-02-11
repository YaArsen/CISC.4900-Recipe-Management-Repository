import Fetch from './Fetch';
import SearchForm from './SearchForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [recipes, setRecipes] = useState([]);
    const [isFetchedOk, setIsFetchedOk] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

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
                        <div className='recipes' key={recipe._id}>
                            <img src={recipe.photoReference} alt='recipe' style={{ width: '100px' }} />
                            <h4>{recipe.title}</h4>
                            <button onClick={() => navigate(`/recipe/search/${recipe._id}`)}>View</button>
                        </div>
                    ))
                ) : (
                        isFetchedOk && <h2>No recipes found</h2>
                )}
            </div>
        </>
    );
};

export default Search;