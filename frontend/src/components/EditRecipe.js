import { useNavigate } from 'react-router-dom';

const EditRecipe = ({ currentPage, recipeId }) => {
    const navigate = useNavigate();

    return (
        <button
            type='button'
            onClick={(e) => {
                e.stopPropagation();
                navigate(`/recipes/${currentPage}/edit-recipe/${recipeId}`);
            }}
        >
            Edit
        </button>
    );
};

export default EditRecipe;