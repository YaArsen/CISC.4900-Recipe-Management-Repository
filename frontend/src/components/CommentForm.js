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
        <form onSubmit={handleSubmit} style={{ margin: '15px 0', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h4 style={{ width: '200px' }}>{parentId ? 'Reply to Comment' : 'Post a New Comment'}</h4>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='Write your comment...'
                rows='3'
                required
                style={{ width: '100%', resize: 'vertical', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <button
                type='submit'
                style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                Send
            </button>
        </form>
    );
};

export default CommentForm;