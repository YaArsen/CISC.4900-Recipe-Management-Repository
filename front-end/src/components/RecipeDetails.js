import { useNavigate } from 'react-router-dom';

const RecipeDetails = ({ recipe, component }) => {
    const navigate = useNavigate();

    return (
        <div className='recipes' key={recipe._id}>
            <img src={recipe.photoReference} alt='recipe' />
            <h1>{recipe.title}</h1>
            <h4>{recipe.cookingTime} min</h4>
            <h4>Category: {recipe.category}</h4>
            <h4>Difficulty: {recipe.difficulty}</h4>
            <h4>{new Date(recipe.timestamp).toLocaleString()}</h4>
            <button onClick={() => navigate(`/recipe/${component}/${recipe._id}`)}>View</button>
        </div>
    );
};

export default RecipeDetails;