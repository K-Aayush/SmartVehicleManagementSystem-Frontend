import { CartContext } from "../context/CartContext";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "../components/ui/separator";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } =
    useContext(CartContext);

  const { token, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Handle checkout
  const onCheckout = async () => {
    if (!token) {
      toast.error("Please login to checkout your cart products");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const item = cartItems[0];

      const { data } = await axios.post(
        `${backendUrl}/api/payment/create-payment`,
        {
          productId: item.id,
          quantity: item.quantity,
          paymentMethod: "CREDIT",
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (data.success) {
        localStorage.setItem(
          "currentOrder",
          JSON.stringify({
            orderId: data.orderId,
            paymentId: data.paymentId,
            items: cartItems,
            total: cartTotal,
          })
        );

        // Redirect to checkout page with client secret
        navigate(
          `/checkout?clientSecret=${data.clientSecret}&paymentId=${data.paymentId}&orderId=${data.orderId}`
        );
      } else {
        toast.error("Failed to create payment");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred during checkout");
    } finally {
      setLoading(false);
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="mb-4 text-2xl font-bold">Your Cart is Empty</h1>
        <p className="mb-8 text-gray-600">
          Add some products to your cart to see them here.
        </p>
        <Link to="/products">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container min-h-screen px-4 py-8 mx-auto">
      <h1 className="mb-8 text-2xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="w-full h-24 overflow-hidden bg-gray-100 rounded-md sm:w-24">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0].imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 gap-2">
                    <div className="flex justify-between">
                      <Link
                        to={`/product/${item.id}`}
                        className="font-medium hover:underline"
                      >
                        {item.name}
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-sm text-gray-500">{item.category}</div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="font-semibold">
                        {formatPrice(item.price)}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-8 h-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-8 h-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link to="/products">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Order Summary</h2>

            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-medium">{formatPrice(cartTotal)}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-sm text-gray-500">Shipping</span>
              <span className="text-sm text-gray-500">
                Calculated at checkout
              </span>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between mb-6">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">
                {formatPrice(cartTotal)}
              </span>
            </div>

            <Button onClick={onCheckout} className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
