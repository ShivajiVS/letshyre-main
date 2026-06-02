import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForgotSendOtpMutation } from "@/hooks/useForgotMutations";

import "@/pages/employee/auth/EmployeeSignIn";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

function ForgotEmail({ onNext, onBack }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const sendOtpMutation = useForgotSendOtpMutation();

  const onSubmit = (data) => {
    sendOtpMutation.mutate(data, {
      onSuccess: (response) => {
        const otpSessionKey = response?.otp_session_key;
        if (otpSessionKey) {
          onNext({
            email: data.email,
            otpSessionKey,
          });
        }
      },
    });
  };

  return (
    <div className="register-box">
      <h1 className="cl-title">Forgot Password?</h1>

      <p className="cl-sub-para">
        No worries - we’ll send you an OTP to reset your password
      </p>

      <form className="cl-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="cl-input-group">
          <input
            type="email"
            className="cl-input"
            placeholder="Email address"
            {...register("email")}
          />
          <i className="bi bi-envelope cl-icon"></i>
        </div>
        {errors.email && (
          <p style={{ color: "red", fontSize: "14px", textAlign: "left" }}>
            {errors.email.message}
          </p>
        )}

        <button
          className="cl-btn button01"
          disabled={sendOtpMutation.isPending}
        >
          {sendOtpMutation.isPending ? "Sending..." : "Send OTP"}
        </button>
      </form>

      <p className="form-subtext">
        <Link to="/get-started" onClick={onBack}>
          Back to Login
        </Link>
      </p>
    </div>
  );
}

export default ForgotEmail;
