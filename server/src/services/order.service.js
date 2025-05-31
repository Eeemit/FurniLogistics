const Order = require("../models/Order.model");
const ApiError = require("../errors/api.error");

class OrderService {
    async create(data) {
        try {
            return await Order.create(data)
        } catch (e) {
            throw new ApiError(e.message, e.status)
        }
    }

    async findById(id) {
        try {
            return await Order.findById(id)
        } catch (e) {
            throw new ApiError(e.message, e.status)
        }
    }
}

module.exports = new OrderService()