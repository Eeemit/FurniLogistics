const axios = require("axios");

const {Order} = require("../models/Order.model");
const {ApiError} = require("../errors/api.error");
const {Warehouse} = require("../models/Warehouse.model");
const {ORS_API_KEY} = require("../configs/config");
const {emailService} = require("./email.service");
const {EEmailActions} = require("../enums/email.enum");

class OrderService {
    async create(data) {
        try {
            const order = await Order.create(data);

            const context = {
                id: order._id,
                name: data.name,
                companyName: data.companyName,
                phone: data.phone,
                email: data.email,
                city: data.city,
                addresses: data.addresses.toString(),
                message: data.message,
            }

            await emailService.sendMail(data.email, EEmailActions.ORDER_CREATED, context)

            return order
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

    async findRoute(id) {
        try {
            let {addresses, city} = await Order.findById(id);

            const geocoded = await Promise.all(addresses.map(async (addr, i) => {
                const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addr)}&format=json&limit=1`;
                const res = await axios.get(url, {headers: {'User-Agent': 'logistics-app'}});
                const loc = res.data[0];
                return {id: i + 1, location: [parseFloat(loc.lon), parseFloat(loc.lat)]};
            }));

            const vehicleStart = await Warehouse.findOne({city: city});

            const orsRes = await axios.post(
                'https://api.openrouteservice.org/optimization',
                {
                    jobs: geocoded,
                    vehicles: [{id: 1, profile:"driving-car", start: vehicleStart.coords}]
                },
                {
                    headers: {
                        Authorization: ORS_API_KEY
                    }
                }
            );

            const steps = orsRes.data.routes[0].steps;

            return steps.filter(step => step.type !== 'end').map(step => step.location);
        } catch (e) {
            throw new ApiError(e.message, e.status)
        }
    }
}

const orderService = new OrderService();

module.exports = {orderService}