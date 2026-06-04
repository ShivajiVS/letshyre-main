import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useVerifyOrder } from "@/hooks/payments/useCreditPurchase";
import "../../styles/payment-verification.css";

export function PaymentVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutateAsync: verifyOrder } = useVerifyOrder();

  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const verifyAttempted = useRef(false);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const errorDesc = searchParams.get("description");

    if (errorParam === "true") {
      setStatus("error");
      setErrorMessage(errorDesc || "Payment failed or was cancelled.");
      return;
    }

    const verifyPayment = async () => {
      if (verifyAttempted.current) return;
      verifyAttempted.current = true;

      const razorpay_payment_id = searchParams.get("razorpay_payment_id");
      const razorpay_order_id = searchParams.get("razorpay_order_id");
      const razorpay_signature = searchParams.get("razorpay_signature");
      const purchase_id = searchParams.get("purchase_id");

      if (
        !razorpay_payment_id ||
        !razorpay_order_id ||
        !razorpay_signature ||
        !purchase_id
      ) {
        setStatus("error");
        setErrorMessage(
          "Invalid payment verification request. Missing required tokens.",
        );
        return;
      }

      try {
        const payload = {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          purchase_id,
        };
        const res = await verifyOrder(payload);

        if (res.success) {
          setStatus("success");
          setOrderDetails(res.data);
        } else {
          setStatus("error");
          setErrorMessage(
            res.message || "Payment signature verification failed.",
          );
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err.message || "An unexpected error occurred during verification.",
        );
      }
    };

    verifyPayment();
  }, [searchParams, verifyOrder]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="pv-container">
      <motion.div
        className="pv-card"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {status === "loading" && (
          <motion.div className="pv-content" variants={itemVariants}>
            <div
              style={{
                position: "relative",
                width: "56px",
                height: "56px",
                marginBottom: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Clean, professional spinner */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "3px solid #f1f5f9",
                  borderTopColor: "#3b82f6",
                }}
              />
            </div>

            <h2 className="pv-title">Verifying Payment</h2>
            <p className="pv-desc">
              Please wait while we confirm your transaction.
            </p>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div className="pv-content" variants={containerVariants}>
            <motion.div
              className="pv-icon-container success"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 25,
                delay: 0.1,
              }}
            >
              <i className="bi bi-check-lg"></i>
            </motion.div>

            <motion.h2 variants={itemVariants} className="pv-title">
              Payment Successful
            </motion.h2>
            <motion.p variants={itemVariants} className="pv-desc">
              Your credits have been added successfully.
              <span className="pv-block mt-2 text-sm text-slate-500">
                Transaction ID:{" "}
                <span className="pv-highlight">
                  {orderDetails?.purchase_id ||
                    orderDetails?.payment_id ||
                    searchParams.get("razorpay_payment_id")}
                </span>
              </span>
            </motion.p>

            <motion.div variants={itemVariants} className="pv-actions">
              <button
                className="pv-btn secondary"
                onClick={() => navigate("/employer/managing-subscriptions")}
              >
                View Credits
              </button>
              <button
                className="pv-btn primary"
                onClick={() => navigate("/employer/dashboard")}
              >
                Go to Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div className="pv-content" variants={containerVariants}>
            <motion.div
              className="pv-icon-container error"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
            >
              <i className="bi bi-x-lg"></i>
            </motion.div>

            <motion.h2 variants={itemVariants} className="pv-title">
              Payment Failed
            </motion.h2>
            <motion.p variants={itemVariants} className="pv-desc error-text">
              {errorMessage}
            </motion.p>

            <motion.div variants={itemVariants} className="pv-actions">
              <button
                className="pv-btn secondary"
                onClick={() => navigate("/employer/dashboard")}
              >
                Go Back
              </button>
              <button
                className="pv-btn primary"
                onClick={() => navigate("/employer/managing-subscriptions")}
              >
                Try Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
