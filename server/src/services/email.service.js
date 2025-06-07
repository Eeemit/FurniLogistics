const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");

const {NO_REPLY_EMAIL, NO_REPLY_PASSWORD} = require("../configs/config");
const emailConstants = require("../constants/email.constants");

class EmailService {
    #transporter

    constructor() {
        this.#transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: NO_REPLY_EMAIL,
                pass: NO_REPLY_PASSWORD
            }
        })

        const hbsOptions = {
            viewEngine: {
                extname: ".hbs",
                defaultLayout: "main",
                layoutsDir: path.join(process.cwd(), "src", "email-templates", "layouts"),
                partialsDir: path.join(process.cwd(), "src", "email-templates", "partials"),
            },
            viewPath: path.join(process.cwd(), "src", "email-templates", "views"),
            extName: ".hbs"
        }

        this.#transporter.use("compile", hbs(hbsOptions))
    }

    async sendMail(email, emailAction, context = {}) {
        const {templateName, subject} = emailConstants[emailAction];

        const mailOptions = {
            from: `FurniLogistics - No Reply <${NO_REPLY_EMAIL}>`,
            to: email,
            subject,
            template: templateName,
            context,
        }

        return await this.#transporter.sendMail(mailOptions)
    }
}

const emailService = new EmailService();

module.exports = {emailService}