import EditComment from './EditComment';
import DeleteComment from './DeleteComment';
import CommentForm from './CommentForm';
import { useState } from 'react';
import threeVerticalDots from '../assets/three-dots-vertical.svg';

const CommentItem = ({ userId, recipeId, comment, allComments, onAddReply, setComments }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [activeManageId, setActiveManageId] = useState('');
    const replies = allComments.filter(c => !c.parentId ? false : c.parentId.toString() === comment._id.toString());

    const handleReplySubmit = (content) => {
        onAddReply(comment._id, content);
        setShowReplyForm(false);
    };

    return (
        <div className={`comment-item ${comment.parentId ? 'is-reply' : ''}`}>
            <div className="comment-content-wrapper">
                <div className="comment-header">
                    <div className="comment-info">
                        <span className="comment-username">{comment.username}</span>
                        <span className="comment-timestamp">{new Date(comment.timestamp).toLocaleString()}</span>
                    </div>

                    <button className='manage-button' onClick={() => setActiveManageId(activeManageId === comment._id ? '' : comment._id.toString())}>
                        <img src={threeVerticalDots} alt='manage' />
                    </button>
                    
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

                <p className="comment-text"><pre>{comment.content}</pre></p>

                <button className="action-button" onClick={() => setShowReplyForm(!showReplyForm)}>
                    {showReplyForm ? 'Cancel Reply' : 'Reply'}
                </button>

                {replies.length > 0 && (
                    <button className="action-button" onClick={() => setShowReplies(!showReplies)}>
                        {showReplies ? 'Hide replies' : `Show replies (${replies.length})`}
                    </button>
                )}
            </div>

            {showReplyForm && <CommentForm parentId={comment._id} onSubmit={handleReplySubmit} />}

            {showReplies && (
                <div style={{ marginTop: '10px' }}>
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
                </div>
            )}
        </div>
    );
};

export default CommentItem;