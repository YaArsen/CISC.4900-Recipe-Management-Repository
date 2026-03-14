import Login from './pages/Login';
import Register from './pages/Register';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import RecipeView from './pages/RecipeView';
import CommentsContainer from './pages/CommentsContainer';
import VerifyUser from './components/VerifyUser';
import PasswordReset from './pages/PasswordReset';
import Email from './pages/Email';
import Account from './pages/Account';
import VerifyEmail from './components/VerifyEmail';
import Search from './pages/Search';
import Recipes from './pages/Recipes';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/search' element={<Search />} />
                <Route path='/recipes' element={<Recipes />} />
                <Route path='/add-recipe' element={<AddRecipe />} />
                <Route path='/edit-recipe/:recipeId' element={<EditRecipe />} />
                <Route path='/:page/recipe-view/:recipeId' element={<RecipeView />} />
                <Route path='/:page/recipe-view/:recipeId/comments' element={<CommentsContainer />} />
                <Route path='/verify-email/:verificationToken' element={<VerifyUser />} />
                <Route path='/reset-password/:verificationToken' element={<PasswordReset />} />
                <Route path='/email' element={<Email />} />
                <Route path='/account' element={<Account />} />
                <Route path='/verify/:verificationToken' element={<VerifyEmail />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;