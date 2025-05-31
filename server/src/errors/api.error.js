class ApiError extends Error {
    status

    constructor(message, status) {
        super(message);
        this.status = status
    }
}

module.exports = {ApiError}