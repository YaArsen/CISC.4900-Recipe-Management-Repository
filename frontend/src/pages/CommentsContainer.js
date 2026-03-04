import { fetchGetRecipe, fetchPostComment } from '../api';
import CommentItem from '../components/CommentItem';
import CommentForm from '../components/CommentForm';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CommentsContainer = () => {
    const { userId, recipeId } = useParams();
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

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

    const postComment = async (parentId, content) => {
        try {
            const data = await fetchPostComment(recipeId, { parentId, content });
            setComments(data);
        } catch (error) {
            return alert(error);
        }
    };

    if (!comments) return <p>Loading...</p>;

    const topLevelComments = comments
    .filter(c => !c.parentId)
    .sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px', backgroundColor: '#f4f4f9', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <button onClick={() => navigate(-1)}>x</button>
            <h1 style={{ margin: '0' }}>Recipe comments {comments.length}</h1>
            <CommentForm parentId={undefined} onSubmit={(content) => postComment(undefined, content)} />

            <div style={{ marginTop: '30px' }}>
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

                {topLevelComments.length === 0 && <p style={{ textAlign: 'center', color: '#333' }}>Be the first to share your thoughts!</p>}
            </div>
        </div>
    );
};

export default CommentsContainer;