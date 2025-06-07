const {EEmailActions} = require("../enums/email.enum");

module.exports = {
    [EEmailActions.ORDER_CREATED]: {
        templateName: "order-created",
        subject: "Замовлення створено",
    },
}