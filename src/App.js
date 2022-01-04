import "./App.css";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import "bootswatch/dist/lux/bootstrap.min.css";
import axios from "axios";
import { useState } from "react";

const stripePromise = loadStripe(
  "pk_test_51KE01jJnCT04ZB9UO1BxUw4XPB8Lg5Yy0h8DyuaMDvJ5y5HkbzCImFHZGLHLvYqURu7ouGhG1GbLcr0p3bQauDRU004t0QEDEh"
);
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    setLoading(true);

    if (!error) {
      const { id } = paymentMethod;
      try {
        const { data } = await axios.post(
          "http://localhost:3001/api/checkout",
          {
            id,
            amount: 20000,
          }
        );
        console.log(data);
        elements.getElement(CardElement).clear();
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  console.log(!stripe || loading);

  return (
    <form
      onSubmit={handleSubmit}
      className="card card-body mx-auto"
      style={{ maxWidth: "300px" }}
    >
      <img
        src="https://ae01.alicdn.com/kf/H645cea0113334c05a4c9775e87257e28G/Camiseta-de-ReactJS-React-js-para-hombre-camisa-con-Logo-oficial-marco-de-metal-Unisex-estampada.jpg"
        alt="Polo ReactJS"
        className="img-fluid"
      />
      <h3 className="text-center my-3">Price: 100$</h3>
      <div className="form-group mb-3">
        <CardElement className="form-control" />
      </div>
      <button disabled={!stripe} className="btn btn-success" type="submit">
        {loading ? (
          <div className="spinner-border text-light" role="status">
            <span className="sr-only"></span>
          </div>
        ) : (
          "Buy"
        )}
      </button>
    </form>
  );
};

function App() {
  return (
    <div className="App pt-5">
      <h1>Test Stripe</h1>
      <Elements stripe={stripePromise}>
        <div className="container p-5">
          <div className="row">
            <div className="col-md-12 text-center">
              <CheckoutForm />
            </div>
          </div>
        </div>
      </Elements>
    </div>
  );
}

export default App;
