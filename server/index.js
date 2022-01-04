const express = require('express');
const Stripe = require("stripe");
const cors = require("cors")

const app = express()

app.use(cors({origin: 'http://localhost:3000/'}))
app.use(express.json())
const stripe = new Stripe("sk_test_51KE01jJnCT04ZB9UmbjQ7yYGyMCGJfWctkR1Jp6eb3ZIDAGeXSquCiNGWVzJDgwmi3w8gzasZsF4Clxb01jj1bGu00PPcR4xbL")


app.post("/api/checkout", async (req, res) => {

    try {
        const {id, amount} = req.body;

        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            description: "T-shirt Reactjs",
            payment_method: id,
            confirm: true
        })
        console.log(payment);
        res.send({message: `Succesfull payment`})
    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.raw.message})
    }
})

app.listen(3001, () => {
    console.log("Listening on port 3001");
})
