import { fetchGetRecipe, fetchGetRecipeComments, fetchPostComment } from '../api';
import mergeSort from '../utils/sortingAlgorithm';
import CommentItem from '../components/CommentItem';
import CommentForm from '../components/CommentForm';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const CommentsContainer = () => {
    const { page, pageNumber, recipeId } = useParams(); // Extract recipeId from the URL parameters to fetch the correct recipe data
    const [user, setUser] = useState(null);
    const [comments, setComments] = useState(null); // State to store the list of comments
    const [recipe, setRecipe] = useState(null);
    const [tempRecipe, setTempRecipe] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const recipe = localStorage.getItem('recipe');

        if (recipe) {
            localStorage.removeItem('recipe');
            setTempRecipe(JSON.parse(recipe));
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve token for authentication
        const user = jwtDecode(token);
        setUser(user);
    }, []);

    // Fetch comments for the recipe when the component mounts or recipeId changes
    useEffect(() => {
        const getRecipe = async () => {
            try {
                const data = await fetchGetRecipe(recipeId);
                setRecipe(data);
            } catch (error) {
                alert(error);
            }
        };

        getRecipe();
    }, [recipeId]);

    useEffect(() => {
        const getRecipeComments = async () => {
            try {
                const data = await fetchGetRecipeComments(recipeId);
                setComments(data);
            } catch (error) {
                alert(error);
            }
        };

        getRecipeComments();
    }, [recipeId]);

    // Function to handle submitting a new comment or reply
    const postComment = async (parentId, content) => {
        try {
            const data = await fetchPostComment(recipeId, { parentId, content });
            setComments(data); // Update local state with the new list of comments returned from the API
        } catch (error) {
            alert(error);
        }
    };

    const array = page.split(' ');
    if (page !== 'search' && page !== 'recipes' && array[0] !== 'search' && array[0] !== 'recipes') return <div>404 Not Found</div>;
    if (!user || !recipe || !comments) return <p className='loading'>Loading...</p>; // Simple loading state

    // Filter to get only top-level comments (those without a parentId) and sort them by timestamp (newest first)
    const topLevelComments = mergeSort(comments.filter(c => !c.parentId));

    return (
        <div className='comments-container'>
            <div className='comments-page-header'>
                <img src={recipe.base64File} alt={recipe.title} />
                <h1>{recipe.title}</h1>
            </div>

            <div className='comments-header-row'>
                <h1>Recipe comments {comments.length}</h1> {/* Header displaying the total number of comments */}

                <button
                    type='button'
                    className='close-button'
                    onClick={() => {
                        if (tempRecipe) localStorage.setItem('recipe', JSON.stringify(tempRecipe));
                        navigate(`/${page}/${pageNumber}/recipe-view/${recipeId}`);
                    }}
                >
                    x
                </button>
            </div>

            <CommentForm parentId={undefined} onSubmit={(content) => postComment(undefined, content)} /> {/* Form to submit a new top-level comment */}

            {/* Map over top-level comments and render each CommentItem */}
            {topLevelComments.map(comment => (
                <CommentItem
                    key={comment._id}
                    userId={user.userId}
                    recipeId={recipeId}
                    comment={comment}
                    allComments={comments}
                    onAddReply={postComment}
                    setComments={setComments}
                />
            ))}

            {/* Message displayed when there are no comments */}
            {topLevelComments.length === 0 && <p className='no-comments-msg'>Be the first to share your thoughts!</p>}
        </div>
    );
};

export default CommentsContainer;