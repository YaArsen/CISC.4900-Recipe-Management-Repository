import { handleChange } from '../utils/handleChange';
import SearchOutline from '../assets/search-outline.svg';
import { useState } from 'react';

const SearchForm = ({ onSubmit }) => {
  // Define the initial shape of the search criteria for easy resetting
  const initialData = {
    title: '',
    cookingTime: '',
    likes: '',
    difficulty: '',
    category: '',
    startDate: '',
    endDate: ''
  };

  const [recipe, setRecipe] = useState(initialData); // State to manage all form field values
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State to toggle the visibility of advanced filters

  // Handles form submission: prevents default reload and passes state to parent
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(recipe);
  };

  // Resets the search form to initial empty values
  const clear = () => {
    setRecipe(initialData);
  };

  return (
    <>
      <form className='search-results' onSubmit={handleSubmit}>
        {/* Main search input for title */}
        <input
          type='text'
          name='title'
          value={recipe.title}
          onChange={(e) => handleChange(e, recipe, setRecipe)}
          placeholder='Search...'
        />

        {/* Button to show advanced filters, hidden when filters are open */}
        {!isFilterOpen && (
          <button type='button' onClick={() => setIsFilterOpen(true)}>
            Open Filters
          </button>
        )}

        <button type='submit' style={{ position: 'absolute'}}><img style={{ width: '25px' }} src={SearchOutline} alt='Search' /></button>
      </form>

      {/* Advanced Filters Section: conditionally rendered */}
      {isFilterOpen && (
        <div className='filters'>
          {/* Numeric inputs for filters */}
          <input
            type='number'
            min='0'
            name='cookingTime'
            value={recipe.cookingTime}
            onChange={(e) => handleChange(e, recipe, setRecipe)}
            placeholder='Maximum cooking time (minutes)'
          />

          <input
            type='number'
            min='0'
            name='likes'
            value={recipe.likes}
            onChange={(e) => handleChange(e, recipe, setRecipe)}
            placeholder='Minimum likes'
          />

          {/* Radio buttons for category */}
          <p className='form-p'>Category</p>
          {['Breakfast', 'Lunch', 'Dinner'].map(category => (
            <label key={category}>
              <input
                type='radio'
                name='category'
                value={category}
                checked={recipe.category === category}
                onChange={(e) => handleChange(e, recipe, setRecipe)}
              />
              {category}
            </label>
          ))}

          {/* Radio buttons for difficulty */}
          <p className='form-p'>Difficulty</p>
          {['Easy', 'Medium', 'Hard'].map(difficulty => (
            <label key={difficulty}>
              <input
                type='radio'
                name='difficulty'
                value={difficulty}
                checked={recipe.difficulty === difficulty}
                onChange={(e) => handleChange(e, recipe, setRecipe)}
              />
              {difficulty}
            </label>
          ))}

          {/* Date range filters */}
          <p className='form-p'>Date Range</p>
          <input
            type='date'
            name='startDate'
            value={recipe.startDate}
            onChange={(e) => handleChange(e, recipe, setRecipe)}
          />

          <input
            type='date'
            name='endDate'
            value={recipe.endDate}
            onChange={(e) => handleChange(e, recipe, setRecipe)}
          />

          {/* Action buttons for filters */}
          <button className='form-btn' type='button' onClick={clear}>
            Clear
          </button>

          <button
            className='form-btn'
            type='button'
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