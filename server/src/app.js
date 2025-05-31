const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors");

const orderRouter = require("./routers/order.router");
const {DB_URL} = require("./configs/config");

const app = express()

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/orders", orderRouter)
app.use((err, req, res, next) => {
    const status = err.status || 500;

    return res.status(status).json({
        message: err.message,
        status: err.status,
    });
});

const dbConnect = async () => {
    let dbCon = false;

    while (!dbCon) {
        console.log("Connecting to database")
        await mongoose
            .connect(DB_URL)
            .then(() => {
                dbCon = true
                console.log("Successfully connected to database")
            })
            .catch(async (err) => {
                console.log(`Error connecting to database: ${err} \nWait 3 seconds`)
                await new Promise(resolve => setTimeout(resolve, 3000))
            })
    }
}

const PORT = 3000;

app.listen(PORT, async () => {
    await dbConnect()
    console.log(`Server has started on PORT ${PORT}`)
})
