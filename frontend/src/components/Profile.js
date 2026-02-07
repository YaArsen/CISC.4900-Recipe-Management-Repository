import ToggleButton from './ToggleButton';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;
        const user = jwtDecode(token);
        setUser(user);
    }, [token]);

    if (!token || !user) return <p>Loading...</p>;

    return (
        <div>
            <h2>Welcome, {user.name}</h2>
            <ToggleButton />
            <a href={'/search'}>Search</a>
            <div>
                <h3>Your Recipes</h3>
                <button onClick={() => navigate('/add-recipe')}>Add a New Recipe</button>
                {recipes.length === 0 ? (
                    <p>No recipes yet!</p>
                ) : (
                    <ul>
                        {recipes.map((recipe) => (
                            <li key={recipe._id}>
                                <img src={recipe.photoReference} alt={recipe.title} style={{ maxWidth: '100px' }} />
                                <h4>{recipe.title}</h4>
                                {recipe.isPublic ? <h4>PUBLIC</h4> : <h4>PRIVATE</h4>}
                                <h4>{recipe.username}</h4>
                                <h4>{new Date(recipe.timestamp).toLocaleTimeString()}</h4>
                                <div>
                                    <a href={`/recipe/${recipe._id}`}>View</a>
                                    <a href={`/edit-recipe/${recipe._id}`}>Edit</a>
                                    <DeleteRecipe recipeId={recipe._id} setRecipes={setRecipes} />
                                    <a href={`/comments/${recipe._id}`}>Comments</a>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Profile;