const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // Attempt to extract the token from the 'Authorization' header. 
  if (!token) return res.status(403).json({ message: 'No token provided' }); // If no token is found, return a 403 Forbidden status with a message

  try {
    // Verify the token using the secret from environment variables.
    // If valid, the decoded payload is attached to the request object as 'req.user'
    // for use in subsequent middleware or route handlers.
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next(); // Pass control to the next handler in the route sequence
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = auth;