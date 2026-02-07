import Fetch from './Fetch';

const DeleteRecipe = ({ recipeId, setRecipes }) => {
  const token = localStorage.getItem('token');

  const handleDelete = async () => {
    const res = await Fetch(`/api/recipes/${recipeId}`, { method: 'DELETE', token });
    const data = await res.json();
    if (!res.ok) return alert(data.message);
    alert('Recipe deleted successfully');
    setRecipes(data.recipes);
  };
  
  return <button onClick={handleDelete}>Delete recipe</button>;
};

export default DeleteRecipe;