// Generic change handler: updates the state based on the input's name attribute
export const handleChange = (e, data, setData) => {
    setData({ ...data, [e.target.name]: e.target.value }); // Updates the data state dynamically based on the input field's name attribute.
};