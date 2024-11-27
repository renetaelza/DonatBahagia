const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

// Endpoint rahasia yang memerlukan token
router.get('/profile', verifyToken, (req, res) => {
    res.status(200).json({
        message: 'Welcome to your profile',
        user: req.user,
    });
});

module.exports = router;
