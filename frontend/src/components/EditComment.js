import { fetchUpdateComment } from '../api';
import { useState, useEffect } from 'react';

const EditComment = ({ setActiveManageId, recipeId, commentId, currentContent, setComments }) => {
    const [content, setContent] = useState(''); // Local state to manage the textarea content
    const [isEditing, setIsEditing] = useState(false); // Toggle state between view (false) and edit (true) modes

    useEffect(() => {
        setContent(currentContent);
    }, [currentContent]); // Syncs textarea content with props whenever currentContent changes

    // Handles API submission to update the comment
    const updateComment = async (e) => {
        e.preventDefault();
        if (!content.trim()) return; // Prevent saving empty comments

        try {
            const data = await fetchUpdateComment(recipeId, commentId, { content }); // Call API to update comment in backend
            setComments(data); // Update parent component state with new data
            // Exit editing mode and clear textarea
            setContent('');
            setIsEditing(false);
            setActiveManageId('');
        } catch (error) {
            return alert(error); // Basic error handling
        }
    };

    // Renders the editing form if in edit mode
    if (isEditing) {
        return (
            <form onSubmit={updateComment}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder='Edit comment...'
                    required
                />

                <button type='submit'>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
        );
    }

    return <button onClick={() => setIsEditing(true)}>Edit</button>; // Renders the Edit button in view mode
};

export default EditComment;