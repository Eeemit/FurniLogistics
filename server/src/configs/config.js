const {config} = require("dotenv");

config()

module.exports = {
    DB_URL: process.env.DB_URL,
    ORS_API_KEY: process.env.ORS_API_KEY,

    NO_REPLY_EMAIL: process.env.NO_REPLY_EMAIL,
    NO_REPLY_PASSWORD: process.env.NO_REPLY_PASSWORD,
}