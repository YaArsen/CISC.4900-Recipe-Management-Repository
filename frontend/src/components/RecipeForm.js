import { handleChange } from '../utils/handleChange';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeForm = ({ initialData, onSubmit }) => {
    const [recipe, setRecipe] = useState({
        title: '',
        ingredients: [''],
        instructions: '',
        file: null,
        isPublic: true,
        cookingTime: '',
        category: '',
        difficulty: ''
    });

    const navigate = useNavigate();
    
    useEffect(() => {
        if (initialData) {
            setRecipe(initialData);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (recipe.file instanceof File) {
            const reader = new FileReader();
            reader.readAsDataURL(recipe.file); // Reads as base64
            reader.onload = () => {
                const base64File = reader.result;
                onSubmit({ ...recipe, file: base64File });
            };
            reader.onerror = (error) => console.error("Error reading file:", error);
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

    const onChange = (e) => {
        if (e.target.name === 'state') {
            setRecipe({ ...recipe, isPublic: e.target.value === 'Public' });
        } else if (e.target.name === 'file') {
            setRecipe({...recipe, file: e.target.files[0] });
        } else {
            handleChange(e, recipe, setRecipe);
        }
    };

    return (
        <>
            <form className='recipe-form' onSubmit={handleSubmit}>
                <button className='close-btn' onClick={() => navigate('/recipes')}>x</button>
                <input
                    type='text'
                    name='title'
                    onChange={onChange}
                    value={recipe.title}
                    placeholder='Recipe Title'
                    required
                />

                {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type='text'
                            name={`ingredient-${index}`}
                            onChange={e => handleIngredientChange(index, e)}
                            value={ingredient}
                            placeholder={`Ingredient ${index + 1}`}
                            required
                        />
                        {recipe.ingredients.length > 1 && (
                            <button className='recipe-form-ingredient-btn' type='button' onClick={() => removeIngredient(index)}>x</button>
                        )}
                    </div>
                ))}

                <button className='form-btn' type='button' onClick={addIngredient}>+ Add Ingredient</button>

                <textarea
                    name='instructions'
                    onChange={onChange}
                    value={recipe.instructions}
                    placeholder='Instructions'
                    required
                />

                <input
                    type='file'
                    name='file'
                    onChange={onChange}
                    required={!initialData}
                />

                <label>
                    <input
                        type='radio'
                        name='state'
                        onChange={onChange}
                        value='Public'
                        checked={recipe.isPublic === true}
                    />
                    Public
                </label>

                <label>
                    <input
                        type='radio'
                        name='state'
                        onChange={onChange}
                        value='Private'
                        checked={recipe.isPublic === false}
                    />
                    Private
                </label>

                <input
                    type='number'
                    name='cookingTime'
                    onChange={onChange}
                    value={recipe.cookingTime}
                    placeholder='Cooking time (min)'
                    required
                />

                <p className='form-p'>Category</p>
                {['Breakfast', 'Lunch', 'Dinner'].map(category => (
                    <label key={category}>
                        <input
                            type='radio'
                            name='category'
                            onChange={onChange}
                            value={category}
                            checked={recipe.category === category}
                            required
                        />
                        {category}
                    </label>
                ))}
                
                <p className='form-p'>Difficulty</p>
                {['Easy', 'Medium', 'Hard'].map(difficulty => (
                    <label key={difficulty}>
                        <input
                            type='radio'
                            name='difficulty'
                            onChange={onChange}
                            value={difficulty}
                            checked={recipe.difficulty === difficulty}
                            required
                        />
                        {difficulty}
                    </label>
                ))}
                
                <button className='form-btn' type='submit'>Save recipe</button>
            </form>
        </>
    );
};

export default RecipeForm;