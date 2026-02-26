import { fetchUpdateComment } from '../api';
import { useState, useEffect } from 'react';

const EditComment = ({ recipeId, commentId, currentContent, setComments }) => {
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => setContent(currentContent), [currentContent]);

    const updateComment = async () => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            const data = await fetchUpdateComment(recipeId, commentId, { content });
            setComments(data);
            setContent('');
            setIsEditing(false);
        } catch (error) {
            return alert(error);
        }
    };

    if (isEditing)
        return
            <form onSubmit={updateComment}>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder='Edit comment...' required />
                <button type='submit'>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
            </form>;

    return <button onClick={setIsEditing(true)}>Edit</button>;
};

export default EditComment;