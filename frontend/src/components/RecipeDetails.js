const RecipeDetails = ({ recipe }) => {
    return (
        <>
            <img src={recipe.photoReference} alt={recipe.title} />
            <h1>{recipe.title}</h1>
            <h4>{recipe.cookingTime} min</h4>
            <h4>Category: {recipe.category}</h4>
            <h4>Difficulty: {recipe.difficulty}</h4>
            <h4>{new Date(recipe.timestamp).toLocaleString()}</h4>
        </>
    );
};

export default RecipeDetails;