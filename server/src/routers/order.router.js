const {Router} = require("express");

const {commonMiddleware} = require("../middlewares/common.middleware");
const {orderMiddleware} = require("../middlewares/order.middleware");
const {OrderValidator} = require("../validators/order.validator");
const {orderController} = require("../controllers/order.controller");

const router = Router();

router.post(
    "/",
    commonMiddleware.isBodyValid(OrderValidator.create),
    orderController.create
)
router.get(
    "/:orderId",
    commonMiddleware.isIdValid("orderId"),
    orderMiddleware.isOrderExist("orderId"),
    orderController.findById
)
router.get(
    "/track/:orderId",
    commonMiddleware.isIdValid("orderId"),
    orderMiddleware.isOrderExist("orderId"),
    orderController.findRoute
)

const orderRouter = router;

module.exports = {orderRouter}