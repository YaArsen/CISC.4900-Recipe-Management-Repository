import { useState } from 'react';

const SearchForm = ({ onSubmit }) => {
    const initialData = { title: '', cookingTime: '', likes: '', difficulty: '', category: '' };
    const [recipe, setRecipe] = useState(initialData);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(recipe);
    };

    const handleChange = (e) => {
        setRecipe({ ...recipe, [e.target.name]: e.target.value });
    };

    const clear = () => {
        setRecipe(initialData);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type='text' name='title' onChange={handleChange} value={recipe.title} placeholder='Search...' />
                {!isFilterOpen && <button onClick={() => setIsFilterOpen(true)}>Open Filters</button>}
                <button type='submit'>Search</button>   
            </form>
            {isFilterOpen && (
                <div className='filters'>
                    <input 
                        type='number' min='0' name='cookingTime' onChange={handleChange} value={recipe.cookingTime} placeholder='Maximum cooking time (min)'
                    />

                    <input 
                        type='number' min='0' name='likes' onChange={handleChange} value={recipe.likes} placeholder='Minimum likes'
                    />

                    <label htmlFor='breakfast'>Breakfast</label>
                    <input 
                        type='radio' name='category' onChange={handleChange} value='Breakfast' checked={recipe.category === 'Breakfast'} id='breakfast'
                    />

                    <label htmlFor='lunch'>Lunch</label>
                    <input 
                        type='radio' name='category' onChange={handleChange} value='Lunch' checked={recipe.category === 'Lunch'} id='lunch'
                    />

                    <label htmlFor='dinner'>Dinner</label>
                    <input 
                        type='radio' name='category' onChange={handleChange} value='Dinner' checked={recipe.category === 'Dinner'} id='dinner'
                    />

                    <label htmlFor='easy'>Easy</label>
                    <input 
                        type='radio' name='difficulty' onChange={handleChange} value='Easy' checked={recipe.difficulty === 'Easy'} id='easy'
                    />

                    <label htmlFor='medium'>Medium</label>
                    <input 
                        type='radio' name='difficulty' onChange={handleChange} value='Medium' checked={recipe.difficulty === 'Medium'} id='medium'
                    />

                    <label htmlFor='dinner'>Dinner</label>
                    <input 
                        type='radio' name='difficulty' onChange={handleChange} value='Hard' checked={recipe.difficulty === 'Hard'} id='hard'
                    />

                    <button 
                        onClick={() => clear()}
                    >
                        Clear
                    </button>

                    <button 
                        onClick={() => {
                            setIsFilterOpen(false);
                            clear();
                        }}
                    >
                        Close Filters
                    </button>
                </div>
            )}
        </>
    );
};

export default SearchForm;