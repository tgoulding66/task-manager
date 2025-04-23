const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// This is a POST request that registers a new user.
// It takes the name, email, and password from the request body.
// It then creates a new user with the name, email, and password.
// It then returns the new user.  

router.post('/register', registerUser);
router.post('/login', loginUser);

// This is a GET request that returns the user's id.
// It takes the user id from the request user.
// It then returns the user's id. 
// It is protected by the authMiddleware.
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    message: 'Access granted to protected route',
    userId: req.user.id
  });
});

module.exports = router;
