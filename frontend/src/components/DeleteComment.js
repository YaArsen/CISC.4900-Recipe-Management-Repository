import { fetchDeleteComment } from '../api';

const DeleteComment = ({ recipeId, commentId, setComments }) => {
    // Handles the deletion logic
    const deleteComment = async () => {
        try {
            const data = await fetchDeleteComment(recipeId, commentId); // 1. Call API to delete the comment on the server
            setComments(data); // 2. Update the local state with the new list of comments returned by the API
        } catch (error) {
            alert(error); // 3. Handle network or API errors
        }
    };

    return <button type='button' onClick={deleteComment}>Delete</button>;
};

export default DeleteComment;