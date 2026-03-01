const Fetch = async (url, obj = {}) => {
    const par = {};

    if (obj.method) par.method = obj.method;
    if (obj.token) par.headers = { 'Authorization': `Bearer ${obj.token}` };
    if (obj.body) {
        par.headers = { ...par.headers, 'Content-Type': 'application/json' };
        par.body = JSON.stringify(obj.body);
    }

    return await fetch(url, par);
};

export default Fetch;