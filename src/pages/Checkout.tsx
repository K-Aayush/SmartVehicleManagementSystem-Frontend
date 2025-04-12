import React from "react";

import { useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { CartContext } from "../context/CartContext";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { Button } from "../components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const clientSecret = searchParams.get("clientSecret");
  const paymentId = searchParams.get("paymentId");
  const orderId = searchParams.get("orderId");

  if (!clientSecret || !paymentId || !orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
        <h1 className="mb-4 text-2xl font-bold">Invalid Checkout Session</h1>
        <p className="mb-6 text-gray-600">
          We couldn't find the necessary information to process your payment.
        </p>
        <Button onClick={() => (window.location.href = "/cart")}>
          Return to Cart
        </Button>
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
    },
  };

  return (
    <div className="container max-w-md px-4 py-8 mx-auto">
      <h1 className="mb-8 text-2xl font-bold text-center">
        Complete Your Payment
      </h1>

      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm paymentId={paymentId} orderId={orderId} />
      </Elements>
    </div>
  );
};

const CheckoutForm = ({
  paymentId,
  orderId,
}: {
  paymentId: string;
  orderId: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContext);
  const { clearCart } = useContext(CartContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
      setLoading(false);
    } else if (paymentIntent) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/payment/verify-payment`,
          {
            paymentIntentId: paymentIntent.id,
            paymentId,
            orderId,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (response.data.success) {
          clearCart();
          navigate("/payment-success");
        } else {
          setMessage("Payment verification failed. Please contact support.");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setMessage("Failed to verify payment with our server.");
      }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-screen space-y-6">
      <PaymentElement />

      {message && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
          {message}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading || !stripe || !elements}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          "Pay Now"
        )}
      </Button>
    </form>
  );
};

export default Checkout;
