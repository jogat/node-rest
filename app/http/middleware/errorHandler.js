module.exports = function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    const status = Number.isInteger(err.code) ? err.code : 500;
    const message = status === 500 && !err.message ? 'Internal Server Error' : err.message;

    if (err.errors) {
        return res.status(status).json({
            message,
            errors: err.errors
        });
    }

    return res.status(status).send(message || 'Internal Server Error');
};
