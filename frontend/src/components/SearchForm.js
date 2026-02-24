import { useState } from 'react';

const SearchForm = ({ onSubmit }) => {
  const initialData = {
    title: '',
    cookingTime: '',
    likes: '',
    difficulty: '',
    category: '',
    startDate: '',
    endDate: ''
  };

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
      <form className='search-results' onSubmit={handleSubmit}>
        <input
          type='text'
          name='title'
          value={recipe.title}
          onChange={handleChange}
          placeholder='Search...'
        />

        {!isFilterOpen && (
          <button type='button' onClick={() => setIsFilterOpen(true)}>
            Open Filters
          </button>
        )}

        <button type='submit'>Search</button>
      </form>

      {isFilterOpen && (
        <div className='filters'>
          <input
            type='number'
            min='0'
            name='cookingTime'
            value={recipe.cookingTime}
            onChange={handleChange}
            placeholder='Maximum cooking time (minutes)'
          />

          <input
            type='number'
            min='0'
            name='likes'
            value={recipe.likes}
            onChange={handleChange}
            placeholder='Minimum likes'
          />

          <p className='form-p'>Category</p>
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

          <p className='form-p'>Difficulty</p>
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

          <p className='form-p'>Date Range</p>
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

          <button type='button' onClick={clear}>
            Clear
          </button>

          <button
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