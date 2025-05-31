const ApiError = require("../errors/api.error");
const Order = require("../models/Order.model");

class OrderMiddleware {
    isOrderExist(idField) {
        return async (req, res, next) => {
            try {
                const post = await Order.findById(req.params[idField]);
                if (!post) {
                    throw new ApiError("Order not found", 404)
                }

                next()
            } catch (e) {
                next(e)
            }
        }
    }
}

module.exports = new OrderMiddleware()