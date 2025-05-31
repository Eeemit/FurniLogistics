const {isObjectIdOrHexString} = require("mongoose");
const {ApiError} = require("../errors/api.error");

class CommonMiddleware {
    isIdValid(field) {
        return (req, res, next) => {
            try {
                const id = req.params[field];

                if (!isObjectIdOrHexString(id)) {
                    throw new ApiError(`${field} is not valid`, 400)
                }

                next()
            } catch (e) {
                next(e)
            }
        }
    }

    isBodyValid(validator) {
        return (req, res, next) => {
            try {
                const {error, value} = validator.validate(req.body);
                if (error) {
                    if (req.files) {
                        req.files.forEach(file => fs.unlinkSync(file.path))
                    }

                    throw new ApiError(error.message, 400);
                }

                req.body = value
                next()
            } catch (e) {
                next(e)
            }
        }
    }
}

const commonMiddleware = new CommonMiddleware();

module.exports = {commonMiddleware}