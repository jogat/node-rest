const ValidationError = require('../errors/ValidationError');

class FormRequest {
    constructor(req) {
        this.req = req;
        this.errors = {};
    }

    validate() {
        return {};
    }

    required(field, value) {
        if (value === undefined || value === null || value === '') {
            this.errors[field] = `${field} is required`;
        }
    }

    integer(field, value) {
        if (value === undefined || value === null || value === '') {
            return;
        }

        if (isNaN(parseInt(value))) {
            this.errors[field] = `${field} must be an integer`;
        }
    }

    failIfInvalid() {
        if (Object.keys(this.errors).length) {
            throw new ValidationError('Invalid request', this.errors);
        }
    }
}

module.exports = FormRequest;
