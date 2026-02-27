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
        <div>
            <div>
                {comment.username}
                {comment.content}
                {new Date(comment.timestamp).toLocaleString()}
                {userId.toString() === comment.user.toString() && (
                    <>
                        <EditComment recipeId={recipeId} commentId={comment._id} currentContent={comment.content} setComments={setComments} />
                        <DeleteComment recipeId={recipeId} commentId={comment._id} setComments={setComments} />
                    </>
                )}
                
                <button onClick={() => setShowReplyForm(!showReplyForm)}>{showReplyForm ? 'Cancel Reply' : 'Reply'}</button>
            </div>

            {showReplyForm && <CommentForm parentId={comment._id} onSubmit={handleReplySubmit} />}
            {replies.length > 0 && <button onClick={() => setShowReplies(!showReplies)}>{showReplies ? 'Hide repls' : `Show repls ${replies.length}`}</button>}

            {showReplies && replies.map(reply => (
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
        </div>
    );
};

export default CommentItem;