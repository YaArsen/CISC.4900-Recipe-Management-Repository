import Login from './pages/Login';
import Register from './pages/Register';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import RecipeView from './pages/RecipeView';
import CommentsContainer from './pages/CommentsContainer';
import VerifyEmail from './components/VerifyEmail';
import PasswordReset from './pages/PasswordReset';
import Email from './pages/Email';
import Account from './pages/Account';
import VerifyNewEmail from './components/VerifyNewEmail';
import Search from './pages/Search';
import Recipes from './pages/Recipes';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/verify-email/:verificationToken' element={<VerifyEmail />} />
                <Route path='/email' element={<Email />} />
                <Route path='/reset-password/:verificationToken' element={<PasswordReset />} />

                {/* Protected Routes wrapped in ProtectedRoute */}
                <Route element={<ProtectedRoute />}>
                    <Route path='/search' element={<Search />} />
                    <Route path='/recipes' element={<Recipes />} />
                    <Route path='/add-recipe' element={<AddRecipe />} />
                    <Route path='/edit-recipe/:recipeId' element={<EditRecipe />} />
                    <Route path='/:page/recipe-view/:recipeId' element={<RecipeView />} />
                    <Route path='/:page/recipe-view/:recipeId/comments' element={<CommentsContainer />} />
                    <Route path='/:page/account' element={<Account />} />
                    <Route path='/verify-new-email/:verificationToken' element={<VerifyNewEmail />} />
                </Route>

                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;