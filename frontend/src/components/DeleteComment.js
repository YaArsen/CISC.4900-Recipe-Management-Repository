import { fetchDeleteComment } from '../api';

const DeleteComment = ({ recipeId, commentId, setComments }) => {
    const deleteComment = async () => {
        try {
            const data = await fetchDeleteComment(recipeId, commentId);
            setComments(data);
        } catch (error) {
            return alert(error);
        }

    };

    return <button onClick={deleteComment}>Delete</button>;
};

export default DeleteComment;