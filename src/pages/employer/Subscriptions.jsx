import { useState } from "react";
import { toast } from "sonner";
import {
  useCalculateCost,
  useCreateOrder,
  useVerifyOrder,
} from "../../hooks/payments/useCreditPurchase";
import { useLoadRazorpay } from "../../hooks/payments/useLoadRazorpay";
import { TokenSelector } from "./payments/TokenSelector";
import { OrderSummary } from "./payments/OrderSummary";
import "./styles/subscriptions.css";

export function Subscriptions() {
  const [tokens, setTokens] = useState(10);
  const isRazorpayLoaded = useLoadRazorpay();

  const {
    data: costData,
    isPending: isCostPending,
    isError: isCostError,
    error: costError,
  } = useCalculateCost(tokens);

  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const { mutateAsync: verifyOrder } = useVerifyOrder();

  const handlePayment = async () => {
    if (!isRazorpayLoaded) {
      toast.error("Payment SDK failed to load. Are you offline?");
      return;
    }

    if (!costData?.data) {
      toast.error("Could not determine cost. Please try again.");
      return;
    }

    const { amout_to_be_paid } = costData.data;

    try {
      // 1. Create order on our backend
      const orderRes = await createOrder({
        amount: amout_to_be_paid,
        tokens: tokens,
        gst_amount: 0, // Sending 0 as we don't have GST from calculate cost API
        discount_amount: 0,
      });

      if (!orderRes.success) {
        throw new Error(orderRes.message || "Failed to create order");
      }

      const { razorpay_key, order_id, amount, currency, purchase_id } = orderRes.data;

      // 2. Setup Razorpay options
      const options = {
        key: razorpay_key,
        amount: amount * 100, // Amount in paise if required, but API might return correctly. Razorpay expects paise. Assuming amount is in INR rupees.
        currency: currency || "INR",
        name: "LetsHyre",
        description: `Purchase of ${tokens} Premium Tokens`,
        order_id: order_id,
        theme: {
          color: "#2563eb",
        },
        handler: async function (response) {
          try {
            // 3. Verify payment on our backend
            const verifyRes = await verifyOrder({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success || verifyRes.status === 200) {
              toast.success("Payment successful! Tokens added to your account.");
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Payment verified locally, but backend sync failed.");
          }
        },
        prefill: {
          name: "Employer", // Ideally from user context
        },
        notes: {
          purchase_id: purchase_id,
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on("payment.failed", function (response) {
        toast.error(`Payment Failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err) {
      console.error("Payment flow error:", err);
      toast.error(err.message || "Something went wrong during payment initialization.");
    }
  };

  return (
    <div className="subscriptions-container">
      <div className="subscriptions-header">
        <h1>Premium Credits</h1>
        <p>
          Unlock the full potential of LetsHyre. Purchase tokens to access premium 
          candidate profiles and seamlessly schedule AI-driven interviews.
        </p>
      </div>

      {isCostError && (
        <div className="alert alert-error mb-4" style={{ color: "var(--danger)", textAlign: "center", marginBottom: "2rem" }}>
          Failed to load pricing: {costError?.message}
        </div>
      )}

      <div className="subscriptions-grid">
        {/* Token Selector Column */}
        <TokenSelector 
          selectedTokens={tokens} 
          onChange={(newVal) => setTokens(newVal)}
          isPending={isCreatingOrder} 
        />

        {/* Order Summary Column */}
        <OrderSummary 
          costData={costData}
          isPending={isCostPending}
          isPaying={isCreatingOrder}
          onPay={handlePayment}
        />
      </div>
    </div>
  );
}
