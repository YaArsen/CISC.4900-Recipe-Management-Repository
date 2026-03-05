import { fetchGetRecipe, fetchPostComment } from '../api';
import CommentItem from '../components/CommentItem';
import CommentForm from '../components/CommentForm';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CommentsContainer = () => {
    const { userId, recipeId } = useParams(); // Extract recipeId from the URL parameters to fetch the correct recipe data
    const [comments, setComments] = useState([]); // State to store the list of comments
    const navigate = useNavigate();

    // Fetch comments for the recipe when the component mounts or recipeId changes
    useEffect(() => {
        const getRecipe = async () => {
            try {
                const data = await fetchGetRecipe(recipeId);
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

    if (!comments) return <p>Loading...</p>; // Simple loading state

    // Filter to get only top-level comments (those without a parentId) and sort them by timestamp (newest first)
    const topLevelComments = comments
    .filter(c => !c.parentId)
    .sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px', backgroundColor: '#f4f4f9', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <button onClick={() => navigate(-1)}>x</button>
            <h1 style={{ margin: '0' }}>Recipe comments {comments.length}</h1> {/* Header displaying the total number of comments */}
            <CommentForm parentId={undefined} onSubmit={(content) => postComment(undefined, content)} /> {/* Form to submit a new top-level comment */}

            <div style={{ marginTop: '30px' }}>
                {/* Map over top-level comments and render each CommentItem */}
                {topLevelComments.map(comment => (
                    <CommentItem
                        key={comment._id}
                        userId={userId}
                        recipeId={recipeId}
                        comment={comment}
                        allComments={comments}
                        onAddReply={postComment}
                        setComments={setComments}
                    />
                ))}

                {/* Message displayed when there are no comments */}
                {topLevelComments.length === 0 && <p style={{ textAlign: 'center', color: '#333' }}>Be the first to share your thoughts!</p>}
            </div>
        </div>
    );
};

export default CommentsContainer;