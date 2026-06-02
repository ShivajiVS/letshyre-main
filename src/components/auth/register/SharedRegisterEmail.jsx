import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useSendEmailOtpMutation } from "@/hooks/useRegisterMutations";

const emailSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export function SharedRegisterEmail({ onNext, role }) {
  const navigate = useNavigate();
  const mutation = useSendEmailOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data, {
      onSuccess: (response) => {
        const otpSessionKey =
          response?.data?.data?.otp_session_key ||
          response?.data?.otp_session_key ||
          response?.otp_session_key ||
          response?.data?.session_key;

        if (otpSessionKey) {
          localStorage.setItem("email_otp_session", otpSessionKey);
          onNext({
            name: data.fullName,
            username: data.username,
            email: data.email,
            emailOtpSessionKey: otpSessionKey,
          });
        }
      },
    });
  };

  const loginRoute = role === "employer" ? "/employer/sign-in" : "/employee/sign-in";

  return (
    <div className="register-box">
      <h1 className="cl-title cl-title22">
        {role === "employer" ? "Employer Registration" : "Employee Registration"}
      </h1>

      <p className="cl-sub-para">
        {role === "employer"
          ? "Build your dream team faster. Enter your work email."
          : "Create your LetsHyre account to find your next job."}
      </p>

      <form className="cl-form register-form-align" onSubmit={handleSubmit(onSubmit)}>
        {/* USERNAME */}
        <div>
          <div className="cl-input-group">
            <input
              type="text"
              placeholder="Username"
              className="cl-input"
              {...register("username")}
            />
          </div>
          {errors.username && (
            <p style={{ color: "red", fontSize: "13px", marginTop: "4px", textAlign: "left" }}>
              {errors.username.message}
            </p>
          )}
        </div>

        {/* FULL NAME */}
        <div>
          <div className="cl-input-group">
            <input
              type="text"
              placeholder="Full Name"
              className="cl-input"
              {...register("fullName")}
            />
          </div>
          {errors.fullName && (
            <p style={{ color: "red", fontSize: "13px", marginTop: "4px", textAlign: "left" }}>
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <div className="cl-input-group">
            <input
              type="email"
              placeholder="Email"
              className="cl-input"
              {...register("email")}
            />
            <i className="bi bi-envelope cl-icon"></i>
          </div>
          {errors.email && (
            <p style={{ color: "red", fontSize: "13px", marginTop: "4px", textAlign: "left" }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <button className="cl-btn button01" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending OTP..." : "Verify"}
        </button>
      </form>

      <p className="form-subtext">
        Already have an account? <br />
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(loginRoute);
          }}
        >
          <span style={{ cursor: "pointer" }}>Back to Login</span>
        </a>
      </p>
    </div>
  );
}
