const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();

// ✅ Enable CORS for all origins or specify allowed origins
app.use(cors({
    origin: 'http://localhost:5173/', // Allow requests from frontend
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json()); // ✅ Middleware to parse JSON body

app.post('/pay', async (req, res) => {
    try {
        const { amount } = req.body; 

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        // Convert INR to paise (Stripe requires the smallest currency unit)
        const totalAmount = amount * 100;

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'inr',
        });

        res.status(200).json({
            message: 'Payment initiated',
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});