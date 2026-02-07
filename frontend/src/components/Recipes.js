import Fetch from '.Fetch';
import DeleteRecipe from './DeleteRecipe';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            const res = await Fetch('/api/recipes', { token });
            const data = await res.json();
            if (!res.ok) return alert(data.message);
            setRecipes(data);
        };

        fetchRecipes();
    }, [token]);

    if (!recipes) return <p>Loading...</p>;

    return (
        <>
            <h3>Your recipes</h3>
            <button onClick={() => navigate('/add-recipe')}></button>
        </>
    );
};

export default Recipes;