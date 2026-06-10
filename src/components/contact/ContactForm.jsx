import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { contactSchema } from "@/schemas/contact.schema";
import { useContactMutation } from "@/hooks/common/useContact";
import { Link } from "react-router";

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, dirtyFields },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: "onChange", // Enable live validation
  });

  const { mutate: submitContact, isPending } = useContactMutation();

  const onSubmit = (data) => {
    submitContact(data, {
      onSuccess: () => {
        setIsSuccess(true);
        reset();
      },
    });
  };

  const isFieldValid = (fieldName) => {
    // A field is only valid if it has been modified (dirty) AND it has no errors
    return dirtyFields[fieldName] && !errors[fieldName];
  };

  return (
    <motion.div
      className="contact-form-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="contact-form-group">
              <input
                type="text"
                id="name"
                placeholder=" "
                className="contact-form-input"
                disabled={isPending}
                {...register("name")}
              />
              <label htmlFor="name" className="contact-form-label">
                Full Name
              </label>
              {isFieldValid("name") && (
                <i className="bi bi-check-circle-fill contact-validation-icon"></i>
              )}
              {errors.name && (
                <span className="contact-form-error">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="contact-form-group">
              <input
                type="email"
                id="email"
                placeholder=" "
                className="contact-form-input"
                disabled={isPending}
                {...register("email")}
              />
              <label htmlFor="email" className="contact-form-label">
                Email Address
              </label>
              {isFieldValid("email") && (
                <i className="bi bi-check-circle-fill contact-validation-icon"></i>
              )}
              {errors.email && (
                <span className="contact-form-error">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="contact-form-group">
              <input
                type="text"
                id="subject"
                placeholder=" "
                className="contact-form-input"
                disabled={isPending}
                {...register("subject")}
              />
              <label htmlFor="subject" className="contact-form-label">
                Subject
              </label>
              {isFieldValid("subject") && (
                <i className="bi bi-check-circle-fill contact-validation-icon"></i>
              )}
              {errors.subject && (
                <span className="contact-form-error">
                  {errors.subject.message}
                </span>
              )}
            </div>

            <div className="contact-form-group">
              <textarea
                id="message"
                placeholder=" "
                className="contact-form-textarea"
                disabled={isPending}
                {...register("message")}
              />
              <label htmlFor="message" className="contact-form-label">
                Message Details
              </label>
              {isFieldValid("message") && (
                <i className="bi bi-check-circle-fill contact-validation-icon"></i>
              )}
              {errors.message && (
                <span className="contact-form-error">
                  {errors.message.message}
                </span>
              )}
            </div>

            <div className="contact-form-privacy">
              <p>
                We value your privacy. By submitting your information, you agree
                to LetsHyre's{" "}
                <Link to="/policy" className="privacy-link">
                  Privacy Policy
                </Link>
                . Our team typically responds within 2-4 hours.
              </p>
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
          </motion.form>
        ) : (
          <motion.div
            key="success"
            className="contact-success-wrapper"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          >
            <div className="success-icon-bg">
              <i className="bi bi-check"></i>
            </div>
            <h3 className="success-title">Message Sent!</h3>
            <p className="success-desc">
              Thank you for reaching out. Our support team has received your
              message and will get back to you shortly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
