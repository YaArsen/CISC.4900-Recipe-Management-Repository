import { useState, useEffect } from 'react';

const RecipeForm = ({ initialData, onSubmit, setIsAddRecipePage, setIsEditRecipePage }) => {
    const [recipe, setRecipe] = useState({
        title: '',
        ingredients: [''],
        instructions: '',
        photoReference: '',
        isPublic: true,
        cookingTime: '',
        category: '',
        difficulty: ''
    });
    
    useEffect(() => {
        if (initialData) setRecipe(initialData);
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(recipe);
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
        const { name, value } = e.target;

        if (name === 'state')
            setRecipe({ ...recipe, isPublic: value === 'Public' });
        else
            setRecipe({ ...recipe, [name]: value });
    };

    return (
        <>
            <form className='recipe-form' onSubmit={handleSubmit}>
                <button className='recipe-form-btn' onClick={() => setIsAddRecipePage ? setIsAddRecipePage(false) : setIsEditRecipePage(false)}>x</button>
                <input
                    type='text'
                    name='title'
                    onChange={handleChange}
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
                <button type='button' onClick={addIngredient}>+ Add Ingredient</button>
                <textarea
                    name='instructions'
                    onChange={handleChange}
                    value={recipe.instructions}
                    placeholder='Instructions'
                    required
                />
                <input
                    type='text'
                    name='photoReference'
                    onChange={handleChange}
                    value={recipe.photoReference}
                    placeholder='Photo Reference URL'
                    required
                />
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
                <input
                    type='number'
                    name='cookingTime'
                    onChange={handleChange}
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
                            onChange={handleChange}
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
                            onChange={handleChange}
                            value={difficulty}
                            checked={recipe.difficulty === difficulty}
                            required
                        />
                        {difficulty}
                    </label>
                ))}
                <button type='submit'>Save recipe</button>
            </form>
        </>
    );
};

export default RecipeForm;