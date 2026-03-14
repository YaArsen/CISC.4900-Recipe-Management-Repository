const Fetch = async (url, obj = {}) => {
    const par = {}; // Initialize parameters for fetch

    if (obj.method) par.method = obj.method; // 1. Set HTTP method if provided (defaults to GET in fetch)
    if (obj.token) par.headers = { 'Authorization': `Bearer ${obj.token}` }; // 2. Add Authorization header if a token is provided
    // 3. Handle request body: stringify JSON and set content-type
    if (obj.body) {
        par.headers = { ...par.headers, 'Content-Type': 'application/json' };
        par.body = JSON.stringify(obj.body);
    }

    return await fetch(url, par); // 4. Perform the fetch request with structured parameters
};

export default Fetch;