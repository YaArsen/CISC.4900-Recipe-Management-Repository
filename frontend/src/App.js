import LogIn from './pages/LogIn';
import Register from './pages/Register';
import VerifyEmail from './components/VerifyEmail';
import Email from './pages/Email';
import PasswordReset from './pages/PasswordReset';
import ProtectedRoute from './components/ProtectedRoute';
import Search from './pages/Search';
import Recipes from './pages/Recipes';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import RecipeView from './pages/RecipeView';
import CommentsContainer from './pages/CommentsContainer';
import Account from './pages/Account';
import VerifyNewEmail from './components/VerifyNewEmail';
import FavoriteRecipes from './pages/FavoriteRecipes';
import LikedRecipes from './pages/LikedRecipes';
import CommentedRecipes from './pages/CommentedRecipes';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path='/' element={<LogIn />} />
                <Route path='/register' element={<Register />} />
                <Route path='/verify-email/:verificationToken' element={<VerifyEmail />} />
                <Route path='/email' element={<Email />} />
                <Route path='/reset-password/:verificationToken' element={<PasswordReset />} />

                {/* Protected Routes wrapped in ProtectedRoute */}
                <Route element={<ProtectedRoute />}>
                    <Route path='/search' element={<Search />} />
                    <Route path='/recipes' element={<Recipes />} />
                    <Route path='/recipes/:pageNumber/add-recipe' element={<AddRecipe />} />
                    <Route path='/recipes/:pageNumber/edit-recipe/:recipeId' element={<EditRecipe />} />
                    <Route path='/:page/:pageNumber/recipe-view/:recipeId' element={<RecipeView />} />
                    <Route path='/:page/:pageNumber/recipe-view/:recipeId/comments' element={<CommentsContainer />} />
                    <Route path='/:page/account' element={<Account />} />
                    <Route path='/:page/account/verify-new-email/:verificationToken' element={<VerifyNewEmail />} />
                    <Route path='/:page/favorite-recipes' element={<FavoriteRecipes />} />
                    <Route path='/:page/liked-recipes' element={<LikedRecipes />} />
                    <Route path='/:page/commented-recipes' element={<CommentedRecipes />} />
                </Route>

                <Route path='*' element={<div>404 Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;