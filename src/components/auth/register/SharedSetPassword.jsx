import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router";
import { toast } from "sonner";

import { useFinalRegisterMutation } from "@/hooks/useRegisterMutations";

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    agreed_to_terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms & Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SharedSetPassword({ registerData, onNext, role }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const mutation = useFinalRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      agreed_to_terms: false,
    },
  });

  const onError = (errors) => {
    if (errors.agreed_to_terms) {
      toast.error("You must agree to the Terms & Conditions");
    }
  };

  const onSubmit = (data) => {
    // The role field might be needed for the backend. Usually role_id: 2 for candidate, 3 for employer.
    // Assuming backend needs role, but standard implementation in old code just passed registerData.
    const finalPayload = {
      ...registerData,
      password: data.password,
      confirm_password: data.confirmPassword,
      agreed_to_terms: data.agreed_to_terms,
      role,
    };

    // Add role_id if backend expects it (2 = employee, 3 = employer based on typical setups)
    // I will pass registerData as is + password.

    mutation.mutate(finalPayload, {
      onSuccess: () => {
        onNext();
      },
    });
  };

  return (
    <div className="register-box">
      <h1 className="cl-title">
        {role === "Employer" ? "Employer Password" : "Employee Password"}
      </h1>
      <p className="cl-sub-para">Secure your account with a strong password</p>

      <form className="cl-form" onSubmit={handleSubmit(onSubmit, onError)}>
        {/* PASSWORD */}
        <div>
          <div className="cl-input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="cl-input"
              placeholder="Password"
              {...register("password")}
            />
            <i
              className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} cl-icon`}
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          {errors.password && (
            <p
              style={{
                color: "red",
                fontSize: "13px",
                marginTop: "4px",
                textAlign: "left",
              }}
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <div className="cl-input-group">
            <input
              type={showConfirm ? "text" : "password"}
              className="cl-input"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
            />
            <i
              className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"} cl-icon`}
              onClick={() => setShowConfirm(!showConfirm)}
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          {errors.confirmPassword && (
            <p
              style={{
                color: "red",
                fontSize: "13px",
                marginTop: "4px",
                textAlign: "left",
              }}
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* TERMS CHECKBOX */}
        <div style={{ marginTop: "10px" }}>
          <div className="cl-checkbox-container" style={{ cursor: "default" }}>
            <input
              id="terms_checkbox"
              type="checkbox"
              {...register("agreed_to_terms")}
            />
            <label
              htmlFor="terms_checkbox"
              className="checkmark"
              style={{ cursor: "pointer" }}
            ></label>
            <span>
              I agree to the{" "}
              <Link
                to="/T&C"
                target="_blank"
                style={{ color: "#1d4ed8", textDecoration: "underline" }}
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/policy"
                target="_blank"
                style={{ color: "#1d4ed8", textDecoration: "underline" }}
              >
                Privacy Policy
              </Link>
              .
            </span>
          </div>

        </div>

        <button
          className="cl-btn button01"
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating Account..." : "Complete Registration"}
        </button>
      </form>
    </div>
  );
}
