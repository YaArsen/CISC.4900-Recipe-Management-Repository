import { fetchGetRecipe, fetchPostComment } from '../api';
import CommentItem from '../components/CommentItem';
import CommentForm from '../components/CommentForm';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const CommentsContainer = () => {
    const { page, recipeId } = useParams(); // Extract recipeId from the URL parameters to fetch the correct recipe data
    const [user, setUser] = useState(null);
    const [comments, setComments] = useState([]); // State to store the list of comments
    const [recipe, setRecipe] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Retrieve token for authentication

    useEffect(() => {
        if (!token) return;
        const user = jwtDecode(token);
        setUser(user);
    }, [token]);

    // Fetch comments for the recipe when the component mounts or recipeId changes
    useEffect(() => {
        const getRecipe = async () => {
            try {
                const data = await fetchGetRecipe(recipeId);
                setRecipe(data);
                setComments(data.comments);
            } catch (error) {
                return alert(error);
            }
        };

        getRecipe();
    }, [recipeId]);

    // Function to handle submitting a new comment or reply
    const postComment = async (parentId, content) => {
        try {
            const data = await fetchPostComment(recipeId, { parentId, content });
            setComments(data); // Update local state with the new list of comments returned from the API
        } catch (error) {
            return alert(error);
        }
    };

    if (!user || !comments || !recipe) return <p>Loading...</p>; // Simple loading state

    // Filter to get only top-level comments (those without a parentId) and sort them by timestamp (newest first)
    const topLevelComments = comments
    .filter(c => !c.parentId)
    .sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div className="comments-container">
            <div className='recipe-img-and-title'>
                <img src={recipe.photoReference} alt={recipe.title} />
                <h1>{recipe.title}</h1>
            </div>
            <div className="comments-header-row">
                <h1 className="comments-title">Recipe comments {comments.length}</h1> {/* Header displaying the total number of comments */}
                <button className="close-btn" onClick={() => navigate(`/${page}/recipe-view/${recipeId}`)}>x</button>
            </div>

            <CommentForm parentId={undefined} onSubmit={(content) => postComment(undefined, content)} /> {/* Form to submit a new top-level comment */}

            <div style={{ marginTop: '30px' }}>
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
                {topLevelComments.length === 0 && <p className="no-comments-msg">Be the first to share your thoughts!</p>}
            </div>
        </div>
    );
};

export default CommentsContainer;