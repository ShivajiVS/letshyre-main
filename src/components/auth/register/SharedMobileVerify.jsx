import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSendMobileOtpMutation } from "@/hooks/useRegisterMutations";

const mobileSchema = z.object({
  mobile: z.string().length(10, "Enter valid 10 digit mobile number").regex(/^\d+$/, "Must be digits only"),
});

export function SharedMobileVerify({ onNext }) {
  const mutation = useSendMobileOtpMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(mobileSchema),
    defaultValues: {
      mobile: "",
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(
      { phone_number: data.mobile },
      {
        onSuccess: (response) => {
          const sessionKey =
            response?.data?.otp_session_key ||
            response?.data?.data?.otp_session_key ||
            response?.otp_session_key;

          if (sessionKey) {
            onNext({
              mobile: data.mobile,
              otpSessionKey: sessionKey,
            });
          }
        },
      }
    );
  };

  return (
    <div className="register-box">
      <h1 className="cl-title">Register</h1>

      <p className="cl-sub-para">
        Enter your mobile number to secure your LetsHyre account
      </p>

      <form className="cl-form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="cl-input-group">
            <input
              type="text"
              className="cl-input"
              placeholder="Mobile Number"
              maxLength={10}
              {...register("mobile", {
                onChange: (e) => {
                  setValue("mobile", e.target.value.replace(/\D/g, "").slice(0, 10), { shouldValidate: true });
                }
              })}
            />
            <i className="bi bi-phone cl-icon"></i>
          </div>
          {errors.mobile && (
            <p style={{ color: "red", fontSize: "13px", marginTop: "4px", textAlign: "left" }}>
              {errors.mobile.message}
            </p>
          )}
        </div>

        <button className="cl-btn button01" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}
