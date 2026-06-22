import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useLoginMutation } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm({ role, registerLink }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useLoginMutation(role);

  const onSubmit = (data) => {
    mutation.mutate({ ...data, role });
  };

  return (
    <>
      <form className="cl-form" onSubmit={handleSubmit(onSubmit)}>
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
            <p
              style={{
                color: "red",
                fontSize: "13px",
                marginTop: "6px",
                textAlign: "left",
              }}
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <div className="cl-input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="cl-input"
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
                marginTop: "6px",
                textAlign: "left",
              }}
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* FORGOT PASSWORD */}
        <p className="cl-forget-link">
          <span
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(
                "/forgot-password",
                role === "employer" ? { state: { role: "employer" } } : {},
              )
            }
          >
            Forget Password?
          </span>
        </p>

        {/* SUBMIT */}
        <button
          className="cl-btn button01"
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Logging in..." : "LetsHyre Me"}
        </button>
      </form>

      {/* REGISTER CTA */}
      <p className="form-subtext" style={{ marginTop: "20px" }}>
        Don’t have an account?
        <br />
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(registerLink);
          }}
        >
          Register
        </a>
      </p>
    </>
  );
}
