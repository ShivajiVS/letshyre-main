import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForgotPasswordMutation } from "@/hooks/useForgotMutations";

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

function ForgotResetPassword({ email, otpSessionKey, onNext }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const forgotPasswordMutation = useForgotPasswordMutation();

  const onSubmit = (data) => {
    forgotPasswordMutation.mutate(
      {
        email,
        otpSessionKey,
        newPassword: data.password,
        confirmPassword: data.confirm,
      },
      {
        onSuccess: () => {
          onNext();
        },
      }
    );
  };

  return (
    <div className="register-box">
      <h1 className="cl-title">Set New Password</h1>

      <p className="cl-sub-para">Create a new secure password</p>

      <form className="cl-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="cl-input-group">
          <input
            type={showPassword ? "text" : "password"}
            className="cl-input"
            placeholder="New password"
            {...register("password")}
          />
          <i
            className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} cl-icon`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>
        {errors.password && (
          <p style={{ color: "red", fontSize: "14px", textAlign: "left" }}>
            {errors.password.message}
          </p>
        )}

        <div className="cl-input-group">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="cl-input"
            placeholder="Confirm password"
            {...register("confirm")}
          />
          <i
            className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} cl-icon`}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          ></i>
        </div>
        {errors.confirm && (
          <p style={{ color: "red", fontSize: "14px", textAlign: "left" }}>
            {errors.confirm.message}
          </p>
        )}

        <button
          className="cl-btn button01"
          disabled={forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ForgotResetPassword;