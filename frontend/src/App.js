import Login from './pages/Login';
import Register from './pages/Register';
import RecipeView from './pages/RecipeView';
import Profile from './pages/Profile';
import CommentsContainer from './pages/CommentsContainer';
import VerifyUser from './components/VerifyUser';
import PasswordReset from './pages/PasswordReset';
import Email from './pages/Email';
import AccountPage from './pages/AccountPage';
import VerifyEmail from './components/VerifyEmail';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/profile/:page/:userId/:recipeId' element={<RecipeView />} />
                <Route path='/:userId/:recipeId/comments' element={<CommentsContainer />} />
                <Route path='/verify-email/:verificationToken' element={<VerifyUser />} />
                <Route path='/reset-password/:verificationToken' element={<PasswordReset />} />
                <Route path='/email' element={<Email />} />
                <Route path='/account' element={<AccountPage />} />
                <Route path='/verify/:verificationToken' element={<VerifyEmail />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;