import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeForm = ({ initialData, onSubmit, page }) => {
    const [recipe, setRecipe] = useState({ ingredients: [''], isPublic: true });
    const [url, setUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (initialData) {
            setRecipe(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        if (recipe.file) {
            const objectUrl = URL.createObjectURL(recipe.file);
            setUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }

        if (recipe.base64File) {
            setUrl(recipe.base64File);
        }
    }, [recipe.file, recipe.base64File]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!recipe.title.trim() || !recipe.instructions.trim() || !recipe.ingredients[0].trim()) return;
        delete recipe.base64File;

        if (recipe.file instanceof File) {
            const reader = new FileReader();
            reader.readAsDataURL(recipe.file); // Reads as base64

            reader.onload = () => {
                const base64File = reader.result;
                onSubmit({ ...recipe, file: base64File });
            };

            reader.onerror = (error) => console.error('Error reading file:', error);
        } else {
            onSubmit(recipe);
        }  
    };

    const handleIngredientChange = (index, e) => {
        const newIngredients = [...recipe.ingredients];
        newIngredients[index] = e.target.value;
        setRecipe({ ...recipe, ingredients: newIngredients });
    };

    const addIngredient = () => {
        setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ''] });
    };

    const removeIngredient = (index) => {
        const newIngredients = [...recipe.ingredients];
        newIngredients.splice(index, 1);
        setRecipe({ ...recipe, ingredients: newIngredients });
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'state') {
            setRecipe({ ...recipe, isPublic: value === 'Public' });
        } else if (name === 'file') {
            setRecipe({...recipe, file: files[0] });
        } else {
            setRecipe({ ...recipe, [name]: value });
        }
    };

    return (
        <form className='recipe-form-container' onSubmit={handleSubmit}>
            <div className='recipe-form-header'>
                <h2>{page}</h2>
                <button type='button' className='close-button' onClick={() => navigate('/recipes')}>x</button>
            </div>

            <input
                type='text'
                name='title'
                onChange={handleChange}
                value={recipe.title ? recipe.title : ''}
                placeholder='Recipe Title'
                required
            />

            {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className='ingredient-row'>
                    <input
                        type='text'
                        name={`ingredient-${index}`}
                        onChange={e => handleIngredientChange(index, e)}
                        value={ingredient}
                        placeholder={`Ingredient ${index + 1}`}
                        required
                    />

                    {recipe.ingredients.length > 1 && (
                        <button type='button' onClick={() => removeIngredient(index)}>x</button>
                    )}
                </div>
            ))}

            <button className='form-button' type='button' onClick={addIngredient}>+ Add Ingredient</button>

            <textarea
                name='instructions'
                onChange={handleChange}
                value={recipe.instructions}
                placeholder='Instructions'
                required
            />

            <input
                type='file'
                name='file'
                onChange={handleChange}
                required={!initialData}
            />

            {url && <img src={url} alt='img' />}

            <>
                <label>
                    <input
                        type='radio'
                        name='state'
                        onChange={handleChange}
                        value='Public'
                        checked={recipe.isPublic === true}
                    />
                    Public
                </label>

                <label>
                    <input
                        type='radio'
                        name='state'
                        onChange={handleChange}
                        value='Private'
                        checked={recipe.isPublic === false}
                    />
                    Private
                </label>
            </>

            <input
                type='number'
                name='cookingTime'
                onChange={handleChange}
                value={recipe.cookingTime ? recipe.cookingTime : ''}
                placeholder='Cooking time (min)'
                required
            />

            <>
                <p>Category</p>
                {['Breakfast', 'Lunch', 'Dinner'].map(category => (
                    <label key={category}>
                        <input
                            type='radio'
                            name='category'
                            onChange={handleChange}
                            value={category}
                            checked={recipe.category === category}
                            required
                        />
                        {category}
                    </label>
                ))}
            </>

            <>
                <p>Difficulty</p>
                {['Easy', 'Medium', 'Hard'].map(difficulty => (
                    <label key={difficulty}>
                        <input
                            type='radio'
                            name='difficulty'
                            onChange={handleChange}
                            value={difficulty}
                            checked={recipe.difficulty === difficulty}
                            required
                        />
                        {difficulty}
                    </label>
                ))}
            </>

            <button className='form-button' type='submit'>Save recipe</button>
        </form>
    );
};

export default RecipeForm;