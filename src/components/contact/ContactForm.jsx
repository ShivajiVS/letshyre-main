import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { contactSchema } from "@/schemas/contact.schema";
import { useContactMutation } from "@/hooks/common/useContact";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const { mutate: submitContact, isPending } = useContactMutation();

  const onSubmit = (data) => {
    submitContact(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <motion.div
      className="contact-form-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="contact-form-group">
          <label htmlFor="name" className="contact-form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="John Doe"
            className="contact-form-input"
            disabled={isPending}
            {...register("name")}
          />
          {errors.name && (
            <span className="contact-form-error">{errors.name.message}</span>
          )}
        </div>

        <div className="contact-form-group">
          <label htmlFor="email" className="contact-form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="john@example.com"
            className="contact-form-input"
            disabled={isPending}
            {...register("email")}
          />
          {errors.email && (
            <span className="contact-form-error">{errors.email.message}</span>
          )}
        </div>

        <div className="contact-form-group">
          <label htmlFor="subject" className="contact-form-label">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            placeholder="How can we help you?"
            className="contact-form-input"
            disabled={isPending}
            {...register("subject")}
          />
          {errors.subject && (
            <span className="contact-form-error">{errors.subject.message}</span>
          )}
        </div>

        <div className="contact-form-group">
          <label htmlFor="message" className="contact-form-label">
            Message
          </label>
          <textarea
            id="message"
            placeholder="Please share details..."
            className="contact-form-textarea"
            disabled={isPending}
            {...register("message")}
          />
          {errors.message && (
            <span className="contact-form-error">{errors.message.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="contact-form-submit"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className="spinner"></span>
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </motion.div>
  );
}
