import fetchData from './utils/fetchData';

export const fetchRegister = async (user) => {
    const res = await fetchData('/api/auth/register', { method: 'POST', body: user });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchLogIn = async (user) => {
    const res = await fetchData('/api/auth/log-in', { method: 'POST', body: user });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    const res = await fetchData('/api/auth/delete', { method: 'DELETE', token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchPostRecipe = async (recipe) => {
    const token = localStorage.getItem('token');
    const res = await fetchData('/api/recipes', { method: 'POST', token, body: recipe });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchGetAllUserRecipes = async (page) => {
    const token = localStorage.getItem('token');
    const res = await fetchData(`/api/recipes/${page}/10`, { token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchGetRecipe = async (recipeId) => {
    const token = localStorage.getItem('token');
    const res = await fetchData(`/api/recipes/${recipeId}`, { token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchGetIsFavorite = async (recipeId) => {
    const token = localStorage.getItem('token');
    const res = await fetchData(`/api/recipes/${recipeId}/recipe/isFavorite`, { token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchGetIsLiked = async (recipeId) => {
    const token = localStorage.getItem('token');
    const res = await fetchData(`/api/recipes/${recipeId}/recipe/isLiked`, { token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchUpdateRecipe = async (recipeId, recipe) => {
    const token = localStorage.getItem('token');
    const res = await fetchData(`/api/recipes/${recipeId}`, { method: 'PUT', token, body: recipe });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchDeleteRecipe = async (recipeId, page) => {
    const token = localStorage.getItem('token');
    const res = await fetchData(`/api/recipes/${recipeId}/${page}/10`, { method: 'DELETE', token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchToggleFavorite = async (recipeId) => {
    const token = localStorage.getItem('token');
    const res = await fetchData(`/api/recipes/${recipeId}/favorites`, { method: 'PUT',  token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchToggleLike = async (recipeId) => {
    const token = localStorage.getItem('token');
    const res = await fetchData(`/api/recipes/${recipeId}/likes`, { method: 'PUT',  token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchSearchRecipes = async (recipe, page) => {
    const token = localStorage.getItem('token');
    const res = await fetchData(`/api/recipes/search/${page}/10`, { method: 'POST', token, body: recipe });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchPostComment = async (recipeId, comment) => {
    const token = localStorage.getItem('token');
    const res = await fetchData(`/api/recipes/${recipeId}/comments`, { method: 'POST', token, body: comment });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchGetRecipeComments = async (recipeId) => {
    const token = localStorage.getItem('token');
    const res = await fetchData(`/api/recipes/${recipeId}/recipe/comments`, { token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchUpdateComment = async (recipeId, commentId, comment) => {
    const token = localStorage.getItem('token');
    const res = await fetchData(`/api/recipes/${recipeId}/comments/${commentId}`, { method: 'PUT', token, body: comment });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchDeleteComment = async (recipeId, commentId) => {
    const token = localStorage.getItem('token');
    const res = await fetchData(`/api/recipes/${recipeId}/comments/delete-comment/${commentId}`, { method: 'DELETE', token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchPasswordReset = async (user) => {
    const res = await fetchData('/api/auth/reset-password', { method: 'PUT', body: user });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchUpdateName = async (user) => {
    const token = localStorage.getItem('token');
    const res = await fetchData('/api/auth/update-name', { method: 'PUT', token, body: user });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchUpdateEmail = async (user) => {
    const token = localStorage.getItem('token');
    const res = await fetchData('/api/auth/update-email', { method: 'PUT', token, body: user });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchUpdatePassword = async (user) => {
    const token = localStorage.getItem('token');
    const res = await fetchData('/api/auth/update-password', { method: 'PUT', token, body: user });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchGetFavoriteRecipes = async (page) => {
    const token = localStorage.getItem('token');
    const res = await fetchData(`/api/recipes/favorite-recipes/${page}/10`, { token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchGetLikedRecipes = async (page) => {
    const token = localStorage.getItem('token');
    const res = await fetchData(`/api/recipes/liked-recipes/${page}/10`, { token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchGetCommentedRecipes = async (page) => {
    const token = localStorage.getItem('token');
    const res = await fetchData(`/api/recipes/commented-recipes/${page}/10`, { token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};