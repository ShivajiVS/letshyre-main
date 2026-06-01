import { PaymentSkeleton } from "./PaymentSkeleton";

export function OrderSummary({ costData, isPending, onPay, isPaying }) {
  if (isPending || !costData) {
    return <PaymentSkeleton />;
  }

  const { data } = costData;
  const amountToPay = data?.amout_to_be_paid || 0; // Note: using amout_to_be_paid matching API response typo
  const costPerToken = data?.cost_per_token || 0;

  // Assuming the API gives amout_to_be_paid. We simulate GST and discount if they aren't provided
  // for display purposes, but typically they should come from the API.
  // The user prompt API response only has cost_per_token and amout_to_be_paid.
  const baseAmount = amountToPay; 
  const gstAmount = baseAmount * 0.18; // Example 18% GST display (if backend includes it, adjust accordingly)
  
  // Note: Since the backend API (payment/v1/employer/calculate-token-cost/?tokens=10) only returns `amout_to_be_paid` and `cost_per_token`,
  // we will display the amout_to_be_paid as the total directly.

  return (
    <div className="sub-card">
      <h2 className="card-title">
        <i className="bi bi-receipt" style={{ color: "var(--brand-blue)" }}></i>
        Order Summary
      </h2>

      <div className="summary-details">
        <div className="summary-row">
          <span>Cost per token</span>
          <span>₹{costPerToken.toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total Amount</span>
          <span>₹{amountToPay.toFixed(2)}</span>
        </div>
      </div>

      <button 
        className="pay-btn" 
        onClick={onPay} 
        disabled={isPaying || amountToPay <= 0}
      >
        {isPaying ? (
          <>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Processing...
          </>
        ) : (
          <>Pay ₹{amountToPay.toFixed(2)}</>
        )}
      </button>
    </div>
  );
}
