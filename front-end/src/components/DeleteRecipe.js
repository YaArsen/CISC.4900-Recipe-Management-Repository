import Fetch from './Fetch';

const DeleteRecipe = ({ setMessage, recipeId, setRecipes }) => {
    const token = localStorage.getItem('token');

    const handleClick = async () => {
        const res = await Fetch(`/api/recipes/${recipeId}`, { method: 'DELETE', token });
        const data = await res.json();
        if (!res.ok) return alert(data.message);
        setMessage(data.message);
        setRecipes(data.recipes);
    };

    return <button onClick={handleClick}>Delete</button>;
};

export default DeleteRecipe;