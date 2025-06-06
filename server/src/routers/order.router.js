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
router.post(
    "/:orderId",
    commonMiddleware.isIdValid("orderId"),
    commonMiddleware.isBodyValid(OrderValidator.getOrder),
    orderMiddleware.isOrderExist("orderId"),
    orderMiddleware.checkPhoneNumber("orderId"),
    orderController.findById
)
router.post(
    "/track/:orderId",
    commonMiddleware.isIdValid("orderId"),
    commonMiddleware.isBodyValid(OrderValidator.getOrder),
    orderMiddleware.isOrderExist("orderId"),
    orderMiddleware.checkPhoneNumber("orderId"),
    orderController.findRoute
)

const orderRouter = router;

module.exports = {orderRouter}