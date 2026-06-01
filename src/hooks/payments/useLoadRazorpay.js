import { useState, useEffect } from "react";

export const useLoadRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setIsLoaded(false);
    document.body.appendChild(script);

    return () => {
      // document.body.removeChild(script); // Optional: keeps it loaded to avoid multiple loads
    };
  }, []);

  return isLoaded;
};
