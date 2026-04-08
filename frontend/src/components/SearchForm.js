import SearchOutline from '../assets/search-outline.svg';
import { useState } from 'react';

const SearchForm = ({ onSubmit }) => {
    const [recipe, setRecipe] = useState(''); // State to manage all form field values
    const [isFilterOpen, setIsFilterOpen] = useState(false); // State to toggle the visibility of advanced filters

    // Handles form submission: prevents default reload and passes state to parent
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(recipe);
    };

    // Resets the search form to initial empty values
    const clear = () => {
        setRecipe('');
    };

    // Generic change handler: updates the state based on the input's name attribute
    const handleChange = (e) => {
        setRecipe({ ...recipe, [e.target.name]: e.target.value }); // Updates the recipe state dynamically based on the input field's name attribute.
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='search-results'>
                {/* Main search input for title */}
                <input
                    type='text'
                    name='title'
                    value={recipe.title}
                    onChange={handleChange}
                    placeholder='Search...'
                />

                {/* Button to show advanced filters, hidden when filters are open */}
                {!isFilterOpen && (
                    <button
                        type='button'
                        onClick={() => setIsFilterOpen(true)}
                    >
                        Open Filters
                    </button>
                )}

                <button type='submit'><img src={SearchOutline} alt='Search' /></button>
            </div>

            {/* Advanced Filters Section: conditionally rendered */}
            {isFilterOpen && (
                <div className='filters-container'>
                    <div className='filters'>
                        {/* Numeric inputs for filters */}
                        <div>
                            <input
                                type='number'
                                min='0'
                                name='cookingTime'
                                value={recipe.cookingTime}
                                onChange={handleChange}
                                placeholder='Max cooking time (min)'
                            />

                            <input
                                type='number'
                                min='0'
                                name='likes'
                                value={recipe.likes}
                                onChange={handleChange}
                                placeholder='Min likes'
                            />
                        </div>

                        {/* Radio buttons for category */}
                        <div>
                            <p>Category</p>
                            {['Breakfast', 'Lunch', 'Dinner'].map(category => (
                                <label key={category}>
                                    <input
                                        type='radio'
                                        name='category'
                                        value={category}
                                        checked={recipe.category === category}
                                        onChange={handleChange}
                                    />
                                    {category}
                                </label>
                            ))}

                            {/* Radio buttons for difficulty */}
                            <p>Difficulty</p>
                            {['Easy', 'Medium', 'Hard'].map(difficulty => (
                                <label key={difficulty}>
                                    <input
                                        type='radio'
                                        name='difficulty'
                                        value={difficulty}
                                        checked={recipe.difficulty === difficulty}
                                        onChange={handleChange}
                                    />
                                    {difficulty}
                                </label>
                            ))}

                            {/* Date range filters */}
                            <p>Date Range</p>
                            <input
                                type='date'
                                name='startDate'
                                value={recipe.startDate}
                                onChange={handleChange}
                            />

                            <input
                                type='date'
                                name='endDate'
                                value={recipe.endDate}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Action buttons for filters */}
                        <button
                            className='form-button'
                            type='button'
                            onClick={clear}
                        >
                            Clear
                        </button>

                        <button
                            className='form-button'
                            type='button'
                            onClick={() => {
                                setIsFilterOpen(false);
                                clear();
                            }}
                        >
                            Close Filters
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
};

export default SearchForm;