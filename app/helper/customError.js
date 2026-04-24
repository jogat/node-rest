class CustomError extends Error {

    constructor( code = 500, ...params) {
        super(...params)

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError)
        }

        this.name = 'CustomError'
        // Custom debugging information
        this.code = code;
        if (isNaN(this.code)) {
            this.code = 500;
        }
        this.date = new Date()
    }
}

module.exports = CustomError;