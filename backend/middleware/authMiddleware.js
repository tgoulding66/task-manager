const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'testsecret'; // ✅ fallback
    const decoded = jwt.verify(token, secret);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error('JWT verify error:', err);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = protect;
