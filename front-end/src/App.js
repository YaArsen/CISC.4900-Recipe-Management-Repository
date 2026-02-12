import Login from './components/Login';
import Register from './components/Register';
import RecipeView from './components/RecipeView';
import Profile from './components/Profile';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/recipe/:component/:recipeId' element={<RecipeView />} />
                <Route path='/profile' element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;