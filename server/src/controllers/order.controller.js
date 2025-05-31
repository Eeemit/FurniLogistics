const {orderService} = require("../services/order.service");

class OrderController {
    async create(req, res, next) {
        try {
            const createdOrder = await orderService.create(req.body);

            return res.json(createdOrder)
        } catch (e) {
            next(e)
        }
    }

    async findById(req, res, next) {
        try {
            const {orderId} = req.params;
            const order = await orderService.findById(orderId);

            return res.json(order)
        } catch (e) {
            next(e)
        }
    }

    async findRoute(req, res, next) {
        try {
            const {orderId} = req.params;
            const order = await orderService.findRoute(orderId);

            return res.json(order)
        } catch (e) {
            next(e)
        }
    }
}

const orderController = new OrderController();

module.exports = {orderController}