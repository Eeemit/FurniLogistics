const {ApiError} = require("../errors/api.error");
const {Order} = require("../models/Order.model");

class OrderMiddleware {
    isOrderExist(idField) {
        return async (req, res, next) => {
            try {
                const order = await Order.findById(req.params[idField]);
                if (!order) {
                    throw new ApiError("Order not found", 404)
                }

                next()
            } catch (e) {
                next(e)
            }
        }
    }

    checkPhoneNumber (idField) {
        return async (req, res, next) => {
            try {
                const order = await Order.findById(req.params[idField]);

                const {phone} = req.body;

                if (phone !== order.phone) {
                    throw new ApiError("Unknown phone number", 401)
                }

                next()
            } catch (e) {
                next(e)
            }
        }
    }
}

const orderMiddleware = new OrderMiddleware();

module.exports = {orderMiddleware}