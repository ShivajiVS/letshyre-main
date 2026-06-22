import { useEffect, useRef, useState } from "react";
import {
  useVerifyEmailOtpMutation,
  useSendEmailOtpMutation,
} from "@/hooks/useRegisterMutations";

export function SharedOtpVerify({ email, otpSessionKey, onNext, role }) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [timer, setTimer] = useState(30);
  const [currentSessionKey, setCurrentSessionKey] = useState(otpSessionKey);

  const inputRefs = useRef([]);

  const verifyMutation = useVerifyEmailOtpMutation();
  const resendMutation = useSendEmailOtpMutation();

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  /* ================= AUTO FOCUS ================= */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /* ================= OTP CHANGE ================= */
  const handleChange = (e, index) => {
    const val = e.target.value;
    let newChar = "";

    if (val.length > 1) {
      newChar = val.replace(otp[index], "").replace(/\D/g, "");
    } else {
      newChar = val.replace(/\D/g, "");
    }

    if (val !== "" && newChar === "") {
      const resetOtp = [...otp];
      setOtp(resetOtp);
      return;
    }

    newChar = newChar.slice(0, 1);

    const newOtp = [...otp];
    newOtp[index] = newChar;

    setOtp(newOtp);
    setError("");
    setInfo("");

    if (newChar !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    // Extract only numbers
    const numbersOnly = pastedData.replace(/\D/g, "");
    if (numbersOnly.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < numbersOnly.length && i < 6; i++) {
        newOtp[i] = numbersOnly[i];
      }
      setOtp(newOtp);
      setError("");
      setInfo("");

      // Focus the correct input or the last one if full
      const focusIndex = Math.min(newOtp.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    verifyMutation.mutate(
      {
        email,
        otpSessionKey: currentSessionKey,
        otp: otpString,
        otp_type: "Registration",
      },
      {
        onSuccess: () => {
          onNext();
        },
      },
    );
  };

  /* ================= RESEND OTP ================= */
  const handleResendOtp = (e) => {
    e.preventDefault();
    if (resendMutation.isPending) return;

    setError("");
    setInfo("");

    resendMutation.mutate(
      { email },
      {
        onSuccess: (response) => {
          const newSessionKey =
            response?.otp_session_key || response?.data?.otp_session_key;

          if (newSessionKey) {
            setCurrentSessionKey(newSessionKey);
          }

          console.log("key", currentSessionKey);

          setOtp(Array(6).fill(""));
          setTimer(30);
          setInfo("OTP resent successfully");
          inputRefs.current[0]?.focus();
        },
      },
    );
  };

  return (
    <div className="register-box">
      <h1 className="cl-title">
        {role === "Employer"
          ? "Employer Verification"
          : "Employee Verification"}
      </h1>
      <p className="cl-sub-para" style={{ marginBottom: 0 }}>
        Enter the OTP we sent to your email
      </p>
      <p
        className="cl-sub-para"
        style={{
          color: "#666",
          fontSize: "13px",
          marginBottom: "15px",
        }}
      >
        Please check your inbox, including the <strong>spam</strong> or{" "}
        <strong>promotions</strong> folder.
      </p>

      <form className="cl-form" onSubmit={handleSubmit}>
        <div className="otp-inputs">
          {[0, 1, 2, 3, 4, 5].map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              className="otp-box"
              value={otp[index] || ""}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        {error && <p style={{ color: "red", fontSize: 14 }}>{error}</p>}
        {info && <p style={{ color: "green", fontSize: 14 }}>{info}</p>}

        <button
          className="cl-btn button01"
          type="submit"
          disabled={verifyMutation.isPending}
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify & Continue"}
        </button>
      </form>

      <p className="otp-help-text">Didn’t receive code?</p>

      <p className="form-subtext">
        {timer > 0 ? (
          <>
            Resend in{" "}
            <span className="timer-color">
              00:{timer.toString().padStart(2, "0")}
            </span>
          </>
        ) : (
          <a
            href="#"
            onClick={handleResendOtp}
            style={{
              pointerEvents: resendMutation.isPending ? "none" : "auto",
              opacity: resendMutation.isPending ? 0.6 : 1,
            }}
          >
            {resendMutation.isPending ? "Resending..." : "Resend OTP"}
          </a>
        )}
      </p>
    </div>
  );
}
