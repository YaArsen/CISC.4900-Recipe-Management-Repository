import EditComment from './EditComment';
import DeleteComment from './DeleteComment';
import CommentForm from './CommentForm';
import { useState } from 'react';

const CommentItem = ({ userId, recipeId, comment, allComments, onAddReply, setComments }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const replies = allComments.filter(c => !c.parentId ? false : c.parentId.toString() === comment._id.toString());

    const handleReplySubmit = (content) => {
        onAddReply(comment._id, content);
        setShowReplyForm(false);
    };

    return (
        <div
            style={{ 
                marginLeft: comment.parentId ? '20px' : '0', 
                borderLeft: comment.parentId ? '2px solid #ccc' : 'none', 
                paddingLeft: comment.parentId ? '10px' : '0', 
                marginTop: '15px',
                paddingBottom: '10px'
            }}
        >
            <div style={{ backgroundColor: comment.parentId ? '#f9f9f9' : '#fff', padding: '10px', borderRadius: '4px' }}>
                <p style={{ margin: '0 0 10px 0' }}>
                    {comment.username}
                    {comment.content}
                    <span style={{ color: '#333', fontSize: '0.8em', marginLeft: '10px' }}>
                        {new Date(comment.timestamp).toLocaleString()}
                    </span>
                    {userId.toString() === comment.user.toString() && (
                        <>
                            <EditComment recipeId={recipeId} commentId={comment._id} currentContent={comment.content} setComments={setComments} />
                            <DeleteComment recipeId={recipeId} commentId={comment._id} setComments={setComments} />
                        </>
                    )}
                </p>

                <button
                    style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0 }}
                    onClick={() => setShowReplyForm(!showReplyForm)}>{showReplyForm ? 'Cancel Reply' : 'Reply'}
                </button>
            </div>

            {showReplyForm && <CommentForm parentId={comment._id} onSubmit={handleReplySubmit} />}
            {replies.length > 0 && <button
                style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0, marginLeft: '10px' }}
                onClick={() => setShowReplies(!showReplies)}>{showReplies ? 'Hide replies' : `Show replies ${replies.length}`}
            </button>}

            {showReplies && <div style={{ marginTop: '10px' }}>
                {replies.map(reply => (
                    <CommentItem
                        key={reply._id}
                        userId={userId}
                        recipeId={recipeId}
                        comment={reply}
                        allComments={allComments}
                        onAddReply={onAddReply}
                        setComments={setComments}
                    />
                ))}
            </div>}
        </div>
    );
};

export default CommentItem;