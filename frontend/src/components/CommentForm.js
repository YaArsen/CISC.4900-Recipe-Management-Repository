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
        <form onSubmit={handleSubmit} className='comment-form'>
            {/* Conditional title based on whether this is a reply */}
            <h4 className='comment-h4'>{parentId ? 'Reply to Comment' : 'Post a New Comment'}</h4>

            {/* Controlled textarea input */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='Write your comment...'
                rows='3'
                required
            />

            {/* Submit button */}
            <button type='submit' className='submit-btn'>Send</button>
        </form>
    );
};

export default CommentForm;