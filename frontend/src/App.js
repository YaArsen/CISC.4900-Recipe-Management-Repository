import Login from './pages/Login';
import Register from './pages/Register';
import RecipeView from './pages/RecipeView';
import Profile from './pages/Profile';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/profile/:page/:recipeId' element={<RecipeView />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;