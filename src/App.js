
import React, { useState } from 'react'; 
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

import 'bootswatch/dist/lux/bootstrap.min.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

const CheckoutForm = () => {

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const productPrice = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    if (!error) {
      const { id } = paymentMethod;
      try {
        setLoading(true);
        const { data } = await axios.post('http://localhost:4000/api/checkout', {
          id, 
          amount: productPrice * 100 // In cents
        });
        console.log(data);
        elements.getElement(CardElement).clear();
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  }
  
  return <form onSubmit={handleSubmit} className="card card-body">
    <img src="https://www.corsair.com/corsairmedia/sys_master/productcontent/k68-spill-resistant-keyboard-Content-2.png" alt="Logo" className="img-fluid" />
    <h3 className="text-center my-2">Price: ${productPrice}</h3>
    <div className="form-group">
      <CardElement className="form-control" />
    </div>
    <button type="submit" className="btn btn-success" disabled={!stripe}>
      {
        loading ? (
          <div className="spinner-border text-dark" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : 'Buy'
      }  
    </button>    
  </form>
};

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-2">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
