const Joi = require("joi");

const {PHONE} = require("../constants/regex.constants")

class OrderValidator {
    static name = Joi.string().max(45).trim()
    static companyName = Joi.string().max(45).trim()
    static phone = Joi.string().regex(PHONE).trim()
    static email = Joi.string().email({minDomainSegments: 2, tlds: {allow: false}})
    static city = Joi.string().max(45).trim()
    static addresses = Joi.array().items(Joi.string().max(100).trim())
    static message = Joi.string().max(200).trim()

    static create = Joi.object({
        name: this.name.required(),
        companyName: this.companyName.required(),
        phone: this.phone.required(),
        email: this.email.required(),
        city: this.city.required(),
        addresses: this.addresses.required(),
        message: this.message
    })
}

module.exports = {OrderValidator}