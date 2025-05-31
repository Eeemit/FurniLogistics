const {model, Schema} = require("mongoose");

const orderSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        addresses: {
            type: [String],
            required: true,
        },
        message: {
            type: String,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const Order = model("order", orderSchema);

module.exports = {Order}