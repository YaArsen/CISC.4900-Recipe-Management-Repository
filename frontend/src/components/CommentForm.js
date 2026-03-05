import { useState } from 'react';

const CommentForm = ({ parentId, onSubmit }) => {
    const [content, setContent] = useState(''); // Local state to manage the textarea input value

    // Handles form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form behavior (page refresh)
        if (!content.trim()) return; // Validate: prevent sending empty or whitespace-only comments
        onSubmit(content); // Pass the content to the parent component
        setContent(''); // Clear the textarea after submission
    };

    return (
        <form onSubmit={handleSubmit} style={{ margin: '15px 0', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
            {/* Conditional title based on whether this is a reply */}
            <h4 style={{ width: '200px' }}>{parentId ? 'Reply to Comment' : 'Post a New Comment'}</h4>

            {/* Controlled textarea input */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='Write your comment...'
                rows='3'
                required
                style={{ width: '100%', resize: 'vertical', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />

            {/* Submit button */}
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