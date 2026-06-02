import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForgotVerifyOtpMutation, useForgotSendOtpMutation } from "@/hooks/useForgotMutations";

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

  const otp = watch("otp");
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
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const otpArray = otp.split("").slice(0, 6);
    // Pad array if needed
    while (otpArray.length < 6) otpArray.push("");
    otpArray[index] = value;

    const newOtp = otpArray.join("").slice(0, 6);
    setValue("otp", newOtp, { shouldValidate: !!errors.otp });

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
      }
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
          setValue("otp", "");
          setTimer(30);
          inputRefs.current[0]?.focus();
        },
      }
    );
  };

  return (
    <div className="register-box">
      <h1 className="cl-title">Verification</h1>
      <p className="cl-sub-para">Enter the OTP sent to your email</p>

      <form className="cl-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="otp-inputs">
          {[0, 1, 2, 3, 4, 5].map((_, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              className="otp-box"
              type="text"
              maxLength="1"
              value={otp[i] || ""}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
            />
          ))}
        </div>

        {errors.otp && (
          <p style={{ color: "red", fontSize: 14 }}>{errors.otp.message}</p>
        )}

        <button className="cl-btn button01" disabled={verifyOtpMutation.isPending}>
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