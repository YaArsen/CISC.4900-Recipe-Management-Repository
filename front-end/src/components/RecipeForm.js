import { useState, useEffect } from 'react';

const RecipeForm = ({ initialData, onSubmit, setIsAddRecipePage, setIsEditRecipePage }) => {
    const [recipe, setRecipe] = useState({
        title: '',
        ingredients: '',
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

    const handleChange = (e) => {
        if (e.target.name === 'state')
            setRecipe({ ...recipe, isPublic: e.target.value === 'Public' });
        else
            setRecipe({ ...recipe, [e.target.name]: e.target.value });
    };

    return (
        <>
            <button onClick={() => setIsAddRecipePage ? setIsAddRecipePage(false) : setIsEditRecipePage(false)}>x</button>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    name='title'
                    onChange={handleChange}
                    value={recipe.title}
                    placeholder='Recipe Title'
                    required
                />
                <textarea
                    type='text'
                    name='ingredients'
                    onChange={handleChange}
                    value={recipe.ingredients}
                    placeholder='Ingredients'
                    required
                />
                <textarea
                    type='text'
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
                <label HTMLfor='public'>Public</label>
                <input
                    type='radio'
                    name='state'
                    onChange={handleChange}
                    value='Public'
                    id='public'
                    checked={recipe.isPublic === true}
                />
                <label HTMLfor='private'>Private</label>
                <input
                    type='radio'
                    name='state'
                    onChange={handleChange}
                    value='Private'
                    id='private'
                    checked={recipe.isPublic === false}
                />
                <input
                    type='number'
                    name='cookingTime'
                    onChange={handleChange}
                    value={recipe.cookingTime}
                    placeholder='Cooking time (min)'
                    required
                />
                <label HTMLfor='breakfast'>Breakfast</label>
                <input
                    type='radio'
                    name='category'
                    onChange={handleChange}
                    value='Breakfast'
                    id='breakfast'
                    checked={recipe.category === 'Breakfast'}
                    required
                />
                <label HTMLfor='lunch'>Lunch</label>
                <input
                    type='radio'
                    name='category'
                    onChange={handleChange}
                    value='Lunch'
                    id='lunch'
                    checked={recipe.category === 'Lunch'}
                    required
                />
                <label HTMLfor='dinner'>Dinner</label>
                <input
                    type='radio'
                    name='category'
                    onChange={handleChange}
                    value='Dinner'
                    id='dinner'
                    checked={recipe.category === 'Dinner'}
                    required
                />
                <label HTMLfor='easy'>Easy</label>
                <input
                    type='radio'
                    name='difficulty'
                    onChange={handleChange}
                    value='Easy'
                    id='easy'
                    checked={recipe.difficulty === 'Easy'}
                    required
                />
                <label HTMLfor='medium'>Medium</label>
                <input
                    type='radio'
                    name='difficulty'
                    onChange={handleChange}
                    value='Medium'
                    id='medium'
                    checked={recipe.difficulty === 'Medium'}
                    required
                />
                <label HTMLfor='hard'>Hard</label>
                <input
                    type='radio'
                    name='difficulty'
                    onChange={handleChange}
                    value='Hard'
                    id='hard'
                    checked={recipe.difficulty === 'Hard'}
                    required
                />
                <button type='submit'>Save recipe</button>
            </form>
        </>
    );
};

export default RecipeForm;