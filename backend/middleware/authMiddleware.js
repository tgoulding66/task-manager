const jwt = require('jsonwebtoken');

// This is a middleware function that protects routes.
// It takes the request, response, and next function as arguments.
// It then checks if the authorization header is present and if it starts with 'Bearer '.
// If the authorization header is not present or does not start with 'Bearer ', it then returns a 401 status and a message.
// If the authorization header is present and starts with 'Bearer ', it then verifies the token.
// If the token is valid, it then sets the user in the request to the decoded token.  

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = protect;
