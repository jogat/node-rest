const customError = require('../../helper/customError');

class ValidationError extends customError {
    constructor(message = 'Invalid request', errors = {}) {
        super(400, message);
        this.errors = errors;
    }
}

module.exports = ValidationError;
