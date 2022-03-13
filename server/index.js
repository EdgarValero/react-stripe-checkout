const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));

app.post('/api/checkout', async (req, res) => {
  try {
    const { id, amount } = req.body;
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description: 'Gaming keyboard Corsair K68',
      payment_method: id,
      confirm: true
    });
    console.log(payment);
    res.json({ msg: 'Successfull Payment' });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

app.listen(4000, () => console.log('Server started on port 4000'));
