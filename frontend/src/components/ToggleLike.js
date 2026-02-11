import Fetch from './Fetch';

const ToggleLike = ({ recipeId, setRecipe }) => {
    const token = localStorage.getItem('token');

    const handleClick = async () => {
        const res = await Fetch(`/api/recipes/${recipeId}/likes`, { method: 'POST', token });
        const data = await res.json();
        if (!res.ok) return alert(data.message);
        setRecipe(data);
    };

    return <button className='like-btn' onClick={handleClick}>Like</button>;
};

export default ToggleLike;