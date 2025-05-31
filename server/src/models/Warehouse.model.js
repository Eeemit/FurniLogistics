const {model, Schema} = require("mongoose");

const warehouseSchema = new Schema(
    {
        city: {
            type: String,
            required: true,
        },
        coords: {
            type: [Number],
            required: true,
        }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const Warehouse = model("warehouse", warehouseSchema)

module.exports = {Warehouse}