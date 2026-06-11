import { z } from "zod";

export const employerProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be under 50 characters"),

  role: z
    .string()
    .min(2, "Role must be at least 2 characters")
    .max(50, "Role must be under 50 characters"),

  email: z.string().email("Please enter a valid email address"),

  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),

  location: z.string().min(1, "Please select a location"),

  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be under 100 characters"),

  companyWebsite: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#].*)?$/.test(val),
      "Enter a valid URL (e.g. example.com or https://example.com)"
    ),

  companySize: z.string().min(1, "Please select a company size"),

  industry: z.string().min(1, "Please select an industry"),

  linkedinUrl: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .regex(/linkedin\.com/, "Must be a LinkedIn URL")
    .optional()
    .or(z.literal("")),

  registrationNumber: z.string().min(1, "Registration number is required"),

  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Enter a valid PAN (e.g. ABCDE1234F)")
    .optional()
    .or(z.literal("")),

  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Enter a valid 15-digit GST number"
    )
    .optional()
    .or(z.literal("")),

  companyDescription: z
    .string()
    .max(500, "Description must be under 500 characters")
    .optional()
    .or(z.literal("")),

  companyLogo: z
    .any()
    .optional()
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        (files[0] && files[0].size <= 2 * 1024 * 1024),
      "File size must be under 2MB"
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        (files[0] &&
          ["image/jpeg", "image/png", "image/svg+xml", "image/webp"].includes(
            files[0].type
          )),
      "Only JPG, PNG, SVG or WEBP allowed"
    ),
});
