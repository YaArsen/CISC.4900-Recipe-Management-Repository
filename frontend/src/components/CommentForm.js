import { useState } from 'react';

const CommentForm = ({ parentId, onSubmit }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        onSubmit(content);
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h4>{parentId ? 'Reply to Comment' : 'Post a New Comment'}</h4>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder='Write your comment...' required />
            <button type='submit'>Send</button>
        </form>
    );
};

export default CommentForm;