const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Menghapus "Bearer " di depan token
    const tokenWithoutBearer = token.split(' ')[1];

    try {
        // Verifikasi token menggunakan JWT_SECRET
        const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        req.user = verified; // Menyimpan data pengguna ke req.user
        next(); // Melanjutkan ke rute berikutnya
    } catch (err) {
        // Jika token tidak valid
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = verifyToken;
