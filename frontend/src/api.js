import Fetch from './components/Fetch';

export const fetchRegister = async (user) => {
    const res = await Fetch('/api/auth/register', { method: 'POST', body: user });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchLogin = async (user) => {
    const res = await Fetch('/api/auth/login', { method: 'POST', body: user });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    const res = await Fetch('/api/auth/delete', { method: 'DELETE', token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchPostRecipe = async (recipe) => {
    const token = localStorage.getItem('token');
    const res = await Fetch('/api/recipes', { method: 'POST', token, body: recipe });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchGetAllUserRecipes = async () => {
    const token = localStorage.getItem('token');
    const res = await Fetch('/api/recipes', { token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchIsActivated = async (recipeId) => {
    const token = localStorage.getItem('token');
    const res = await Fetch(`/api/recipes/isActivated/${recipeId}`, { token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchGetRecipe = async (recipeId) => {
    const token = localStorage.getItem('token');
    const res = await Fetch(`/api/recipes/${recipeId}`, { token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchUpdateRecipe = async (recipeId, recipe) => {
    const token = localStorage.getItem('token');
    const res = await Fetch(`/api/recipes/${recipeId}`, { method: 'PUT', token, body: recipe });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchDeleteRecipe = async (recipeId) => {
    const token = localStorage.getItem('token');
    const res = await Fetch(`/api/recipes/${recipeId}`, { method: 'DELETE', token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchToggleLike = async (recipeId) => {
    const token = localStorage.getItem('token');
    const res = await Fetch(`/api/recipes/${recipeId}/likes`, { method: 'PUT',  token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchSearchRecipes = async (recipe) => {
    const token = localStorage.getItem('token');
    const res = await Fetch(`/api/recipes/search`, { method: 'POST', token, body: recipe });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchPostComment = async (recipeId, comment) => {
    const token = localStorage.getItem('token');
    const res = await Fetch(`/api/recipes/${recipeId}/comments`, { method: 'POST', token, body: comment });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchUpdateComment = async (recipeId, commentId, comment) => {
    const token = localStorage.getItem('token');
    const res = await Fetch(`/api/recipes/${recipeId}/comments/${commentId}`, { method: 'PUT', token, body: comment });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const fetchDeleteComment = async (recipeId, commentId) => {
    const token = localStorage.getItem('token');
    const res = await Fetch(`/api/recipes/${recipeId}/comments/${commentId}`, { method: 'DELETE', token });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};