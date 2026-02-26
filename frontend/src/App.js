import Login from './pages/Login';
import Register from './pages/Register';
import RecipeView from './pages/RecipeView';
import Profile from './pages/Profile';
import CommentsConatainer from './pages/CommentsContainer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/profile/:page/:userId/:recipeId' element={<RecipeView />} />
                <Route path='/:userId/:recipeId/comments' element={<CommentsConatainer />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;