class ErrorHander extends Error {
    constructor(message, statuscode) {
        super(message)
        this.statuscode = statuscode

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ErrorHander