const errorHandler = (err, req, res, next) => {
    console.error(['GLOBAL ERROR', err]); // Log error ke console untuk debugging

    if (err.message === 'Profile not found') {
        return res.status(404).json({ message: err.message });
    }

    if (err.message === 'Username already taken.') {
        return res.status(409).json({ message: err.message }); // 409 Conflict
    }

    // Tangani error lainnya
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
}

module.exports = errorHandler;
