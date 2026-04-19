import { fetchGetCommentUsername } from '../api';
import KebabMenu from './KebabMenu';
import EditComment from './EditComment';
import DeleteComment from './DeleteComment';
import CommentForm from './CommentForm';
import { useState, useEffect } from 'react';

const CommentItem = ({ userId, recipeId, comment, allComments, onAddReply, setComments }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [activeManageId, setActiveManageId] = useState('');
    const [username, setUsername] = useState('');
    const replies = allComments.filter(c => !c.parentId ? false : c.parentId.toString() === comment._id.toString());

    useEffect(() => {
        try {
            const getCommentUsername = async () => {
                const data = await fetchGetCommentUsername(recipeId, comment._id);
                setUsername(data);
            };

            getCommentUsername();
        } catch (error) {
            alert(error);
        }
    }, [recipeId, comment._id]);

    const handleReplySubmit = (content) => {
        onAddReply(comment._id, content);
        setShowReplyForm(false);
    };

    return (
        <div className={`comment-item ${comment.parentId ? 'is-reply' : ''}`}>
            <div className="comment-content-wrapper">
                <div className="comment-header">
                    <div className="comment-info">
                        <span className="comment-username">{username}</span>
                        <span className="comment-timestamp">{new Date(comment.timestamp).toLocaleString()}</span>
                    </div>

                    <KebabMenu
                        setActiveManageId={setActiveManageId}
                        activeManageId={activeManageId}
                        id={comment._id}
                    />

                    {activeManageId === comment._id && userId.toString() === comment.user.toString() && (
                        <div className='is-managing-container'>
                            <EditComment
                                setActiveManageId={setActiveManageId}
                                recipeId={recipeId}
                                commentId={comment._id}
                                currentContent={comment.content}
                                setComments={setComments}
                            />

                            <DeleteComment
                                recipeId={recipeId}
                                commentId={comment._id}
                                setComments={setComments}
                            />
                        </div>
                    )}
                </div>

                <p className='comment-text'>{comment.content}</p>

                <button type='button' className='action-button' onClick={() => setShowReplyForm(!showReplyForm)}>
                    {showReplyForm ? 'Cancel Reply' : 'Reply'}
                </button>

                {replies.length > 0 && (
                    <button type='button' className='action-button' onClick={() => setShowReplies(!showReplies)}>
                        {showReplies ? 'Hide replies' : `Show replies (${replies.length})`}
                    </button>
                )}
            </div>

            {showReplyForm && <CommentForm parentId={comment._id} onSubmit={handleReplySubmit} />}

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