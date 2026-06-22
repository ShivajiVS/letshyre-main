import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useForgotVerifyOtpMutation,
  useForgotSendOtpMutation,
} from "@/hooks/useForgotMutations";

const otpSchema = z.object({
  otp: z.string().length(6, "Enter a valid 6-digit OTP"),
});

function ForgotOtp({ email, otpSessionKey, onNext }) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [currentSessionKey, setCurrentSessionKey] = useState(otpSessionKey);

  const verifyOtpMutation = useForgotVerifyOtpMutation();
  const sendOtpMutation = useForgotSendOtpMutation();

  const inputRefs = useRef([]);

  /* ================= AUTO FOCUS ================= */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  /* ================= OTP INPUT ================= */
  const handleChange = (e, index) => {
    const val = e.target.value;
    let newChar = "";

    if (val.length > 1) {
      newChar = val.replace(otpValues[index], "").replace(/\D/g, "");
    } else {
      newChar = val.replace(/\D/g, "");
    }

    if (val !== "" && newChar === "") {
      const resetOtp = [...otpValues];
      setOtpValues(resetOtp);
      return;
    }

    newChar = newChar.slice(0, 1);

    const newOtp = [...otpValues];
    newOtp[index] = newChar;

    setOtpValues(newOtp);
    setValue("otp", newOtp.join(""), { shouldValidate: !!errors.otp });

    if (newChar !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
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
    const numbersOnly = pastedData.replace(/\D/g, "");
    if (numbersOnly.length > 0) {
      const newOtp = [...otpValues];
      for (let i = 0; i < numbersOnly.length && i < 6; i++) {
        newOtp[i] = numbersOnly[i];
      }
      setOtpValues(newOtp);
      setValue("otp", newOtp.join(""), { shouldValidate: !!errors.otp });

      const focusIndex = Math.min(numbersOnly.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  /* ================= VERIFY OTP ================= */
  const onSubmit = (data) => {
    verifyOtpMutation.mutate(
      {
        email,
        otpSessionKey: currentSessionKey,
        otp: data.otp,
      },
      {
        onSuccess: () => {
          onNext();
        },
      },
    );
  };

  /* ================= RESEND OTP ================= */
  const handleResend = (e) => {
    e.preventDefault();
    if (sendOtpMutation.isPending) return;

    sendOtpMutation.mutate(
      { email },
      {
        onSuccess: (response) => {
          const newSessionKey = response?.otp_session_key;
          if (newSessionKey) {
            setCurrentSessionKey(newSessionKey);
          }
          setOtpValues(Array(6).fill(""));
          setValue("otp", "");
          setTimer(30);
          inputRefs.current[0]?.focus();
        },
      },
    );
  };

  return (
    <div className="register-box">
      <h1 className="cl-title">Email Verification</h1>
      <p className="cl-sub-para" style={{ marginBottom: 0 }}>
        Enter the OTP sent to your email
      </p>
      <p
        className="cl-sub-para"
        style={{
          color: "#666",
          fontSize: "13px",
          marginBottom: "13px",
        }}
      >
        Please check your inbox, including the <strong>spam</strong> or{" "}
        <strong>promotions</strong> folder.
      </p>

      <form className="cl-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="otp-inputs">
          {[0, 1, 2, 3, 4, 5].map((_, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              className="otp-box"
              type="text"
              value={otpValues[i] || ""}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        {errors.otp && (
          <p style={{ color: "red", fontSize: 14 }}>{errors.otp.message}</p>
        )}

        <button
          className="cl-btn button01"
          disabled={verifyOtpMutation.isPending}
        >
          {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Continue"}
        </button>
      </form>

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
            onClick={handleResend}
            style={{
              opacity: sendOtpMutation.isPending ? 0.6 : 1,
              pointerEvents: sendOtpMutation.isPending ? "none" : "auto",
            }}
          >
            {sendOtpMutation.isPending ? "Resending..." : "Resend OTP"}
          </a>
        )}
      </p>
    </div>
  );
}

export default ForgotOtp;
